import { useState, useRef, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { B, Ic, Av, Tag, tagVariant, fmt, pct, MOCK, AGENDA, ANUNCIOS, CAMPANHAS, CADENCIAS, ERP_PRODUCTS_DETAIL } from './lib/data.jsx'
import { useIsMobile, useAuth, useAppData } from './hooks/useApp.js'

// ─── Constants ────────────────────────────────
const STAGES     = ['closing','negotiation','proposal','qualified','prospect']
const STAGE_LABEL= { closing:'Fechamento', negotiation:'Negociação', proposal:'Proposta', qualified:'Qualificado', prospect:'Prospect' }
const STATUS_LABEL= { draft:'Rascunho', sent:'Enviado', confirmed:'Confirmado', invoiced:'Faturado', delivered:'Entregue', cancelled:'Cancelado', open:'Aberto', approved:'Aprovado', rejected:'Rejeitado', expired:'Expirado' }

// ─── Auth screens ─────────────────────────────
// ─── Email validation ────────────────────────────────────────────────────────
const isValidEmail = e => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test((e||'').trim())

// Field defined OUTSIDE LoginScreen to avoid remount on every keystroke
const AuthField = ({ label, type='text', value, onChange, placeholder, error, onKey, hint }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
    <label style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.5 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKey}
      placeholder={placeholder}
      autoComplete={type==='password'?'current-password':type==='email'?'email':'name'}
      style={{
        padding:'12px 13px',
        border:`1px solid ${error ? '#fca5a5' : B[200]}`,
        background: error ? '#fff5f5' : B[50],
        fontSize:14, color:B[800], outline:'none', fontFamily:'inherit',
        WebkitAppearance:'none', borderRadius:0,
      }}
    />
    {error && <div style={{ fontSize:11, color:'#dc2626' }}>⚠ {error}</div>}
    {hint && !error && <div style={{ fontSize:11, color:B[500] }}>{hint}</div>}
  </div>
)

function LoginScreen({ onLogin, onSignUp, onDemo }) {
  const [mode, setMode]       = useState('login') // login | signup
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [pw, setPw]           = useState('')
  const [pw2, setPw2]         = useState('')
  const [errs, setErrs]       = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (mode === 'signup' && name.trim().length < 2)
      e.name = 'Digite seu nome completo'
    if (!isValidEmail(email))
      e.email = 'E-mail inválido — ex: nome@empresa.com.br'
    if (pw.length < 6)
      e.pw = 'Senha deve ter ao menos 6 caracteres'
    if (mode === 'signup' && pw !== pw2)
      e.pw2 = 'As senhas não coincidem'
    return e
  }

  const switchMode = m => { setMode(m); setErrs({}); }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrs(e); return }
    setErrs({}); setLoading(true)

    if (mode === 'login') {
      const { error } = await onLogin(email.trim(), pw)
      if (error) setErrs({ global: 'E-mail ou senha incorretos' })
    } else {
      const { error } = await onSignUp(email.trim(), pw, name.trim())
      if (error) {
        setErrs({ global: error.message.includes('already') ? 'E-mail já cadastrado. Faça login.' : error.message })
      } else {
        // Auto-login after signup
        const { error: loginErr } = await onLogin(email.trim(), pw)
        if (loginErr) setErrs({ global: 'Conta criada! Faça login com suas credenciais.' })
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100dvh', background:B[50], display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:400 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <img src="/logo.svg" alt="CRepresentante" style={{ height:44, objectFit:'contain' }}
            onError={e=>{e.target.style.display='none'; e.target.nextSibling.style.display='block'}} />
          <div style={{ display:'none', fontSize:20, fontWeight:900, color:B[800] }}>CRepresentante</div>
          <div style={{ fontSize:12, color:B[500], marginTop:6 }}>CRM WhatsApp para representantes</div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', border:`1px solid ${B[200]}` }}>
          {[['login','Entrar'],['signup','Criar conta']].map(([id,lbl])=>(
            <button key={id} onClick={()=>switchMode(id)} style={{
              flex:1, padding:'12px', background:mode===id?B[800]:B[0],
              color:mode===id?B[0]:B[600], border:'none', cursor:'pointer',
              fontSize:13, fontWeight:700, letterSpacing:.2,
            }}>{lbl}</button>
          ))}
        </div>

        <div style={{ background:B[0], border:`1px solid ${B[200]}`, borderTop:'none', padding:'22px 22px 18px', display:'flex', flexDirection:'column', gap:14 }}>

          {errs.global && (
            <div style={{ fontSize:12, color:'#dc2626', background:'#fef2f2', border:'1px solid #fca5a5', padding:'10px 14px' }}>
              ⚠ {errs.global}
            </div>
          )}

          {mode === 'signup' && (
            <AuthField
              label="Nome completo"
              value={name}
              onChange={e=>setName(e.target.value)}
              placeholder="Ex: Carlos Souza"
              error={errs.name}
            />
          )}

          <AuthField
            label="E-mail"
            type="email"
            value={email}
            onChange={e=>{ setEmail(e.target.value); setErrs(v=>({...v,email:undefined,global:undefined})) }}
            placeholder="seu@email.com.br"
            error={errs.email}
            hint={email && !isValidEmail(email) ? 'Formato: nome@dominio.com.br' : undefined}
          />

          <AuthField
            label="Senha"
            type="password"
            value={pw}
            onChange={e=>setPw(e.target.value)}
            placeholder={mode==='signup'?'Mínimo 6 caracteres':'Sua senha'}
            error={errs.pw}
            onKey={mode==='login'?e=>e.key==='Enter'&&submit():undefined}
          />

          {mode === 'signup' && (
            <AuthField
              label="Confirmar senha"
              type="password"
              value={pw2}
              onChange={e=>setPw2(e.target.value)}
              placeholder="Repita a senha"
              error={errs.pw2}
              onKey={e=>e.key==='Enter'&&submit()}
            />
          )}

          <button
            onClick={submit}
            disabled={loading}
            style={{
              padding:'13px', background:loading?B[400]:B[800], color:B[0],
              border:'none', fontSize:14, fontWeight:800,
              cursor:loading?'default':'pointer', marginTop:4,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}
          >
            {loading ? 'Aguarde...' : mode==='login' ? 'Entrar' : 'Criar conta grátis'}
          </button>
        </div>

        <div style={{ height:1, background:B[200], margin:'16px 0' }} />

        <button onClick={onDemo} style={{
          width:'100%', padding:'11px', background:B[0],
          border:`1px solid ${B[300]}`, color:B[600],
          fontSize:13, fontWeight:600, cursor:'pointer',
        }}>
          Acessar em modo demonstração →
        </button>
      </div>
    </div>
  )
}


// ─── Shared: KpiCard ─────────────────────────
const KpiCard = ({ label, value, sub, icon, delta, accent=false }) => (
  <div style={{ background:B[0], borderTop:`3px solid ${accent?B[800]:B[200]}`, border:`1px solid ${B[150]}`, padding:'16px 18px' }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
      <span style={{ fontSize:10, color:B[500], fontWeight:700, textTransform:'uppercase', letterSpacing:.6 }}>{label}</span>
      <Ic n={icon} s={16} c={B[400]} />
    </div>
    <div style={{ fontSize:24, fontWeight:900, color:B[800], letterSpacing:-1 }}>{value}</div>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
      <span style={{ fontSize:11, color:B[500] }}>{sub}</span>
      {delta && <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', background:B[150], color:B[700] }}>{delta}</span>}
    </div>
  </div>
)

// ─── Shared: OrderPanel (used on both mobile+desktop) ─────────────────────────
function OrderPanel({ contact, products, promotions, combos, paymentTerms, deliveryOptions, onSend, compact=false }) {
  const [cart, setCart]         = useState({})
  const [cat, setCat]           = useState('Todos')
  const [search, setSearch]     = useState('')
  const [pay, setPay]           = useState('30/60')
  const [del, setDel]           = useState('5 dias úteis')
  const [notes, setNotes]       = useState('')
  const [screen, setScreen]     = useState('catalog')
  const [flash, setFlash]       = useState({})
  const [done, setDone]         = useState(false)
  const cats = ['Todos', ...[...new Set(products.map(p=>p.category))]]
  const lines = Object.entries(cart).filter(([,q])=>q>0)
  const count = lines.reduce((a,[,q])=>a+q,0)
  const total = lines.reduce((a,[id,q])=>a+(products.find(p=>p.id===id)?.price||0)*q,0)
  const filtered = products.filter(p=>(cat==='Todos'||p.category===cat)&&(p.name.toLowerCase().includes(search.toLowerCase())||p.ref?.toLowerCase().includes(search.toLowerCase())))
  const add = id=>{setCart(c=>({...c,[id]:(c[id]||0)+1}));setFlash(f=>({...f,[id]:true}));setTimeout(()=>setFlash(f=>({...f,[id]:false})),500)}
  const setQty=(id,q)=>q<=0?setCart(c=>(({[id]:_,...r})=>r)(c)):setCart(c=>({...c,[id]:q}))
  const addCombo=cb=>cb.items.forEach(({pid,q})=>setCart(c=>({...c,[pid]:(c[pid]||0)+q})))
  const submit=async()=>{const items=lines.map(([id,q])=>{const p=products.find(x=>x.id===id);return{...p,qty:q}});await onSend?.(contact,items,{paymentTerms:pay,deliveryDays:del,notes});setDone(true);setTimeout(()=>{setCart({});setScreen('catalog');setDone(false)},2500)}

  if (done) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, gap:16, textAlign:'center' }}>
      <div style={{ width:64, height:64, background:B[800], display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="check" s={32} c={B[0]} /></div>
      <div style={{ fontSize:18, fontWeight:900, color:B[800] }}>Pedido enviado!</div>
      <div style={{ fontSize:24, fontWeight:900, color:B[500], fontVariantNumeric:'tabular-nums' }}>{fmt(total)}</div>
      <div style={{ fontSize:12, color:B[500] }}>{pay} · {del}</div>
    </div>
  )

  // Checkout screen
  if (screen==='checkout') return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${B[150]}`, display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={()=>setScreen('catalog')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="back" s={20} c={B[800]} /></button>
        <span style={{ fontSize:14, fontWeight:800, color:B[800] }}>Finalizar — {fmt(total)}</span>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:14 }}>
        {/* Resumo */}
        <div style={{ background:B[50], borderTop:`3px solid ${B[800]}`, border:`1px solid ${B[150]}`, padding:'12px 14px' }}>
          {lines.map(([id,q])=>{const p=products.find(x=>x.id===id);return(<div key={id} style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}><span style={{ color:B[700] }}>{q}× {p?.name}</span><span style={{ fontWeight:700, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt((p?.price||0)*q)}</span></div>)})}
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, borderTop:`1px solid ${B[200]}`, marginTop:6 }}><span style={{ fontSize:14, fontWeight:800, color:B[800] }}>Total</span><span style={{ fontSize:16, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(total)}</span></div>
        </div>
        {/* Pagamento */}
        <div><div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:'uppercase', letterSpacing:.7, marginBottom:8 }}>Pagamento</div><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>{paymentTerms.map(t=>(<button key={t} onClick={()=>setPay(t)} style={{ padding:'10px 4px', fontSize:11, fontWeight:700, cursor:'pointer', background:pay===t?B[800]:B[0], color:pay===t?B[0]:B[600], border:`1px solid ${pay===t?B[800]:B[200]}` }}>{t}</button>))}</div></div>
        {/* Entrega */}
        <div><div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:'uppercase', letterSpacing:.7, marginBottom:8 }}>Entrega</div><div style={{ display:'flex', flexDirection:'column', gap:5 }}>{deliveryOptions.map(d=>(<button key={d} onClick={()=>setDel(d)} style={{ padding:'11px 14px', fontSize:12, fontWeight:600, cursor:'pointer', textAlign:'left', background:del===d?B[800]:B[0], color:del===d?B[0]:B[700], border:`1px solid ${del===d?B[800]:B[200]}` }}>{d}</button>))}</div></div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Observações..." style={{ padding:'10px 12px', border:`1px solid ${B[200]}`, fontSize:12, outline:'none', fontFamily:'inherit', resize:'none', background:B[50] }} />
      </div>
      <div style={{ padding:'12px 16px', borderTop:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', gap:7 }}>
        <button onClick={submit} style={{ padding:'14px', background:B[800], color:B[0], border:'none', fontSize:13, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}><Ic n="send" s={15} c={B[0]} /> Confirmar e enviar</button>
        <button onClick={submit} style={{ padding:'10px', background:B[0], color:B[600], border:`1px solid ${B[200]}`, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><span style={{ fontSize:8, fontWeight:900, background:B[800], color:B[0], padding:'2px 5px' }}>ERP</span> Somente ERP</button>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:0 }}>
      {/* Search + client info */}
      {contact && <div style={{ padding:'10px 14px', background:B[800], borderBottom:`1px solid ${B[700]}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:B[0] }}>{contact.name}</div>
        <div style={{ fontSize:10, color:B[300] }}>{contact.company}</div>
      </div>}
      <div style={{ padding:'8px 12px', borderBottom:`1px solid ${B[150]}`, background:B[0] }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'8px 12px' }}>
          <Ic n="search" s={15} c={B[400]} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produto ou código..." style={{ border:'none', background:'none', outline:'none', fontSize:13, color:B[800], flex:1, fontFamily:'inherit' }} />
          {search && <button onClick={()=>setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Ic n="x" s={14} c={B[400]} /></button>}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
        {/* Promos */}
        {!search && promotions.length>0 && (
          <div style={{ padding:'10px 0 4px' }}>
            <div style={{ padding:'0 12px', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Ic n="zap" s={13} c={B[800]} /><span style={{ fontSize:10, fontWeight:800, color:B[800], textTransform:'uppercase', letterSpacing:.7 }}>Promoções</span></div>
            <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'thin', scrollbarColor:`${B[200]} transparent`, padding:'0 12px 12px' }}>
              {promotions.map(pr=>(
                <div key={pr.id} style={{ flexShrink:0, width:200, background:B[800], padding:'12px', position:'relative' }}>
                  <div style={{ position:'absolute', top:0, right:0, background:B[500], padding:'4px 8px', fontSize:9, fontWeight:900, color:B[0] }}>{pr.badge}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:B[0], marginTop:8, marginBottom:3 }}>{pr.title}</div>
                  <div style={{ fontSize:10, color:B[300], marginBottom:10 }}>{pr.description}</div>
                  <button onClick={()=>pr.product_ids?.forEach(add)} style={{ padding:'7px 12px', background:B[0], color:B[800], border:'none', fontSize:10, fontWeight:800, cursor:'pointer' }}>+ Adicionar</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Combos */}
        {!search && combos.length>0 && (
          <div style={{ padding:'4px 0 6px' }}>
            <div style={{ padding:'0 12px', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Ic n="tag" s={13} c={B[800]} /><span style={{ fontSize:10, fontWeight:800, color:B[800], textTransform:'uppercase', letterSpacing:.7 }}>Combos</span></div>
            <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'thin', scrollbarColor:`${B[200]} transparent`, padding:'0 12px 12px' }}>
              {combos.map(cb=>(
                <div key={cb.id} style={{ flexShrink:0, width:170, background:B[0], border:`1px solid ${B[200]}`, borderTop:`3px solid ${B[800]}`, padding:'10px' }}>
                  <div style={{ fontSize:9, fontWeight:800, color:B[500], textTransform:'uppercase', marginBottom:3 }}>{cb.tag}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:B[800], marginBottom:5 }}>{cb.name}</div>
                  <div style={{ fontSize:16, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums', marginBottom:8 }}>{fmt(cb.combo_price)}</div>
                  <button onClick={()=>addCombo(cb)} style={{ width:'100%', padding:'8px', background:B[800], color:B[0], border:'none', fontSize:10, fontWeight:800, cursor:'pointer' }}>+ Combo</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Cats */}
        <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, borderBottom:`1px solid ${B[150]}`, position:'sticky', top:0, zIndex:5 }}>
          <div style={{ display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
            {cats.map(c=>(<button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0, padding:'10px 12px', background:'none', border:'none', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap', color:cat===c?B[800]:B[400], borderBottom:cat===c?`2px solid ${B[800]}`:'2px solid transparent', marginBottom:-1 }}>{c}</button>))}
          </div>
        </div>
        {/* Product grid */}
        <div style={{ display:'grid', gridTemplateColumns:compact?'1fr':'1fr 1fr', gap:6, padding:8, paddingBottom:count>0?80:20 }}>
          {filtered.map(p=>{
            const q=cart[p.id]||0,fl=flash[p.id],low=p.stock<20
            return (
              <div key={p.id} style={{ background:B[0], border:`1px solid ${q>0?B[800]:B[200]}`, borderTop:`3px solid ${q>0?B[800]:B[150]}`, padding:'10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:9, color:B[400], fontFamily:'monospace', fontWeight:700 }}>{p.ref}</span>
                  {q>0&&<span style={{ fontSize:9, fontWeight:900, background:B[800], color:B[0], padding:'1px 5px' }}>{q}</span>}
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:B[800], lineHeight:1.3, marginBottom:6 }}>{p.name}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:8 }}>
                  <div><div style={{ fontSize:14, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(p.price)}</div><div style={{ fontSize:9, color:B[400] }}>/{p.unit}</div></div>
                  {low&&<span style={{ fontSize:8, fontWeight:700, color:'#b45309', background:'#fff7ed', padding:'2px 4px' }}>⚠{p.stock}</span>}
                </div>
                {q===0
                  ?<button onClick={()=>add(p.id)} style={{ width:'100%', padding:'9px 0', background:fl?B[300]:B[800], color:B[0], border:'none', fontSize:11, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4, transition:'background .2s' }}><Ic n={fl?'check':'plus'} s={12} c={B[0]} />{fl?'Adicionado':'Adicionar'}</button>
                  :<div style={{ display:'flex', overflow:'hidden', border:`1px solid ${B[800]}` }}>
                    <button onClick={()=>setQty(p.id,q-1)} style={{ flex:1, padding:'8px 0', background:B[100], border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="minus" s={13} c={B[800]} /></button>
                    <span style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:B[800], fontFamily:'monospace' }}>{q}</span>
                    <button onClick={()=>add(p.id)} style={{ flex:1, padding:'8px 0', background:B[800], border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Ic n="plus" s={13} c={B[0]} /></button>
                  </div>
                }
              </div>
            )
          })}
        </div>
      </div>
      {count>0&&<button onClick={()=>setScreen('checkout')} style={{ position:'sticky', bottom:0, width:'100%', background:B[800], color:B[0], border:'none', padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ position:'relative' }}><Ic n="cart" s={22} c={B[0]} /><div style={{ position:'absolute', top:-5, right:-5, width:16, height:16, background:B[500], borderRadius:'50%', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center' }}>{count}</div></div>
          <div><div style={{ fontSize:10, color:B[300] }}>{count} item{count!==1?'s':''}</div><div style={{ fontSize:15, fontWeight:900, fontVariantNumeric:'tabular-nums' }}>{fmt(total)}</div></div>
        </div>
        <div style={{ fontSize:12, fontWeight:800, display:'flex', alignItems:'center', gap:5 }}>Ver carrinho <Ic n="chevR" s={15} c={B[0]} /></div>
      </button>}
    </div>
  )
}

// ─── Shared: ChatPanel ────────────────────────
function ChatPanel({ contact, msgs, onSend, onBack }) {
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])
  const send = () => { if (!input.trim()) return; onSend(input); setInput('') }
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ background:B[800], padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        {onBack && <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="back" s={22} c={B[0]} /></button>}
        <Av lbl={contact?.av||'?'} sz={34} bg={B[600]} />
        <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:B[0] }}>{contact?.name}</div><div style={{ fontSize:10, color:B[300] }}>{contact?.company}</div></div>
        <button style={{ padding:'6px 12px', background:B[600], color:B[0], border:'none', fontSize:10, fontWeight:800, cursor:'pointer' }}>Orçamento</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px', background:B[50], display:'flex', flexDirection:'column', gap:8 }}>
        {(msgs||[]).map((m,i)=>(
          <div key={i} style={{ display:'flex', justifyContent:m.from==='m'?'flex-end':'flex-start' }}>
            <div style={{ maxWidth:'72%', padding:'9px 12px', background:m.from==='m'?B[800]:B[0], border:m.from==='m'?'none':`1px solid ${B[200]}` }}>
              <div style={{ fontSize:12, color:m.from==='m'?B[0]:B[800], whiteSpace:'pre-wrap', lineHeight:1.5 }}>{m.text}</div>
              <div style={{ fontSize:10, color:m.from==='m'?B[300]:B[400], marginTop:4, textAlign:'right' }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ background:B[0], padding:'10px 14px', display:'flex', gap:8, borderTop:`1px solid ${B[150]}`, flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Digite uma mensagem..." style={{ flex:1, padding:'10px 12px', border:`1px solid ${B[200]}`, background:B[50], fontSize:13, color:B[800], outline:'none', fontFamily:'inherit' }} />
        <button onClick={send} style={{ width:40, height:40, background:B[800], border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic n="send" s={16} c={B[0]} /></button>
      </div>
    </div>
  )
}


// ─── FAB + Client Selector ────────────────────────────────────────────────────
function FabOrder({ data }) {
  const [open, setOpen]     = useState(false)
  const [clientId, setClientId] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = data.contacts.filter(c =>
    c.stage !== 'prospect' &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.company.toLowerCase().includes(search.toLowerCase()))
  )
  const client = data.contacts.find(c => c.id === clientId)

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(true)} style={{
        position:'fixed', bottom:78, right:16, zIndex:90,
        width:54, height:54, borderRadius:'50%', background:B[800],
        border:`3px solid ${B[0]}`, cursor:'pointer', display:'flex',
        alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 20px rgba(38,59,126,0.45)',
      }}>
        <Ic n="cart" s={22} c={B[0]} />
      </button>

      {/* Overlay */}
      {open && (
        <div onClick={() => { setOpen(false); setClientId(null); setSearch('') }}
          style={{ position:'fixed', inset:0, background:'rgba(15,20,50,0.6)', zIndex:100, backdropFilter:'blur(2px)' }} />
      )}

      {/* Bottom sheet */}
      {open && (
        <div style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:101,
          background:B[0], borderRadius:'16px 16px 0 0',
          maxHeight:'88dvh', display:'flex', flexDirection:'column',
          boxShadow:'0 -8px 40px rgba(15,20,50,0.2)',
        }}>
          {/* Handle */}
          <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 8px' }}>
            <div style={{ width:36, height:4, background:B[200], borderRadius:2 }} />
          </div>

          {!clientId ? (
            <>
              <div style={{ padding:'0 18px 14px' }}>
                <div style={{ fontSize:16, fontWeight:800, color:B[800], marginBottom:14 }}>Tirar pedido para:</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'10px 13px' }}>
                  <Ic n="search" s={16} c={B[400]} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
                    style={{ border:'none', background:'none', outline:'none', fontSize:14, color:B[800], flex:1, fontFamily:'inherit' }} />
                </div>
              </div>
              <div style={{ flex:1, overflowY:'auto', paddingBottom:20 }}>
                {filtered.map(c => (
                  <div key={c.id} onClick={e => { e.stopPropagation(); setClientId(c.id) }}
                    style={{ display:'flex', gap:12, padding:'13px 18px', borderBottom:`1px solid ${B[100]}`, cursor:'pointer', alignItems:'center' }}>
                    <Av lbl={c.av} sz={40} bg={B[800]} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</div>
                      <div style={{ fontSize:12, color:B[500] }}>{c.company} · {c.city}</div>
                      {c.pipeline_value > 0 && <div style={{ fontSize:12, fontWeight:700, color:B[600], fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</div>}
                    </div>
                    <Ic n="chevR" s={16} c={B[300]} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'0 18px 10px', display:'flex', alignItems:'center', gap:10 }}>
                <button onClick={e => { e.stopPropagation(); setClientId(null) }}
                  style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
                  <Ic n="back" s={20} c={B[800]} />
                </button>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:B[800] }}>{client?.name}</div>
                  <div style={{ fontSize:12, color:B[500] }}>{client?.company}</div>
                </div>
              </div>
              <div style={{ flex:1, overflow:'hidden' }} onClick={e => e.stopPropagation()}>
                <OrderPanel
                  contact={client}
                  products={data.products}
                  promotions={data.promotions}
                  combos={data.combos}
                  paymentTerms={data.paymentTerms}
                  deliveryOptions={data.deliveryOptions}
                  onSend={async (...args) => { await data.createOrder(...args); setOpen(false); setClientId(null) }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ─── Page: PRODUTOS (ERP catalog) ─────────────────────────────────────────────
function Produtos() {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('Todos')
  const [view, setView]       = useState('grid') // grid | list
  const [syncFilter, setSyncFilter] = useState('all') // all | ok | error

  const cats = ['Todos', ...new Set(ERP_PRODUCTS_DETAIL.map(p => p.category))]
  const lastSyncGlobal = 'há 5 min'

  const filtered = ERP_PRODUCTS_DETAIL.filter(p =>
    (cat === 'Todos' || p.category === cat) &&
    (syncFilter === 'all' || (syncFilter === 'ok' && p.syncOk) || (syncFilter === 'error' && !p.syncOk)) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase()) || p.erpCode.toLowerCase().includes(search.toLowerCase()))
  )

  const syncOkCount  = ERP_PRODUCTS_DETAIL.filter(p => p.syncOk).length
  const syncErrCount = ERP_PRODUCTS_DETAIL.filter(p => !p.syncOk).length

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100%' }}>
      {/* Header strip */}
      <div style={{ background:B[800], padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:10, color:B[300], textTransform:'uppercase', letterSpacing:.8 }}>Catálogo integrado ao</div>
          <div style={{ fontSize:14, fontWeight:800, color:B[0] }}>ERP · {ERP_PRODUCTS_DETAIL.length} produtos</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:9, color:B[300] }}>Última sincronização</div>
          <div style={{ fontSize:12, fontWeight:700, color:B[0] }}>{lastSyncGlobal}</div>
        </div>
      </div>

      {/* Sync status bar */}
      <div style={{ display:'flex', background:B[0], borderBottom:`1px solid ${B[150]}` }}>
        {[
          ['all',   `Todos (${ERP_PRODUCTS_DETAIL.length})`, B[800]],
          ['ok',    `Sincronizados (${syncOkCount})`,        '#15803d'],
          ['error', `Erro (${syncErrCount})`,                '#dc2626'],
        ].map(([id, label, col]) => (
          <button key={id} onClick={() => setSyncFilter(id)} style={{
            flex:1, padding:'10px 6px', background:'none', border:'none', cursor:'pointer',
            fontSize:10, fontWeight:700, color:syncFilter === id ? col : B[400],
            borderBottom:`2px solid ${syncFilter === id ? col : 'transparent'}`,
            marginBottom:-1,
          }}>{label}</button>
        ))}
        <button style={{ padding:'8px 12px', background:'none', border:'none', cursor:'pointer', color:B[500], fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
          <Ic n="erp" s={13} c={B[500]} /> Sincronizar
        </button>
      </div>

      {/* Search + filters */}
      <div style={{ background:B[0], padding:'10px 14px', borderBottom:`1px solid ${B[150]}` }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'9px 12px' }}>
            <Ic n="search" s={15} c={B[400]} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome, código ERP ou referência..."
              style={{ border:'none', background:'none', outline:'none', fontSize:13, color:B[800], flex:1, fontFamily:'inherit' }} />
            {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Ic n="x" s={14} c={B[400]} /></button>}
          </div>
          <div style={{ display:'flex', border:`1px solid ${B[200]}` }}>
            {[['grid', 'grid'], ['list', 'sort']].map(([id, icon]) => (
              <button key={id} onClick={() => setView(id)} style={{ padding:'9px 10px', background:view===id?B[800]:B[0], border:'none', cursor:'pointer', display:'flex' }}>
                <Ic n={icon} s={15} c={view===id?B[0]:B[500]} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, position:'sticky', top:0, zIndex:5 }}>
        <div style={{ display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              flexShrink:0, padding:'10px 13px', background:'none', border:'none', cursor:'pointer',
              fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              color: cat===c ? B[800] : B[400],
              borderBottom: cat===c ? `2px solid ${B[800]}` : '2px solid transparent', marginBottom:-1,
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Products */}
      {view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, padding:10 }}>
          {filtered.map(p => {
            const low    = p.stock <= p.min
            const outOfSync = !p.syncOk
            return (
              <div key={p.ref} style={{ background:B[0], border:`1px solid ${outOfSync?'#fca5a5':low?'#fed7aa':B[200]}`, borderTop:`3px solid ${outOfSync?'#dc2626':low?'#f97316':B[800]}`, padding:'11px 11px 10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:9, color:B[400], fontFamily:'monospace', fontWeight:700 }}>{p.ref}</span>
                  <span style={{ fontSize:8, fontWeight:800, padding:'1px 5px', background:p.syncOk?'#dcfce7':'#fee2e2', color:p.syncOk?'#15803d':'#dc2626' }}>
                    {p.syncOk ? '✓ ERP' : '✗ SYNC'}
                  </span>
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:B[800], lineHeight:1.3, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:9, color:B[500], marginBottom:6 }}>{p.erpCode}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(p.price)}</div>
                    <div style={{ fontSize:9, color:B[400] }}>/{p.unit}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:low?'#dc2626':B[700] }}>{p.stock}</div>
                    <div style={{ fontSize:9, color:B[400] }}>em estoque</div>
                  </div>
                </div>
                {low && <div style={{ marginTop:6, fontSize:9, fontWeight:800, color:'#b45309', background:'#fff7ed', padding:'2px 6px' }}>Estoque baixo — mín: {p.min}</div>}
                {!p.syncOk && <div style={{ marginTop:6, fontSize:9, fontWeight:800, color:'#dc2626', background:'#fef2f2', padding:'2px 6px' }}>Erro de sincronização · {p.lastSync}</div>}
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ background:B[0] }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:B[50] }}>
                {['Ref','Nome','Cód. ERP','Preço','Estoque','Mín','Sincronização'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.6, borderBottom:`1px solid ${B[150]}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const low = p.stock <= p.min
                return (
                  <tr key={p.ref} style={{ borderBottom:`1px solid ${B[100]}`, background:i%2?B[50]:B[0] }}>
                    <td style={{ padding:'10px 14px', fontFamily:'monospace', fontWeight:700, color:B[600] }}>{p.ref}</td>
                    <td style={{ padding:'10px 14px', fontWeight:600, color:B[800] }}>{p.name}</td>
                    <td style={{ padding:'10px 14px', fontFamily:'monospace', color:B[500], fontSize:11 }}>{p.erpCode}</td>
                    <td style={{ padding:'10px 14px', fontWeight:800, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(p.price)}/{p.unit}</td>
                    <td style={{ padding:'10px 14px', fontWeight:700, color:low?'#dc2626':B[700] }}>{p.stock}</td>
                    <td style={{ padding:'10px 14px', color:B[500] }}>{p.min}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ fontSize:10, fontWeight:800, padding:'3px 8px', background:p.syncOk?'#dcfce7':'#fee2e2', color:p.syncOk?'#15803d':'#dc2626' }}>
                        {p.syncOk ? `✓ ${p.lastSync}` : `✗ Erro · ${p.lastSync}`}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Page: MARKETING ──────────────────────────────────────────────────────────
function Marketing() {
  const [sub, setSub] = useState('agenda')

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100%' }}>
      {/* Sub-nav */}
      <div style={{ background:B[0], display:'flex', borderBottom:`1px solid ${B[150]}`, flexShrink:0, overflowX:'auto', scrollbarWidth:'none' }}>
        {[['agenda','Agenda'],['anuncios','Anúncios'],['campanhas','Campanhas'],['cadencia','Cadência']].map(([id,lbl]) => (
          <button key={id} onClick={() => setSub(id)} style={{
            flexShrink:0, padding:'12px 18px', background:'none', border:'none', cursor:'pointer',
            fontSize:13, fontWeight:sub===id?800:500, color:sub===id?B[800]:B[400],
            borderBottom:sub===id?`2px solid ${B[800]}`:'2px solid transparent', marginBottom:-1,
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>

        {/* ── AGENDA ── */}
        {sub === 'agenda' && (
          <div>
            <div style={{ padding:'14px 16px', background:B[0], borderBottom:`1px solid ${B[150]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{AGENDA.length} visitas agendadas</div>
                <div style={{ fontSize:11, color:B[500] }}>{AGENDA.filter(v=>v.origin==='erp').length} via ERP · {AGENDA.filter(v=>v.origin==='platform').length} via plataforma</div>
              </div>
              <button style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', background:B[800], color:B[0], border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                <Ic n="plus" s={13} c={B[0]} /> Nova visita
              </button>
            </div>

            {/* Legenda */}
            <div style={{ padding:'8px 16px', background:B[50], borderBottom:`1px solid ${B[150]}`, display:'flex', gap:16 }}>
              {[['ERP',B[800]],['Plataforma',B[400]]].map(([l,c]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:B[600] }}>
                  <div style={{ width:8, height:8, background:c }} />{l}
                </div>
              ))}
            </div>

            {AGENDA.map((v, i) => (
              <div key={v.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:'13px 16px', borderLeft:`4px solid ${v.origin==='erp'?B[800]:B[400]}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <Av lbl={v.av} sz={38} bg={v.origin==='erp'?B[800]:B[500]} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{v.contact_name}</div>
                      <div style={{ fontSize:11, color:B[500] }}>{v.type==='presencial'?'Visita presencial':v.type==='videocall'?'Videochamada':'Ligação'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontSize:9, fontWeight:800, padding:'2px 6px', textTransform:'uppercase', background:v.origin==='erp'?B[800]:B[150], color:v.origin==='erp'?B[0]:B[700] }}>{v.origin==='erp'?'ERP':'Site'}</span>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', gap:5, alignItems:'center', fontSize:12, color:B[600] }}>
                    <Ic n="cal" s={13} c={B[500]} />
                    <strong>{v.date}</strong> às {v.time}
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <span style={{ fontSize:9, fontWeight:800, padding:'2px 8px', background:v.status==='confirmed'?'#dcfce7':'#fef9c3', color:v.status==='confirmed'?'#15803d':'#854d0e', textTransform:'uppercase' }}>
                      {v.status==='confirmed'?'Confirmado':'Pendente'}
                    </span>
                  </div>
                </div>
                {v.notes && <div style={{ marginTop:8, fontSize:11, color:B[600], background:B[50], padding:'6px 10px', borderLeft:`2px solid ${B[300]}` }}>{v.notes}</div>}
                <div style={{ marginTop:10, display:'flex', gap:6 }}>
                  <button style={{ flex:1, padding:'7px', background:B[800], color:B[0], border:'none', fontSize:10, fontWeight:700, cursor:'pointer' }}>Abrir chat</button>
                  <button style={{ flex:1, padding:'7px', background:B[50], color:B[700], border:`1px solid ${B[200]}`, fontSize:10, fontWeight:700, cursor:'pointer' }}>Tirar pedido</button>
                  <button style={{ padding:'7px 12px', background:B[50], color:B[500], border:`1px solid ${B[200]}`, fontSize:10, cursor:'pointer' }}>Reagendar</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ANÚNCIOS ── */}
        {sub === 'anuncios' && (
          <div>
            <div style={{ padding:'14px 16px', background:B[0], borderBottom:`1px solid ${B[150]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>Anúncios WhatsApp</div>
              <button style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', background:B[800], color:B[0], border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                <Ic n="plus" s={13} c={B[0]} /> Novo anúncio
              </button>
            </div>
            {ANUNCIOS.map(a => (
              <div key={a.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{a.title}</div>
                    <div style={{ fontSize:10, color:B[500], marginTop:2 }}>Criado em {a.created} · {a.type}</div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:800, padding:'3px 8px', textTransform:'uppercase',
                    background:a.status==='ativo'?'#dcfce7':a.status==='rascunho'?B[150]:'#f1f5f9',
                    color:a.status==='ativo'?'#15803d':a.status==='rascunho'?B[600]:'#64748b'
                  }}>{a.status}</span>
                </div>
                <div style={{ fontSize:12, color:B[600], background:B[50], padding:'8px 12px', lineHeight:1.5, marginBottom:10, borderLeft:`2px solid ${B[300]}` }}>
                  {a.message}
                </div>
                {a.sent > 0 && (
                  <div style={{ display:'flex', gap:16, marginBottom:10 }}>
                    {[['Enviados',a.sent,'#263b7e'],['Abertos',a.opened,'#15803d'],['Convertidos',a.converted,'#7c3aed']].map(([l,v,c])=>(
                      <div key={l} style={{ textAlign:'center' }}>
                        <div style={{ fontSize:16, fontWeight:900, color:c }}>{v}</div>
                        <div style={{ fontSize:9, color:B[500], textTransform:'uppercase', letterSpacing:.5 }}>{l}</div>
                      </div>
                    ))}
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:16, fontWeight:900, color:B[700] }}>{a.sent>0?Math.round(a.converted/a.sent*100):0}%</div>
                      <div style={{ fontSize:9, color:B[500], textTransform:'uppercase', letterSpacing:.5 }}>Conversão</div>
                    </div>
                  </div>
                )}
                <div style={{ display:'flex', gap:6 }}>
                  {a.status==='rascunho' && <button style={{ flex:1, padding:'8px', background:B[800], color:B[0], border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>Enviar agora</button>}
                  <button style={{ flex:1, padding:'8px', background:B[50], color:B[700], border:`1px solid ${B[200]}`, fontSize:11, fontWeight:700, cursor:'pointer' }}>Editar</button>
                  {a.status==='ativo' && <button style={{ flex:1, padding:'8px', background:B[50], color:B[700], border:`1px solid ${B[200]}`, fontSize:11, fontWeight:700, cursor:'pointer' }}>Pausar</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CAMPANHAS ── */}
        {sub === 'campanhas' && (
          <div>
            <div style={{ padding:'14px 16px', background:B[0], borderBottom:`1px solid ${B[150]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>Campanhas de mensagens</div>
              <button style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', background:B[800], color:B[0], border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                <Ic n="plus" s={13} c={B[0]} /> Nova campanha
              </button>
            </div>
            {CAMPANHAS.map(c => (
              <div key={c.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{c.name}</div>
                    <div style={{ fontSize:10, color:B[500], marginTop:2 }}>Início: {c.start} · WhatsApp</div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:800, padding:'3px 8px', textTransform:'uppercase',
                    background:c.status==='ativa'?'#dcfce7':c.status==='rascunho'?B[150]:'#f1f5f9',
                    color:c.status==='ativa'?'#15803d':c.status==='rascunho'?B[600]:'#64748b'
                  }}>{c.status}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, marginBottom:10 }}>
                  {[['Contatos',c.contacts,B[800]],['Enviados',c.sent,B[600]],['Responderam',c.replied,'#15803d'],['Convertidos',c.converted,'#7c3aed']].map(([l,v,col])=>(
                    <div key={l} style={{ background:B[50], border:`1px solid ${B[150]}`, padding:'8px', textAlign:'center' }}>
                      <div style={{ fontSize:18, fontWeight:900, color:col }}>{v}</div>
                      <div style={{ fontSize:9, color:B[500], textTransform:'uppercase', letterSpacing:.4 }}>{l}</div>
                    </div>
                  ))}
                </div>
                {c.sent > 0 && (
                  <div style={{ background:B[100], height:6, marginBottom:10 }}>
                    <div style={{ height:6, background:B[800], width:`${Math.round(c.sent/c.contacts*100)}%` }} />
                  </div>
                )}
                <div style={{ display:'flex', gap:6 }}>
                  {c.status==='rascunho' && <button style={{ flex:1, padding:'7px', background:B[800], color:B[0], border:'none', fontSize:10, fontWeight:700, cursor:'pointer' }}>Iniciar campanha</button>}
                  <button style={{ flex:1, padding:'7px', background:B[50], color:B[700], border:`1px solid ${B[200]}`, fontSize:10, fontWeight:700, cursor:'pointer' }}>Ver detalhes</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CADÊNCIA ── */}
        {sub === 'cadencia' && (
          <div>
            <div style={{ padding:'14px 16px', background:B[0], borderBottom:`1px solid ${B[150]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>Sequências de cadência</div>
              <button style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 14px', background:B[800], color:B[0], border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                <Ic n="plus" s={13} c={B[0]} /> Nova sequência
              </button>
            </div>
            {CADENCIAS.map(cd => (
              <div key={cd.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:'14px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{cd.name}</div>
                    <div style={{ fontSize:11, color:B[500], marginTop:2 }}>{cd.contacts} contatos ativos</div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:800, padding:'3px 8px', background:'#dcfce7', color:'#15803d', textTransform:'uppercase' }}>{cd.status}</span>
                </div>
                <div style={{ position:'relative', paddingLeft:20 }}>
                  {/* Timeline line */}
                  <div style={{ position:'absolute', left:7, top:8, bottom:8, width:2, background:B[150] }} />
                  {cd.steps.map((step, i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10, position:'relative' }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', background:step.done?B[800]:B[200], border:`2px solid ${step.done?B[800]:B[300]}`, flexShrink:0, marginTop:2, zIndex:1 }} />
                      <div style={{ flex:1, background:step.done?B[50]:B[0], border:`1px solid ${step.done?B[200]:B[150]}`, padding:'8px 12px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <span style={{ fontSize:12, fontWeight:600, color:step.done?B[600]:B[800] }}>{step.label}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:B[500] }}>Dia {step.day}</span>
                        </div>
                        <div style={{ fontSize:10, color:B[400], marginTop:2, textTransform:'uppercase', letterSpacing:.4 }}>
                          {step.type==='whatsapp'?'WhatsApp':step.type==='visita'?'Visita':'Ligação'} {step.done?'· Enviado':''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{ width:'100%', marginTop:4, padding:'8px', background:B[50], color:B[700], border:`1px solid ${B[200]}`, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Gerenciar sequência
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// MOBILE APP
// ═══════════════════════════════════════════════
function MobileApp({ data, user, onLogout }) {
  const [tab, setTab]         = useState('home')
  const [sideOpen, setSideOpen] = useState(false)

  const LABELS = { home:'Início', pedidos:'Tirar Pedido', conversas:'Conversas', contatos:'Contatos', funil:'Funil de Vendas', marketing:'Marketing', produtos:'Catálogo ERP', mais:'Mais' }
  const SIDE_NAV = [
    { section:'Principal' },
    { id:'home',       label:'Início',             icon:'home'   },
    { id:'pedidos',    label:'Tirar Pedido',        icon:'cart'   },
    { id:'conversas',  label:'Conversas',           icon:'chat'   },
    { section:'Clientes' },
    { id:'contatos',   label:'Carteira de Contatos',icon:'user'   },
    { id:'funil',      label:'Funil de Vendas',     icon:'funnel' },
    { section:'Marketing' },
    { id:'marketing',  label:'Marketing & Agenda',  icon:'zap'    },
    { id:'produtos',   label:'Catálogo ERP',        icon:'erp'    },
    { section:'Performance' },
    { id:'mais',       label:'Metas & Gestão',      icon:'bar'    },
  ]

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:B[50], height:'100dvh', display:'flex', flexDirection:'column', overflow:'hidden', maxWidth:430, margin:'0 auto', position:'relative' }}>
      {/* Sidebar */}
      {sideOpen && <div onClick={()=>setSideOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(15,20,50,0.55)', zIndex:200, backdropFilter:'blur(2px)' }} />}
      <div style={{ position:'fixed', top:0, left:0, bottom:0, width:272, background:B[0], zIndex:201, transform:sideOpen?'translateX(0)':'translateX(-100%)', transition:'transform .25s cubic-bezier(.4,0,.2,1)', display:'flex', flexDirection:'column', boxShadow:sideOpen?'4px 0 32px rgba(15,20,50,0.18)':'none' }}>
        <div style={{ background:B[800], padding:'16px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <img src="/logo.svg" alt="" style={{ height:30, filter:'brightness(0) invert(1)' }} onError={e=>{e.target.style.display='none'}} />
          <button onClick={()=>setSideOpen(false)} style={{ background:'rgba(255,255,255,0.15)', border:'none', cursor:'pointer', display:'flex', padding:8 }}><Ic n="x" s={16} c={B[0]} /></button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {SIDE_NAV.map((item,i)=>item.section
            ? <div key={i} style={{ padding:'14px 20px 6px', fontSize:9, fontWeight:800, color:B[400], textTransform:'uppercase', letterSpacing:1.2 }}>{item.section}</div>
            : <button key={item.id} onClick={()=>{ setTab(item.id); setSideOpen(false) }} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'13px 20px', background:tab===item.id?B[100]:'none', borderLeft:`3px solid ${tab===item.id?B[800]:'transparent'}`, border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
                <Ic n={item.icon} s={20} c={tab===item.id?B[800]:B[400]} />
                <span style={{ fontSize:14, fontWeight:tab===item.id?700:500, color:tab===item.id?B[800]:B[600] }}>{item.label}</span>
              </button>
          )}
        </div>
        <div style={{ borderTop:`1px solid ${B[150]}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, background:B[50] }}>
          <Av lbl={(user?.full_name||'CS').split(' ').map(w=>w[0]).join('').slice(0,2)} sz={40} bg={B[800]} />
          <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{user?.full_name||'Demo'}</div><div style={{ fontSize:11, color:B[500] }}>{user?.role||'Representante'}</div></div>
          <button onClick={onLogout} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="logout" s={18} c={B[400]} /></button>
        </div>
      </div>

      {/* Header */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px 0' }}>
          <button onClick={()=>setSideOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:6, marginLeft:-6 }}><Ic n="menu" s={22} c={B[800]} /></button>
          <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
            <img src="/logo.svg" alt="CRepresentante" style={{ height:32, objectFit:'contain' }} onError={e=>{e.target.style.display='none'}} />
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <button style={{ background:'none', border:'none', cursor:'pointer', position:'relative', display:'flex', padding:4 }}>
              <Ic n="bell" s={21} c={B[600]} />
              <div style={{ position:'absolute', top:3, right:3, width:7, height:7, background:'#ef4444', borderRadius:'50%', border:`1.5px solid ${B[0]}` }} />
            </button>
            <Av lbl={(user?.full_name||'CS').split(' ').map(w=>w[0]).join('').slice(0,2)} sz={30} bg={B[800]} />
          </div>
        </div>
        <div style={{ padding:'6px 16px 10px' }}>
          <span style={{ fontSize:12, fontWeight:800, color:B[700], textTransform:'uppercase', letterSpacing:.8 }}>{LABELS[tab]||tab}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
        {tab==='home'       && <MobileHome data={data} />}
        {tab==='pedidos'    && <MobilePedidos data={data} />}
        {tab==='conversas'  && <MobileConversas data={data} />}
        {tab==='contatos'   && <MobileContatos data={data} />}
        {tab==='funil'      && <MobileFunil data={data} />}
        {tab==='marketing'  && <Marketing data={data} isMobile />}
        {tab==='produtos'   && <div style={{ padding:16 }}><div style={{ fontSize:12, color:B[500] }}>Abra no desktop para visualização completa dos produtos ERP.</div></div>}
        {tab==='mais'       && <MobileMais data={data} />}
      </div>
      {/* Bottom nav */}
      <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, display:'flex', flexShrink:0 }}>
        {[['home','Início','home'],['pedidos','Pedidos','cart'],['conversas','Chat','chat'],['marketing','Marketing','zap'],['mais','Mais','bar']].map(([id,lbl,icon])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'10px 0 12px', background:'none', border:'none', cursor:'pointer', position:'relative' }}>
            {tab===id && <div style={{ position:'absolute', top:0, left:'22%', right:'22%', height:2, background:B[800] }} />}
            <Ic n={icon} s={tab===id?21:19} c={tab===id?B[800]:B[300]} />
            <span style={{ fontSize:9, fontWeight:tab===id?800:500, color:tab===id?B[800]:B[400], letterSpacing:.2 }}>{lbl}</span>
          </button>
        ))}
      </div>
      <FAB data={data} visible={!['pedidos','conversas'].includes(tab)} />
    </div>
  )
}

function MobileHome({ data }) {
  const s = data.stats
  return (
    <div style={{ paddingBottom:24 }}>
      <div style={{ background:B[800], padding:'20px 20px 24px' }}>
        <div style={{ fontSize:12, color:B[300], marginBottom:14 }}>Resultados de Junho 2025</div>
        <div style={{ display:'flex', gap:0, marginBottom:14 }}>
          <div style={{ flex:1 }}><div style={{ fontSize:11, color:B[400] }}>Realizado</div><div style={{ fontSize:28, fontWeight:900, color:B[0], letterSpacing:-1, fontVariantNumeric:'tabular-nums' }}>{fmt(s.salesMonth)}</div></div>
          <div style={{ flex:1 }}><div style={{ fontSize:11, color:B[400] }}>Meta</div><div style={{ fontSize:28, fontWeight:900, color:B[300], letterSpacing:-1 }}>{fmt(s.target)}</div></div>
          <div style={{ flex:1, textAlign:'right' }}><div style={{ fontSize:11, color:B[400] }}>Atingimento</div><div style={{ fontSize:28, fontWeight:900, color:'#ffd166', letterSpacing:-1 }}>{s.attainment}%</div></div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.2)', height:6 }}><div style={{ width:`${s.attainment}%`, height:6, background:B[300] }} /></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:B[200] }}>
        <KpiCard label="Orçamentos abertos" value={s.openQuotes}      sub={fmt(s.openQuotesValue)} icon="file"   accent />
        <KpiCard label="Pipeline total"     value={fmt(s.pipeline)}   sub="em negociação"         icon="dollar" accent />
        <KpiCard label="Visitas marcadas"   value={s.visitsUpcoming}  sub="próximas"              icon="cal"    accent />
        <KpiCard label="Conversão"          value={`${s.conversionRate}%`} sub="+6pp vs. maio"   icon="trend"  accent />
      </div>
      <div style={{ background:B[0], margin:'1px 0', padding:'14px 16px 8px' }}>
        <div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.6, marginBottom:12 }}>Vendas vs Meta</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.monthData} barSize={12} barGap={3}>
            <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
            <XAxis dataKey="m" tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:9, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
            <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:11 }} />
            <Bar dataKey="t" fill={B[150]} name="Meta" /><Bar dataKey="v" fill={B[800]} name="Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background:B[0], margin:'1px 0' }}>
        <div style={{ padding:'12px 16px 0', fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.6 }}>Próximas visitas</div>
        {data.visits.map(v=>(
          <div key={v.id} style={{ padding:'11px 16px', borderBottom:`1px solid ${B[100]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div><div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{v.contact_name}</div><div style={{ fontSize:11, color:B[500], marginTop:1 }}>{v.scheduled_at} · {v.type}</div></div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontSize:9, fontWeight:800, padding:'2px 6px', textTransform:'uppercase', background:v.origin==='erp'?B[800]:B[150], color:v.origin==='erp'?B[0]:B[700] }}>{v.origin==='erp'?'ERP':'Site'}</span>
              <Tag label={v.status==='confirmed'?'Confirmado':'Pendente'} variant={v.status==='confirmed'?'success':'warn'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MobilePedidos({ data }) {
  const [clientId, setClientId] = useState(data.contacts.filter(c=>c.stage!=='prospect')[0]?.id)
  const client = data.contacts.find(c=>c.id===clientId)
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}` }}>
        <div style={{ display:'flex', overflowX:'auto', scrollbarWidth:'none', padding:'8px 12px 0', gap:4 }}>
          {data.contacts.filter(c=>c.stage!=='prospect').map(c=>(
            <button key={c.id} onClick={()=>setClientId(c.id)} style={{ flexShrink:0, display:'flex', alignItems:'center', gap:6, padding:'6px 10px 10px', background:'none', border:'none', cursor:'pointer', borderBottom:clientId===c.id?`2px solid ${B[800]}`:'2px solid transparent', marginBottom:-1 }}>
              <Av lbl={c.av} sz={22} bg={clientId===c.id?B[800]:B[300]} />
              <span style={{ fontSize:11, fontWeight:clientId===c.id?800:500, color:clientId===c.id?B[800]:B[500], whiteSpace:'nowrap' }}>{c.company.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <OrderPanel contact={client} products={data.products} promotions={data.promotions} combos={data.combos} paymentTerms={data.paymentTerms} deliveryOptions={data.deliveryOptions} onSend={data.createOrder} />
      </div>
    </div>
  )
}

function MobileConversas({ data }) {
  const [activeId, setActiveId] = useState(null)
  const [msgs, setMsgs]         = useState({ ...MOCK.messages })
  const [showOrder, setShowOrder] = useState(false)
  const ac = data.contacts.find(c=>c.id===activeId)
  const sendMsg = text => { const now=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); setMsgs(m=>({...m,[activeId]:[...(m[activeId]||[]),{from:'m',text,time:now}]})); data.addMessage(activeId,{from:'m',text,time:now}) }
  if (activeId && showOrder) return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={()=>setShowOrder(false)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="back" s={20} c={B[800]} /></button>
        <div><div style={{ fontSize:13, fontWeight:800, color:B[800] }}>Compra Assistida</div><div style={{ fontSize:11, color:B[500] }}>{ac?.name}</div></div>
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <OrderPanel contact={ac} products={data.products} promotions={data.promotions} combos={data.combos} paymentTerms={data.paymentTerms} deliveryOptions={data.deliveryOptions} onSend={async (...args)=>{ await data.createOrder(...args); setShowOrder(false) }} />
      </div>
    </div>
  )
  if (activeId) return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ background:B[800], padding:'12px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <button onClick={()=>setActiveId(null)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="back" s={22} c={B[0]} /></button>
        <Av lbl={ac?.av||'?'} sz={34} bg={B[600]} />
        <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:B[0] }}>{ac?.name}</div><div style={{ fontSize:10, color:B[300] }}>{ac?.company}</div></div>
        <button onClick={()=>setShowOrder(true)} style={{ padding:'6px 12px', background:'rgba(255,255,255,0.15)', color:B[0], border:'none', fontSize:10, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <Ic n="cart" s={13} c={B[0]} /> Pedido
        </button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px', background:B[50], display:'flex', flexDirection:'column', gap:8 }}>
        {(msgs[activeId]||[]).map((m,i)=>(<div key={i} style={{ display:'flex', justifyContent:m.from==='m'?'flex-end':'flex-start' }}><div style={{ maxWidth:'72%', padding:'9px 12px', background:m.from==='m'?B[800]:B[0], border:m.from==='m'?'none':`1px solid ${B[200]}` }}><div style={{ fontSize:12, color:m.from==='m'?B[0]:B[800], whiteSpace:'pre-wrap', lineHeight:1.5 }}>{m.text}</div><div style={{ fontSize:10, color:m.from==='m'?B[300]:B[400], marginTop:4, textAlign:'right' }}>{m.time}</div></div></div>))}
      </div>
      <div style={{ background:B[0], padding:'10px 14px', display:'flex', gap:8, borderTop:`1px solid ${B[150]}`, flexShrink:0 }}>
        <input value={''} onFocus={()=>{}} placeholder="Digite uma mensagem..." onChange={e=>sendMsg(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){sendMsg(e.target.value); e.target.value=''}}} style={{ flex:1, padding:'10px 12px', border:`1px solid ${B[200]}`, background:B[50], fontSize:13, color:B[800], outline:'none', fontFamily:'inherit' }} />
        <button style={{ width:40, height:40, background:B[800], border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic n="send" s={16} c={B[0]} /></button>
      </div>
    </div>
  )
  return (
    <div>
      {data.contacts.map(c=>{
        const last=(msgs[c.id]||[]).at(-1)
        return (
          <div key={c.id} onClick={()=>setActiveId(c.id)} style={{ display:'flex', gap:12, padding:'14px 16px', background:B[0], borderBottom:`1px solid ${B[100]}`, cursor:'pointer', alignItems:'center' }}>
            <div style={{ position:'relative' }}><Av lbl={c.av} sz={44} bg={B[800]} />{c.unread>0&&<div style={{ position:'absolute', top:-3, right:-3, width:17, height:17, background:B[500], borderRadius:'50%', fontSize:9, fontWeight:900, color:B[0], display:'flex', alignItems:'center', justifyContent:'center' }}>{c.unread}</div>}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</span><span style={{ fontSize:11, color:B[400] }}>{c.last_contact_at}</span></div>
              <div style={{ fontSize:12, color:B[500] }}>{c.company}</div>
              <div style={{ fontSize:11, color:B[400], overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>{last?.text?.split('\n')[0]||'Sem mensagens'}</div>
            </div>
            <Ic n="chevR" s={16} c={B[300]} />
          </div>
        )
      })}
    </div>
  )
}

function MobileContatos({ data }) {
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [showF, setShowF]     = useState(false)
  const [activeTag, setActiveTag] = useState('Todos')
  const allTags = ['Todos',...new Set(data.contacts.flatMap(c=>c.tags))]
  const list = data.contacts.filter(c=>(activeTag==='Todos'||c.tags.includes(activeTag))&&(c.name.toLowerCase().includes(search.toLowerCase())||c.company.toLowerCase().includes(search.toLowerCase())))
  if (selected) {
    const c=data.contacts.find(x=>x.id===selected)
    return (
      <div>
        <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="back" s={22} c={B[800]} /></button>
          <span style={{ fontSize:13, fontWeight:700, color:B[800] }}>Contato</span>
        </div>
        <div style={{ background:B[800], padding:'24px 20px 20px', display:'flex', gap:16, alignItems:'center' }}>
          <Av lbl={c.av} sz={56} bg={B[600]} />
          <div><div style={{ fontSize:18, fontWeight:800, color:B[0] }}>{c.name}</div><div style={{ fontSize:13, color:B[300], marginTop:2 }}>{c.job_title}</div><div style={{ fontSize:12, color:B[400] }}>{c.company}</div><div style={{ display:'flex', gap:5, marginTop:8, flexWrap:'wrap' }}>{c.tags.map(t=><Tag key={t} label={t} variant={tagVariant(t)} />)}</div></div>
        </div>
        <div style={{ display:'flex', gap:0, borderBottom:`1px solid ${B[150]}` }}>
          {[['phone','Ligar'],['chat','WhatsApp'],['cal','Visita'],['file','Orçar']].map(([icon,lbl])=>(
            <button key={lbl} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'14px 8px', background:B[0], border:'none', borderRight:`1px solid ${B[150]}`, cursor:'pointer' }}>
              <Ic n={icon} s={20} c={B[800]} /><span style={{ fontSize:9, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.4 }}>{lbl}</span>
            </button>
          ))}
        </div>
        {[['phone','Telefone',c.phone],['mail','E-mail',c.email],['map','Cidade',`${c.city} · ${c.state}`],['funnel','Estágio',STAGE_LABEL[c.stage]||c.stage]].map(([icon,label,val])=>(
          <div key={label} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 16px', borderBottom:`1px solid ${B[100]}`, background:B[0] }}>
            <Ic n={icon} s={18} c={B[400]} />
            <div><div style={{ fontSize:10, color:B[400], marginBottom:2 }}>{label}</div><div style={{ fontSize:13, fontWeight:600, color:B[800] }}>{val||'—'}</div></div>
          </div>
        ))}
        {c.pipeline_value>0 && <div style={{ background:B[0], padding:'14px 16px', margin:'1px 0' }}><div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:'uppercase', letterSpacing:.8, marginBottom:8 }}>Pipeline</div><div style={{ fontSize:24, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</div></div>}
        {c.notes && <div style={{ background:B[0], margin:'1px 0', padding:'14px 16px' }}><div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:'uppercase', letterSpacing:.8, marginBottom:8 }}>Notas</div><div style={{ fontSize:13, color:B[700], lineHeight:1.6, background:B[50], padding:'12px 14px', borderLeft:`3px solid ${B[800]}` }}>{c.notes}</div></div>}
      </div>
    )
  }
  return (
    <div>
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:'10px 14px' }}>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'9px 12px' }}>
            <Ic n="search" s={15} c={B[400]} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nome, empresa ou telefone..." style={{ border:'none', background:'none', outline:'none', fontSize:13, color:B[800], flex:1, fontFamily:'inherit' }} />
            {search&&<button onClick={()=>setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}><Ic n="x" s={14} c={B[400]} /></button>}
          </div>
          <button onClick={()=>setShowF(f=>!f)} style={{ padding:'9px 12px', background:showF?B[800]:B[50], border:`1px solid ${showF?B[800]:B[200]}`, cursor:'pointer', display:'flex' }}><Ic n="filter" s={16} c={showF?B[0]:B[600]} /></button>
        </div>
        {showF && <div style={{ marginTop:10, display:'flex', gap:5, overflowX:'auto', scrollbarWidth:'none' }}>
          {allTags.map(t=>(<button key={t} onClick={()=>setActiveTag(t)} style={{ flexShrink:0, padding:'5px 10px', fontSize:10, fontWeight:700, cursor:'pointer', background:activeTag===t?B[800]:B[0], color:activeTag===t?B[0]:B[600], border:`1px solid ${activeTag===t?B[800]:B[200]}` }}>{t}</button>))}
        </div>}
      </div>
      <div style={{ padding:'7px 16px', background:B[50], borderBottom:`1px solid ${B[150]}`, display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, color:B[500] }}>{list.length} contato{list.length!==1?'s':''}</span>
        <button style={{ fontSize:11, fontWeight:700, color:B[800], background:'none', border:`1px solid ${B[300]}`, padding:'4px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><Ic n="plus" s={12} c={B[800]} /> Novo</button>
      </div>
      {list.map(c=>(
        <div key={c.id} onClick={()=>setSelected(c.id)} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:'13px 16px', display:'flex', gap:12, alignItems:'center', cursor:'pointer' }}>
          <div style={{ position:'relative' }}><Av lbl={c.av} sz={44} bg={B[800]} />{c.unread>0&&<div style={{ position:'absolute', top:-3, right:-3, width:16, height:16, background:B[500], borderRadius:'50%', fontSize:9, fontWeight:900, color:B[0], display:'flex', alignItems:'center', justifyContent:'center' }}>{c.unread}</div>}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</span><span style={{ fontSize:10, color:B[400] }}>{c.last_contact_at}</span></div>
            <div style={{ fontSize:12, color:B[500], marginBottom:4 }}>{c.company} · {c.city}</div>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:4 }}>{c.tags.slice(0,2).map(t=><Tag key={t} label={t} variant={tagVariant(t)} />)}</div>
              {c.pipeline_value>0&&<span style={{ fontSize:12, fontWeight:800, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</span>}
            </div>
          </div>
          <Ic n="chevR" s={15} c={B[300]} />
        </div>
      ))}
    </div>
  )
}

function MobileFunil({ data }) {
  return (
    <div>
      <div style={{ background:B[0], padding:'14px 16px', borderBottom:`1px solid ${B[150]}`, display:'flex', gap:0 }}>
        {[['Total',data.contacts.length],['Pipeline',fmt(data.contacts.reduce((a,c)=>a+c.pipeline_value,0))],['Conversão','34%']].map(([l,v])=>(
          <div key={l} style={{ flex:1, textAlign:'center' }}><div style={{ fontSize:18, fontWeight:900, color:B[800] }}>{v}</div><div style={{ fontSize:10, color:B[500], textTransform:'uppercase', letterSpacing:.5 }}>{l}</div></div>
        ))}
      </div>
      {STAGES.map(stage=>{
        const cs=data.contacts.filter(c=>c.stage===stage); if(!cs.length) return null
        return (
          <div key={stage} style={{ marginBottom:1 }}>
            <div style={{ padding:'10px 16px', background:B[800], display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:10, fontWeight:800, color:B[0], textTransform:'uppercase', letterSpacing:.8 }}>{STAGE_LABEL[stage]}</span>
              <div style={{ display:'flex', gap:10 }}><span style={{ fontSize:11, fontWeight:700, color:B[300], fontVariantNumeric:'tabular-nums' }}>{fmt(cs.reduce((a,c)=>a+c.pipeline_value,0))}</span><span style={{ fontSize:10, fontWeight:800, background:'rgba(255,255,255,0.15)', color:B[0], padding:'2px 7px' }}>{cs.length}</span></div>
            </div>
            {cs.map(c=>(
              <div key={c.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:'12px 16px', display:'flex', gap:12, alignItems:'center' }}>
                <Av lbl={c.av} sz={38} bg={B[700]} />
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{c.name}</div><div style={{ fontSize:11, color:B[500] }}>{c.company}</div>{c.pipeline_value>0&&<div style={{ fontSize:14, fontWeight:900, color:B[800], marginTop:4, fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</div>}</div>
                <div style={{ display:'flex', gap:5 }}>
                  <button style={{ padding:'7px', background:B[800], border:'none', cursor:'pointer', display:'flex' }}><Ic n="chat" s={15} c={B[0]} /></button>
                  <button style={{ padding:'7px', background:B[50], border:`1px solid ${B[200]}`, cursor:'pointer', display:'flex' }}><Ic n="file" s={15} c={B[600]} /></button>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function MobileMais({ data }) {
  const [sub, setSub] = useState('metas')
  const s = data.stats
  return (
    <div>
      <div style={{ background:B[0], display:'flex', borderBottom:`1px solid ${B[150]}` }}>
        {[['metas','Metas'],['gestao','Gestão'],['pedidos','Pedidos']].map(([id,lbl])=>(<button key={id} onClick={()=>setSub(id)} style={{ flex:1, padding:'13px', background:'none', border:'none', cursor:'pointer', fontSize:13, fontWeight:sub===id?800:500, color:sub===id?B[800]:B[400], borderBottom:sub===id?`2px solid ${B[800]}`:'2px solid transparent', marginBottom:-1 }}>{lbl}</button>))}
      </div>
      {sub==='metas'&&(<div>
        <div style={{ background:B[0], padding:'18px 16px', borderBottom:`1px solid ${B[150]}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}><div style={{ fontSize:24, fontWeight:900, color:B[800] }}>R$55k <span style={{ fontSize:14, color:B[400], fontWeight:500 }}>/ R$60k</span></div><div style={{ fontSize:22, fontWeight:900, color:B[800] }}>91%</div></div>
          <div style={{ background:B[150], height:10 }}><div style={{ width:'91%', height:10, background:B[800] }} /></div>
          <div style={{ fontSize:12, color:B[500], marginTop:6 }}>Faltam R$5.000 para bater a meta</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:B[200] }}>
          {[['Visitas','21','25'],['Propostas','14','20'],['Fechamentos','18','22'],['NPS','82','—']].map(([l,v,m])=>(<div key={l} style={{ background:B[0], padding:'14px 16px' }}><div style={{ fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{l}</div><div style={{ fontSize:22, fontWeight:900, color:B[800] }}>{v}<span style={{ fontSize:11, color:B[400], fontWeight:500 }}>/{m}</span></div>{m!=='—'&&<div style={{ background:B[150], height:4, marginTop:6 }}><div style={{ width:`${pct(+v,+m)}%`, height:4, background:B[800] }} /></div>}</div>))}
        </div>
        <div style={{ background:B[0], padding:'14px 16px 8px', margin:'1px 0' }}>
          <div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.6, marginBottom:10 }}>Vendas esta semana</div>
          <ResponsiveContainer width="100%" height={130}><AreaChart data={data.weekData}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={B[800]} stopOpacity={0.15}/><stop offset="95%" stopColor={B[800]} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="2 4" stroke={B[150]} /><XAxis dataKey="d" tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize:9, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} /><Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:11 }} /><Area type="monotone" dataKey="v" stroke={B[800]} strokeWidth={2} fill="url(#ag)" name="Vendas" dot={{ fill:B[800], r:3, strokeWidth:0 }} /></AreaChart></ResponsiveContainer>
        </div>
      </div>)}
      {sub==='gestao'&&(<div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:B[200] }}>
          {[['Pipeline',fmt(s.pipeline),'6 oport.'],['Ticket médio',`R$${(s.avgTicket/1000).toFixed(0)}k`,'+12% vs maio'],['Conversão',`${s.conversionRate}%`,'+6pp vs maio'],['Clientes ativos',s.contactsTotal,'3 prospects']].map(([l,v,su])=>(<div key={l} style={{ background:B[0], padding:'16px', borderTop:`3px solid ${B[800]}` }}><div style={{ fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{l}</div><div style={{ fontSize:20, fontWeight:900, color:B[800] }}>{v}</div><div style={{ fontSize:11, color:B[400], marginTop:4 }}>{su}</div></div>))}
        </div>
        <div style={{ background:B[0], margin:'1px 0' }}>
          <div style={{ padding:'12px 16px 0', fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.6 }}>Orçamentos</div>
          {data.quotes.map((q,i)=>(<div key={q.id} style={{ padding:'11px 16px', borderBottom:`1px solid ${B[100]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}><div><div style={{ fontSize:12, fontWeight:800, color:B[600], fontFamily:'monospace' }}>{q.number}</div><div style={{ fontSize:12, color:B[700] }}>{q.contact_name}</div></div><div style={{ textAlign:'right' }}><div style={{ fontSize:14, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(q.total)}</div><Tag label={STATUS_LABEL[q.status]||q.status} variant={q.status==='approved'?'success':q.status==='rejected'?'urgente':'default'} /></div></div>))}
        </div>
      </div>)}
      {sub==='pedidos'&&(<div>
        <div style={{ background:B[0], margin:'1px 0' }}>
          <div style={{ padding:'12px 16px 0', fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.6 }}>Pedidos Recentes</div>
          {data.orders.map(o=>(<div key={o.id} style={{ padding:'11px 16px', borderBottom:`1px solid ${B[100]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}><div><div style={{ fontSize:12, fontWeight:800, color:B[600], fontFamily:'monospace' }}>{o.number}</div><div style={{ fontSize:12, color:B[700] }}>{o.contact_name}</div><div style={{ fontSize:10, color:B[400] }}>{o.created_at}</div></div><div style={{ textAlign:'right' }}><div style={{ fontSize:14, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(o.total)}</div><div style={{ display:'flex', gap:4, justifyContent:'flex-end', marginTop:4 }}><span style={{ fontSize:8, fontWeight:900, padding:'2px 5px', background:o.origin==='erp'?B[800]:B[150], color:o.origin==='erp'?B[0]:B[700] }}>{o.origin==='erp'?'ERP':'Site'}</span><Tag label={STATUS_LABEL[o.status]||o.status} /></div></div></div>))}
        </div>
      </div>)}
    </div>
  )
}

// ═══════════════════════════════════════════════
// DESKTOP APP
// ═══════════════════════════════════════════════
function DesktopApp({ data, user, onLogout }) {
  const [tab, setTab]         = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const NAV = [
    { section:'Principal' },
    { id:'dashboard', label:'Dashboard',   icon:'home'   },
    { id:'pedidos',   label:'Pedidos',     icon:'cart'   },
    { id:'conversas', label:'Conversas',   icon:'chat'   },
    { section:'Clientes' },
    { id:'contatos',  label:'Contatos',    icon:'user'   },
    { id:'funil',     label:'Funil',       icon:'funnel' },
    { section:'Marketing' },
    { id:'marketing', label:'Marketing',   icon:'zap'    },
    { id:'produtos',  label:'Catálogo ERP',icon:'erp'    },
    { section:'Performance' },
    { id:'metas',     label:'Metas',       icon:'target' },
    { id:'gestao',    label:'Gestão',      icon:'bar'    },
    { section:'Config.' },
    { id:'erp',       label:'Integração ERP', icon:'settings' },
  ]

  const LABELS = { dashboard:'Dashboard', pedidos:'Pedidos', conversas:'Conversas', contatos:'Carteira de Contatos', funil:'Funil de Vendas', marketing:'Marketing', produtos:'Catálogo de Produtos ERP', metas:'Metas & Performance', gestao:'Gestão & Relatórios', erp:'Integração ERP' }

  const W = collapsed ? 56 : 220

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:B[50], height:'100dvh', display:'flex', overflow:'hidden' }}>
      {/* Sidebar */}
      <div style={{ width:W, background:B[900], display:'flex', flexDirection:'column', transition:'width .2s', overflow:'hidden', flexShrink:0 }}>
        <div style={{ padding:collapsed?'18px 0 14px':'18px 16px 14px', borderBottom:`1px solid rgba(255,255,255,0.08)`, display:'flex', alignItems:'center', justifyContent:collapsed?'center':'flex-start', gap:10 }}>
          {!collapsed ? <>
            <img src="/logo.svg" alt="" style={{ height:36, filter:'brightness(0) invert(1)', flexShrink:0 }} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block'}} />
            <span style={{ display:'none', color:B[0], fontWeight:900, fontSize:13 }}>CRep.</span>
          </> : <img src="/logo-mark.svg" alt="" style={{ height:30, filter:'brightness(0) invert(1)', flexShrink:0 }} onError={e=>{e.target.style.display='none'}} />}
        </div>
        <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {NAV.map((item,i)=>item.section
            ? (!collapsed && <div key={i} style={{ padding:'10px 16px 2px', fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.28)', letterSpacing:.2 }}>{item.section}</div>)
            : <button key={item.id} onClick={()=>setTab(item.id)} title={collapsed?item.label:undefined} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:collapsed?'11px 0':'11px 16px', justifyContent:collapsed?'center':'flex-start', background:tab===item.id?'rgba(255,255,255,0.1)':'none', borderLeft:`3px solid ${tab===item.id?B[400]:'transparent'}`, border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all .12s' }}>
                <Ic n={item.icon} s={18} c={tab===item.id?B[300]:B[600]} />
                {!collapsed && <span style={{ fontSize:13, fontWeight:tab===item.id?700:400, color:tab===item.id?B[0]:'rgba(255,255,255,0.55)' }}>{item.label}</span>}
              </button>
          )}
        </nav>
        <div style={{ borderTop:`1px solid rgba(255,255,255,0.08)`, padding:collapsed?'12px 0':'12px 14px', display:'flex', alignItems:'center', gap:10, justifyContent:collapsed?'center':'flex-start' }}>
          <Av lbl={(user?.full_name||'CS').split(' ').map(w=>w[0]).join('').slice(0,2)} sz={32} bg={B[600]} />
          {!collapsed && <div style={{ flex:1 }}><div style={{ color:B[0], fontWeight:600, fontSize:12 }}>{user?.full_name||'Demo'}</div><div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{user?.role||'Representante'}</div></div>}
          {!collapsed && <button onClick={onLogout} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}><Ic n="logout" s={16} c={B[600]} /></button>}
        </div>
        <button onClick={()=>setCollapsed(c=>!c)} style={{ background:'rgba(255,255,255,0.05)', border:'none', borderTop:`1px solid rgba(255,255,255,0.08)`, color:'rgba(255,255,255,0.4)', padding:'9px', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Ic n={collapsed?'chevR':'back'} s={13} c="rgba(255,255,255,0.4)" />
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Topbar */}
        <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', height:58, flexShrink:0 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:B[800] }}>{LABELS[tab]||tab}</div>
            <div style={{ fontSize:10, color:B[500], fontWeight:600, letterSpacing:.5, textTransform:'uppercase' }}>Junho 2025 · MG, Brasil</div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ position:'relative' }}>
              <button style={{ background:B[50], border:`1px solid ${B[200]}`, color:B[600], padding:'7px', cursor:'pointer', display:'flex' }}><Ic n="bell" s={16} /></button>
              <div style={{ position:'absolute', top:-3, right:-3, width:14, height:14, background:B[500], color:B[0], fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>5</div>
            </div>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:B[800], color:B[0], border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}><Ic n="plus" s={13} c={B[0]} /> Novo Pedido</button>
            <Av lbl={(user?.full_name||'CS').split(' ').map(w=>w[0]).join('').slice(0,2)} sz={32} bg={B[700]} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:['conversas','pedidos','produtos'].includes(tab)?'hidden':'auto' }}>
          {tab==='dashboard' && <DesktopDashboard data={data} />}
          {tab==='pedidos'   && <DesktopPedidos   data={data} />}
          {tab==='conversas' && <DesktopConversas data={data} />}
          {tab==='contatos'  && <DesktopContatos  data={data} />}
          {tab==='funil'     && <DesktopFunil      data={data} />}
          {tab==='marketing' && <Marketing         data={data} />}
          {tab==='produtos'  && <ProdutosERP       data={data} />}
          {tab==='metas'     && <DesktopMetas      data={data} />}
          {tab==='gestao'    && <DesktopGestao     data={data} />}
          {tab==='erp'       && <DesktopErp        data={data} />}
        </div>
      </div>
    </div>
  )
}

// ─── Desktop pages ────────────────────────────
function DesktopDashboard({ data }) {
  const s = data.stats
  return (
    <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${B[900]},${B[800]})`, padding:'14px 24px', display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
        <div><div style={{ fontSize:11, color:B[400], textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Realizado — Junho 2025</div><div style={{ fontSize:30, fontWeight:900, color:B[0], letterSpacing:-1, fontVariantNumeric:'tabular-nums' }}>{fmt(s.salesMonth)}</div></div>
        <div style={{ paddingBottom:4 }}><div style={{ fontSize:11, color:B[400] }}>Meta</div><div style={{ fontSize:20, fontWeight:700, color:B[300], fontVariantNumeric:'tabular-nums' }}>{fmt(s.target)}</div></div>
        <div style={{ flex:1, minWidth:200, paddingBottom:8 }}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:11, color:B[400] }}>Atingimento</span><span style={{ fontSize:15, fontWeight:800, color:B[200] }}>{s.attainment}%</span></div><div style={{ background:B[700], height:8 }}><div style={{ width:`${s.attainment}%`, height:8, background:B[400] }} /></div></div>
        <div style={{ display:'flex', gap:28 }}>
          {[['Conversão',`${s.conversionRate}%`],['Ticket médio',`R$${(s.avgTicket/1000).toFixed(0)}k`],['Pipeline',`R$${(s.pipeline/1000).toFixed(0)}k`]].map(([l,v])=>(<div key={l}><div style={{ fontSize:10, color:B[400], textTransform:'uppercase', letterSpacing:.5, marginBottom:2 }}>{l}</div><div style={{ fontSize:18, fontWeight:800, color:B[0] }}>{v}</div></div>))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:B[200] }}>
        <KpiCard label="Orçamentos abertos"  value={s.openQuotes}          sub={fmt(s.openQuotesValue)} icon="file"   accent delta={`+${s.openQuotes}`} />
        <KpiCard label="Pedidos este mês"    value={s.pendingOrders}       sub="em andamento"          icon="cart"   accent />
        <KpiCard label="Visitas marcadas"    value={s.visitsUpcoming}      sub="próximas"              icon="cal"    accent />
        <KpiCard label="Clientes ativos"     value={s.contactsTotal}       sub="na carteira"           icon="users"  accent />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
        {/* Chart */}
        <div style={{ background:B[0], border:`1px solid ${B[150]}`, padding:'20px 20px 12px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:B[800], marginBottom:14 }}>Vendas vs Meta — 2025</div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={data.monthData} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
              <XAxis dataKey="m" tick={{ fontSize:11, fill:B[400] }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
              <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} />
              <Bar dataKey="t" fill={B[150]} name="Meta" /><Bar dataKey="v" fill={B[800]} name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Sidebar right */}
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <div style={{ background:B[0], border:`1px solid ${B[150]}`, flex:1 }}>
            <div style={{ padding:'13px 16px', borderBottom:`1px solid ${B[150]}`, fontSize:11, fontWeight:700, color:B[800], textTransform:'uppercase', letterSpacing:.6 }}>Próximas Visitas</div>
            {data.visits.map(v=>(
              <div key={v.id} style={{ padding:'11px 16px', borderBottom:`1px solid ${B[100]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div><div style={{ fontSize:12, fontWeight:700, color:B[800] }}>{v.contact_name}</div><div style={{ fontSize:11, color:B[500] }}>{v.scheduled_at} · {v.type}</div></div>
                <div style={{ display:'flex', gap:5 }}>
                  <span style={{ fontSize:9, fontWeight:800, padding:'2px 6px', textTransform:'uppercase', background:v.origin==='erp'?B[800]:B[150], color:v.origin==='erp'?B[0]:B[700] }}>{v.origin==='erp'?'ERP':'Site'}</span>
                  <Tag label={v.status==='confirmed'?'Confirmado':'Pendente'} variant={v.status==='confirmed'?'success':'warn'} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:B[0], border:`1px solid ${B[150]}` }}>
            <div style={{ padding:'13px 16px', borderBottom:`1px solid ${B[150]}`, fontSize:11, fontWeight:700, color:B[800], textTransform:'uppercase', letterSpacing:.6 }}>Orçamentos</div>
            {data.quotes.slice(0,3).map(q=>(
              <div key={q.id} style={{ padding:'10px 16px', borderBottom:`1px solid ${B[100]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div><div style={{ fontSize:11, fontWeight:800, color:B[600], fontFamily:'monospace' }}>{q.number}</div><div style={{ fontSize:11, color:B[700] }}>{q.contact_name}</div></div>
                <div style={{ textAlign:'right' }}><div style={{ fontSize:13, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(q.total)}</div><Tag label={STATUS_LABEL[q.status]||q.status} variant={q.status==='approved'?'success':q.status==='rejected'?'urgente':'default'} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DesktopPedidos({ data }) {
  const [clientId, setClientId] = useState(data.contacts.filter(c=>c.stage!=='prospect')[0]?.id)
  const client = data.contacts.find(c=>c.id===clientId)
  return (
    <div style={{ display:'flex', height:'100%' }}>
      {/* Client selector */}
      <div style={{ width:240, background:B[0], borderRight:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'14px 16px', borderBottom:`1px solid ${B[150]}` }}>
          <div style={{ fontSize:11, fontWeight:800, color:B[800], textTransform:'uppercase', letterSpacing:.7, marginBottom:10 }}>Selecionar Cliente</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'8px 10px' }}>
            <Ic n="search" s={14} c={B[400]} /><input placeholder="Buscar..." style={{ border:'none', background:'none', outline:'none', fontSize:12, color:B[800], flex:1, fontFamily:'inherit' }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {data.contacts.filter(c=>c.stage!=='prospect').map(c=>(
            <div key={c.id} onClick={()=>setClientId(c.id)} style={{ padding:'11px 14px', cursor:'pointer', background:clientId===c.id?B[50]:B[0], borderLeft:`3px solid ${clientId===c.id?B[800]:'transparent'}`, borderBottom:`1px solid ${B[100]}`, display:'flex', gap:10, alignItems:'center' }}>
              <Av lbl={c.av} sz={32} bg={clientId===c.id?B[800]:B[700]} />
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12, fontWeight:700, color:B[800], overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div><div style={{ fontSize:10, color:B[500] }}>{c.company}</div>{c.pipeline_value>0&&<div style={{ fontSize:11, fontWeight:700, color:B[600], fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</div>}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Order builder */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', minHeight:0 }}>
        <OrderPanel contact={client} products={data.products} promotions={data.promotions} combos={data.combos} paymentTerms={data.paymentTerms} deliveryOptions={data.deliveryOptions} onSend={data.createOrder} />
      </div>
      {/* Order history */}
      <div style={{ width:280, background:B[0], borderLeft:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'13px 16px', borderBottom:`1px solid ${B[150]}`, fontSize:11, fontWeight:700, color:B[800], textTransform:'uppercase', letterSpacing:.6 }}>Pedidos Recentes</div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {data.orders.map(o=>(
            <div key={o.id} style={{ padding:'12px 14px', borderBottom:`1px solid ${B[100]}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:800, color:B[600], fontFamily:'monospace' }}>{o.number}</span>
                <div style={{ display:'flex', gap:4 }}>
                  <span style={{ fontSize:8, fontWeight:900, padding:'2px 5px', background:o.origin==='erp'?B[800]:B[150], color:o.origin==='erp'?B[0]:B[700] }}>{o.origin==='erp'?'ERP':'Site'}</span>
                  <Tag label={STATUS_LABEL[o.status]||o.status} />
                </div>
              </div>
              <div style={{ fontSize:12, color:B[700] }}>{o.contact_name}</div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:11, color:B[400] }}>{o.created_at}</span>
                <span style={{ fontSize:13, fontWeight:800, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesktopConversas({ data }) {
  const [activeId, setActiveId]   = useState(data.contacts[0]?.id)
  const [msgs, setMsgs]           = useState({ ...MOCK.messages })
  const [rightTab, setRightTab]   = useState('info') // info | order
  const [search, setSearch]       = useState('')

  const ac      = data.contacts.find(c => c.id === activeId)
  const sendMsg = text => {
    const now = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})
    setMsgs(m => ({ ...m, [activeId]: [...(m[activeId]||[]), { from:'m', text, time:now }] }))
  }

  const filteredContacts = data.contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display:'flex', height:'100%', minHeight:0 }}>

      {/* ── Col 1: Contact list ── */}
      <div style={{ width:264, background:B[0], borderRight:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', flexShrink:0, minHeight:0 }}>
        <div style={{ padding:'12px 12px', borderBottom:`1px solid ${B[150]}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'8px 10px' }}>
            <Ic n="search" s={13} c={B[400]} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar contato..."
              style={{ border:'none', background:'none', outline:'none', fontSize:12, color:B[800], flex:1, fontFamily:'inherit' }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
          {filteredContacts.map(c => {
            const last = (msgs[c.id]||[]).at(-1)
            const isActive = activeId === c.id
            return (
              <div key={c.id} onClick={() => { setActiveId(c.id); setRightTab('info') }}
                style={{ display:'flex', gap:10, padding:'11px 12px', cursor:'pointer', alignItems:'center',
                  background: isActive ? B[50] : B[0],
                  borderLeft: `3px solid ${isActive ? B[800] : 'transparent'}`,
                  borderBottom: `1px solid ${B[100]}` }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <Av lbl={c.av} sz={36} bg={isActive?B[700]:B[800]} />
                  {c.unread>0 && <div style={{ position:'absolute', top:-3, right:-3, width:15, height:15, background:B[500], borderRadius:'50%', fontSize:8, fontWeight:900, color:B[0], display:'flex', alignItems:'center', justifyContent:'center' }}>{c.unread}</div>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <span style={{ fontSize:12, fontWeight:isActive?700:500, color:B[800], overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                    <span style={{ fontSize:9, color:B[400], flexShrink:0, marginLeft:4 }}>{c.last_contact_at}</span>
                  </div>
                  <div style={{ fontSize:11, color:B[500], overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {last?.text?.split('\n')[0] || c.company}
                  </div>
                  {c.stage && <div style={{ marginTop:3 }}><Tag label={STAGE_LABEL[c.stage]||c.stage} variant={c.stage==='closing'?'success':c.stage==='prospect'?'prospect':'default'} /></div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Col 2: Chat ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, minWidth:0 }}>
        <ChatPanel
          contact={ac}
          msgs={msgs[activeId]||[]}
          onSend={sendMsg}
          rightSlot={
            <button onClick={() => setRightTab(t => t==='order'?'info':'order')}
              style={{ padding:'6px 12px', background:rightTab==='order'?B[0]:B[600], color:rightTab==='order'?B[800]:B[0], border:rightTab==='order'?`1px solid ${B[300]}`:'none', fontSize:10, fontWeight:800, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', gap:5 }}>
              <Ic n="cart" s={12} c={rightTab==='order'?B[800]:B[0]} />
              {rightTab==='order' ? 'Fechar' : 'Pedido'}
            </button>
          }
        />
      </div>

      {/* ── Col 3: Right panel ── */}
      <div style={{ width:308, background:B[0], borderLeft:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', flexShrink:0, minHeight:0 }}>
        {/* Tab header */}
        <div style={{ display:'flex', borderBottom:`1px solid ${B[150]}`, flexShrink:0 }}>
          {[['info','Contato'],['order','Compra Assistida']].map(([id,lbl]) => (
            <button key={id} onClick={() => setRightTab(id)} style={{
              flex:1, padding:'10px 6px', background:'none', border:'none', cursor:'pointer',
              fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:.5,
              color:      rightTab===id ? B[800] : B[400],
              borderBottom: rightTab===id ? `2px solid ${B[800]}` : '2px solid transparent',
              marginBottom:-1,
            }}>{lbl}</button>
          ))}
        </div>

        {rightTab === 'info' ? (
          /* ── Contact info ── */
          <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
            {/* Hero */}
            <div style={{ padding:'16px', background:B[50], borderBottom:`1px solid ${B[150]}` }}>
              <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
                <Av lbl={ac?.av||'?'} sz={44} bg={B[800]} />
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:B[800] }}>{ac?.name}</div>
                  <div style={{ fontSize:12, color:B[500] }}>{ac?.job_title||'—'}</div>
                  <div style={{ fontSize:11, color:B[400] }}>{ac?.company}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {(ac?.tags||[]).map(t => <Tag key={t} label={t} variant={tagVariant(t)} />)}
              </div>
            </div>
            {/* Actions */}
            <div style={{ display:'flex', borderBottom:`1px solid ${B[150]}` }}>
              {[['phone','Ligar'],['chat','Chat'],['cal','Visita'],['file','Orçar']].map(([icon,lbl]) => (
                <button key={lbl} style={{ flex:1, padding:'10px 4px', background:B[0], border:'none', borderRight:`1px solid ${B[150]}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <Ic n={icon} s={17} c={B[800]} />
                  <span style={{ fontSize:8, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.3 }}>{lbl}</span>
                </button>
              ))}
            </div>
            {/* Info rows */}
            {ac && [
              ['phone','Telefone', ac.phone],
              ['mail', 'E-mail',   ac.email],
              ['map',  'Cidade',   `${ac.city||'—'} · ${ac.state||'MG'}`],
              ['funnel','Estágio', STAGE_LABEL[ac.stage]||ac.stage],
            ].map(([icon,label,val]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderBottom:`1px solid ${B[100]}` }}>
                <Ic n={icon} s={15} c={B[400]} />
                <div>
                  <div style={{ fontSize:9, color:B[400], marginBottom:1, textTransform:'uppercase', letterSpacing:.4 }}>{label}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:B[800] }}>{val||'—'}</div>
                </div>
              </div>
            ))}
            {ac?.pipeline_value>0 && (
              <div style={{ padding:'12px 14px', borderBottom:`1px solid ${B[100]}` }}>
                <div style={{ fontSize:9, color:B[500], textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Pipeline</div>
                <div style={{ fontSize:20, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(ac.pipeline_value)}</div>
                <div style={{ marginTop:4 }}><Tag label={STAGE_LABEL[ac.stage]||ac.stage} variant={ac.stage==='closing'?'success':ac.stage==='prospect'?'prospect':'default'} /></div>
              </div>
            )}
            {ac?.notes && (
              <div style={{ padding:'12px 14px' }}>
                <div style={{ fontSize:9, color:B[500], textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>Notas</div>
                <div style={{ fontSize:12, color:B[700], lineHeight:1.6, background:B[50], padding:'10px 12px', borderLeft:`3px solid ${B[800]}` }}>{ac.notes}</div>
              </div>
            )}
          </div>
        ) : (
          /* ── Compra Assistida ── */
          <div style={{ flex:1, minHeight:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <OrderPanel
              contact={ac}
              products={data.products}
              promotions={data.promotions}
              combos={data.combos}
              paymentTerms={data.paymentTerms}
              deliveryOptions={data.deliveryOptions}
              onSend={async (...args) => {
                await data.createOrder(...args)
                setRightTab('info')
              }}
              compact
            />
          </div>
        )}
      </div>
    </div>
  )
}

function DesktopContatos({ data }) {
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState('')
  const [stageF, setStageF]     = useState('all')
  const sc = data.contacts.find(c=>c.id===selected)
  const list = data.contacts.filter(c=>(stageF==='all'||c.stage===stageF)&&(c.name.toLowerCase().includes(search.toLowerCase())||c.company.toLowerCase().includes(search.toLowerCase())))
  return (
    <div style={{ display:'flex', height:'100%' }}>
      {/* Table */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 24px', borderBottom:`1px solid ${B[150]}`, display:'flex', gap:12, alignItems:'center', background:B[0] }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'8px 12px', flex:1, maxWidth:300 }}>
            <Ic n="search" s={14} c={B[400]} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ border:'none', background:'none', outline:'none', fontSize:13, color:B[800], flex:1, fontFamily:'inherit' }} />
          </div>
          <select value={stageF} onChange={e=>setStageF(e.target.value)} style={{ padding:'8px 12px', border:`1px solid ${B[200]}`, background:B[0], fontSize:12, color:B[800], outline:'none', cursor:'pointer' }}>
            <option value="all">Todos os estágios</option>
            {STAGES.map(s=><option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
          </select>
          <div style={{ marginLeft:'auto' }}>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:B[800], color:B[0], border:'none', fontSize:12, fontWeight:700, cursor:'pointer' }}><Ic n="plus" s={13} c={B[0]} /> Novo Contato</button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead style={{ position:'sticky', top:0 }}>
              <tr style={{ background:B[50] }}>
                {['Contato','Empresa','Cidade','Estágio','Valor','Último contato','Ações'].map(h=>(<th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.7, borderBottom:`1px solid ${B[150]}` }}>{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {list.map((c,i)=>(
                <tr key={c.id} onClick={()=>setSelected(selected===c.id?null:c.id)} style={{ borderBottom:`1px solid ${B[100]}`, background:selected===c.id?B[50]:i%2?B[0]:'#fafbfd', cursor:'pointer' }}>
                  <td style={{ padding:'12px 20px' }}><div style={{ display:'flex', gap:10, alignItems:'center' }}><Av lbl={c.av} sz={32} bg={B[800]} /><div><div style={{ fontWeight:700, color:B[800] }}>{c.name}</div><div style={{ fontSize:10, color:B[400] }}>{c.job_title}</div></div></div></td>
                  <td style={{ padding:'12px 20px', color:B[700] }}>{c.company}</td>
                  <td style={{ padding:'12px 20px', color:B[500] }}>{c.city}</td>
                  <td style={{ padding:'12px 20px' }}><Tag label={STAGE_LABEL[c.stage]||c.stage} variant={c.stage==='closing'?'success':c.stage==='prospect'?'prospect':'default'} /></td>
                  <td style={{ padding:'12px 20px', fontWeight:700, color:B[800], fontVariantNumeric:'tabular-nums' }}>{c.pipeline_value>0?fmt(c.pipeline_value):'—'}</td>
                  <td style={{ padding:'12px 20px', color:B[500] }}>{c.last_contact_at}</td>
                  <td style={{ padding:'12px 20px' }}><div style={{ display:'flex', gap:5 }}><button style={{ padding:'5px 10px', background:B[800], color:B[0], border:'none', fontSize:10, fontWeight:700, cursor:'pointer' }}>Chat</button><button style={{ padding:'5px 10px', background:B[50], color:B[700], border:`1px solid ${B[200]}`, fontSize:10, fontWeight:700, cursor:'pointer' }}>Orçar</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Detail panel */}
      {sc && (
        <div style={{ width:320, background:B[0], borderLeft:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
          <div style={{ background:B[800], padding:'20px 18px', display:'flex', gap:14, alignItems:'center' }}>
            <Av lbl={sc.av} sz={48} bg={B[600]} />
            <div><div style={{ fontSize:16, fontWeight:800, color:B[0] }}>{sc.name}</div><div style={{ fontSize:12, color:B[300] }}>{sc.job_title}</div><div style={{ fontSize:11, color:B[400] }}>{sc.company}</div></div>
          </div>
          <div style={{ display:'flex', borderBottom:`1px solid ${B[150]}` }}>
            {[['phone','Ligar'],['chat','Chat'],['file','Orçar']].map(([icon,lbl])=>(<button key={lbl} style={{ flex:1, padding:'12px', background:B[0], border:'none', borderRight:`1px solid ${B[150]}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}><Ic n={icon} s={18} c={B[800]} /><span style={{ fontSize:9, fontWeight:700, color:B[600], textTransform:'uppercase' }}>{lbl}</span></button>))}
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {[['phone','Telefone',sc.phone],['mail','E-mail',sc.email],['map','Cidade',`${sc.city} · ${sc.state}`],['funnel','Estágio',STAGE_LABEL[sc.stage]||sc.stage],['tag','Tags',sc.tags.join(', ')]].map(([icon,label,val])=>(<div key={label} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:`1px solid ${B[100]}` }}><Ic n={icon} s={16} c={B[400]} /><div><div style={{ fontSize:10, color:B[400], marginBottom:1 }}>{label}</div><div style={{ fontSize:12, fontWeight:600, color:B[800] }}>{val||'—'}</div></div></div>))}
            {sc.pipeline_value>0 && <div style={{ padding:'14px 16px', borderBottom:`1px solid ${B[100]}` }}><div style={{ fontSize:10, color:B[500], textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Pipeline</div><div style={{ fontSize:22, fontWeight:900, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(sc.pipeline_value)}</div></div>}
            {sc.notes && <div style={{ padding:'14px 16px' }}><div style={{ fontSize:10, color:B[500], textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Notas</div><div style={{ fontSize:12, color:B[700], lineHeight:1.6, background:B[50], padding:'10px 12px', borderLeft:`3px solid ${B[800]}` }}>{sc.notes}</div></div>}
          </div>
        </div>
      )}
    </div>
  )
}

function DesktopFunil({ data }) {
  return (
    <div style={{ padding:28 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, background:B[200], marginBottom:20 }}>
        {STAGES.map((stage,i)=>{
          const cs=data.contacts.filter(c=>c.stage===stage)
          const total=cs.reduce((a,c)=>a+c.pipeline_value,0)
          const op=1-i*.1
          return (
            <div key={stage} style={{ background:B[0] }}>
              <div style={{ background:`rgba(38,59,126,${op+.2})`, padding:'10px 14px', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:10, fontWeight:800, color:B[0], textTransform:'uppercase', letterSpacing:.6 }}>{STAGE_LABEL[stage]}</span>
                <span style={{ fontSize:10, fontWeight:800, background:'rgba(255,255,255,0.2)', color:B[0], padding:'1px 7px' }}>{cs.length}</span>
              </div>
              {total>0&&<div style={{ padding:'6px 14px', background:B[50], borderBottom:`1px solid ${B[150]}`, fontSize:11, fontWeight:700, color:B[600], fontVariantNumeric:'tabular-nums' }}>{fmt(total)}</div>}
              <div style={{ padding:8, display:'flex', flexDirection:'column', gap:6, minHeight:200 }}>
                {cs.map(c=>(
                  <div key={c.id} style={{ background:B[50], border:`1px solid ${B[200]}`, padding:'10px 12px' }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}><Av lbl={c.av} sz={26} bg={B[700]} /><div><div style={{ fontSize:11, fontWeight:700, color:B[800] }}>{c.name}</div><div style={{ fontSize:10, color:B[500] }}>{c.city}</div></div></div>
                    {c.pipeline_value>0&&<div style={{ fontSize:12, fontWeight:800, color:B[700], marginBottom:6, fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</div>}
                    <div style={{ display:'flex', gap:4 }}><button style={{ flex:1, padding:'4px', background:B[800], color:B[0], border:'none', fontSize:9, fontWeight:800, cursor:'pointer' }}>Chat</button><button style={{ flex:1, padding:'4px', background:B[100], color:B[700], border:`1px solid ${B[200]}`, fontSize:9, fontWeight:700, cursor:'pointer' }}>Orçar</button></div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DesktopMetas({ data }) {
  const s = data.stats
  return (
    <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ background:B[0], border:`1px solid ${B[150]}`, padding:'24px 28px', display:'flex', gap:40, alignItems:'center', flexWrap:'wrap' }}>
        <div><div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:'uppercase', letterSpacing:.7, marginBottom:4 }}>Meta Junho 2025</div><div style={{ fontSize:32, fontWeight:900, color:B[800], letterSpacing:-1 }}>{fmt(s.target)}</div></div>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}><span style={{ fontSize:12, color:B[700] }}>Realizado: <strong>{fmt(s.salesMonth)}</strong></span><span style={{ fontSize:15, fontWeight:800, color:B[500] }}>{s.attainment}%</span></div>
          <div style={{ background:B[100], height:12 }}><div style={{ width:`${s.attainment}%`, height:12, background:B[500] }} /></div>
          <div style={{ fontSize:11, color:B[500], marginTop:6 }}>Faltam {fmt(s.target-s.salesMonth)}</div>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {[['Visitas','21','25'],['Propostas','14','20'],['Fechamentos','18','22'],['Novos clientes','3','5']].map(([l,v,m])=>(
            <div key={l} style={{ textAlign:'center' }}><div style={{ fontSize:10, color:B[600], textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{l}</div><div style={{ fontSize:22, fontWeight:800, color:B[800] }}>{v}<span style={{ fontSize:12, color:B[400] }}>/{m}</span></div><div style={{ background:B[100], height:4, marginTop:4 }}><div style={{ width:`${pct(+v,+m)}%`, height:4, background:B[500] }} /></div></div>
          ))}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:B[200] }}>
        <KpiCard label="Conversão"    value={`${s.conversionRate}%`} sub="+6pp vs maio" icon="trend"  accent delta="+6pp" />
        <KpiCard label="Ticket médio" value={`R$${(s.avgTicket/1000).toFixed(0)}k`} sub="pedidos em jun" icon="dollar" accent delta="+12%" />
        <KpiCard label="Pipeline"     value={fmt(s.pipeline)} sub="em negociação" icon="funnel" accent />
        <KpiCard label="NPS"          value="82" sub="Excelente" icon="target" accent delta="+4pp" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:B[0], border:`1px solid ${B[150]}`, padding:'18px 18px 10px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:B[800], marginBottom:12 }}>Vendas esta semana</div>
          <ResponsiveContainer width="100%" height={180}><AreaChart data={data.weekData}><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={B[800]} stopOpacity={0.15}/><stop offset="95%" stopColor={B[800]} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="2 4" stroke={B[150]} /><XAxis dataKey="d" tick={{ fontSize:11, fill:B[400] }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} /><Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} /><Area type="monotone" dataKey="v" stroke={B[800]} strokeWidth={2} fill="url(#wg)" name="Vendas" dot={{ fill:B[800], r:3, strokeWidth:0 }} /></AreaChart></ResponsiveContainer>
        </div>
        <div style={{ background:B[0], border:`1px solid ${B[150]}`, padding:'18px 0 0' }}>
          <div style={{ fontSize:13, fontWeight:700, color:B[800], padding:'0 18px', marginBottom:12 }}>Ranking da Equipe</div>
          {[['Ana Souza',71000],['Patrícia M.',63000],['Carlos Souza',55000,true],['Rui Costa',48000],['Lucas B.',39000]].map(([name,total,me],i)=>(
            <div key={name} style={{ padding:'11px 18px', borderBottom:`1px solid ${B[100]}`, background:me?B[50]:B[0], display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:11, fontWeight:800, color:i<3?B[500]:B[400], minWidth:18 }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:12, fontWeight:me?700:500, color:me?B[800]:B[700] }}>{name}{me?' (você)':''}</span><span style={{ fontSize:12, fontWeight:700, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(total)}</span></div>
                <div style={{ background:B[100], height:4 }}><div style={{ width:`${pct(total,71000)}%`, height:4, background:[B[900],B[800],B[700],B[500],B[300]][i] }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesktopGestao({ data }) {
  const s = data.stats
  const convData = [{m:'Jan',t:28},{m:'Fev',t:35},{m:'Mar',t:30},{m:'Abr',t:38},{m:'Mai',t:42},{m:'Jun',t:34}]
  return (
    <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:1, background:B[200] }}>
        <KpiCard label="Pipeline"     value={fmt(s.pipeline)}          sub="6 oportunidades"    icon="funnel" accent />
        <KpiCard label="Ticket médio" value={`R$${(s.avgTicket/1000).toFixed(0)}k`} sub="pedidos em jun" icon="dollar" accent />
        <KpiCard label="Conversão"    value={`${s.conversionRate}%`}   sub="propostas fechadas" icon="trend"  accent />
        <KpiCard label="Ciclo venda"  value="18 dias"                  sub="média fechamento"   icon="cal"    accent />
        <KpiCard label="Clientes"     value={s.contactsTotal}          sub="3 prospects"        icon="users"  accent />
        <KpiCard label="Orçamentos"   value={s.openQuotes}             sub={fmt(s.openQuotesValue)} icon="file" accent />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
        <div style={{ background:B[0], border:`1px solid ${B[150]}`, padding:'18px 18px 10px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:B[800], marginBottom:12 }}>Taxa de Conversão Mensal (%)</div>
          <ResponsiveContainer width="100%" height={200}><LineChart data={convData}><CartesianGrid strokeDasharray="2 4" stroke={B[150]} /><XAxis dataKey="m" tick={{ fontSize:11, fill:B[400] }} axisLine={false} tickLine={false} /><YAxis domain={[20,50]} tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} /><Tooltip formatter={v=>`${v}%`} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} /><Line type="monotone" dataKey="t" stroke={B[800]} strokeWidth={2.5} dot={{ fill:B[800], r:4, strokeWidth:0 }} name="Conversão" /></LineChart></ResponsiveContainer>
        </div>
        <div style={{ background:B[0], border:`1px solid ${B[150]}`, padding:'18px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:B[800], marginBottom:14 }}>Funil de Vendas</div>
          {STAGES.map((s,i)=>{
            const n=data.contacts.filter(c=>c.stage===s).length
            const w=[100,78,58,40,25][i]
            return (
              <div key={s} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:B[600], marginBottom:4 }}><span style={{ textTransform:'uppercase', fontWeight:700, letterSpacing:.4 }}>{STAGE_LABEL[s]}</span><span style={{ fontWeight:800, color:B[800] }}>{n}</span></div>
                <div style={{ background:B[100], height:22, position:'relative' }}>
                  <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${w}%`, background:`rgba(38,59,126,${1-i*.12})`, display:'flex', alignItems:'center', paddingLeft:8 }}>
                    <span style={{ fontSize:9, color:B[0], fontWeight:700 }}>{w}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Orders table */}
      <div style={{ background:B[0], border:`1px solid ${B[150]}` }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${B[150]}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:11, fontWeight:700, color:B[800], textTransform:'uppercase', letterSpacing:.7 }}>Pedidos Recentes</div>
          <button style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 14px', background:B[800], color:B[0], border:'none', fontSize:11, fontWeight:700, cursor:'pointer' }}><Ic n="plus" s={12} c={B[0]} /> Novo</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:B[50] }}>{['Número','Cliente','Valor','Pagamento','Origem','Status','Data'].map(h=>(<th key={h} style={{ padding:'10px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.7, borderBottom:`1px solid ${B[150]}` }}>{h}</th>))}</tr></thead>
          <tbody>{data.orders.map((o,i)=>(<tr key={o.id} style={{ borderBottom:`1px solid ${B[100]}`, background:i%2?B[50]:B[0] }}><td style={{ padding:'12px 20px', fontWeight:800, color:B[600], fontFamily:'monospace' }}>{o.number}</td><td style={{ padding:'12px 20px', color:B[800] }}>{o.contact_name}</td><td style={{ padding:'12px 20px', fontWeight:800, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(o.total)}</td><td style={{ padding:'12px 20px', color:B[600] }}>{o.payment_terms}</td><td style={{ padding:'12px 20px' }}><span style={{ fontSize:9, fontWeight:900, padding:'3px 7px', background:o.origin==='erp'?B[800]:B[150], color:o.origin==='erp'?B[0]:B[700], textTransform:'uppercase', letterSpacing:.5 }}>{o.origin==='erp'?'ERP':'Plataforma'}</span></td><td style={{ padding:'12px 20px' }}><Tag label={STATUS_LABEL[o.status]||o.status} variant={o.status==='delivered'||o.status==='confirmed'?'success':o.status==='cancelled'?'urgente':'default'} /></td><td style={{ padding:'12px 20px', color:B[500] }}>{o.created_at}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}

function DesktopErp({ data }) {
  return (
    <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ background:B[0], border:`1px solid ${B[150]}`, borderTop:`3px solid ${B[800]}`, padding:'24px 28px' }}>
        <div style={{ fontSize:15, fontWeight:800, color:B[800], marginBottom:4 }}>Integração ERP</div>
        <div style={{ fontSize:13, color:B[500] }}>Endpoint webhook configurado · Supabase Edge Function ativa</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:B[200] }}>
        <KpiCard label="Pedidos via ERP"      value={data.orders.filter(o=>o.origin==='erp').length}      sub="sincronizados"  icon="erp"   accent />
        <KpiCard label="Pedidos via plataforma" value={data.orders.filter(o=>o.origin!=='erp').length}     sub="criados no app" icon="cart"  accent />
        <KpiCard label="Última sincronização"  value="há 2min"  sub="Automático"     icon="check" accent />
      </div>
      <div style={{ background:B[0], border:`1px solid ${B[150]}` }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${B[150]}`, fontSize:11, fontWeight:700, color:B[800], textTransform:'uppercase', letterSpacing:.7 }}>Configuração</div>
        <div style={{ padding:20, display:'flex', flexDirection:'column', gap:16 }}>
          {[['Webhook URL','https://xinferxiukuxobjnrasp.supabase.co/functions/v1/erp-webhook'],['Método','POST'],['Header de autenticação','x-erp-secret: {seu-secret}'],['Eventos suportados','order.confirmed · order.delivered · quote.approved · stock.updated']].map(([label,val])=>(
            <div key={label}><div style={{ fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.7, marginBottom:6 }}>{label}</div><div style={{ background:B[50], border:`1px solid ${B[200]}`, padding:'10px 14px', fontSize:12, color:B[800], fontFamily:'monospace', wordBreak:'break-all' }}>{val}</div></div>
          ))}
        </div>
      </div>
      <div style={{ background:B[0], border:`1px solid ${B[150]}` }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${B[150]}`, fontSize:11, fontWeight:700, color:B[800], textTransform:'uppercase', letterSpacing:.7 }}>Log de Sincronização</div>
        {data.orders.map((o,i)=>(
          <div key={o.id} style={{ padding:'11px 20px', borderBottom:`1px solid ${B[100]}`, display:'flex', gap:16, alignItems:'center' }}>
            <span style={{ fontSize:9, fontWeight:900, padding:'3px 7px', background:o.origin==='erp'?B[800]:B[150], color:o.origin==='erp'?B[0]:B[700] }}>{o.origin==='erp'?'ERP':'Plataforma'}</span>
            <span style={{ fontSize:12, fontWeight:700, color:B[600], fontFamily:'monospace' }}>{o.number}</span>
            <span style={{ fontSize:12, color:B[700] }}>{o.contact_name}</span>
            <span style={{ fontSize:12, fontWeight:700, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(o.total)}</span>
            <span style={{ marginLeft:'auto', fontSize:11, color:B[400] }}>{o.created_at}</span>
            <Tag label={STATUS_LABEL[o.status]||o.status} variant={o.status==='confirmed'||o.status==='delivered'?'success':'default'} />
          </div>
        ))}
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════
// MOCK DATA — Marketing & Agenda
// ═══════════════════════════════════════════════
const AGENDA_MOCK = [
  { id:'a1', contact:'Metalúrgica Pinheiro', date:'Hoje',    time:'14h00', type:'Presencial', status:'confirmado', origin:'platform', av:'RP' },
  { id:'a2', contact:'Construtora Lima',     date:'Amanhã',  time:'10h00', type:'Videocall',  status:'confirmado', origin:'erp',      av:'PL' },
  { id:'a3', contact:'EletroSul Comercial',  date:'Sex 27',  time:'09h00', type:'Presencial', status:'pendente',   origin:'platform', av:'LE' },
  { id:'a4', contact:'AutoPeças Central',    date:'Sex 27',  time:'14h30', type:'Ligação',    status:'confirmado', origin:'erp',      av:'AC' },
  { id:'a5', contact:'Ferragens Monteiro',   date:'Seg 30',  time:'11h00', type:'Presencial', status:'pendente',   origin:'platform', av:'JM' },
  { id:'a6', contact:'Distribuidora Alves',  date:'Ter 01',  time:'16h00', type:'Videocall',  status:'confirmado', origin:'erp',      av:'CA' },
]
const ANUNCIOS_MOCK = [
  { id:'an1', title:'Promoção Válvulas V200', type:'Oferta relâmpago',  status:'ativo',    enviado:42, aberto:31, resposta:12, texto:'Aproveite! Válvula V200 com 12% de desconto até 30/06. Peça já o seu orçamento.' },
  { id:'an2', title:'Kit Hidráulico Completo', type:'Lançamento',       status:'rascunho', enviado:0,  aberto:0,  resposta:0,  texto:'Novo combo hidráulico disponível! Mangueira + conectores com economia de R$67.' },
  { id:'an3', title:'Recorrência Rolamentos', type:'Recorrência',       status:'pausado',  enviado:18, aberto:14, resposta:5,  texto:'Sua próxima compra de rolamentos está chegando! Estoque garantido para você.' },
]
const CAMPANHAS_MOCK = [
  { id:'cp1', name:'Clientes VIP — Junho',    status:'ativo',    alvos:8,  enviados:8,  abertos:7,  respostas:4, inicio:'01/06' },
  { id:'cp2', name:'Recuperação Prospects',   status:'ativo',    alvos:12, enviados:5,  abertos:3,  respostas:1, inicio:'15/06' },
  { id:'cp3', name:'Lançamento Kit Hidráulico',status:'rascunho',alvos:20, enviados:0,  abertos:0,  respostas:0, inicio:'—'     },
]
const CADENCIA_MOCK = [
  { id:'cd1', name:'Onboarding Cliente Novo',  steps:5, ativos:3, taxa:68, passos:[
    { dia:0,  acao:'WhatsApp: Boas-vindas e apresentação', status:'done'    },
    { dia:2,  acao:'WhatsApp: Envio do catálogo',          status:'done'    },
    { dia:5,  acao:'Ligação: Follow-up catálogo',          status:'pending' },
    { dia:10, acao:'WhatsApp: Oferta personalizada',       status:'pending' },
    { dia:15, acao:'Visita presencial',                    status:'pending' },
  ]},
  { id:'cd2', name:'Reativação de Inativos', steps:3, ativos:7, taxa:42, passos:[
    { dia:0,  acao:'WhatsApp: Sentimos sua falta!',        status:'done'    },
    { dia:3,  acao:'WhatsApp: Oferta exclusiva',           status:'pending' },
    { dia:7,  acao:'Ligação: Atendimento personalizado',   status:'pending' },
  ]},
]

// ═══════════════════════════════════════════════
// FAB — Floating Action Button (tirar pedido rápido)
// ═══════════════════════════════════════════════
function FAB({ data, visible=true }) {
  const [open, setOpen]     = useState(false)
  const [step, setStep]     = useState('client') // client | order
  const [clientId, setClientId] = useState(null)
  const [search, setSearch] = useState('')

  const client = data.contacts.find(c=>c.id===clientId)
  const filtered = data.contacts.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  const close = () => { setOpen(false); setStep('client'); setClientId(null); setSearch('') }

  if (!visible) return null

  return (
    <>
      {/* FAB button */}
      <button onClick={()=>setOpen(true)} style={{
        position:'fixed', bottom:80, right:18, width:56, height:56,
        background:B[800], color:B[0], border:'none', borderRadius:'50%',
        cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 20px rgba(38,59,126,0.45)',
        zIndex:100, transition:'transform .15s',
      }}>
        <Ic n="cart" s={24} c={B[0]} />
      </button>

      {/* Backdrop */}
      {open && (
        <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(15,20,50,0.5)', zIndex:300, backdropFilter:'blur(2px)' }} />
      )}

      {/* Bottom sheet */}
      {open && (
        <div style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:301,
          background:B[0], borderTop:`1px solid ${B[200]}`,
          borderRadius:'14px 14px 0 0',
          maxHeight:'88vh', display:'flex', flexDirection:'column',
          boxShadow:'0 -8px 40px rgba(15,20,50,0.15)',
        }}>
          {/* Handle */}
          <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 0' }}>
            <div style={{ width:40, height:4, background:B[200] }} />
          </div>

          {/* Header */}
          <div style={{ padding:'10px 18px 12px', borderBottom:`1px solid ${B[150]}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {step==='order' && (
                <button onClick={()=>{ setStep('client'); setClientId(null) }} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:'4px 6px 4px 0' }}>
                  <Ic n="back" s={20} c={B[800]} />
                </button>
              )}
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:B[800] }}>
                  {step==='client' ? 'Tirar Pedido' : `Pedido — ${client?.name?.split(' ')[0]}`}
                </div>
                {step==='order' && <div style={{ fontSize:11, color:B[500] }}>{client?.company}</div>}
              </div>
            </div>
            <button onClick={close} style={{ background:B[100], border:'none', cursor:'pointer', display:'flex', padding:8 }}>
              <Ic n="x" s={16} c={B[600]} />
            </button>
          </div>

          {/* Step 1: Selecionar cliente */}
          {step==='client' && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'10px 16px', borderBottom:`1px solid ${B[150]}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'9px 12px' }}>
                  <Ic n="search" s={15} c={B[400]} />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..." autoFocus
                    style={{ border:'none', background:'none', outline:'none', fontSize:14, color:B[800], flex:1, fontFamily:'inherit' }} />
                </div>
              </div>
              <div style={{ flex:1, overflowY:'auto' }}>
                {filtered.map(c=>(
                  <div key={c.id} onClick={()=>{ setClientId(c.id); setStep('order') }} style={{ display:'flex', gap:12, padding:'13px 16px', borderBottom:`1px solid ${B[100]}`, cursor:'pointer', alignItems:'center' }}>
                    <Av lbl={c.av} sz={40} bg={B[800]} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</div>
                      <div style={{ fontSize:12, color:B[500] }}>{c.company} · {c.city}</div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                      <Tag label={STAGE_LABEL[c.stage]||c.stage} variant={c.stage==='closing'?'success':c.stage==='prospect'?'prospect':'default'} />
                      {c.pipeline_value>0 && <span style={{ fontSize:11, fontWeight:700, color:B[700], fontVariantNumeric:'tabular-nums' }}>{fmt(c.pipeline_value)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Order panel for selected client */}
          {step==='order' && client && (
            <div style={{ flex:1, overflow:'hidden' }}>
              <OrderPanel
                contact={client}
                products={data.products}
                promotions={data.promotions}
                combos={data.combos}
                paymentTerms={data.paymentTerms}
                deliveryOptions={data.deliveryOptions}
                onSend={async (...args)=>{ await data.createOrder(...args); close() }}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════
// PRODUTOS ERP — visualização integrada
// ═══════════════════════════════════════════════
function ProdutosERP({ data }) {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('Todos')
  const [selected, setSelected] = useState(null)
  const cats = ['Todos', ...[...new Set(data.products.map(p=>p.category))]]
  const list  = data.products.filter(p=>
    (cat==='Todos'||p.category===cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.ref?.toLowerCase().includes(search.toLowerCase()))
  )
  const sp = data.products.find(p=>p.id===selected)

  return (
    <div style={{ display:'flex', height:'100%' }}>
      {/* Catalog */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${B[150]}`, background:B[0], display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:'8px 12px', flex:1, maxWidth:300 }}>
            <Ic n="search" s={14} c={B[400]} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produto ou ref..." style={{ border:'none', background:'none', outline:'none', fontSize:13, color:B[800], flex:1, fontFamily:'inherit' }} />
          </div>
          <div style={{ display:'flex', gap:1, background:B[200] }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:'8px 14px', background:cat===c?B[800]:B[0], color:cat===c?B[0]:B[600], border:'none', cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{c}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:B[500], marginLeft:'auto', background:B[50], border:`1px solid ${B[200]}`, padding:'7px 12px' }}>
            <Ic n="erp" s={14} c={B[400]} /> ERP · Sincronizado há 2min
          </div>
        </div>
        {/* Table */}
        <div style={{ flex:1, overflowY:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead style={{ position:'sticky', top:0 }}>
              <tr style={{ background:B[50] }}>
                {['Ref','Produto','Categoria','Preço','Estoque','Mín.','Status'].map(h=>(
                  <th key={h} style={{ padding:'10px 20px', textAlign:'left', fontSize:10, fontWeight:700, color:B[600], textTransform:'uppercase', letterSpacing:.7, borderBottom:`1px solid ${B[150]}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((p,i)=>{
                const lowStock = p.stock < 20
                return (
                  <tr key={p.id} onClick={()=>setSelected(selected===p.id?null:p.id)} style={{ borderBottom:`1px solid ${B[100]}`, background:selected===p.id?B[50]:i%2?B[0]:'#fafbfd', cursor:'pointer' }}>
                    <td style={{ padding:'12px 20px', fontFamily:'monospace', fontWeight:700, color:B[600] }}>{p.ref}</td>
                    <td style={{ padding:'12px 20px', fontWeight:600, color:B[800] }}>{p.name}</td>
                    <td style={{ padding:'12px 20px', color:B[500] }}>{p.category}</td>
                    <td style={{ padding:'12px 20px', fontWeight:800, color:B[800], fontVariantNumeric:'tabular-nums' }}>{fmt(p.price)}<span style={{ fontSize:10, color:B[400], fontWeight:400 }}>/{p.unit}</span></td>
                    <td style={{ padding:'12px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:60, background:B[100], height:4 }}>
                          <div style={{ width:`${Math.min(p.stock/300*100,100)}%`, height:4, background:lowStock?'#f59e0b':B[600] }} />
                        </div>
                        <span style={{ fontWeight:700, color:lowStock?'#b45309':B[800] }}>{p.stock}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 20px', color:B[500] }}>20</td>
                    <td style={{ padding:'12px 20px' }}>
                      {lowStock
                        ? <span style={{ fontSize:9, fontWeight:800, padding:'3px 8px', background:'#fef3c7', color:'#b45309', textTransform:'uppercase' }}>Estoque baixo</span>
                        : <span style={{ fontSize:9, fontWeight:800, padding:'3px 8px', background:B[150], color:B[700], textTransform:'uppercase' }}>OK</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Footer stats */}
        <div style={{ padding:'10px 20px', borderTop:`1px solid ${B[150]}`, background:B[50], display:'flex', gap:24, fontSize:11, color:B[500] }}>
          <span>{list.length} produtos</span>
          <span style={{ color:'#b45309' }}>⚠ {list.filter(p=>p.stock<20).length} com estoque baixo</span>
          <span style={{ marginLeft:'auto' }}>Valor total: <strong style={{ color:B[800] }}>{fmt(list.reduce((a,p)=>a+p.price*p.stock,0))}</strong></span>
        </div>
      </div>

      {/* Detail */}
      {sp && (
        <div style={{ width:300, background:B[0], borderLeft:`1px solid ${B[150]}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
          <div style={{ background:B[800], padding:'20px 18px' }}>
            <div style={{ fontSize:10, color:B[300], fontFamily:'monospace', marginBottom:4 }}>{sp.ref}</div>
            <div style={{ fontSize:16, fontWeight:800, color:B[0], marginBottom:4 }}>{sp.name}</div>
            <div style={{ fontSize:12, color:B[300] }}>{sp.category}</div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {[
              ['Preço unitário', fmt(sp.price)+'/'+sp.unit],
              ['Estoque atual',  `${sp.stock} ${sp.unit}`],
              ['Estoque mínimo', `20 ${sp.unit}`],
              ['Categoria',      sp.category],
              ['Origem',         'ERP integrado'],
              ['Última sync',    'há 2 minutos'],
            ].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 18px', borderBottom:`1px solid ${B[100]}` }}>
                <span style={{ fontSize:11, color:B[500] }}>{l}</span>
                <span style={{ fontSize:12, fontWeight:700, color:B[800] }}>{v}</span>
              </div>
            ))}
            <div style={{ padding:'14px 18px' }}>
              <div style={{ fontSize:10, color:B[500], textTransform:'uppercase', letterSpacing:.5, marginBottom:8 }}>Estoque</div>
              <div style={{ background:B[100], height:8, marginBottom:6 }}>
                <div style={{ width:`${Math.min(sp.stock/300*100,100)}%`, height:8, background:sp.stock<20?'#f59e0b':B[600] }} />
              </div>
              <div style={{ fontSize:11, color:sp.stock<20?'#b45309':B[600] }}>
                {sp.stock<20?`⚠ Estoque baixo — ${sp.stock} restantes`:`${sp.stock} em estoque`}
              </div>
            </div>
            <div style={{ padding:'14px 18px', borderTop:`1px solid ${B[150]}` }}>
              <button style={{ width:'100%', padding:'11px', background:B[800], color:B[0], border:'none', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <Ic n="cart" s={14} c={B[0]} /> Incluir em pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════
export default function App() {
  const isMobile           = useIsMobile()
  const { session, loading, profile, signIn, signUp, signOut } = useAuth()
  const [demo, setDemo]    = useState(false)
  const authenticated      = session || demo
  const userId             = session?.user?.id || null
  const data               = useAppData(authenticated ? userId : null)
  const user               = authenticated ? (profile || MOCK.profile) : null

  if (loading) return (
    <div style={{ height:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:B[50] }}>
      <div style={{ textAlign:'center' }}>
        <img src="/logo.svg" alt="" style={{ height:40, marginBottom:16 }} onError={e=>{e.target.style.display='none'}} />
        <div style={{ fontSize:12, color:B[500] }}>Carregando...</div>
      </div>
    </div>
  )

  if (!authenticated) return (
    <LoginScreen
      onLogin={signIn}
      onSignUp={signUp}
      onDemo={() => setDemo(true)}
    />
  )

  const handleLogout = () => { signOut(); setDemo(false) }

  return isMobile
    ? <MobileApp  data={data} user={user} onLogout={handleLogout} />
    : <DesktopApp data={data} user={user} onLogout={handleLogout} />
}

