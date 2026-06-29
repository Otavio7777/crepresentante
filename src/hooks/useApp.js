import { useState, useEffect, useCallback } from 'react'
import { supabase, auth as sbAuth, contacts as sbContacts, products as sbProducts, catalog as sbCatalog, orders as sbOrders, quotes as sbQuotes, conversations as sbConvs, visits as sbVisits } from '../lib/supabase.js'
import { MOCK } from '../lib/data.jsx'

// ─── useIsMobile ──────────────────────────────────────────────────────────────
export function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

// ─── useAuth ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    sbAuth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = sbAuth.onAuthChange((_event, s) => {
      setSession(s)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) { setProfile(null); return }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfile(data || MOCK.profile))
  }, [session])

  const signIn  = (email, password) => sbAuth.signIn(email, password)
  const signUp  = (email, password, name) => sbAuth.signUp(email, password, name)
  const signOut = () => sbAuth.signOut()

  return { session, loading, profile: profile || (session ? null : MOCK.profile), signIn, signUp, signOut }
}

// ─── useAppData ────────────────────────────────────────────────────────────────
export function useAppData(userId) {
  const isDemo = !userId

  const [contacts,      setContacts]      = useState(MOCK.contacts)
  const [products,      setProducts]      = useState(MOCK.products)
  const [categories,    setCategories]    = useState([...new Set(MOCK.products.map(p=>p.category))])
  const [promotions,    setPromotions]    = useState(MOCK.promotions)
  const [combos,        setCombos]        = useState(MOCK.combos)
  const [orders,        setOrders]        = useState(MOCK.orders)
  const [quotes,        setQuotes]        = useState(MOCK.quotes)
  const [visits,        setVisits]        = useState(MOCK.visits)
  const [messages,      setMessages]      = useState(MOCK.messages)
  const [loading,       setLoading]       = useState(false)

  useEffect(() => {
    if (isDemo) return
    setLoading(true)

    Promise.all([
      sbContacts.list(userId).then(({ data }) => data && setContacts(data.map(normalizeContact))),
      sbProducts.list().then(({ data }) => {
        if (!data) return
        setProducts(data.map(normalizeProduct))
        setCategories([...new Set(data.map(p => p.product_categories?.name).filter(Boolean))])
      }),
      sbCatalog.promotions().then(({ data }) => data && setPromotions(data.map(normalizePromo))),
      sbCatalog.combos().then(({ data }) => data && setCombos(data.map(normalizeCombo))),
      sbOrders.list(userId).then(({ data }) => data && setOrders(data.map(normalizeOrder))),
      sbQuotes.list(userId).then(({ data }) => data && setQuotes(data.map(normalizeQuote))),
      sbVisits.list(userId, { upcoming: true }).then(({ data }) => data && setVisits(data.map(normalizeVisit))),
    ]).finally(() => setLoading(false))
  }, [userId, isDemo])

  // Live messages state (managed locally in chat)
  const addMessage = useCallback((contactId, msg) => {
    setMessages(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), msg]
    }))
  }, [])

  // Create order (real or mock)
  const createOrder = useCallback(async (contactId, items, opts = {}) => {
    if (isDemo) {
      const newOrder = {
        id: `o${Date.now()}`,
        number: `#${2902 + orders.length}`,
        contact_id: contactId,
        contact_name: contacts.find(c=>c.id===contactId)?.name || '—',
        total: items.reduce((a,i)=>a+i.price*i.qty,0),
        status: 'sent',
        origin: 'platform',
        payment_terms: opts.paymentTerms || '30/60',
        created_at: new Date().toLocaleDateString('pt-BR'),
      }
      setOrders(prev => [newOrder, ...prev])
      return { data: newOrder }
    }
    return sbOrders.create(userId, contactId, items, opts)
  }, [isDemo, userId, orders, contacts])

  // Add new contact (real users: Supabase insert; demo: local state)
  const addContact = useCallback(async (contactData) => {
    const av = (contactData.name||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    const newContact = {
      id: `c_${Date.now()}`,
      av, stage:'prospect', tags:[], pipeline_value:0, unread:0,
      last_contact_at: new Date().toLocaleDateString('pt-BR'),
      notes:'',
      ...contactData,
    }
    setContacts(prev => [newContact, ...prev])
    if (!isDemo) {
      const { data: saved } = await sbContacts.create({
        user_id:   userId,
        name:      contactData.name       || '',
        company:   contactData.company    || '',
        phone:     contactData.phone      || '',
        email:     contactData.email      || '',
        city:      contactData.city       || '',
        job_title: contactData.job_title  || '',
        stage:     'prospect',
      })
      if (saved) setContacts(prev => prev.map(c => c.id===newContact.id ? normalizeContact(saved) : c))
    }
    return newContact
  }, [isDemo, userId])

  // Update contact stage
  const updateContactStage = useCallback(async (contactId, stage) => {
    setContacts(prev => prev.map(c => c.id===contactId ? { ...c, stage } : c))
    if (!isDemo) await sbContacts.update(contactId, { stage })
  }, [isDemo])

  return {
    loading, contacts, products, categories, promotions, combos,
    orders, quotes, visits, messages, stats: MOCK.stats,
    monthData: MOCK.monthData, weekData: MOCK.weekData,
    paymentTerms: MOCK.payment_terms, deliveryOptions: MOCK.delivery_options,
    addMessage, createOrder, updateContactStage, addContact,
  }
}

// ─── Normalizers (map DB shape → app shape) ───────────────────────────────────
const normalizeContact = c => ({
  id: c.id, name: c.name, company: c.company, job_title: c.job_title,
  phone: c.phone, email: c.email, city: c.city, state: c.state,
  stage: c.stage || 'prospect', pipeline_value: c.pipeline_value || 0,
  notes: c.notes, last_contact_at: c.last_contact_at,
  tags: c.contact_tags?.map(t=>t.tag) || [],
  unread: 0, av: (c.name||'??').split(' ').map(w=>w[0]).slice(0,2).join(''),
})

const normalizeProduct = p => ({
  id: p.id, ref: p.ref || p.code, name: p.name, unit: p.unit,
  price: p.price, stock: p.stock || 0,
  category: p.product_categories?.name || '—',
})

const normalizePromo = p => ({
  id: p.id, title: p.title, description: p.description,
  badge: p.badge, discount_pct: p.discount_pct,
  ends_at: p.ends_at ? new Date(p.ends_at).toLocaleDateString('pt-BR') : '—',
  product_ids: p.promotion_products?.map(x=>x.product_id) || [],
})

const normalizeCombo = c => ({
  id: c.id, name: c.name, tag: c.tag,
  original_price: c.original_price, combo_price: c.combo_price, saving: c.saving,
  items: c.combo_items?.map(i=>({ pid: i.product_id, q: i.quantity })) || [],
})

const normalizeOrder = o => ({
  id: o.id, number: o.number, contact_id: o.contact_id,
  contact_name: o.contacts?.name || '—',
  total: o.total, status: o.status, origin: o.origin,
  payment_terms: o.payment_terms,
  created_at: o.created_at ? new Date(o.created_at).toLocaleDateString('pt-BR') : '—',
})

const normalizeQuote = q => ({
  id: q.id, number: q.number, contact_id: q.contact_id,
  contact_name: q.contacts?.name || '—',
  total: q.total, status: q.status,
  valid_until: q.deadline ? new Date(q.deadline).toLocaleDateString('pt-BR') : '—',
})

const normalizeVisit = v => ({
  id: v.id, contact_id: v.contact_id,
  contact_name: v.contacts?.name || '—',
  scheduled_at: v.scheduled_at ? new Date(v.scheduled_at).toLocaleString('pt-BR', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' }) : '—',
  type: v.type, status: v.status, origin: v.origin,
})
