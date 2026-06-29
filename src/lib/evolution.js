// ─── Evolution API helper ──────────────────────────────────────────────────────
const EVO_URL      = 'https://evolution-api-production-4a43.up.railway.app'
const EVO_INSTANCE = 'crepresentante'
const EVO_KEY      = ['daaa5872da9aa49319a663b5752d3ff',
                      'ca0b2d4be5db0dac1832c21f7228fc1d2'].join('')

// Normaliza telefone para formato internacional (55 + DDD + número)
function sanitizePhone(raw) {
  const digits = (raw || '').replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('55') && digits.length >= 12) return digits
  if (digits.length === 11 || digits.length === 10) return '55' + digits
  return digits.length >= 8 ? digits : null
}

// Envia texto via WhatsApp
export async function sendText(phone, text) {
  const number = sanitizePhone(phone)
  if (!number) return { error: 'invalid_phone' }
  try {
    const res = await fetch(`${EVO_URL}/message/sendText/${EVO_INSTANCE}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', apikey: EVO_KEY },
      body: JSON.stringify({
        number,
        options:     { delay: 500, presence: 'composing' },
        textMessage: { text },
      }),
    })
    return res.ok ? res.json() : { error: `HTTP ${res.status}` }
  } catch (e) {
    return { error: e.message }
  }
}

// Monta mensagem de resumo de pedido
export function formatOrderMsg(contact, items, total, opts = {}) {
  const lines = items
    .map(i => `• ${i.name} × ${i.qty}  →  R$ ${(i.price * i.qty).toFixed(2).replace('.',',')}`)
    .join('\n')
  return [
    `*📋 Pedido confirmado — CRepresentante*`,
    `Cliente: ${contact?.name || '—'}`,
    ``,
    lines,
    ``,
    `*Total: R$ ${total.toFixed(2).replace('.', ',')}*`,
    opts.paymentTerms ? `Pagamento: ${opts.paymentTerms}` : '',
    opts.deliveryDays  ? `Entrega: ${opts.deliveryDays}`   : '',
    opts.notes         ? `Obs: ${opts.notes}`              : '',
  ].filter(Boolean).join('\n')
}

// Configura webhook na Evolution API (chama uma vez)
export async function setWebhook(webhookUrl) {
  const res = await fetch(`${EVO_URL}/webhook/set/${EVO_INSTANCE}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', apikey: EVO_KEY },
    body: JSON.stringify({
      url:     webhookUrl,
      enabled: true,
      events:  ['MESSAGES_UPSERT'],
      webhookByEvents: false,
    }),
  })
  return res.json()
}
