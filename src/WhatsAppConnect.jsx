import { useState, useRef, useEffect } from 'react'
import { B, Ic } from './lib/data.jsx'

const EVO_URL      = 'https://evolution-api-production-4a43.up.railway.app'
const EVO_INSTANCE = 'crepresentante'
const EVO_KEY      = ['daaa5872da9aa49319a663b5752d3ff',
                      'ca0b2d4be5db0dac1832c21f7228fc1d2'].join('')

// ─── Main component ────────────────────────────────────────────────────────────
export function WhatsAppConnect({ isMobile = false }) {
  const [status,   setStatus]   = useState('unknown')   // unknown | disconnected | connecting | connected
  const [qrCode,   setQrCode]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [phone,    setPhone]    = useState(null)
  const pollRef = useRef(null)

  const headers = { apikey: EVO_KEY, 'Content-Type': 'application/json' }

  // ─── Check connection state ──────────────────────────────────────────────────
  const checkState = async () => {
    try {
      const res  = await fetch(`${EVO_URL}/instance/connectionState/${EVO_INSTANCE}`, { headers })
      const data = await res.json()
      const state = data?.instance?.state
      if (state === 'open') {
        setStatus('connected')
        setQrCode(null)
        setPhone(data?.instance?.profileName || data?.instance?.me?.pushName || null)
        clearInterval(pollRef.current)
        return 'open'
      }
      if (state === 'connecting') { setStatus('connecting'); return 'connecting' }
      setStatus('disconnected')
      return 'disconnected'
    } catch {
      setStatus('disconnected')
      return 'disconnected'
    }
  }

  // ─── Connect → generate QR ──────────────────────────────────────────────────
  const connect = async () => {
    setLoading(true); setError(null); setQrCode(null)
    try {
      // 1. Try existing instance connection endpoint first
      const connRes  = await fetch(`${EVO_URL}/instance/connect/${EVO_INSTANCE}`, { headers })
      const connData = await connRes.json()

      const b64 = connData?.base64 || connData?.qrcode?.base64
      if (b64) {
        setQrCode(b64.startsWith('data:') ? b64 : `data:image/png;base64,${b64}`)
        setStatus('connecting')
        startPolling()
        return
      }

      // 2. If instance doesn't exist, create it
      if (connRes.status === 404 || connData?.error) {
        const createRes  = await fetch(`${EVO_URL}/instance/create`, {
          method: 'POST', headers,
          body: JSON.stringify({ instanceName: EVO_INSTANCE, qrcode: true, integration: 'WHATSAPP-BAILEYS' })
        })
        const createData = await createRes.json()
        const b64c = createData?.qrcode?.base64
        if (b64c) {
          setQrCode(b64c.startsWith('data:') ? b64c : `data:image/png;base64,${b64c}`)
          setStatus('connecting')
          startPolling()
          return
        }
      }

      setError('Não foi possível gerar o QR Code. Verifique a conexão com o servidor.')
    } catch (e) {
      setError('Erro ao conectar ao servidor Evolution API.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Polling ─────────────────────────────────────────────────────────────────
  const startPolling = () => {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      const s = await checkState()
      if (s === 'open') clearInterval(pollRef.current)
    }, 3000)
  }

  // ─── Disconnect ───────────────────────────────────────────────────────────────
  const disconnect = async () => {
    clearInterval(pollRef.current)
    try {
      await fetch(`${EVO_URL}/instance/logout/${EVO_INSTANCE}`, { method: 'DELETE', headers })
    } finally {
      setStatus('disconnected'); setQrCode(null); setPhone(null)
    }
  }

  useEffect(() => {
    checkState()
    return () => clearInterval(pollRef.current)
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────────
  const pad = isMobile ? 16 : 24

  return (
    <div style={{ padding: pad, maxWidth: isMobile ? '100%' : 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: B[800], marginBottom: 4 }}>
          Conexão WhatsApp
        </div>
        <div style={{ fontSize: 12, color: B[500] }}>
          Conecte seu número para sincronizar conversas em tempo real
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 20
      }}>
        {/* ─── Painel QR / Status ─── */}
        <div style={{ background: B[0], border: `1px solid ${B[150]}`, padding: 24 }}>
          <StatusPill status={status} />

          {status === 'connected' ? (
            <ConnectedState phone={phone} onDisconnect={disconnect} />
          ) : qrCode ? (
            <QrState qr={qrCode} onRefresh={connect} loading={loading} />
          ) : (
            <IdleState onConnect={connect} loading={loading} error={error} />
          )}
        </div>

        {/* ─── Painel Info ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <HowItWorks />
          <InstanceInfo status={status} />
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const map = {
    connected:    { color: '#00963D', bg: '#E6FFF2', label: 'Conectado' },
    connecting:   { color: '#D97706', bg: '#FFF8E7', label: 'Aguardando escaneamento...' },
    disconnected: { color: B[500],    bg: B[50],     label: 'Desconectado' },
    unknown:      { color: B[400],    bg: B[50],     label: 'Verificando...' },
  }
  const s = map[status] || map.unknown
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: s.bg, padding: '6px 12px', marginBottom: 20 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.label}</span>
    </div>
  )
}

function ConnectedState({ phone, onDisconnect }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E6FFF2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
        <Ic n="check" s={32} c="#00963D" />
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: B[800], marginBottom: 4 }}>WhatsApp Conectado!</div>
      {phone && <div style={{ fontSize: 13, color: B[500], marginBottom: 16 }}>{phone}</div>}
      <div style={{ fontSize: 12, color: B[500], lineHeight: 1.7, marginBottom: 24 }}>
        Mensagens recebidas aparecem automaticamente<br />na aba <strong>Conversas</strong> em tempo real.
      </div>
      <button onClick={onDisconnect}
        style={{ padding: '9px 18px', background: '#FFF0F0', color: '#DC2626', border: '1px solid #fca5a5', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
        Desconectar WhatsApp
      </button>
    </div>
  )
}

function QrState({ qr, onRefresh, loading }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: B[700], marginBottom: 14 }}>
        Escaneie com seu WhatsApp
      </div>
      <div style={{ background: '#fff', padding: 10, border: `2px solid #00C85330`, display: 'inline-block', marginBottom: 14 }}>
        <img src={qr} alt="QR Code" style={{ width: 220, height: 220, display: 'block' }} />
      </div>
      <div style={{ fontSize: 11, color: B[500], lineHeight: 1.8, marginBottom: 16 }}>
        1. Abra o WhatsApp no celular<br />
        2. Toque em <strong>Mais opções → Aparelhos conectados</strong><br />
        3. Toque em <strong>Conectar um aparelho</strong><br />
        4. Aponte a câmera para o QR Code acima
      </div>
      <button onClick={onRefresh} disabled={loading}
        style={{ padding: '8px 14px', background: B[50], color: B[600], border: `1px solid ${B[200]}`, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Ic n="zap" s={12} c={B[500]} /> Novo QR Code
      </button>
    </div>
  )
}

function IdleState({ onConnect, loading, error }) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ width: 220, height: 220, background: B[50], border: `2px dashed ${B[200]}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Ic n="phone" s={40} c={B[250]} />
        <div style={{ fontSize: 12, color: B[400], marginTop: 10 }}>QR Code aparece aqui</div>
      </div>
      {error && (
        <div style={{ background: '#FFF0F0', border: '1px solid #fca5a5', padding: '10px 14px', fontSize: 12, color: '#DC2626', marginBottom: 16 }}>
          {error}
        </div>
      )}
      <button onClick={onConnect} disabled={loading}
        style={{ padding: '12px 24px', background: loading ? B[100] : B[800], color: loading ? B[500] : B[0], border: 'none', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {loading ? <><Ic n="zap" s={14} c={B[400]} /> Gerando QR Code...</> : <><Ic n="phone" s={14} c={B[0]} /> Conectar WhatsApp</>}
      </button>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { n: '1', title: 'Conecte seu número', desc: 'Escaneie o QR Code com seu WhatsApp pessoal ou comercial' },
    { n: '2', title: 'Mensagens sincronizadas', desc: 'Toda mensagem recebida aparece em tempo real na aba Conversas' },
    { n: '3', title: 'Responda na plataforma', desc: 'Envie mensagens, orçamentos e pedidos sem sair do CRepresentante' },
  ]
  return (
    <div style={{ background: B[0], border: `1px solid ${B[150]}`, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: B[800], marginBottom: 14 }}>Como funciona</div>
      {steps.map(s => (
        <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: B[800], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: B[0], flexShrink: 0 }}>{s.n}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: B[800], marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: B[500], lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function InstanceInfo({ status }) {
  const rows = [
    { label: 'Instância',  value: EVO_INSTANCE },
    { label: 'Servidor',   value: 'Railway · US West' },
    { label: 'Versão',     value: 'Evolution API 2.3.7' },
    { label: 'Status',     value: { connected:'Ativo', connecting:'Aguardando', disconnected:'Offline', unknown:'Verificando' }[status] || '-' },
  ]
  return (
    <div style={{ background: B[0], border: `1px solid ${B[150]}`, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: B[800], marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Ic n="settings" s={13} c={B[600]} /> Configurações
      </div>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${B[100]}` }}>
          <span style={{ fontSize: 11, color: B[500] }}>{r.label}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: B[700] }}>{r.value}</span>
        </div>
      ))}
    </div>
  )
}
