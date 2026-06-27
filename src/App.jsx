import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

// ─────────────────────────────────────────────
// DESIGN SYSTEM — azul e branco, sem bordas
// arredondadas, sem emojis
// ─────────────────────────────────────────────
const B = {
  950: "#060F20",
  900: "#0A1A36",
  800: "#0F2244",
  700: "#1A3560",
  600: "#1D4ED8",
  500: "#2563EB",
  400: "#3B82F6",
  300: "#93C5FD",
  200: "#BFDBFE",
  150: "#DBEAFE",
  100: "#EFF6FF",
  50:  "#F5F8FF",
  0:   "#FFFFFF",
};

// ─────────────────────────────────────────────
// SVG ICON LIBRARY
// ─────────────────────────────────────────────
const Ic = {
  home:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chat:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  users:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  target:  (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  bar:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  calendar:(s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="0" ry="0"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  file:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  dollar:  (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  clock:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trend:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  send:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search:  (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  check:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  funnel:  (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  eye:     (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  pack:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  chevL:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:   (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  map:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  list:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  grid:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const CLIENTS = [
  { id:1, name:"Metalúrgica Pinheiro", phone:"(31)99201-4455", stage:"Fechamento",  value:28500, city:"Belo Horizonte", avatar:"MP", last:"há 2h",  unread:3, prospect:false },
  { id:2, name:"Distribuidora Alves",  phone:"(31)98800-2211", stage:"Proposta",    value:15200, city:"Contagem",       avatar:"DA", last:"há 1d",  unread:0, prospect:false },
  { id:3, name:"Ferragens Monteiro",   phone:"(31)97700-3344", stage:"Negociação",  value:9800,  city:"Betim",          avatar:"FM", last:"há 3h",  unread:1, prospect:false },
  { id:4, name:"Grupo Savassi",        phone:"(31)99900-5566", stage:"Prospect",    value:0,     city:"Belo Horizonte", avatar:"GS", last:"há 5d",  unread:0, prospect:true  },
  { id:5, name:"AutoPeças Central",    phone:"(31)98100-7788", stage:"Qualificado", value:4300,  city:"Vespasiano",     avatar:"AC", last:"há 30m", unread:5, prospect:false },
  { id:6, name:"Construtora Lima",     phone:"(31)96600-9900", stage:"Fechamento",  value:67000, city:"Nova Lima",      avatar:"CL", last:"há 1h",  unread:2, prospect:false },
  { id:7, name:"MadeiraMad Premium",   phone:"(31)95500-1122", stage:"Prospect",    value:0,     city:"Sabará",         avatar:"MM", last:"há 2d",  unread:0, prospect:true  },
  { id:8, name:"EletroSul Comercial",  phone:"(31)94400-3344", stage:"Proposta",    value:22100, city:"Belo Horizonte", avatar:"EC", last:"há 6h",  unread:0, prospect:false },
];
const STAGES = ["Prospect","Qualificado","Proposta","Negociação","Fechamento"];
const PRODUCTS = [
  { id:"P01", name:"Válvula V200",           price:285,  stock:120, unit:"un" },
  { id:"P02", name:"Rolamento 6205",          price:42,   stock:48,  unit:"un" },
  { id:"P03", name:"Rolamento 6305",          price:58,   stock:12,  unit:"un" },
  { id:"P04", name:"Parafuso Sextavado M12",  price:1.80, stock:5000,unit:"cx" },
  { id:"P05", name:"Correia Dentada T5",      price:34,   stock:200, unit:"un" },
  { id:"P06", name:"Mangueira Hidráulica 3/4",price:28.5, stock:300, unit:"mt" },
];
const CHATS = {
  1:[
    { from:"c", text:"Bom dia! Preciso do orçamento daquelas válvulas industriais.", time:"09:14" },
    { from:"m", text:"Bom dia, Dr. Pinheiro! Claro, vou gerar agora pelo sistema.", time:"09:15" },
    { from:"m", text:"Orçamento #2847 enviado via ERP\n• 50x Válvula V200 — R$ 285,00/un\n• Total: R$ 14.250,00\n• Validade: 10 dias", time:"09:16" },
    { from:"c", text:"Perfeito. Podem incluir mais 20 unidades?", time:"09:31" },
    { from:"m", text:"Com 70 unidades o preço cai para R$ 270/un. Total R$ 18.900. Atualizo o orçamento?", time:"09:33" },
    { from:"c", text:"Sim! E qual o prazo de entrega?", time:"09:45" },
  ],
  5:[
    { from:"c", text:"Oi, quero ver o catálogo de rolamentos.", time:"14:02" },
    { from:"m", text:"Boa tarde! Vou te enviar o catálogo atualizado.", time:"14:03" },
    { from:"c", text:"Preciso de algo para esta semana, tem estoque?", time:"14:10" },
    { from:"c", text:"Especialmente rolamento 6205 e 6305.", time:"14:11" },
    { from:"m", text:"6205 — 48 un. em BH. 6305 — 12 un. Faço a reserva?", time:"14:15" },
  ],
  3:[
    { from:"c", text:"Proposta enviada semana passada, conseguiu revisar?", time:"11:00" },
    { from:"m", text:"Sim! A gestão aprovou o desconto adicional de 5%. Posso fechar hoje?", time:"11:05" },
    { from:"c", text:"Ótimo! Mas precisamos parcelar em 3x sem juros.", time:"11:20" },
    { from:"m", text:"Parcelado em 3x fica R$ 3.266,67/mês. Gerando contrato via sistema.", time:"11:22" },
  ],
  6:[
    { from:"c", text:"Bom dia, quando chegam os materiais para obra?", time:"08:30" },
    { from:"m", text:"Bom dia! Previsão de entrega: 02/07. Estou acompanhando com a logística.", time:"08:45" },
    { from:"c", text:"Perfeito. Pode adiantar mais 5 toneladas de aço?", time:"09:10" },
  ],
};
const MONTH_DATA = [
  { mes:"Jan", vendas:42000, meta:50000 },
  { mes:"Fev", vendas:58000, meta:50000 },
  { mes:"Mar", vendas:47000, meta:55000 },
  { mes:"Abr", vendas:63000, meta:55000 },
  { mes:"Mai", vendas:71000, meta:60000 },
  { mes:"Jun", vendas:55000, meta:60000 },
];
const WEEK_DATA = [
  { d:"Seg", v:8200 },{ d:"Ter", v:12400 },{ d:"Qua", v:6800 },
  { d:"Qui", v:15000 },{ d:"Sex", v:9100 },{ d:"Sáb", v:3500 },
];
const CONV_DATA = [
  { mes:"Jan", taxa:28, pedidos:32 },{ mes:"Fev", taxa:35, pedidos:41 },
  { mes:"Mar", taxa:30, pedidos:36 },{ mes:"Abr", taxa:38, pedidos:48 },
  { mes:"Mai", taxa:42, pedidos:55 },{ mes:"Jun", taxa:34, pedidos:44 },
];
const VISITS = [
  { client:"Metalúrgica Pinheiro", date:"Hoje — 14h00",    type:"Presencial", ok:true  },
  { client:"Construtora Lima",     date:"Amanhã — 10h00",  type:"Videocall",  ok:true  },
  { client:"EletroSul Comercial",  date:"Sex — 09h00",     type:"Presencial", ok:false },
];
const ORCAMENTOS = [
  { num:"#2847", client:"Metalúrgica Pinheiro", val:14250, date:"23/06", dias:4, status:"Aguardando" },
  { num:"#2848", client:"Construtora Lima",     val:67000, date:"22/06", dias:5, status:"Aprovado"   },
  { num:"#2849", client:"EletroSul Comercial",  val:22100, date:"20/06", dias:7, status:"Em revisão" },
  { num:"#2850", client:"AutoPeças Central",    val:4300,  date:"19/06", dias:8, status:"Aguardando" },
  { num:"#2851", client:"Distribuidora Alves",  val:15200, date:"18/06", dias:9, status:"Expirado"   },
];
const TEAM = [
  { name:"Ana Souza",      total:71000 },
  { name:"Patrícia M.",    total:63000 },
  { name:"Carlos Souza",   total:55000, me:true },
  { name:"Rui Costa",      total:48000 },
  { name:"Lucas B.",       total:39000 },
];

const fmt = n => "R$ " + n.toLocaleString("pt-BR");
const pct = (a,b) => Math.round(a/b*100);

// ─────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────
const Avatar = ({ label, size=36, bg=B[700] }) => (
  <div style={{
    width:size, height:size, background:bg, color:B[0],
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.33, fontWeight:700, flexShrink:0, letterSpacing:.5,
  }}>{label}</div>
);

const Chip = ({ label, variant="default" }) => {
  const v = {
    default:  { bg:B[100],   color:B[700] },
    blue:     { bg:B[150],   color:B[600] },
    warn:     { bg:"#FFF7ED",color:"#B45309" },
    danger:   { bg:"#FFF1F2",color:"#BE123C" },
    success:  { bg:"#F0FDF4",color:"#16A34A" },
  }[variant];
  return (
    <span style={{
      fontSize:10, fontWeight:700, padding:"2px 8px",
      letterSpacing:.6, textTransform:"uppercase",
      background:v.bg, color:v.color,
    }}>{label}</span>
  );
};

const KpiBlock = ({ label, value, sub, icon, delta, accent=false }) => (
  <div style={{
    background:B[0], borderTop:`3px solid ${accent ? B[500] : B[200]}`,
    border:`1px solid ${B[200]}`, padding:"18px 20px",
    display:"flex", flexDirection:"column", gap:10,
  }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:1 }}>{label}</span>
      <span style={{ color: accent ? B[500] : B[400], display:"flex" }}>{icon(18)}</span>
    </div>
    <div style={{ fontSize:26, fontWeight:800, color:B[800], letterSpacing:-1, fontVariantNumeric:"tabular-nums" }}>{value}</div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:11, color:B[700] }}>{sub}</span>
      {delta && (
        <span style={{
          fontSize:10, fontWeight:700, padding:"2px 7px",
          background: delta[0]==="+"?B[150]:"#FFF1F2",
          color:      delta[0]==="+"?B[600]:"#BE123C",
        }}>{delta}</span>
      )}
    </div>
  </div>
);

const PanelHead = ({ icon, title, right }) => (
  <div style={{
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"14px 20px", borderBottom:`1px solid ${B[150]}`,
  }}>
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ color:B[500], display:"flex" }}>{icon(15)}</span>
      <span style={{ fontSize:11, fontWeight:700, color:B[800], textTransform:"uppercase", letterSpacing:.9 }}>{title}</span>
    </div>
    {right}
  </div>
);

const Btn = ({ children, onClick, variant="outline", size="sm" }) => {
  const p = size==="sm" ? "5px 14px" : "9px 20px";
  const styles = {
    solid:   { background:B[500], color:B[0],   border:`1px solid ${B[500]}` },
    outline: { background:B[0],   color:B[600],  border:`1px solid ${B[300]}` },
    ghost:   { background:B[100], color:B[700],  border:`1px solid ${B[100]}` },
  }[variant];
  return (
    <button onClick={onClick} style={{
      ...styles, padding:p, fontSize:11, fontWeight:700,
      letterSpacing:.4, cursor:"pointer", fontFamily:"inherit",
      display:"flex", alignItems:"center", gap:5,
    }}>{children}</button>
  );
};

// ─────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────
function Dashboard() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:1 }}>

      {/* Hero strip */}
      <div style={{ background:B[800], padding:"28px 32px", display:"flex", gap:48, alignItems:"flex-end", flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:11, color:B[300], fontWeight:600, letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Resultados — Junho 2025</div>
          <div style={{ fontSize:11, color:B[400], marginBottom:2 }}>Realizado</div>
          <div style={{ fontSize:40, fontWeight:900, color:B[0], letterSpacing:-2, lineHeight:1 }}>R$ 55.000</div>
        </div>
        <div style={{ paddingBottom:4 }}>
          <div style={{ fontSize:11, color:B[400], marginBottom:2 }}>Meta</div>
          <div style={{ fontSize:28, fontWeight:700, color:B[300], letterSpacing:-1 }}>R$ 60.000</div>
        </div>
        <div style={{ flex:1, minWidth:200, paddingBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:11, color:B[400] }}>Atingimento</span>
            <span style={{ fontSize:13, fontWeight:800, color:B[200] }}>91,7%</span>
          </div>
          <div style={{ background:B[700], height:6 }}>
            <div style={{ width:"91.7%", height:6, background:B[400] }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:24, paddingBottom:4 }}>
          <div><div style={{ fontSize:10, color:B[400], letterSpacing:.5 }}>CONVERSÃO</div><div style={{ fontSize:20, fontWeight:800, color:B[0] }}>34%</div></div>
          <div><div style={{ fontSize:10, color:B[400], letterSpacing:.5 }}>TICKET MÉDIO</div><div style={{ fontSize:20, fontWeight:800, color:B[0] }}>R$18k</div></div>
          <div><div style={{ fontSize:10, color:B[400], letterSpacing:.5 }}>PEDIDOS</div><div style={{ fontSize:20, fontWeight:800, color:B[0] }}>18</div></div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:B[150] }}>
        <KpiBlock label="Visitas marcadas"    value="8"    sub="3 esta semana"       icon={Ic.calendar} accent delta="+2" />
        <KpiBlock label="Orçamentos abertos"  value="14"   sub="R$ 142.800 em aberto" icon={Ic.file}     accent delta="+3" />
        <KpiBlock label="Contratos p/ fechar" value="3"    sub="R$ 97.500"           icon={Ic.check}    accent delta="este mês" />
        <KpiBlock label="NPS clientes"        value="82"   sub="Excelente"           icon={Ic.trend}    accent delta="+4pp" />
      </div>

      {/* Charts + Sidebar */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:1, background:B[150], marginTop:1 }}>

        {/* Main chart */}
        <div style={{ background:B[0] }}>
          <PanelHead icon={Ic.bar} title="Vendas vs Meta — 2025" />
          <div style={{ padding:"20px 20px 12px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTH_DATA} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
                <XAxis dataKey="mes" tick={{ fontSize:11, fill:B[700] }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:B[700] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} />
                <Bar dataKey="meta"   fill={B[150]} name="Meta"   radius={[0,0,0,0]} />
                <Bar dataKey="vendas" fill={B[500]} name="Vendas" radius={[0,0,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display:"flex", flexDirection:"column", gap:1 }}>

          {/* Visits */}
          <div style={{ background:B[0] }}>
            <PanelHead icon={Ic.calendar} title="Próximas Visitas" />
            <div style={{ padding:0 }}>
              {VISITS.map((v,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", borderBottom: i<VISITS.length-1?`1px solid ${B[100]}`:undefined }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:B[800] }}>{v.client}</div>
                    <div style={{ fontSize:11, color:B[600], marginTop:2 }}>{v.date} · {v.type}</div>
                  </div>
                  <Chip label={v.ok?"Confirmado":"Pendente"} variant={v.ok?"blue":"warn"} />
                </div>
              ))}
            </div>
          </div>

          {/* Orçamentos pendentes */}
          <div style={{ background:B[0], flex:1 }}>
            <PanelHead icon={Ic.file} title="Orçamentos Abertos" />
            <div>
              {ORCAMENTOS.slice(0,4).map((o,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 20px", borderBottom:i<3?`1px solid ${B[100]}`:undefined }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:B[500], fontVariantNumeric:"tabular-nums" }}>{o.num}</div>
                    <div style={{ fontSize:11, color:B[700] }}>{o.client}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:12, fontWeight:800, color:B[800] }}>{fmt(o.val)}</div>
                    <Chip label={o.status} variant={o.status==="Aprovado"?"success":o.status==="Em revisão"?"warn":"default"} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EXTRA DATA — agenda + ERP
// ─────────────────────────────────────────────
const AGENDA = [
  { id:1, client:"Metalúrgica Pinheiro", date:"Hoje",    time:"14h00", type:"Presencial", status:"confirmado", origin:"plataforma", avatar:"MP" },
  { id:2, client:"Construtora Lima",     date:"Amanhã",  time:"10h00", type:"Videocall",  status:"confirmado", origin:"erp",        avatar:"CL" },
  { id:3, client:"EletroSul Comercial",  date:"Sex 27",  time:"09h00", type:"Presencial", status:"pendente",   origin:"plataforma", avatar:"EC" },
  { id:4, client:"AutoPeças Central",    date:"Sex 27",  time:"14h30", type:"Ligação",    status:"confirmado", origin:"erp",        avatar:"AC" },
  { id:5, client:"Ferragens Monteiro",   date:"Seg 30",  time:"11h00", type:"Presencial", status:"pendente",   origin:"plataforma", avatar:"FM" },
  { id:6, client:"Distribuidora Alves",  date:"Ter 01",  time:"16h00", type:"Videocall",  status:"confirmado", origin:"erp",        avatar:"DA" },
];

const PEDIDOS_HIST = {
  1: [
    { num:"#1198", val:14250, date:"10/06", status:"entregue", origin:"plataforma" },
    { num:"#1145", val:8900,  date:"22/05", status:"entregue", origin:"erp"        },
    { num:"#1089", val:21000, date:"03/05", status:"entregue", origin:"erp"        },
  ],
  5: [
    { num:"#1201", val:4300,  date:"15/06", status:"entregue", origin:"plataforma" },
    { num:"#1167", val:2100,  date:"01/06", status:"entregue", origin:"plataforma" },
  ],
  3: [
    { num:"#1195", val:9800,  date:"12/06", status:"em andamento", origin:"erp"   },
  ],
  6: [
    { num:"#1200", val:67000, date:"14/06", status:"em andamento", origin:"erp"   },
    { num:"#1150", val:31000, date:"25/05", status:"entregue",     origin:"plataforma" },
  ],
};

const CLIENT_CHART = {
  1: [
    { mes:"Mar", real:8900,  meta:10000 },
    { mes:"Abr", real:21000, meta:15000 },
    { mes:"Mai", real:8900,  meta:18000 },
    { mes:"Jun", real:14250, meta:20000 },
  ],
  5: [
    { mes:"Mar", real:1200,  meta:3000 },
    { mes:"Abr", real:2800,  meta:3000 },
    { mes:"Mai", real:2100,  meta:4000 },
    { mes:"Jun", real:4300,  meta:4000 },
  ],
  3: [
    { mes:"Mar", real:4200,  meta:5000 },
    { mes:"Abr", real:3800,  meta:5000 },
    { mes:"Mai", real:7200,  meta:8000 },
    { mes:"Jun", real:9800,  meta:8000 },
  ],
  6: [
    { mes:"Mar", real:22000, meta:30000 },
    { mes:"Abr", real:31000, meta:30000 },
    { mes:"Mai", real:31000, meta:35000 },
    { mes:"Jun", real:67000, meta:35000 },
  ],
};

// ─────────────────────────────────────────────
// PAGE: CONVERSAS
// ─────────────────────────────────────────────
function Conversas({ isMobile }) {
  const [active, setActive]     = useState(1);
  const [input, setInput]       = useState("");
  const [msgs, setMsgs]         = useState({ ...CHATS });
  const [rightTab, setRightTab] = useState("pedido"); // pedido | graficos | agenda
  const [orderQty, setOrderQty] = useState({});
  const [discount, setDiscount] = useState(0);
  const endRef = useRef(null);
  const chatList = CLIENTS.filter(c => !c.prospect);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, active]);

  const send = text => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    setMsgs(p=>({ ...p, [active]:[...(p[active]||[]), { from:"m", text, time:now }] }));
    setInput("");
  };

  const orderLines  = Object.entries(orderQty).filter(([,q])=>q>0);
  const orderSubtotal = orderLines.reduce((a,[id,q])=>a+PRODUCTS.find(x=>x.id===id).price*q, 0);
  const orderTotal    = orderSubtotal * (1 - discount/100);

  const sendOrder = () => {
    if (!orderLines.length) return;
    const lines = orderLines.map(([id,q])=>{
      const p = PRODUCTS.find(x=>x.id===id);
      return `• ${q}x ${p.name} — ${fmt(p.price*q)}`;
    });
    const disc = discount>0 ? `\nDesconto aplicado: ${discount}%` : "";
    send(`Pedido registrado via CRepresentante\n${lines.join("\n")}${disc}\n\nTotal: ${fmt(orderTotal)}\nConfirmação enviada ao ERP automaticamente.`);
    setOrderQty({}); setDiscount(0);
  };

  const ac         = CLIENTS.find(c=>c.id===active);
  const chartData  = CLIENT_CHART[active] || CLIENT_CHART[1];
  const pedHist    = PEDIDOS_HIST[active] || [];
  const showChat   = !isMobile || active;
  const showList   = !isMobile || !active;

  const OriginBadge = ({ o }) => (
    <span style={{
      fontSize:9, fontWeight:800, letterSpacing:.7, textTransform:"uppercase",
      padding:"2px 6px",
      background: o==="erp" ? B[800] : B[150],
      color:      o==="erp" ? B[0]   : B[600],
    }}>{o==="erp" ? "ERP" : "Plataforma"}</span>
  );

  const RightTabs = () => (
    <div style={{ display:"flex", borderBottom:`1px solid ${B[150]}`, background:B[0], flexShrink:0 }}>
      {[
        ["pedido",   Ic.pack,     "Pedido"],
        ["graficos", Ic.bar,      "Gráficos"],
        ["agenda",   Ic.calendar, "Agenda"],
      ].map(([id, icon, lbl])=>(
        <button key={id} onClick={()=>setRightTab(id)} style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
          padding:"10px 6px", background:"none", border:"none", cursor:"pointer",
          fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:"uppercase",
          color:       rightTab===id ? B[500]  : B[500],
          borderBottom:rightTab===id ? `2px solid ${B[500]}` : "2px solid transparent",
          marginBottom:-1,
          opacity:     rightTab===id ? 1 : 0.45,
        }}>
          {icon(12)} {lbl}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display:"flex", height:"calc(100vh - 58px)", background:B[150] }}>

      {/* ── Col 1: Lista ── */}
      {showList && (
        <div style={{ width:isMobile?"100%":252, background:B[0], borderRight:`1px solid ${B[150]}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"12px 14px", borderBottom:`1px solid ${B[150]}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:"6px 10px" }}>
              <span style={{ color:B[400], display:"flex" }}>{Ic.search(13)}</span>
              <input placeholder="Buscar cliente..." style={{ border:"none", background:"none", outline:"none", fontSize:11, color:B[800], flex:1, fontFamily:"inherit" }} />
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {chatList.map(c=>{
              const lastMsg = (msgs[c.id]||[]).at(-1);
              const isActive = active===c.id;
              return (
                <div key={c.id} onClick={()=>setActive(c.id)} style={{
                  display:"flex", gap:10, padding:"11px 14px", cursor:"pointer",
                  background: isActive ? B[50] : B[0],
                  borderLeft:  isActive ? `3px solid ${B[500]}` : "3px solid transparent",
                  borderBottom:`1px solid ${B[100]}`,
                }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <Avatar label={c.avatar} size={36} bg={isActive?B[600]:B[700]} />
                    {c.unread>0 && (
                      <div style={{ position:"absolute", top:-3, right:-3, width:15, height:15, background:B[500], color:B[0], fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{c.unread}</div>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:B[800], overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
                      <span style={{ fontSize:9, color:B[400], flexShrink:0, marginLeft:4 }}>{c.last}</span>
                    </div>
                    <div style={{ fontSize:10, color:B[500], overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {lastMsg?.text?.split("\n")[0] || "—"}
                    </div>
                    <div style={{ marginTop:4 }}>
                      <Chip label={c.stage} variant={c.stage==="Fechamento"?"success":c.stage==="Prospect"?"default":"blue"} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Col 2: Chat ── */}
      {showChat && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          {/* Header do chat */}
          <div style={{ background:B[800], padding:"10px 18px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${B[700]}`, flexShrink:0 }}>
            {isMobile && (
              <button onClick={()=>setActive(null)} style={{ background:"none", border:"none", color:B[300], cursor:"pointer", display:"flex" }}>{Ic.chevL(18)}</button>
            )}
            <Avatar label={ac?.avatar} size={32} bg={B[500]} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:B[0] }}>{ac?.name}</div>
              <div style={{ fontSize:10, color:B[300] }}>{ac?.phone} · {ac?.city} · <span style={{ color:B[400] }}>{ac?.stage}</span></div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <Btn variant="solid" size="sm">{Ic.file(12)} Orçamento ERP</Btn>
            </div>
          </div>

          {/* Mensagens */}
          <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:8, background:B[50] }}>
            {(msgs[active]||[]).map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.from==="m"?"flex-end":"flex-start" }}>
                <div style={{
                  maxWidth:"70%", padding:"9px 13px",
                  background: m.from==="m" ? B[600] : B[0],
                  border:     m.from==="m" ? "none"  : `1px solid ${B[200]}`,
                }}>
                  <div style={{ fontSize:12, color:m.from==="m"?B[0]:B[800], whiteSpace:"pre-wrap", lineHeight:1.6 }}>{m.text}</div>
                  <div style={{ fontSize:9, color:m.from==="m"?B[300]:B[400], marginTop:5, textAlign:"right" }}>
                    {m.time}{m.from==="m"?" · enviado":""}
                    {m.erp && <span style={{ marginLeft:6, background:B[800], color:B[0], fontSize:8, fontWeight:800, padding:"1px 5px" }}>ERP</span>}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ background:B[0], padding:"10px 18px", display:"flex", gap:8, alignItems:"center", borderTop:`1px solid ${B[150]}`, flexShrink:0 }}>
            <input
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send(input)}
              placeholder="Digite uma mensagem..."
              style={{ flex:1, padding:"9px 13px", border:`1px solid ${B[200]}`, background:B[50], fontSize:12, color:B[800], outline:"none", fontFamily:"inherit" }}
            />
            <button onClick={()=>send(input)} style={{ width:36, height:36, background:B[500], border:"none", color:B[0], cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {Ic.send(14)}
            </button>
          </div>
        </div>
      )}

      {/* ── Col 3: Painel Direito ── */}
      {!isMobile && (
        <div style={{ width:320, background:B[0], borderLeft:`1px solid ${B[150]}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <RightTabs />

          {/* ── TAB: PEDIDO ASSISTIDO ── */}
          {rightTab==="pedido" && (
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
              {/* Cabeçalho cliente */}
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${B[100]}`, background:B[50] }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>Pedido para</div>
                <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{ac?.name}</div>
                <div style={{ fontSize:11, color:B[500], marginTop:2 }}>{ac?.stage} · {ac?.city}</div>
              </div>

              {/* Produtos */}
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${B[100]}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:10 }}>Selecionar Produtos</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {PRODUCTS.map(p=>{
                    const qty = orderQty[p.id]||0;
                    return (
                      <div key={p.id} style={{ border:`1px solid ${qty>0?B[400]:B[200]}`, background: qty>0?B[50]:B[0], padding:"9px 12px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, alignItems:"flex-start" }}>
                          <div>
                            <div style={{ fontSize:11, fontWeight:700, color:B[800] }}>{p.name}</div>
                            <div style={{ fontSize:10, color:B[500] }}>{fmt(p.price)}/{p.unit}</div>
                          </div>
                          <div style={{ fontSize:10, color:B[400], textAlign:"right" }}>
                            <div>Estoque</div>
                            <div style={{ fontWeight:700, color:p.stock<20?B[600]:B[700] }}>{p.stock} {p.unit}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <button onClick={()=>setOrderQty(q=>({...q,[p.id]:Math.max(0,(q[p.id]||0)-1)}))}
                            style={{ width:22,height:22,background:B[100],border:`1px solid ${B[200]}`,color:B[700],cursor:"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>−</button>
                          <input
                            value={qty}
                            onChange={e=>setOrderQty(q=>({...q,[p.id]:Math.max(0,parseInt(e.target.value)||0)}))}
                            style={{ width:36, textAlign:"center", border:`1px solid ${B[200]}`, padding:"2px 0", fontSize:12, fontWeight:800, color:B[800], background:B[0], outline:"none", fontFamily:"monospace" }}
                          />
                          <button onClick={()=>setOrderQty(q=>({...q,[p.id]:(q[p.id]||0)+1}))}
                            style={{ width:22,height:22,background:B[500],border:"none",color:B[0],cursor:"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>+</button>
                          {qty>0 && <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:B[600], fontVariantNumeric:"tabular-nums" }}>{fmt(p.price*qty)}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desconto */}
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${B[100]}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Desconto comercial</div>
                <div style={{ display:"flex", gap:6 }}>
                  {[0,3,5,8,10].map(d=>(
                    <button key={d} onClick={()=>setDiscount(d)} style={{
                      flex:1, padding:"5px 0", fontSize:10, fontWeight:700, cursor:"pointer",
                      background: discount===d ? B[500] : B[50],
                      color:      discount===d ? B[0]   : B[600],
                      border:     `1px solid ${discount===d ? B[500] : B[200]}`,
                    }}>{d}%</button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              {orderLines.length>0 && (
                <div style={{ padding:"12px 16px", background:B[50], borderBottom:`1px solid ${B[150]}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Resumo do Pedido</div>
                  {orderLines.map(([id,q])=>{
                    const p=PRODUCTS.find(x=>x.id===id);
                    return <div key={id} style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:B[700], marginBottom:4 }}>
                      <span>{q}x {p.name}</span><span style={{ fontWeight:700 }}>{fmt(p.price*q)}</span>
                    </div>;
                  })}
                  {discount>0 && <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:B[600], borderTop:`1px solid ${B[200]}`, paddingTop:6, marginTop:4 }}>
                    <span>Desconto {discount}%</span><span>− {fmt(orderSubtotal*discount/100)}</span>
                  </div>}
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, fontWeight:800, color:B[800], borderTop:`1px solid ${B[300]}`, paddingTop:8, marginTop:6 }}>
                    <span>Total</span><span style={{ fontVariantNumeric:"tabular-nums" }}>{fmt(orderTotal)}</span>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:6 }}>
                <button onClick={sendOrder} disabled={!orderLines.length} style={{
                  padding:"10px", background: orderLines.length?B[500]:B[200], color:B[0], border:"none",
                  fontSize:11, fontWeight:700, cursor:orderLines.length?"pointer":"default", letterSpacing:.4,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                }}>{Ic.send(13)} Enviar Pedido + Mensagem WhatsApp</button>
                <button onClick={sendOrder} disabled={!orderLines.length} style={{
                  padding:"10px", background:B[0], color:B[600], border:`1px solid ${B[300]}`,
                  fontSize:11, fontWeight:700, cursor:orderLines.length?"pointer":"default", letterSpacing:.4,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                }}>
                  <span style={{ fontSize:9, fontWeight:800, background:B[800], color:B[0], padding:"2px 5px" }}>ERP</span>
                  Gerar no ERP apenas
                </button>
              </div>

              {/* Histórico */}
              {pedHist.length>0 && (
                <div style={{ borderTop:`1px solid ${B[100]}`, padding:"12px 16px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Pedidos anteriores</div>
                  {pedHist.map((p,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:i<pedHist.length-1?`1px solid ${B[100]}`:undefined }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:700, color:B[600] }}>{p.num}</div>
                        <div style={{ fontSize:10, color:B[500] }}>{p.date}</div>
                      </div>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <span style={{ fontSize:11, fontWeight:700, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(p.val)}</span>
                        <span style={{ fontSize:9, fontWeight:800, padding:"2px 6px", textTransform:"uppercase",
                          background: p.origin==="erp"?B[800]:B[150],
                          color:      p.origin==="erp"?B[0]:B[600] }}>{p.origin==="erp"?"ERP":"Site"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: GRÁFICOS ── */}
          {rightTab==="graficos" && (
            <div style={{ flex:1, overflowY:"auto" }}>
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${B[100]}`, background:B[50] }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8 }}>Performance do cliente</div>
                <div style={{ fontSize:13, fontWeight:700, color:B[800], marginTop:2 }}>{ac?.name}</div>
              </div>

              {/* Gráfico meta vs realizado */}
              <div style={{ padding:"16px 16px 8px", borderBottom:`1px solid ${B[100]}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>Compras vs Meta Mensal</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} barSize={14} barGap={2}>
                    <CartesianGrid strokeDasharray="2 4" stroke={B[100]} />
                    <XAxis dataKey="mes" tick={{ fontSize:10, fill:B[600] }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:9, fill:B[600] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                    <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:11 }} />
                    <Bar dataKey="meta" fill={B[150]} name="Meta" />
                    <Bar dataKey="real" fill={B[500]} name="Realizado" />
                  </BarChart>
                </ResponsiveContainer>
                {/* legenda */}
                <div style={{ display:"flex", gap:16, marginTop:8 }}>
                  {[["Meta",B[150]],["Realizado",B[500]]].map(([l,c])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:B[600] }}>
                      <div style={{ width:10, height:10, background:c }} />{l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evolução linha */}
              <div style={{ padding:"14px 16px 8px", borderBottom:`1px solid ${B[100]}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>Evolução de compras</div>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={B[500]} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={B[500]} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke={B[100]} />
                    <XAxis dataKey="mes" tick={{ fontSize:10, fill:B[600] }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:9, fill:B[600] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                    <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:11 }} />
                    <Area type="monotone" dataKey="real" stroke={B[500]} strokeWidth={2} fill="url(#rg)" name="Realizado" dot={{ fill:B[500], r:3, strokeWidth:0 }} />
                    <Line type="monotone" dataKey="meta" stroke={B[300]} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Meta" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* KPIs do cliente */}
              <div style={{ padding:"14px 16px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:10 }}>Resumo do cliente</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { l:"Total comprado",   v:fmt(chartData.reduce((a,d)=>a+d.real,0)) },
                    { l:"Atingimento",       v:`${pct(chartData.reduce((a,d)=>a+d.real,0), chartData.reduce((a,d)=>a+d.meta,0))}%` },
                    { l:"Pedidos no período",v:`${pedHist.length} pedidos` },
                    { l:"Ticket médio",      v:pedHist.length?fmt(pedHist.reduce((a,p)=>a+p.val,0)/pedHist.length):"—" },
                  ].map(({ l,v })=>(
                    <div key={l} style={{ background:B[50], border:`1px solid ${B[150]}`, borderTop:`2px solid ${B[500]}`, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:B[600], textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{l}</div>
                      <div style={{ fontSize:14, fontWeight:800, color:B[800], fontVariantNumeric:"tabular-nums" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Origem dos pedidos */}
                {pedHist.length>0 && (
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Origem dos pedidos</div>
                    {(() => {
                      const erp  = pedHist.filter(p=>p.origin==="erp").length;
                      const site = pedHist.filter(p=>p.origin==="plataforma").length;
                      const tot  = pedHist.length;
                      return (
                        <div>
                          <div style={{ display:"flex", height:20, overflow:"hidden", marginBottom:6 }}>
                            <div style={{ width:`${pct(erp,tot)}%`, background:B[800], display:"flex", alignItems:"center", justifyContent:"center" }}>
                              {erp>0 && <span style={{ fontSize:9, color:B[0], fontWeight:700 }}>ERP {pct(erp,tot)}%</span>}
                            </div>
                            <div style={{ flex:1, background:B[400], display:"flex", alignItems:"center", justifyContent:"center" }}>
                              {site>0 && <span style={{ fontSize:9, color:B[0], fontWeight:700 }}>Plataforma {pct(site,tot)}%</span>}
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:12 }}>
                            {[["ERP",erp,B[800]],["Plataforma",site,B[400]]].map(([l,n,c])=>(
                              <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:B[600] }}>
                                <div style={{ width:8, height:8, background:c }} />
                                {l}: {n} pedido{n!==1?"s":""}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: AGENDA ── */}
          {rightTab==="agenda" && (
            <div style={{ flex:1, overflowY:"auto" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:B[50] }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8 }}>Agenda de Visitas</div>
                <Btn variant="solid" size="sm">{Ic.plus(11)} Nova</Btn>
              </div>

              {/* Legenda de origem */}
              <div style={{ padding:"10px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", gap:12 }}>
                {[["ERP",B[800]],["Plataforma",B[400]]].map(([l,c])=>(
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:B[600] }}>
                    <div style={{ width:8, height:8, background:c }} />{l}
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", flexDirection:"column" }}>
                {AGENDA.map((v,i)=>(
                  <div key={v.id} style={{
                    padding:"12px 16px", borderBottom:`1px solid ${B[100]}`,
                    background: i%2===0 ? B[0] : B[50],
                    borderLeft: `3px solid ${v.origin==="erp" ? B[800] : B[400]}`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <Avatar label={v.avatar} size={28} bg={v.origin==="erp"?B[800]:B[500]} />
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:B[800] }}>{v.client}</div>
                          <div style={{ fontSize:10, color:B[500] }}>{v.type}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize:9, fontWeight:800, padding:"2px 6px", textTransform:"uppercase", letterSpacing:.5,
                        background: v.origin==="erp" ? B[800] : B[150],
                        color:      v.origin==="erp" ? B[0]   : B[600],
                      }}>{v.origin==="erp"?"ERP":"Site"}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:5, alignItems:"center", color:B[600], fontSize:10 }}>
                        <span style={{ display:"flex" }}>{Ic.calendar(11)}</span>
                        <span style={{ fontWeight:600 }}>{v.date} — {v.time}</span>
                      </div>
                      <Chip label={v.status} variant={v.status==="confirmado"?"blue":"warn"} />
                    </div>
                    <div style={{ marginTop:8, display:"flex", gap:5 }}>
                      <button style={{ flex:1, padding:"4px", background:B[50], border:`1px solid ${B[200]}`, color:B[600], fontSize:9, fontWeight:700, cursor:"pointer", letterSpacing:.3 }}>CONFIRMAR</button>
                      <button style={{ flex:1, padding:"4px", background:B[500], border:"none", color:B[0], fontSize:9, fontWeight:700, cursor:"pointer", letterSpacing:.3 }}>INICIAR CHAT</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo integração */}
              <div style={{ padding:"14px 16px", borderTop:`1px solid ${B[150]}`, background:B[50] }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:10 }}>Integração ERP</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { l:"Via ERP",        v:AGENDA.filter(a=>a.origin==="erp").length,        c:B[800] },
                    { l:"Via Plataforma", v:AGENDA.filter(a=>a.origin==="plataforma").length, c:B[400] },
                    { l:"Confirmadas",    v:AGENDA.filter(a=>a.status==="confirmado").length,  c:B[500] },
                    { l:"Pendentes",      v:AGENDA.filter(a=>a.status==="pendente").length,    c:B[300] },
                  ].map(({ l,v,c })=>(
                    <div key={l} style={{ background:B[0], border:`1px solid ${B[150]}`, borderTop:`2px solid ${c}`, padding:"8px 10px" }}>
                      <div style={{ fontSize:9, color:B[600], textTransform:"uppercase", letterSpacing:.4, marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:18, fontWeight:800, color:B[800] }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE: CLIENTES
// ─────────────────────────────────────────────
function Clientes() {
  const [view, setView] = useState("funil");
  const [search, setSearch] = useState("");
  const filtered = CLIENTS.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>

      {/* Toolbar */}
      <div style={{ background:B[0], padding:"12px 24px", display:"flex", gap:10, alignItems:"center", borderBottom:`1px solid ${B[150]}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:"7px 12px", flex:1, maxWidth:260 }}>
          <span style={{ color:B[400], display:"flex" }}>{Ic.search(14)}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..." style={{ border:"none", background:"none", outline:"none", fontSize:12, color:B[800], flex:1 }} />
        </div>
        <div style={{ display:"flex", border:`1px solid ${B[200]}` }}>
          {[["funil",Ic.funnel],["lista",Ic.list],["mapa",Ic.map]].map(([id,icon],i)=>(
            <button key={id} onClick={()=>setView(id)} style={{
              padding:"7px 14px", background:view===id?B[500]:B[0],
              color:view===id?B[0]:B[600], border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600,
              borderRight: i<2 ? `1px solid ${B[200]}` : undefined,
            }}>{icon(13)} {id.charAt(0).toUpperCase()+id.slice(1)}</button>
          ))}
        </div>
        <div style={{ marginLeft:"auto" }}>
          <Btn variant="solid" size="sm">{Ic.plus(13)} Novo Cliente</Btn>
        </div>
      </div>

      {/* Funil Kanban */}
      {view==="funil" && (
        <div style={{ display:"flex", gap:1, padding:1, background:B[150], overflowX:"auto", minHeight:"calc(100vh - 130px)" }}>
          {STAGES.map((stage,si)=>{
            const cols = filtered.filter(c=>c.stage===stage);
            const total = cols.reduce((a,c)=>a+c.value,0);
            const opacity = 1 - si*0.12;
            return (
              <div key={stage} style={{ width:220, flexShrink:0, display:"flex", flexDirection:"column" }}>
                <div style={{ background:`rgba(15,34,68,${opacity})`, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:B[0], textTransform:"uppercase", letterSpacing:.7 }}>{stage}</span>
                  <span style={{ fontSize:10, fontWeight:800, background:"rgba(255,255,255,0.15)", color:B[0], padding:"2px 7px" }}>{cols.length}</span>
                </div>
                {total>0 && (
                  <div style={{ background:B[100], padding:"6px 14px", borderBottom:`1px solid ${B[200]}` }}>
                    <span style={{ fontSize:10, fontWeight:700, color:B[600] }}>{fmt(total)}</span>
                  </div>
                )}
                <div style={{ flex:1, background:B[50], padding:8, display:"flex", flexDirection:"column", gap:6, overflowY:"auto" }}>
                  {cols.map(c=>(
                    <div key={c.id} style={{ background:B[0], border:`1px solid ${B[200]}`, padding:"12px 14px" }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                        <Avatar label={c.avatar} size={28} bg={c.prospect?B[400]:B[700]} />
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:B[800] }}>{c.name}</div>
                          <div style={{ fontSize:10, color:B[500] }}>{c.city}</div>
                        </div>
                      </div>
                      {c.value>0 && <div style={{ fontSize:13, fontWeight:800, color:B[700], marginBottom:6, fontVariantNumeric:"tabular-nums" }}>{fmt(c.value)}</div>}
                      <div style={{ fontSize:10, color:B[500], marginBottom:8 }}>{c.phone}</div>
                      <div style={{ display:"flex", gap:4 }}>
                        <button style={{ flex:1, padding:"4px", background:B[500], color:B[0], border:"none", fontSize:10, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>{Ic.chat(11)} Chat</button>
                        <button style={{ flex:1, padding:"4px", background:B[100], color:B[600], border:`1px solid ${B[200]}`, fontSize:10, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>{Ic.file(11)} Orçar</button>
                      </div>
                    </div>
                  ))}
                  {!cols.length && <div style={{ fontSize:11, color:B[400], textAlign:"center", padding:"16px 0" }}>Nenhum cliente</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista */}
      {view==="lista" && (
        <div style={{ background:B[0] }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:B[50] }}>
                {["Cliente","Cidade","Estágio","Valor","Contato","Ações"].map(h=>(
                  <th key={h} style={{ padding:"10px 20px", textAlign:"left", fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, borderBottom:`1px solid ${B[150]}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c,i)=>(
                <tr key={c.id} style={{ borderBottom:`1px solid ${B[100]}`, background:i%2?B[50]:B[0] }}>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <Avatar label={c.avatar} size={28} bg={c.prospect?B[400]:B[700]} />
                      <span style={{ fontWeight:600, color:B[800] }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 20px", color:B[600] }}>{c.city}</td>
                  <td style={{ padding:"12px 20px" }}><Chip label={c.stage} variant={c.stage==="Fechamento"?"success":c.stage==="Prospect"?"default":"blue"} /></td>
                  <td style={{ padding:"12px 20px", fontWeight:700, color:B[800], fontVariantNumeric:"tabular-nums" }}>{c.value>0?fmt(c.value):"—"}</td>
                  <td style={{ padding:"12px 20px", color:B[600] }}>{c.last}</td>
                  <td style={{ padding:"12px 20px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <Btn>{Ic.chat(12)}</Btn>
                      <Btn>{Ic.file(12)}</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mapa placeholder */}
      {view==="mapa" && (
        <div style={{ background:B[0], flex:1, display:"flex", alignItems:"center", justifyContent:"center", minHeight:400, flexDirection:"column", gap:12, color:B[400] }}>
          <span style={{ opacity:.4 }}>{Ic.map(48)}</span>
          <div style={{ fontSize:12, fontWeight:600, color:B[600], textTransform:"uppercase", letterSpacing:.8 }}>Integração com Google Maps</div>
          <div style={{ fontSize:11, color:B[400] }}>Disponível com chave de API configurada</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE: METAS
// ─────────────────────────────────────────────
function Metas() {
  const meta=60000, real=55000;
  const PIE_BLUES = [B[800],B[600],B[400],B[300],B[200]];
  const TOP = [
    { name:"Válvula V200",    value:38 },
    { name:"Rolamento 6205",  value:24 },
    { name:"Correia T5",      value:18 },
    { name:"Mangueira 3/4",   value:12 },
    { name:"Outros",          value:8  },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:1, background:B[150] }}>

      {/* Meta hero */}
      <div style={{ background:B[0], padding:"24px 28px", display:"flex", gap:40, alignItems:"center", flexWrap:"wrap" }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:B[600], textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Meta Junho 2025</div>
          <div style={{ fontSize:32, fontWeight:900, color:B[800], letterSpacing:-1 }}>{fmt(meta)}</div>
        </div>
        <div style={{ flex:1, minWidth:240 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, color:B[700] }}>Realizado: <strong style={{ color:B[800] }}>{fmt(real)}</strong></span>
            <span style={{ fontSize:14, fontWeight:800, color:B[500] }}>{pct(real,meta)}%</span>
          </div>
          <div style={{ background:B[100], height:10 }}>
            <div style={{ width:`${pct(real,meta)}%`, height:10, background:B[500], transition:"width .6s" }} />
          </div>
          <div style={{ fontSize:11, color:B[500], marginTop:6 }}>Faltam {fmt(meta-real)} para bater a meta</div>
        </div>
        <div style={{ display:"flex", gap:20 }}>
          {[["Visitas","21","25"],["Propostas","14","20"],["Fechamentos","18","22"]].map(([l,v,m])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:10, color:B[600], textTransform:"uppercase", letterSpacing:.7, marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:22, fontWeight:800, color:B[800] }}>{v}<span style={{ fontSize:13, color:B[400] }}>/{m}</span></div>
              <div style={{ background:B[100], height:4, marginTop:4 }}>
                <div style={{ width:`${pct(+v,+m)*100/100}%`, height:4, background:B[500] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1 }}>
        <KpiBlock label="Taxa de conversão" value="34%"  sub="Propostas fechadas" icon={Ic.trend}  accent delta="+6pp" />
        <KpiBlock label="Ticket médio"      value="R$18k" sub="Pedidos em jun"    icon={Ic.dollar} accent delta="+12%" />
        <KpiBlock label="Novos clientes"    value="3"    sub="Meta: 5"            icon={Ic.users}  accent />
        <KpiBlock label="NPS"               value="82"   sub="Excelente"          icon={Ic.target} accent delta="+4pp" />
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr 0.9fr", gap:1 }}>

        <div style={{ background:B[0] }}>
          <PanelHead icon={Ic.bar} title="Vendas por semana" />
          <div style={{ padding:"16px 20px 12px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEEK_DATA}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={B[500]} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={B[500]} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
                <XAxis dataKey="d" tick={{ fontSize:11, fill:B[600] }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:B[600] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} />
                <Tooltip formatter={v=>fmt(v)} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} />
                <Area type="monotone" dataKey="v" stroke={B[500]} strokeWidth={2} fill="url(#wg)" name="Vendas" dot={{ fill:B[500], r:3, strokeWidth:0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background:B[0] }}>
          <PanelHead icon={Ic.users} title="Ranking da Equipe" />
          <div style={{ padding:"12px 0" }}>
            {TEAM.map((r,i)=>(
              <div key={i} style={{ padding:"10px 20px", borderBottom:`1px solid ${B[100]}`, background:r.me?B[50]:B[0] }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:10, fontWeight:800, color: i<3?B[500]:B[400], minWidth:14 }}>{i+1}</span>
                    <span style={{ fontSize:12, fontWeight:r.me?700:500, color:r.me?B[800]:B[700] }}>{r.name}</span>
                    {r.me && <Chip label="Você" variant="blue" />}
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(r.total)}</span>
                </div>
                <div style={{ background:B[100], height:4 }}>
                  <div style={{ width:`${pct(r.total,71000)}%`, height:4, background:i===0?B[800]:i===1?B[600]:i===2?B[500]:B[300] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:B[0] }}>
          <PanelHead icon={Ic.pack} title="Mix de Produtos" />
          <div style={{ padding:"16px 20px" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
              <PieChart width={130} height={130}>
                <Pie data={TOP} cx={60} cy={60} innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={2}>
                  {TOP.map((_,i)=><Cell key={i} fill={PIE_BLUES[i]} />)}
                </Pie>
              </PieChart>
            </div>
            {TOP.map((p,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:8, height:8, background:PIE_BLUES[i], flexShrink:0 }} />
                <span style={{ flex:1, fontSize:11, color:B[700] }}>{p.name}</span>
                <span style={{ fontSize:11, fontWeight:700, color:B[800] }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE: GESTÃO
// ─────────────────────────────────────────────
const GIcon = {
  users: Ic.users, pipe:Ic.dollar, ticket:(s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>,
  clock:Ic.clock, trend:Ic.trend, chat:Ic.chat, funnel:Ic.funnel, bar:Ic.bar, eye:Ic.eye, file:Ic.file,
};

function Gestao() {
  const [activeTab, setActiveTab] = useState("conversao");
  const statusColor = {
    "Aprovado":   { bg:B[150], color:B[600] },
    "Aguardando": { bg:B[50],  color:B[700] },
    "Em revisão": { bg:"#FFF7ED", color:"#B45309" },
    "Expirado":   { bg:"#FFF1F2", color:"#BE123C" },
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:1, background:B[150] }}>

      {/* KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:1 }}>
        {[
          { label:"Clientes ativos",  value:"8",      sub:"3 prospects",       icon:GIcon.users,  delta:"+2"   },
          { label:"Pipeline total",   value:"R$147k", sub:"6 oportunidades",   icon:GIcon.pipe,   delta:"+18%" },
          { label:"Ticket médio",     value:"R$18k",  sub:"Pedidos este mês",  icon:GIcon.ticket, delta:"+12%" },
          { label:"Ciclo de venda",   value:"18 dias",sub:"Média fechamento",  icon:GIcon.clock,  delta:"-3d"  },
          { label:"Taxa conversão",   value:"34%",    sub:"Propostas fechadas",icon:GIcon.trend,  delta:"+6pp" },
          { label:"Msgs WhatsApp",    value:"312",    sub:"Enviadas em jun",   icon:GIcon.chat,   delta:null   },
        ].map((k,i)=><KpiBlock key={i} {...k} accent />)}
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:1 }}>

        <div style={{ background:B[0] }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${B[150]}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:B[500], display:"flex" }}>{GIcon.bar(15)}</span>
              <span style={{ fontSize:11, fontWeight:700, color:B[800], textTransform:"uppercase", letterSpacing:.9 }}>Desempenho Mensal</span>
            </div>
            <div style={{ display:"flex", border:`1px solid ${B[200]}` }}>
              {[["conversao","Conversão %"],["pedidos","Pedidos"]].map(([id,lbl],i)=>(
                <button key={id} onClick={()=>setActiveTab(id)} style={{
                  padding:"5px 14px", background:activeTab===id?B[500]:B[0],
                  color:activeTab===id?B[0]:B[600], border:"none",
                  borderRight:i===0?`1px solid ${B[200]}`:undefined,
                  fontSize:11, fontWeight:600, cursor:"pointer", letterSpacing:.3,
                }}>{lbl}</button>
              ))}
            </div>
          </div>
          <div style={{ padding:"16px 20px 12px" }}>
            <ResponsiveContainer width="100%" height={210}>
              {activeTab==="conversao" ? (
                <AreaChart data={CONV_DATA}>
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={B[500]} stopOpacity={0.15}/><stop offset="95%" stopColor={B[500]} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
                  <XAxis dataKey="mes" tick={{ fontSize:11, fill:B[600] }} axisLine={false} tickLine={false} />
                  <YAxis domain={[20,60]} tick={{ fontSize:10, fill:B[600] }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
                  <Tooltip formatter={v=>`${v}%`} contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} />
                  <Area type="monotone" dataKey="taxa" stroke={B[500]} strokeWidth={2} fill="url(#cg)" name="Conversão" dot={{ fill:B[500], r:3, strokeWidth:0 }} />
                </AreaChart>
              ) : (
                <BarChart data={CONV_DATA} barSize={22}>
                  <CartesianGrid strokeDasharray="2 4" stroke={B[150]} />
                  <XAxis dataKey="mes" tick={{ fontSize:11, fill:B[600] }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:B[600] }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ border:`1px solid ${B[200]}`, borderRadius:0, fontSize:12 }} />
                  <Bar dataKey="pedidos" fill={B[500]} name="Pedidos" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background:B[0] }}>
          <PanelHead icon={GIcon.funnel} title="Funil de Vendas" />
          <div style={{ padding:"16px 20px" }}>
            {STAGES.map((s,i)=>{
              const n = CLIENTS.filter(c=>c.stage===s).length;
              const w = [100,72,54,38,22][i];
              const op = 1 - i*0.13;
              return (
                <div key={s} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:B[700], marginBottom:5, fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>
                    <span>{s}</span><span style={{ color:B[800], fontWeight:800 }}>{n}</span>
                  </div>
                  <div style={{ background:B[50], height:24, position:"relative" }}>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${w}%`, background:`rgba(37,99,235,${op})`, display:"flex", alignItems:"center", paddingLeft:10 }}>
                      <span style={{ fontSize:10, color:B[0], fontWeight:700 }}>{w}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop:16, padding:"12px 14px", background:B[50], borderLeft:`3px solid ${B[500]}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.5 }}>Conversão geral</div>
              <div style={{ fontSize:24, fontWeight:900, color:B[800], marginTop:4 }}>34%</div>
              <div style={{ fontSize:11, color:B[500] }}>Prospect → Fechamento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ background:B[0] }}>
        <div style={{ padding:"14px 20px", borderBottom:`1px solid ${B[150]}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:B[500], display:"flex" }}>{GIcon.file(15)}</span>
            <span style={{ fontSize:11, fontWeight:700, color:B[800], textTransform:"uppercase", letterSpacing:.9 }}>Orçamentos Pendentes</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:B[50], border:`1px solid ${B[200]}`, padding:"5px 10px" }}>
              {Ic.search(12)}<input placeholder="Filtrar..." style={{ border:"none", background:"none", outline:"none", fontSize:11, width:120, color:B[800] }} />
            </div>
            <Btn variant="solid" size="sm">{Ic.plus(12)} Novo</Btn>
          </div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:B[50] }}>
              {["Nº","Cliente","Valor","Emissão","Dias aberto","Status",""].map(h=>(
                <th key={h} style={{ padding:"10px 20px", textAlign:"left", fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, borderBottom:`1px solid ${B[150]}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORCAMENTOS.map((o,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${B[100]}`, background:i%2?B[50]:B[0] }}>
                <td style={{ padding:"12px 20px", fontWeight:700, color:B[500], fontVariantNumeric:"tabular-nums" }}>{o.num}</td>
                <td style={{ padding:"12px 20px", color:B[800], fontWeight:500 }}>{o.client}</td>
                <td style={{ padding:"12px 20px", fontWeight:800, color:B[900], fontVariantNumeric:"tabular-nums" }}>{fmt(o.val)}</td>
                <td style={{ padding:"12px 20px", color:B[600] }}>{o.date}</td>
                <td style={{ padding:"12px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:60, background:B[100], height:4 }}>
                      <div style={{ width:`${Math.min(o.dias/14*100,100)}%`, height:4, background:o.dias>7?B[400]:B[500] }} />
                    </div>
                    <span style={{ fontSize:11, color:B[700], fontWeight:600 }}>{o.dias}d</span>
                  </div>
                </td>
                <td style={{ padding:"12px 20px" }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", textTransform:"uppercase", letterSpacing:.5, background:statusColor[o.status]?.bg, color:statusColor[o.status]?.color }}>{o.status}</span>
                </td>
                <td style={{ padding:"12px 20px" }}>
                  <Btn size="sm">{GIcon.eye(12)} Ver</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:"10px 20px", borderTop:`1px solid ${B[150]}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:B[50] }}>
          <span style={{ fontSize:11, color:B[600] }}>5 orçamentos · Total: {fmt(122850)}</span>
          <div style={{ display:"flex" }}>
            {["‹","1","2","›"].map((p,i)=>(
              <button key={i} style={{ padding:"4px 10px", background:p==="1"?B[500]:B[0], color:p==="1"?B[0]:B[700], border:`1px solid ${B[200]}`, borderLeft:i>0?"none":undefined, fontSize:12, cursor:"pointer", fontWeight:p==="1"?700:400 }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────
const NAV = [
  { id:"dashboard", label:"Início",    icon:Ic.home   },
  { id:"conversas", label:"Conversas", icon:Ic.chat   },
  { id:"clientes",  label:"Clientes",  icon:Ic.users  },
  { id:"metas",     label:"Metas",     icon:Ic.target },
  { id:"gestao",    label:"Gestão",    icon:Ic.bar    },
];

// ─────────────────────────────────────────────
// APP SHELL
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 700;
  const TITLES = { dashboard:"Dashboard", conversas:"Conversas", clientes:"Clientes", metas:"Metas", gestao:"Gestão" };

  const renderPage = () => {
    if (page==="dashboard") return <Dashboard />;
    if (page==="conversas") return <Conversas isMobile={isMobile} />;
    if (page==="clientes")  return <Clientes />;
    if (page==="metas")     return <Metas />;
    if (page==="gestao")    return <Gestao />;
  };

  // ── Mobile ──
  if (isMobile) return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:B[50], minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ background:B[800], padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`2px solid ${B[600]}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:26, height:26, background:B[500], display:"flex", alignItems:"center", justifyContent:"center", color:B[0] }}>{Ic.bar(14)}</div>
          <span style={{ color:B[0], fontWeight:800, fontSize:13, letterSpacing:.5 }}>CRepresentante</span>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ color:B[300], display:"flex" }}>{Ic.bell(18)}</span>
          <Avatar label="CS" size={28} bg={B[600]} />
        </div>
      </div>
      <div style={{ fontSize:10, fontWeight:700, color:B[400], textTransform:"uppercase", letterSpacing:1.2, padding:"8px 18px", background:B[900], borderBottom:`1px solid ${B[800]}` }}>
        {TITLES[page]}
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>{renderPage()}</div>
      <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, display:"flex" }}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            padding:"10px 0 12px", background:"none", border:"none", cursor:"pointer",
            color: page===n.id ? B[500] : B[400],
            borderTop: page===n.id ? `2px solid ${B[500]}` : "2px solid transparent",
          }}>
            {n.icon(18)}
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Desktop ──
  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:B[50], minHeight:"100vh", display:"flex" }}>

      {/* Sidebar */}
      <div style={{ width:sideOpen?216:56, background:B[900], display:"flex", flexDirection:"column", transition:"width .2s", overflow:"hidden", flexShrink:0 }}>

        {/* Logo */}
        <div style={{ padding:"20px 0 18px", borderBottom:`1px solid ${B[800]}`, display:"flex", alignItems:"center", gap:12, paddingLeft:sideOpen?18:0, justifyContent:sideOpen?"flex-start":"center" }}>
          <div style={{ width:30, height:30, background:B[500], display:"flex", alignItems:"center", justifyContent:"center", color:B[0], flexShrink:0 }}>{Ic.bar(16)}</div>
          {sideOpen && (
            <div>
              <div style={{ color:B[0], fontWeight:800, fontSize:13, letterSpacing:.5 }}>CRepresentante</div>
              <div style={{ color:B[600], fontSize:10, letterSpacing:.3 }}>CRM WhatsApp</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, paddingTop:8 }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding: sideOpen ? "11px 18px" : "11px 0",
              justifyContent: sideOpen ? "flex-start" : "center",
              background: page===n.id ? B[800] : "none",
              borderLeft: page===n.id ? `3px solid ${B[500]}` : "3px solid transparent",
              color: page===n.id ? B[0] : B[600],
              border:"none", cursor:"pointer", fontFamily:"inherit",
              fontSize:12, fontWeight: page===n.id ? 700 : 500,
              letterSpacing:.3, transition:"all .12s",
            }}>
              <span style={{ flexShrink:0, display:"flex" }}>{n.icon(16)}</span>
              {sideOpen && <span>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: sideOpen?"14px 16px":"14px 0", borderTop:`1px solid ${B[800]}`, display:"flex", gap:10, alignItems:"center", justifyContent:sideOpen?"flex-start":"center" }}>
          <Avatar label="CS" size={30} bg={B[600]} />
          {sideOpen && (
            <div>
              <div style={{ color:B[0], fontWeight:600, fontSize:11 }}>Carlos Souza</div>
              <div style={{ color:B[600], fontSize:10 }}>Rep. Comercial · MG</div>
            </div>
          )}
        </div>

        {/* Collapse btn */}
        <button onClick={()=>setSideOpen(s=>!s)} style={{ background:B[800], border:"none", borderTop:`1px solid ${B[700]}`, color:B[500], padding:"10px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {sideOpen ? Ic.chevL(14) : Ic.chevR(14)}
        </button>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:B[800], letterSpacing:-.3 }}>{TITLES[page]}</div>
              <div style={{ fontSize:10, color:B[500], fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>Junho 2025 · MG, Brasil</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <button style={{ background:B[50], border:`1px solid ${B[200]}`, color:B[600], padding:"7px", cursor:"pointer", display:"flex" }}>{Ic.bell(16)}</button>
              <div style={{ position:"absolute", top:-3, right:-3, width:14, height:14, background:B[500], color:B[0], fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>5</div>
            </div>
            <Btn variant="solid" size="sm">{Ic.plus(13)} Novo Pedido</Btn>
            <div style={{ width:1, height:24, background:B[150] }} />
            <Avatar label="CS" size={32} bg={B[700]} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
