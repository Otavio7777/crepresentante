import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Brand ───────────────────────────────────
const BRAND = "#263b7e";
const B = {
  900:"#1a2654", 800:"#263b7e", 700:"#2d4a99",
  600:"#3557b5", 500:"#3d64cc", 400:"#7a9adf",
  300:"#b3c7ef", 200:"#d4e0f7", 150:"#e6edfb",
  100:"#f0f5fd", 50:"#f7faff", 0:"#ffffff",
};

// ─── Icons (SVG inline) ───────────────────────
const I = {
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  chat:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bar:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  send:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  back:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  zap:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  tag:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  trend:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  cal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="0"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  file:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
};

const Ico = ({ i, s=20, c="currentColor" }) => (
  <span style={{ display:"inline-flex", width:s, height:s, color:c, flexShrink:0 }}>
    {i}
  </span>
);

// ─── Data ─────────────────────────────────────
const CLIENTS = [
  { id:1, name:"Metalúrgica Pinheiro", short:"Pinheiro",  av:"MP", stage:"Fechamento",  val:28500, city:"BH",       unread:3, last:"2h"  },
  { id:2, name:"Distribuidora Alves",  short:"Alves",     av:"DA", stage:"Proposta",    val:15200, city:"Contagem",  unread:0, last:"1d"  },
  { id:3, name:"Ferragens Monteiro",   short:"Monteiro",  av:"FM", stage:"Negociação",  val:9800,  city:"Betim",     unread:1, last:"3h"  },
  { id:5, name:"AutoPeças Central",    short:"AutoPeças", av:"AC", stage:"Qualificado", val:4300,  city:"Vespasiano",unread:5, last:"30m" },
  { id:6, name:"Construtora Lima",     short:"Lima",      av:"CL", stage:"Fechamento",  val:67000, city:"Nova Lima", unread:2, last:"1h"  },
  { id:8, name:"EletroSul Comercial",  short:"EletroSul", av:"EC", stage:"Proposta",    val:22100, city:"BH",        unread:0, last:"6h"  },
];
const PRODUCTS = [
  { id:"P01", cat:"Válvulas",    name:"Válvula V200",            price:285,  stock:120, unit:"un", ref:"VLV-200" },
  { id:"P02", cat:"Válvulas",    name:"Válvula V350 Industrial", price:490,  stock:44,  unit:"un", ref:"VLV-350" },
  { id:"P03", cat:"Válvulas",    name:"Válvula Esfera 1/2",      price:68,   stock:200, unit:"un", ref:"VLV-E12" },
  { id:"P04", cat:"Rolamentos",  name:"Rolamento 6205",          price:42,   stock:48,  unit:"un", ref:"ROL-6205"},
  { id:"P05", cat:"Rolamentos",  name:"Rolamento 6305",          price:58,   stock:12,  unit:"un", ref:"ROL-6305"},
  { id:"P06", cat:"Rolamentos",  name:"Rolamento 6208 2RS",      price:74,   stock:30,  unit:"un", ref:"ROL-6208"},
  { id:"P07", cat:"Fixação",     name:"Parafuso Sextavado M12",  price:1.80, stock:5000,unit:"cx", ref:"PAR-M12" },
  { id:"P08", cat:"Fixação",     name:"Porca Sextavada M12",     price:0.90, stock:8000,unit:"cx", ref:"PRC-M12" },
  { id:"P10", cat:"Transmissão", name:"Correia Dentada T5",      price:34,   stock:200, unit:"un", ref:"COR-T5"  },
  { id:"P11", cat:"Transmissão", name:"Polia Alumínio 80mm",     price:87,   stock:60,  unit:"un", ref:"POL-080" },
  { id:"P12", cat:"Hidráulico",  name:"Mangueira Hidráulica 3/4",price:28.5, stock:300, unit:"mt", ref:"MAN-34"  },
  { id:"P13", cat:"Hidráulico",  name:"Conector Reto 3/4",       price:12,   stock:400, unit:"un", ref:"CON-34"  },
  { id:"P14", cat:"Elétrico",    name:"Cabo PP 2x2.5mm",         price:8.90, stock:1000,unit:"mt", ref:"CAB-225" },
  { id:"P15", cat:"Elétrico",    name:"Disjuntor DIN 20A",       price:32,   stock:150, unit:"un", ref:"DIS-20A" },
];
const CATS = ["Todos", ...new Set(PRODUCTS.map(p=>p.cat))];
const PROMOS = [
  { id:"PR1", title:"Válvulas em Destaque", sub:"V200 + V350 com 12% OFF no kit", badge:"−12%", pids:["P01","P02"] },
  { id:"PR2", title:"Rolamentos da Semana",  sub:"Leve 5 pague 4 na linha 6200",  badge:"5×4",  pids:["P04","P05"] },
  { id:"PR3", title:"Fixação em Atacado",    sub:"+500cx com 8% de desconto",     badge:"−8%",  pids:["P07","P08"] },
];
const COMBOS = [
  { id:"C1", name:"Kit Hidráulico",   items:[{id:"P12",q:10},{id:"P13",q:5}],  orig:427, price:360, save:67,  tag:"Top" },
  { id:"C2", name:"Pack Rolamentos",  items:[{id:"P04",q:5},{id:"P05",q:3}],   orig:360, price:295, save:65,  tag:"Limitado" },
  { id:"C3", name:"Kit Transmissão",  items:[{id:"P10",q:2},{id:"P11",q:1}],   orig:155, price:125, save:30,  tag:"Novo" },
  { id:"C4", name:"Fixação M12 Pack", items:[{id:"P07",q:50},{id:"P08",q:50}], orig:135, price:105, save:30,  tag:"Econômico" },
];
const PAYMENT = ["À vista","7 dias","14 dias","21 dias","30/60","30/60/90","45/90/135"];
const DELIVERY = ["Retirada","3 dias úteis","5 dias úteis","7 dias úteis","10 dias úteis","A combinar"];
const MONTH_DATA = [
  {m:"Jan",v:42000,t:50000},{m:"Fev",v:58000,t:50000},{m:"Mar",v:47000,t:55000},
  {m:"Abr",v:63000,t:55000},{m:"Mai",v:71000,t:60000},{m:"Jun",v:55000,t:60000},
];
const VISITS = [
  { client:"Metalúrgica Pinheiro", when:"Hoje 14h",   type:"Presencial", ok:true  },
  { client:"Construtora Lima",     when:"Amanhã 10h", type:"Videocall",  ok:true  },
  { client:"EletroSul Comercial",  when:"Sex 09h",    type:"Presencial", ok:false },
];
const CHATS_DATA = {
  1:[ {f:"c",t:"Bom dia! Preciso do orçamento das válvulas.",    h:"09:14"},
      {f:"m",t:"Bom dia! Vou gerar agora pelo sistema.",          h:"09:15"},
      {f:"m",t:"Orçamento #2847 — 50× Válvula V200\nTotal: R$ 14.250,00\nValidade: 10 dias",h:"09:16"},
      {f:"c",t:"Podem incluir mais 20 unidades?",                 h:"09:31"},
      {f:"m",t:"Com 70 un o preço cai para R$ 270/un. Total R$ 18.900. Atualizo?",h:"09:33"},
      {f:"c",t:"Sim! E qual o prazo de entrega?",                 h:"09:45"} ],
  5:[ {f:"c",t:"Oi, quero ver o catálogo de rolamentos.",         h:"14:02"},
      {f:"m",t:"Boa tarde! Enviando catálogo atualizado.",         h:"14:03"},
      {f:"c",t:"Especialmente 6205 e 6305 para esta semana.",     h:"14:11"},
      {f:"m",t:"6205 — 48 un em BH. 6305 — 12 un. Faço reserva?",h:"14:15"} ],
  3:[ {f:"c",t:"Proposta da semana passada, conseguiu revisar?",  h:"11:00"},
      {f:"m",t:"Aprovado desconto de 5%. Posso fechar hoje?",     h:"11:05"},
      {f:"c",t:"Precisamos parcelar em 3× sem juros.",            h:"11:20"},
      {f:"m",t:"3× de R$ 3.266,67/mês. Gerando contrato.",       h:"11:22"} ],
};

const fmt = n => "R$\u00a0" + n.toLocaleString("pt-BR", {minimumFractionDigits:0});
const pct = (a,b) => Math.round(a/b*100);

// ─── Primitives ───────────────────────────────
const Av = ({ lbl, sz=36, bg=B[800] }) => (
  <div style={{ width:sz, height:sz, background:bg, color:B[0], display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*.33, fontWeight:700, flexShrink:0, letterSpacing:.5 }}>{lbl}</div>
);

// ─── Page: HOME ───────────────────────────────
function Home() {
  return (
    <div style={{ padding:"0 0 24px" }}>
      {/* Hero */}
      <div style={{ background:B[800], padding:"20px 20px 24px" }}>
        <div style={{ fontSize:12, color:B[300], marginBottom:4 }}>Bom dia, Carlos 👋</div>
        <div style={{ fontSize:13, color:B[400], marginBottom:16 }}>Resultado de Junho 2025</div>
        <div style={{ display:"flex", gap:0, marginBottom:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:B[400] }}>Realizado</div>
            <div style={{ fontSize:30, fontWeight:900, color:B[0], letterSpacing:-1, fontVariantNumeric:"tabular-nums" }}>R$55k</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:B[400] }}>Meta</div>
            <div style={{ fontSize:30, fontWeight:900, color:B[300], letterSpacing:-1 }}>R$60k</div>
          </div>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ fontSize:11, color:B[400] }}>Atingimento</div>
            <div style={{ fontSize:30, fontWeight:900, color:"#ffd166", letterSpacing:-1 }}>91%</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.15)", height:6 }}>
          <div style={{ width:"91%", height:6, background:B[300] }} />
        </div>
      </div>

      {/* KPIs rápidos */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:B[200], margin:"1px 0" }}>
        {[
          { l:"Visitas marcadas",    v:"8",   s:"3 esta semana",        i:I.cal    },
          { l:"Orçamentos abertos",  v:"14",  s:"R$142k em aberto",     i:I.file   },
          { l:"Contratos p/ fechar", v:"3",   s:"R$97.500",             i:I.check  },
          { l:"Taxa de conversão",   v:"34%", s:"+6pp vs. maio",        i:I.trend  },
        ].map(({ l,v,s,i })=>(
          <div key={l} style={{ background:B[0], padding:"16px 16px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:10, color:B[500], fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>{l}</span>
              <Ico i={i} s={16} c={B[400]} />
            </div>
            <div style={{ fontSize:26, fontWeight:900, color:B[800], letterSpacing:-1 }}>{v}</div>
            <div style={{ fontSize:11, color:B[400], marginTop:4 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div style={{ background:B[0], margin:"1px 0", padding:"16px 16px 8px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6, marginBottom:14 }}>Vendas vs Meta</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={MONTH_DATA} barSize={14} barGap={3}>
            <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
            <XAxis dataKey="m" tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:9, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
            <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:11 }} />
            <Bar dataKey="t" fill={B[150]} name="Meta" />
            <Bar dataKey="v" fill={B[800]} name="Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Próximas visitas */}
      <div style={{ background:B[0], margin:"1px 0" }}>
        <div style={{ padding:"14px 16px 0", fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6 }}>Próximas Visitas</div>
        {VISITS.map((v,i)=>(
          <div key={i} style={{ padding:"12px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{v.client}</div>
              <div style={{ fontSize:11, color:B[500], marginTop:2 }}>{v.when} · {v.type}</div>
            </div>
            <span style={{ fontSize:9, fontWeight:800, padding:"3px 8px", textTransform:"uppercase", letterSpacing:.5, background:v.ok?B[150]:B[100], color:v.ok?B[700]:B[500] }}>{v.ok?"Confirmado":"Pendente"}</span>
          </div>
        ))}
      </div>

      {/* Atividade */}
      <div style={{ background:B[0], margin:"1px 0" }}>
        <div style={{ padding:"14px 16px 0", fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6 }}>Atividade recente</div>
        {[
          { t:"Orçamento #2849 enviado — Construtora Lima",  h:"45m" },
          { t:"Pedido #1204 confirmado — AutoPeças Central", h:"1h"  },
          { t:"Visita marcada — EletroSul Comercial",        h:"2h"  },
          { t:"Nova mensagem — Ferragens Monteiro",          h:"3h"  },
        ].map((a,i)=>(
          <div key={i} style={{ padding:"12px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:12, color:B[700], flex:1 }}>{a.t}</div>
            <div style={{ fontSize:10, color:B[400], marginLeft:12, flexShrink:0 }}>há {a.h}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page: PEDIDOS (mobile-first order flow) ──
function Pedidos() {
  const [clientId, setClientId] = useState(CLIENTS[0].id);
  const [cart, setCart]         = useState({});
  const [screen, setScreen]     = useState("cat"); // cat|cart|checkout|done
  const [cat, setCat]           = useState("Todos");
  const [search, setSearch]     = useState("");
  const [pay, setPay]           = useState("30/60");
  const [del, setDel]           = useState("5 dias úteis");
  const [notes, setNotes]       = useState("");
  const [flash, setFlash]       = useState({});

  const client   = CLIENTS.find(c=>c.id===clientId);
  const lines    = Object.entries(cart).filter(([,q])=>q>0);
  const count    = lines.reduce((a,[,q])=>a+q,0);
  const total    = lines.reduce((a,[id,q])=>a+(PRODUCTS.find(p=>p.id===id)?.price||0)*q,0);
  const filtered = PRODUCTS.filter(p=>(cat==="Todos"||p.cat===cat)&&(p.name.toLowerCase().includes(search.toLowerCase())||p.ref.toLowerCase().includes(search.toLowerCase())));

  const add = id => {
    setCart(c=>({...c,[id]:(c[id]||0)+1}));
    setFlash(f=>({...f,[id]:true}));
    setTimeout(()=>setFlash(f=>({...f,[id]:false})),500);
  };
  const set = (id,q) => q<=0 ? setCart(c=>(({[id]:_,...r})=>r)(c)) : setCart(c=>({...c,[id]:q}));
  const addCombo = combo => combo.items.forEach(({id,q})=>setCart(c=>({...c,[id]:(c[id]||0)+q})));

  // ── DONE ──
  if (screen==="done") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh", gap:20, padding:32, textAlign:"center" }}>
      <div style={{ width:80, height:80, background:B[800], display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ico i={I.check} s={40} c={B[0]} />
      </div>
      <div>
        <div style={{ fontSize:22, fontWeight:900, color:B[800] }}>Pedido enviado!</div>
        <div style={{ fontSize:13, color:B[500], marginTop:8, lineHeight:1.6 }}>Registrado no ERP e WhatsApp<br/>enviado para <strong>{client?.name}</strong></div>
        <div style={{ fontSize:28, fontWeight:900, color:B[800], margin:"20px 0 4px", fontVariantNumeric:"tabular-nums" }}>{fmt(total)}</div>
        <div style={{ fontSize:12, color:B[400] }}>{pay} · {del}</div>
      </div>
      <button onClick={()=>{setCart({});setScreen("cat");}} style={{ padding:"14px 40px", background:B[800], color:B[0], border:"none", fontSize:14, fontWeight:800, cursor:"pointer", marginTop:8 }}>
        Novo Pedido
      </button>
    </div>
  );

  // ── CHECKOUT ──
  if (screen==="checkout") return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100%" }}>
      {/* topbar */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>setScreen("cart")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:4 }}><Ico i={I.back} s={22} c={B[800]} /></button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:B[800] }}>Finalizar Pedido</div>
          <div style={{ fontSize:11, color:B[500] }}>{client?.name}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:16, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(total)}</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:16 }}>
        {/* Resumo */}
        <div style={{ background:B[50], border:`1px solid ${B[150]}`, borderTop:`3px solid ${B[800]}`, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.7, marginBottom:10 }}>Resumo do pedido</div>
          {lines.map(([id,q])=>{
            const p=PRODUCTS.find(x=>x.id===id);
            return (
              <div key={id} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12 }}>
                <span style={{ color:B[700] }}>{q}× {p?.name}</span>
                <span style={{ fontWeight:700, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt((p?.price||0)*q)}</span>
              </div>
            );
          })}
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${B[200]}`, marginTop:6 }}>
            <span style={{ fontSize:14, fontWeight:800, color:B[800] }}>Total</span>
            <span style={{ fontSize:16, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(total)}</span>
          </div>
        </div>

        {/* Pagamento */}
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.7, marginBottom:10 }}>Condição de pagamento</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
            {PAYMENT.map(t=>(
              <button key={t} onClick={()=>setPay(t)} style={{ padding:"12px 6px", fontSize:12, fontWeight:700, cursor:"pointer", background:pay===t?B[800]:B[0], color:pay===t?B[0]:B[600], border:`1px solid ${pay===t?B[800]:B[200]}` }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Entrega */}
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.7, marginBottom:10 }}>Prazo de entrega</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {DELIVERY.map(d=>(
              <button key={d} onClick={()=>setDel(d)} style={{ padding:"13px 16px", fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left", background:del===d?B[800]:B[0], color:del===d?B[0]:B[700], border:`1px solid ${del===d?B[800]:B[200]}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                {d}
                {del===d && <Ico i={I.check} s={16} c={B[300]} />}
              </button>
            ))}
          </div>
        </div>

        {/* Obs */}
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.7, marginBottom:8 }}>Observações</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Instruções de entrega, referência..." style={{ width:"100%", padding:"12px", border:`1px solid ${B[200]}`, fontSize:13, color:B[800], outline:"none", fontFamily:"inherit", resize:"none", boxSizing:"border-box", background:B[50] }} />
        </div>

        <div style={{ height:16 }} />
      </div>

      <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        <button onClick={()=>setScreen("done")} style={{ padding:"16px", background:B[800], color:B[0], border:"none", fontSize:14, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Ico i={I.send} s={16} c={B[0]} /> Confirmar e enviar
        </button>
        <button onClick={()=>setScreen("done")} style={{ padding:"11px", background:B[0], color:B[600], border:`1px solid ${B[200]}`, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <span style={{ fontSize:8, fontWeight:900, background:B[800], color:B[0], padding:"2px 5px" }}>ERP</span> Somente ERP — sem WhatsApp
        </button>
      </div>
    </div>
  );

  // ── CART ──
  if (screen==="cart") return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100%" }}>
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>setScreen("cat")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:4 }}><Ico i={I.back} s={22} c={B[800]} /></button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:B[800] }}>Carrinho</div>
          <div style={{ fontSize:11, color:B[500] }}>{count} item{count!==1?"s":""} · {client?.name}</div>
        </div>
        <div style={{ fontSize:16, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(total)}</div>
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>
        {lines.length===0 ? (
          <div style={{ textAlign:"center", padding:"60px 24px", color:B[300] }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16, opacity:.3 }}><Ico i={I.cart} s={52} /></div>
            <div style={{ fontSize:15, fontWeight:700, color:B[500] }}>Carrinho vazio</div>
            <div style={{ fontSize:12, color:B[400], marginTop:6 }}>Adicione produtos no catálogo</div>
          </div>
        ) : lines.map(([id,q])=>{
          const p=PRODUCTS.find(x=>x.id===id);
          return (
            <div key={id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{p?.name}</div>
                  <div style={{ fontSize:11, color:B[500] }}>{p?.ref} · {fmt(p?.price||0)}/{p?.unit}</div>
                </div>
                <div style={{ fontWeight:900, fontSize:15, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt((p?.price||0)*q)}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ display:"flex", border:`1px solid ${B[300]}` }}>
                  <button onClick={()=>set(id,q-1)} style={{ width:44,height:44,background:B[100],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Ico i={I.minus} s={16} c={B[800]} /></button>
                  <span style={{ width:48,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:B[800],fontFamily:"monospace" }}>{q}</span>
                  <button onClick={()=>set(id,q+1)} style={{ width:44,height:44,background:B[800],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Ico i={I.plus} s={16} c={B[0]} /></button>
                </div>
                <button onClick={()=>set(id,0)} style={{ marginLeft:"auto",padding:"8px 14px",background:B[50],border:`1px solid ${B[200]}`,color:B[400],fontSize:11,fontWeight:700,cursor:"pointer" }}>Remover</button>
              </div>
            </div>
          );
        })}
      </div>

      {lines.length>0 && (
        <div style={{ background:B[0], borderTop:`2px solid ${B[800]}`, padding:"14px 16px" }}>
          <button onClick={()=>setScreen("checkout")} style={{ width:"100%",padding:"16px",background:B[800],color:B[0],border:"none",fontSize:14,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            Finalizar pedido <Ico i={I.send} s={16} c={B[0]} />
          </button>
        </div>
      )}
    </div>
  );

  // ── CATÁLOGO ──
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100%" }}>
      {/* Cliente selector */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}` }}>
        <div style={{ display:"flex", overflowX:"auto", scrollbarWidth:"none", padding:"8px 12px 0", gap:4 }}>
          {CLIENTS.map(c=>(
            <button key={c.id} onClick={()=>setClientId(c.id)} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6, padding:"6px 10px 10px", background:"none", border:"none", cursor:"pointer", borderBottom:clientId===c.id?`2px solid ${B[800]}`:"2px solid transparent", marginBottom:-1 }}>
              <Av lbl={c.av} sz={24} bg={clientId===c.id?B[800]:B[300]} />
              <span style={{ fontSize:11, fontWeight:clientId===c.id?800:500, color:clientId===c.id?B[800]:B[500], whiteSpace:"nowrap" }}>{c.short}</span>
            </button>
          ))}
        </div>
        {/* Busca */}
        <div style={{ padding:"8px 12px 10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:"10px 12px" }}>
            <Ico i={I.search} s={17} c={B[400]} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produto ou código..." style={{ border:"none",background:"none",outline:"none",fontSize:14,color:B[800],flex:1,fontFamily:"inherit" }} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",display:"flex" }}><Ico i={I.x} s={16} c={B[400]} /></button>}
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom: count>0 ? 72 : 24 }}>

        {/* Promoções */}
        {!search && (
          <div style={{ padding:"14px 0 0" }}>
            <div style={{ padding:"0 14px 10px", display:"flex", alignItems:"center", gap:6 }}>
              <Ico i={I.zap} s={14} c={B[800]} />
              <span style={{ fontSize:11, fontWeight:800, color:B[800], textTransform:"uppercase", letterSpacing:.7 }}>Promoções ativas</span>
            </div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", scrollbarWidth:"none", padding:"0 14px 14px" }}>
              {PROMOS.map(pr=>(
                <div key={pr.id} style={{ flexShrink:0, width:230, background:B[800], padding:"14px", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, right:0, background:B[500], padding:"5px 10px", fontSize:10, fontWeight:900, color:B[0] }}>{pr.badge}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:B[0], marginTop:10, marginBottom:4 }}>{pr.title}</div>
                  <div style={{ fontSize:11, color:B[300], marginBottom:14, lineHeight:1.4 }}>{pr.sub}</div>
                  <button onClick={()=>pr.pids.forEach(add)} style={{ padding:"9px 16px",background:B[0],color:B[800],border:"none",fontSize:11,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                    <Ico i={I.plus} s={12} c={B[800]} /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Combos */}
        {!search && (
          <div style={{ padding:"4px 0 8px" }}>
            <div style={{ padding:"0 14px 10px", display:"flex", alignItems:"center", gap:6 }}>
              <Ico i={I.tag} s={14} c={B[800]} />
              <span style={{ fontSize:11, fontWeight:800, color:B[800], textTransform:"uppercase", letterSpacing:.7 }}>Combos especiais</span>
            </div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", scrollbarWidth:"none", padding:"0 14px 14px" }}>
              {COMBOS.map(cb=>(
                <div key={cb.id} style={{ flexShrink:0, width:190, background:B[0], border:`1px solid ${B[200]}`, borderTop:`3px solid ${B[800]}`, padding:"12px" }}>
                  <div style={{ fontSize:9, fontWeight:800, color:B[500], textTransform:"uppercase", marginBottom:4 }}>{cb.tag}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:B[800], marginBottom:6, lineHeight:1.3 }}>{cb.name}</div>
                  <div style={{ marginBottom:8 }}>
                    {cb.items.map(({id,q})=>{
                      const p=PRODUCTS.find(x=>x.id===id);
                      return <div key={id} style={{ fontSize:10, color:B[500], marginBottom:2 }}>{q}× {p?.name}</div>;
                    })}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:10, color:B[400], textDecoration:"line-through" }}>{fmt(cb.orig)}</div>
                      <div style={{ fontSize:16, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(cb.price)}</div>
                    </div>
                    <div style={{ fontSize:10, fontWeight:800, background:B[150], color:B[700], padding:"3px 7px" }}>−{fmt(cb.save)}</div>
                  </div>
                  <button onClick={()=>addCombo(cb)} style={{ width:"100%",padding:"10px",background:B[800],color:B[0],border:"none",fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
                    <Ico i={I.plus} s={12} c={B[0]} /> Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorias sticky */}
        <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, borderBottom:`1px solid ${B[150]}`, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0,padding:"12px 14px",background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",color:cat===c?B[800]:B[400],borderBottom:cat===c?`2px solid ${B[800]}`:"2px solid transparent",marginBottom:-1 }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Grid 2 colunas */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, padding:10 }}>
          {filtered.map(p=>{
            const q=cart[p.id]||0, isFlash=flash[p.id], low=p.stock<20;
            return (
              <div key={p.id} style={{ background:B[0], border:`1px solid ${q>0?B[800]:B[200]}`, borderTop:`3px solid ${q>0?B[800]:B[150]}`, padding:"12px 11px 10px", display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:9, color:B[400], fontFamily:"monospace", fontWeight:700 }}>{p.ref}</span>
                  {q>0 && <span style={{ fontSize:9, fontWeight:900, background:B[800], color:B[0], padding:"1px 6px" }}>{q}</span>}
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:B[800], lineHeight:1.35, flex:1 }}>{p.name}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(p.price)}</div>
                    <div style={{ fontSize:9, color:B[400] }}>/{p.unit}</div>
                  </div>
                  {low && <span style={{ fontSize:9, fontWeight:700, color:"#b45309", background:"#fff7ed", padding:"2px 5px" }}>⚠ {p.stock}</span>}
                </div>
                {q===0 ? (
                  <button onClick={()=>add(p.id)} style={{ padding:"11px 0",background:isFlash?B[300]:B[800],color:B[0],border:"none",fontSize:12,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"background .2s" }}>
                    {isFlash ? <Ico i={I.check} s={13} c={B[0]} /> : <Ico i={I.plus} s={13} c={B[0]} />}
                    {isFlash ? "Adicionado" : "Adicionar"}
                  </button>
                ) : (
                  <div style={{ display:"flex", overflow:"hidden", border:`1px solid ${B[800]}` }}>
                    <button onClick={()=>set(p.id,q-1)} style={{ flex:1,padding:"10px 0",background:B[100],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Ico i={I.minus} s={15} c={B[800]} /></button>
                    <span style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:B[800],background:B[0],fontFamily:"monospace" }}>{q}</span>
                    <button onClick={()=>add(p.id)} style={{ flex:1,padding:"10px 0",background:B[800],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Ico i={I.plus} s={15} c={B[0]} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carrinho flutuante */}
      {count>0 && (
        <button onClick={()=>setScreen("cart")} style={{ position:"sticky",bottom:0,width:"100%",background:B[800],color:B[0],border:"none",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <Ico i={I.cart} s={24} c={B[0]} />
              <div style={{ position:"absolute",top:-6,right:-6,width:18,height:18,background:B[500],borderRadius:"50%",fontSize:10,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center" }}>{count}</div>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:10, color:B[300] }}>{count} item{count!==1?"s":""}</div>
              <div style={{ fontSize:16, fontWeight:900, fontVariantNumeric:"tabular-nums" }}>{fmt(total)}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:800 }}>
            Ver carrinho <Ico i={I.back} s={16} c={B[0]} style={{ transform:"scaleX(-1)" }} />
          </div>
        </button>
      )}
    </div>
  );
}

// ─── Page: CONVERSAS ──────────────────────────
function Conversas() {
  const [activeId, setActiveId] = useState(null);
  const [msgs, setMsgs]         = useState({...CHATS_DATA});
  const [input, setInput]       = useState("");
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,activeId]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    setMsgs(m=>({...m,[activeId]:[...(m[activeId]||[]),{f:"m",t:input,h:now}]}));
    setInput("");
  };

  const ac = CLIENTS.find(c=>c.id===activeId);

  // Chat aberto
  if (activeId) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ background:B[800], padding:"12px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <button onClick={()=>setActiveId(null)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:4 }}><Ico i={I.back} s={22} c={B[0]} /></button>
        <Av lbl={ac?.av} sz={34} bg={B[600]} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:B[0] }}>{ac?.name}</div>
          <div style={{ fontSize:10, color:B[300] }}>{ac?.city} · {ac?.stage}</div>
        </div>
        <button style={{ padding:"7px 12px",background:B[600],color:B[0],border:"none",fontSize:10,fontWeight:800,cursor:"pointer" }}>
          Orçamento
        </button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 14px", background:B[50], display:"flex", flexDirection:"column", gap:8 }}>
        {(msgs[activeId]||[]).map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.f==="m"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"75%", padding:"10px 13px", background:m.f==="m"?B[800]:B[0], border:m.f==="m"?"none":`1px solid ${B[200]}` }}>
              <div style={{ fontSize:13, color:m.f==="m"?B[0]:B[800], whiteSpace:"pre-wrap", lineHeight:1.5 }}>{m.t}</div>
              <div style={{ fontSize:10, color:m.f==="m"?B[300]:B[400], marginTop:5, textAlign:"right" }}>{m.h}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ background:B[0], padding:"10px 14px", display:"flex", gap:8, borderTop:`1px solid ${B[150]}`, flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Digite uma mensagem..." style={{ flex:1,padding:"11px 13px",border:`1px solid ${B[200]}`,background:B[50],fontSize:13,color:B[800],outline:"none",fontFamily:"inherit" }} />
        <button onClick={send} style={{ width:44,height:44,background:B[800],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
          <Ico i={I.send} s={17} c={B[0]} />
        </button>
      </div>
    </div>
  );

  // Lista
  return (
    <div>
      {CLIENTS.map(c=>{
        const last = (msgs[c.id]||[]).at(-1);
        return (
          <div key={c.id} onClick={()=>setActiveId(c.id)} style={{ display:"flex", gap:12, padding:"14px 16px", background:B[0], borderBottom:`1px solid ${B[100]}`, cursor:"pointer", alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <Av lbl={c.av} sz={44} bg={B[800]} />
              {c.unread>0 && <div style={{ position:"absolute",top:-3,right:-3,width:18,height:18,background:B[500],borderRadius:"50%",fontSize:10,fontWeight:900,color:B[0],display:"flex",alignItems:"center",justifyContent:"center" }}>{c.unread}</div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</span>
                <span style={{ fontSize:11, color:B[400] }}>há {c.last}</span>
              </div>
              <div style={{ fontSize:12, color:B[500], overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {last?.t?.split("\n")[0] || "—"}
              </div>
              <div style={{ marginTop:5 }}>
                <span style={{ fontSize:9, fontWeight:800, padding:"2px 7px", textTransform:"uppercase", letterSpacing:.5, background:B[150], color:B[700] }}>{c.stage}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page: CLIENTES ───────────────────────────
function Clientes() {
  return (
    <div>
      {["Fechamento","Negociação","Proposta","Qualificado","Prospect"].map(stage=>{
        const cs = CLIENTS.filter(c=>c.stage===stage);
        if (!cs.length) return null;
        return (
          <div key={stage} style={{ marginBottom:1 }}>
            <div style={{ padding:"10px 16px", background:B[800], display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, fontWeight:800, color:B[0], textTransform:"uppercase", letterSpacing:.8 }}>{stage}</span>
              <span style={{ fontSize:10, fontWeight:800, background:"rgba(255,255,255,0.15)", color:B[0], padding:"2px 8px" }}>{cs.length}</span>
            </div>
            {cs.map(c=>(
              <div key={c.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:"14px 16px", display:"flex", gap:12, alignItems:"center" }}>
                <Av lbl={c.av} sz={40} bg={B[700]} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</div>
                  <div style={{ fontSize:11, color:B[500], marginTop:2 }}>{c.city}</div>
                  {c.val>0 && <div style={{ fontSize:14, fontWeight:900, color:B[800], marginTop:6, fontVariantNumeric:"tabular-nums" }}>{fmt(c.val)}</div>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <button style={{ padding:"8px 12px",background:B[800],color:B[0],border:"none",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4 }}>
                    <Ico i={I.chat} s={13} c={B[0]} /> Chat
                  </button>
                  <button style={{ padding:"7px 12px",background:B[50],color:B[700],border:`1px solid ${B[200]}`,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4 }}>
                    <Ico i={I.file} s={13} c={B[700]} /> Orçar
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page: MAIS (metas + gestão) ──────────────
function Mais() {
  const [sub, setSub] = useState("metas");
  return (
    <div>
      <div style={{ background:B[0], display:"flex", borderBottom:`1px solid ${B[150]}` }}>
        {[["metas","Metas"],["gestao","Gestão"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSub(id)} style={{ flex:1, padding:"14px", background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:sub===id?800:500, color:sub===id?B[800]:B[400], borderBottom:sub===id?`2px solid ${B[800]}`:"2px solid transparent", marginBottom:-1 }}>{lbl}</button>
        ))}
      </div>

      {sub==="metas" && (
        <div>
          {/* Meta principal */}
          <div style={{ background:B[0], padding:"20px 16px", borderBottom:`1px solid ${B[150]}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.7, marginBottom:4 }}>Meta Junho 2025</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:28, fontWeight:900, color:B[800] }}>R$55k <span style={{ fontSize:14, color:B[400], fontWeight:500 }}>/ R$60k</span></div>
              <div style={{ fontSize:24, fontWeight:900, color:B[800] }}>91%</div>
            </div>
            <div style={{ background:B[150], height:10 }}>
              <div style={{ width:"91%", height:10, background:B[800] }} />
            </div>
            <div style={{ fontSize:12, color:B[500], marginTop:8 }}>Faltam R$5.000 para bater a meta</div>
          </div>
          {/* KPIs de meta */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:B[200] }}>
            {[["Visitas","21","25"],["Propostas","14","20"],["Fechamentos","18","22"],["NPS","82","—"]].map(([l,v,m])=>(
              <div key={l} style={{ background:B[0], padding:"16px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[600], textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>{l}</div>
                <div style={{ fontSize:26, fontWeight:900, color:B[800] }}>{v}<span style={{ fontSize:12, color:B[400], fontWeight:500 }}>/{m}</span></div>
                {m!=="—" && <div style={{ background:B[150], height:4, marginTop:8 }}><div style={{ width:`${pct(+v,+m)}%`, height:4, background:B[800] }} /></div>}
              </div>
            ))}
          </div>
          {/* Gráfico semana */}
          <div style={{ background:B[0], padding:"16px 16px 8px", margin:"1px 0" }}>
            <div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6, marginBottom:12 }}>Vendas esta semana</div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={[{d:"Seg",v:8200},{d:"Ter",v:12400},{d:"Qua",v:6800},{d:"Qui",v:15000},{d:"Sex",v:9100},{d:"Sáb",v:3500}]}>
                <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={B[800]} stopOpacity={0.15}/><stop offset="95%" stopColor={B[800]} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
                <XAxis dataKey="d" tick={{ fontSize:10, fill:B[400] }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:9, fill:B[400] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:11 }} />
                <Area type="monotone" dataKey="v" stroke={B[800]} strokeWidth={2} fill="url(#ag)" name="Vendas" dot={{ fill:B[800], r:3, strokeWidth:0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {sub==="gestao" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:B[200] }}>
            {[["Pipeline total","R$147k","6 oportunidades"],["Ticket médio","R$18k","+12% vs maio"],["Ciclo de venda","18 dias","Média fechamento"],["Conversão","34%","+6pp vs maio"],["Msgs WhatsApp","312","Enviadas em jun"],["Clientes ativos","8","3 prospects"]].map(([l,v,s])=>(
              <div key={l} style={{ background:B[0], padding:"16px", borderTop:`3px solid ${B[800]}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[600], textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>{l}</div>
                <div style={{ fontSize:22, fontWeight:900, color:B[800], letterSpacing:-1 }}>{v}</div>
                <div style={{ fontSize:11, color:B[400], marginTop:4 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Orçamentos */}
          <div style={{ background:B[0], margin:"1px 0" }}>
            <div style={{ padding:"14px 16px 0", fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6 }}>Orçamentos pendentes</div>
            {[
              {n:"#2847",c:"Metalúrgica Pinheiro",v:14250,s:"Aguardando"},
              {n:"#2848",c:"Construtora Lima",    v:67000,s:"Aprovado"  },
              {n:"#2849",c:"EletroSul Comercial", v:22100,s:"Em revisão"},
              {n:"#2850",c:"AutoPeças Central",   v:4300, s:"Aguardando"},
            ].map((o,i)=>(
              <div key={i} style={{ padding:"12px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:B[600], fontFamily:"monospace" }}>{o.n}</div>
                  <div style={{ fontSize:12, color:B[700], marginTop:1 }}>{o.c}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(o.v)}</div>
                  <span style={{ fontSize:9, fontWeight:800, padding:"2px 7px", textTransform:"uppercase", letterSpacing:.5, background:o.s==="Aprovado"?B[150]:B[100], color:o.s==="Aprovado"?B[700]:B[500] }}>{o.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────
const TABS = [
  { id:"home",       label:"Início",    icon:I.home  },
  { id:"pedidos",    label:"Pedidos",   icon:I.cart  },
  { id:"conversas",  label:"Chat",      icon:I.chat  },
  { id:"clientes",   label:"Clientes",  icon:I.users },
  { id:"mais",       label:"Mais",      icon:I.bar   },
];

// ─── APP SHELL ────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");

  const pageTitle = { home:"Início", pedidos:"Tirar Pedido", conversas:"Conversas", clientes:"Clientes", mais:"Mais" };

  const renderPage = () => {
    if (tab==="home")      return <Home />;
    if (tab==="pedidos")   return <Pedidos />;
    if (tab==="conversas") return <Conversas />;
    if (tab==="clientes")  return <Clientes />;
    if (tab==="mais")      return <Mais />;
  };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:B[50], height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden", maxWidth:430, margin:"0 auto" }}>

      {/* ── Header ── */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px 8px" }}>
          {/* Logo */}
          <img
            src="/logo.svg"
            alt="CRepresentante"
            style={{ height:32, objectFit:"contain" }}
            onError={e=>{
              e.target.style.display="none";
              document.getElementById("logo-fallback").style.display="flex";
            }}
          />
          <div id="logo-fallback" style={{ display:"none", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, background:B[800], display:"flex", alignItems:"center", justifyContent:"center" }}><Ico i={I.bar} s={16} c={B[0]} /></div>
            <span style={{ fontSize:15, fontWeight:900, color:B[800], letterSpacing:-.3 }}>CRepresentante</span>
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <button style={{ background:"none", border:"none", cursor:"pointer", position:"relative", display:"flex", padding:4 }}>
              <Ico i={I.bell} s={22} c={B[600]} />
              <div style={{ position:"absolute", top:2, right:2, width:8, height:8, background:"#ef4444", borderRadius:"50%", border:`2px solid ${B[0]}` }} />
            </button>
            <Av lbl="CS" sz={32} bg={B[800]} />
          </div>
        </div>

        {/* Page label */}
        <div style={{ padding:"0 16px 10px", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:11, fontWeight:800, color:B[800], textTransform:"uppercase", letterSpacing:.8 }}>{pageTitle[tab]}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
        {renderPage()}
      </div>

      {/* ── Bottom Tab Bar ── */}
      <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, display:"flex", flexShrink:0 }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 0 12px", background:"none", border:"none", cursor:"pointer", position:"relative" }}>
            {tab===t.id && <div style={{ position:"absolute", top:0, left:"22%", right:"22%", height:2, background:B[800] }} />}
            <span style={{ display:"flex", color:tab===t.id?B[800]:B[300], transition:"color .1s" }}>
              <Ico i={t.icon} s={tab===t.id?22:20} c={tab===t.id?B[800]:B[300]} />
            </span>
            <span style={{ fontSize:9, fontWeight:tab===t.id?800:500, color:tab===t.id?B[800]:B[400], letterSpacing:.2 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
