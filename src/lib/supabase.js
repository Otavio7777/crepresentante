import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://xinferxiukuxobjnrasp.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbmZlcnhpdWt1eG9iam5yYXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODI3MDgsImV4cCI6MjA5ODA1ODcwOH0.bEJqTQDtFLce7pLPDB-u-gdyVLVj5SvdxKmUGAr-Ymc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export const auth = {
  signUp: (email, password, name) =>
    supabase.auth.signUp({ email, password, options: { data: { full_name: name } } }),

  signIn: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthChange: (cb) => supabase.auth.onAuthStateChange(cb),
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const contacts = {
  list: (userId, { stage, search, limit = 50, offset = 0 } = {}) => {
    let q = supabase
      .from('contacts')
      .select('*, contact_tags(tag)')
      .eq('user_id', userId)
      .order('last_contact_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (stage)  q = q.eq('stage', stage)
    if (search) q = q.or(`name.ilike.%${search}%,company.ilike.%${search}%,phone.ilike.%${search}%`)
    return q
  },

  get: (id) =>
    supabase.from('contacts').select('*, contact_tags(tag)').eq('id', id).single(),

  create: (data) =>
    supabase.from('contacts').insert(data).select().single(),

  update: (id, data) =>
    supabase.from('contacts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),

  delete: (id) =>
    supabase.from('contacts').delete().eq('id', id),

  addTag: (contactId, tag) =>
    supabase.from('contact_tags').upsert({ contact_id: contactId, tag }),

  removeTag: (contactId, tag) =>
    supabase.from('contact_tags').delete().eq('contact_id', contactId).eq('tag', tag),

  funnel: (userId) =>
    supabase
      .from('contacts')
      .select('stage, pipeline_value, count(*)')
      .eq('user_id', userId)
      .group('stage, pipeline_value'),
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = {
  list: ({ category, search, active = true } = {}) => {
    let q = supabase
      .from('products')
      .select('*, product_categories(name, sort_order)')
      .eq('active', active)
      .order('name')

    if (category) q = q.eq('category_id', category)
    if (search)   q = q.or(`name.ilike.%${search}%,ref.ilike.%${search}%`)
    return q
  },

  categories: () =>
    supabase.from('product_categories').select('*').eq('active', true).order('sort_order'),

  get: (id) =>
    supabase.from('products').select('*, product_categories(name)').eq('id', id).single(),
}

// ─── Promotions & Combos ──────────────────────────────────────────────────────
export const catalog = {
  promotions: () =>
    supabase
      .from('promotions')
      .select('*, promotion_products(product_id, products(*))')
      .eq('active', true)
      .gt('ends_at', new Date().toISOString()),

  combos: () =>
    supabase
      .from('combos')
      .select('*, combo_items(quantity, products(*))')
      .eq('active', true),
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = {
  list: (userId, { status, contactId, limit = 50 } = {}) => {
    let q = supabase
      .from('orders')
      .select('*, contacts(name, company, phone), order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status)    q = q.eq('status', status)
    if (contactId) q = q.eq('contact_id', contactId)
    return q
  },

  create: async (userId, contactId, items, { paymentTerms, deliveryDays, notes, discountPct = 0, origin = 'platform' } = {}) => {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({ user_id: userId, contact_id: contactId, payment_terms: paymentTerms, delivery_days: deliveryDays, notes, discount_pct: discountPct, origin, status: 'draft' })
      .select()
      .single()

    if (error) return { error }

    const lineItems = items.map(item => ({
      order_id:     order.id,
      product_id:   item.product_id,
      product_name: item.name,
      product_ref:  item.ref,
      unit:         item.unit,
      qty:          item.qty,
      unit_price:   item.price,
      discount_pct: item.discount_pct || 0,
      total:        item.price * item.qty * (1 - (item.discount_pct || 0) / 100),
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(lineItems)
    if (itemsError) return { error: itemsError }

    return { data: order }
  },

  updateStatus: (id, status) =>
    supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id),

  sendToErp: async (orderId) => {
    await supabase.from('erp_sync_log').insert({
      entity_type: 'order',
      entity_id:   orderId,
      status:      'pending',
      payload:     { triggered_at: new Date().toISOString() },
    })
    return supabase.from('orders').update({ sent_to_erp_at: new Date().toISOString() }).eq('id', orderId)
  },
}

// ─── Quotes ───────────────────────────────────────────────────────────────────
export const quotes = {
  list: (userId, { status } = {}) => {
    let q = supabase
      .from('quotes')
      .select('*, contacts(name, company), quote_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) q = q.eq('status', status)
    return q
  },

  create: (data) =>
    supabase.from('quotes').insert(data).select().single(),

  updateStatus: (id, status) =>
    supabase.from('quotes').update({ status, updated_at: new Date().toISOString() }).eq('id', id),
}

// ─── Conversations & Messages ─────────────────────────────────────────────────
export const conversations = {
  list: (userId) =>
    supabase
      .from('conversations')
      .select('*, contacts(name, company, phone)')
      .eq('user_id', userId)
      .order('last_msg_at', { ascending: false }),

  messages: (conversationId) =>
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at'),

  sendMessage: (conversationId, userId, text, type = 'text') =>
    supabase.from('messages').insert({
      conversation_id: conversationId,
      user_id:         userId,
      from_role:       'rep',
      text,
      msg_type:        type,
    }).select().single(),

  markRead: (conversationId) =>
    supabase.from('conversations').update({ unread: 0 }).eq('id', conversationId),

  subscribeToMessages: (conversationId, onMessage) =>
    supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, payload => onMessage(payload.new))
      .subscribe(),
}

// ─── Visits ───────────────────────────────────────────────────────────────────
export const visits = {
  list: (userId, { upcoming = false } = {}) => {
    let q = supabase
      .from('visits')
      .select('*, contacts(name, company, phone)')
      .eq('user_id', userId)
      .order('scheduled_at')

    if (upcoming) q = q.gte('scheduled_at', new Date().toISOString())
    return q
  },

  create: (data) =>
    supabase.from('visits').insert(data).select().single(),

  updateStatus: (id, status) =>
    supabase.from('visits').update({ status }).eq('id', id),
}

// ─── Goals ────────────────────────────────────────────────────────────────────
export const goals = {
  get: (userId, year, month) =>
    supabase.from('goals').select('*').eq('user_id', userId).eq('year', year).eq('month', month).maybeSingle(),

  upsert: (userId, year, month, targets) =>
    supabase.from('goals').upsert({ user_id: userId, year, month, ...targets }).select().single(),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboard = {
  summary: (userId) =>
    supabase.from('dashboard_summary').select('*').eq('user_id', userId).single(),

  monthlyPerformance: (userId) =>
    supabase.from('monthly_performance').select('*').eq('user_id', userId).limit(12),
}

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = {
  list: (userId) =>
    supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),

  markRead: (id) =>
    supabase.from('notifications').update({ read: true }).eq('id', id),

  markAllRead: (userId) =>
    supabase.from('notifications').update({ read: true }).eq('user_id', userId),

  subscribe: (userId, onNotification) =>
    supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event:  'INSERT',
        schema: 'public',
        table:  'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => onNotification(payload.new))
      .subscribe(),
}
