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
  cart:    (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  tag:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  zap:     (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  x:       (s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
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
  { id:"P01", cat:"Válvulas",    name:"Válvula V200",             price:285,   stock:120,  unit:"un", ref:"VLV-200"  },
  { id:"P02", cat:"Válvulas",    name:"Válvula V350 Industrial",  price:490,   stock:44,   unit:"un", ref:"VLV-350"  },
  { id:"P03", cat:"Válvulas",    name:"Válvula Esfera 1/2",     price:68,    stock:200,  unit:"un", ref:"VLV-E12"  },
  { id:"P04", cat:"Rolamentos",  name:"Rolamento 6205",           price:42,    stock:48,   unit:"un", ref:"ROL-6205" },
  { id:"P05", cat:"Rolamentos",  name:"Rolamento 6305",           price:58,    stock:12,   unit:"un", ref:"ROL-6305" },
  { id:"P06", cat:"Rolamentos",  name:"Rolamento 6208 2RS",       price:74,    stock:30,   unit:"un", ref:"ROL-6208" },
  { id:"P07", cat:"Fixação",     name:"Parafuso Sextavado M12",   price:1.80,  stock:5000, unit:"cx", ref:"PAR-M12"  },
  { id:"P08", cat:"Fixação",     name:"Porca Sextavada M12",      price:0.90,  stock:8000, unit:"cx", ref:"PRC-M12"  },
  { id:"P09", cat:"Fixação",     name:"Arruela Lisa M12",         price:0.40,  stock:9000, unit:"cx", ref:"ARR-M12"  },
  { id:"P10", cat:"Transmissão", name:"Correia Dentada T5",       price:34,    stock:200,  unit:"un", ref:"COR-T5"   },
  { id:"P11", cat:"Transmissão", name:"Polia Alumínio 80mm",      price:87,    stock:60,   unit:"un", ref:"POL-080"  },
  { id:"P12", cat:"Hidráulico",  name:"Mangueira Hidráulica 3/4", price:28.5,  stock:300,  unit:"mt", ref:"MAN-34"   },
  { id:"P13", cat:"Hidráulico",  name:"Conector Reto 3/4",      price:12,    stock:400,  unit:"un", ref:"CON-34"   },
  { id:"P14", cat:"Elétrico",    name:"Cabo PP 2x2.5mm",          price:8.90,  stock:1000, unit:"mt", ref:"CAB-225"  },
  { id:"P15", cat:"Elétrico",    name:"Disjuntor DIN 20A",        price:32,    stock:150,  unit:"un", ref:"DIS-20A"  },
];
const PRODUCT_CATS = ["Todos", ...new Set(PRODUCTS.map(p=>p.cat))];
const PAYMENT_TERMS = ["À vista","7 dias","14 dias","21 dias","28 dias","30/60","30/60/90","45/90/135"];
const DELIVERY_OPTIONS = ["Retirada","3 dias úteis","5 dias úteis","7 dias úteis","10 dias úteis","15 dias úteis","A combinar"];
const PROMOTIONS = [
  { id:"PRO1", title:"Válvulas em Destaque", desc:"V200 + V350 com 12% OFF no kit", badge:"12% OFF", color:B?.[600]||"#2563EB", expires:"Até 30/06", products:["P01","P02"], discPct:12 },
  { id:"PRO2", title:"Rolamentos da Semana", desc:"Linha 6205 e 6305 — leve 5 pague 4", badge:"Leve 5 Pague 4", color:B?.[800]||"#0F2244", expires:"Até 28/06", products:["P04","P05"], discPct:20 },
  { id:"PRO3", title:"Fixação em Atacado", desc:"A partir de 500 cx com 8% desconto", badge:"8% +500cx", color:B?.[700]||"#1A3560", expires:"Mês inteiro", products:["P07","P08","P09"], discPct:8 },
];
const COMBOS = [
  { id:"C01", name:"Kit Hidráulico Completo", items:[{id:"P12",qty:10},{id:"P13",qty:5}], originalPrice:427.5, comboPrice:360, saving:67.5, tag:"Mais vendido" },
  { id:"C02", name:"Pack Rolamentos Linha 6200", items:[{id:"P04",qty:5},{id:"P05",qty:3},{id:"P06",qty:2}], originalPrice:500, comboPrice:420, saving:80, tag:"Estoque limitado" },
  { id:"C03", name:"Kit Transmissão", items:[{id:"P10",qty:2},{id:"P11",qty:1}], originalPrice:155, comboPrice:125, saving:30, tag:"Novidade" },
  { id:"C04", name:"Fixação Industrial M12", items:[{id:"P07",qty:50},{id:"P08",qty:50},{id:"P09",qty:100}], originalPrice:330, comboPrice:265, saving:65, tag:"Econômico" },
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

// ─────────────────────────────────────────────
// PEDIDO ASSISTIDO — painel completo
// ─────────────────────────────────────────────
function PedidoPanel({ ac, orderQty, setOrderQty, discount, setDiscount, pedHist, send }) {
  const [step, setStep]         = useState("produtos"); // produtos | resumo | condicoes
  const [search, setSearch]     = useState("");
  const [activeCat, setActiveCat] = useState("Todos");
  const [payment, setPayment]   = useState("30/60");
  const [delivery, setDelivery] = useState("5 dias úteis");
  const [notes, setNotes]       = useState("");
  const [lineDisc, setLineDisc] = useState({});      // desconto por linha

  const filtered = PRODUCTS.filter(p =>
    (activeCat === "Todos" || p.cat === activeCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.ref.toLowerCase().includes(search.toLowerCase()))
  );

  const orderLines = Object.entries(orderQty).filter(([,q]) => q > 0);
  const subtotal   = orderLines.reduce((a, [id, q]) => {
    const p = PRODUCTS.find(x => x.id === id);
    const ld = lineDisc[id] || 0;
    return a + p.price * q * (1 - ld / 100);
  }, 0);
  const totalDisc  = subtotal * (1 - discount / 100);
  const totalItems = orderLines.reduce((a, [, q]) => a + q, 0);

  const stepLabel = { produtos: "1. Produtos", resumo: "2. Resumo", condicoes: "3. Condições" };

  const sendOrder = () => {
    const lines = orderLines.map(([id, q]) => {
      const p   = PRODUCTS.find(x => x.id === id);
      const ld  = lineDisc[id] || 0;
      const val = p.price * q * (1 - ld / 100);
      return `• ${q}x ${p.name}${ld > 0 ? ` (desc. ${ld}%)` : ""} — ${fmt(val)}`;
    });
    const discText  = discount > 0 ? `\nDesconto geral: ${discount}%` : "";
    const notesText = notes ? `\nObs: ${notes}` : "";
    send(
      `Pedido #${Math.floor(Math.random()*1000)+2900} — ${ac?.name}\n` +
      lines.join("\n") + discText +
      `\n\nTotal: ${fmt(totalDisc)}` +
      `\nPagamento: ${payment} · Entrega: ${delivery}` +
      notesText +
      `\n\nEnviado ao ERP automaticamente.`
    );
    setOrderQty({});
    setLineDisc({});
    setDiscount(0);
    setNotes("");
    setStep("produtos");
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* Cabeçalho do pedido */}
      <div style={{ background:B[800], padding:"12px 16px" }}>
        <div style={{ fontSize:10, color:B[300], letterSpacing:.8, textTransform:"uppercase", marginBottom:3 }}>Pedido assistido</div>
        <div style={{ fontSize:12, fontWeight:700, color:B[0] }}>{ac?.name}</div>
        <div style={{ fontSize:10, color:B[400], marginTop:1 }}>{ac?.city} · {ac?.stage}</div>
      </div>

      {/* Steps nav */}
      <div style={{ display:"flex", borderBottom:`1px solid ${B[150]}`, background:B[0] }}>
        {["produtos","resumo","condicoes"].map((s, i) => (
          <button key={s} onClick={() => orderLines.length > 0 || s === "produtos" ? setStep(s) : null}
            style={{
              flex:1, padding:"9px 4px", background:"none", border:"none", cursor:"pointer",
              fontSize:9, fontWeight:700, letterSpacing:.4, textTransform:"uppercase",
              color:       step === s ? B[500] : B[400],
              borderBottom: step === s ? `2px solid ${B[500]}` : "2px solid transparent",
              marginBottom:-1,
              opacity: (s !== "produtos" && orderLines.length === 0) ? 0.35 : 1,
            }}>
            <div style={{ fontSize:14, fontWeight:800, color: step === s ? B[500] : B[300], marginBottom:2 }}>{i+1}</div>
            {s === "produtos" ? "Produtos" : s === "resumo" ? "Resumo" : "Condições"}
          </button>
        ))}
      </div>

      {/* ── STEP 1: PRODUTOS ── */}
      {step === "produtos" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Busca */}
          <div style={{ padding:"10px 12px", borderBottom:`1px solid ${B[100]}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:"6px 10px" }}>
              {Ic.search(13)}
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar produto ou referência..."
                style={{ border:"none", background:"none", outline:"none", fontSize:11, color:B[800], flex:1, fontFamily:"inherit" }}
              />
            </div>
          </div>

          {/* Categorias */}
          <div style={{ display:"flex", gap:0, overflowX:"auto", borderBottom:`1px solid ${B[100]}`, padding:"0 12px" }}>
            {PRODUCT_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{
                padding:"7px 10px", background:"none", border:"none", cursor:"pointer", whiteSpace:"nowrap",
                fontSize:10, fontWeight:700, letterSpacing:.4,
                color:       activeCat === cat ? B[500] : B[500],
                borderBottom: activeCat === cat ? `2px solid ${B[500]}` : "2px solid transparent",
                marginBottom:-1,
                opacity:     activeCat === cat ? 1 : 0.4,
              }}>{cat}</button>
            ))}
          </div>

          {/* Lista de produtos */}
          <div style={{ flex:1, overflowY:"auto" }}>
            {filtered.map((p, i) => {
              const qty = orderQty[p.id] || 0;
              const lowStock = p.stock < 20;
              return (
                <div key={p.id} style={{
                  padding:"10px 12px",
                  borderBottom:`1px solid ${B[100]}`,
                  background: qty > 0 ? B[50] : B[0],
                  borderLeft: qty > 0 ? `3px solid ${B[500]}` : "3px solid transparent",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:B[800], lineHeight:1.3 }}>{p.name}</div>
                      <div style={{ display:"flex", gap:8, marginTop:2, alignItems:"center" }}>
                        <span style={{ fontSize:9, color:B[500], fontFamily:"monospace" }}>{p.ref}</span>
                        <span style={{ fontSize:9, color: lowStock ? "#B45309" : B[400] }}>
                          {lowStock ? `⚠ ${p.stock} em estoque` : `Estoque: ${p.stock} ${p.unit}`}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0, marginLeft:8 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:B[700], fontVariantNumeric:"tabular-nums" }}>{fmt(p.price)}</div>
                      <div style={{ fontSize:9, color:B[400] }}>/{p.unit}</div>
                    </div>
                  </div>

                  {/* Controles de quantidade */}
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button
                      onClick={() => setOrderQty(q => ({ ...q, [p.id]: Math.max(0, (q[p.id]||0) - 1) }))}
                      style={{ width:24, height:24, background:B[100], border:`1px solid ${B[200]}`, color:B[700], cursor:"pointer", fontWeight:900, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>−</button>
                    <input
                      value={qty || ""}
                      onChange={e => setOrderQty(q => ({ ...q, [p.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                      placeholder="0"
                      style={{ width:38, textAlign:"center", border:`1px solid ${qty>0?B[400]:B[200]}`, padding:"3px 0", fontSize:12, fontWeight:800, color:B[800], background:B[0], outline:"none", fontFamily:"monospace" }}
                    />
                    <button
                      onClick={() => setOrderQty(q => ({ ...q, [p.id]: (q[p.id]||0) + 1 }))}
                      style={{ width:24, height:24, background: qty>0?B[500]:B[200], border:"none", color:B[0], cursor:"pointer", fontWeight:900, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>+</button>
                    {qty > 0 && (
                      <span style={{ marginLeft:"auto", fontSize:11, fontWeight:800, color:B[600], fontVariantNumeric:"tabular-nums" }}>
                        = {fmt(p.price * qty)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding:"32px 16px", textAlign:"center", color:B[400], fontSize:12 }}>
                Nenhum produto encontrado
              </div>
            )}
          </div>

          {/* Footer com resumo e botão avançar */}
          {orderLines.length > 0 && (
            <div style={{ borderTop:`2px solid ${B[500]}`, background:B[800], padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:10, color:B[300] }}>{totalItems} item{totalItems!==1?"s":""} selecionado{totalItems!==1?"s":""}</div>
                <div style={{ fontSize:14, fontWeight:800, color:B[0], fontVariantNumeric:"tabular-nums" }}>{fmt(subtotal)}</div>
              </div>
              <button onClick={() => setStep("resumo")} style={{
                padding:"8px 16px", background:B[500], color:B[0], border:"none",
                fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:.4,
                display:"flex", alignItems:"center", gap:6
              }}>
                Resumo {Ic.chevR(13)}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: RESUMO ── */}
      {step === "resumo" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, overflowY:"auto" }}>

            {/* Itens */}
            <div style={{ padding:"10px 0" }}>
              {orderLines.map(([id, q]) => {
                const p   = PRODUCTS.find(x => x.id === id);
                const ld  = lineDisc[id] || 0;
                const val = p.price * q * (1 - ld / 100);
                return (
                  <div key={id} style={{ padding:"10px 14px", borderBottom:`1px solid ${B[100]}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:700, color:B[800] }}>{p.name}</div>
                        <div style={{ fontSize:10, color:B[500] }}>{p.ref} · {fmt(p.price)}/{p.unit}</div>
                      </div>
                      <button
                        onClick={() => setOrderQty(q2 => { const n={...q2}; delete n[id]; return n; })}
                        style={{ background:"none", border:"none", color:B[400], cursor:"pointer", fontSize:14, lineHeight:1, padding:"0 2px" }}>×</button>
                    </div>

                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {/* Qtd */}
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <button onClick={() => setOrderQty(q2 => ({ ...q2, [id]: Math.max(1, q-1) }))}
                          style={{ width:20, height:20, background:B[100], border:`1px solid ${B[200]}`, color:B[700], cursor:"pointer", fontWeight:900, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                        <span style={{ fontSize:12, fontWeight:800, color:B[800], minWidth:24, textAlign:"center", fontFamily:"monospace" }}>{q}</span>
                        <button onClick={() => setOrderQty(q2 => ({ ...q2, [id]: q+1 }))}
                          style={{ width:20, height:20, background:B[500], border:"none", color:B[0], cursor:"pointer", fontWeight:900, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                      </div>

                      {/* Desconto por linha */}
                      <div style={{ display:"flex", alignItems:"center", gap:4, marginLeft:"auto" }}>
                        <span style={{ fontSize:9, color:B[500] }}>Desc.</span>
                        <select
                          value={ld}
                          onChange={e => setLineDisc(d => ({ ...d, [id]: Number(e.target.value) }))}
                          style={{ border:`1px solid ${B[200]}`, background:B[50], fontSize:10, fontWeight:700, color:B[700], padding:"2px 4px", outline:"none" }}>
                          {[0,3,5,8,10,12,15].map(d => <option key={d} value={d}>{d}%</option>)}
                        </select>
                      </div>

                      <div style={{ fontSize:12, fontWeight:800, color:B[700], fontVariantNumeric:"tabular-nums", minWidth:70, textAlign:"right" }}>{fmt(val)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desconto geral */}
            <div style={{ padding:"12px 14px", borderTop:`1px solid ${B[150]}`, borderBottom:`1px solid ${B[150]}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Desconto geral do pedido</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {[0,3,5,8,10,12,15].map(d => (
                  <button key={d} onClick={() => setDiscount(d)} style={{
                    padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer",
                    background: discount===d ? B[800] : B[50],
                    color:      discount===d ? B[0]   : B[600],
                    border:     `1px solid ${discount===d ? B[800] : B[200]}`,
                  }}>{d}%</button>
                ))}
              </div>
            </div>

            {/* Totais */}
            <div style={{ padding:"12px 14px", background:B[50] }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:B[600], marginBottom:6 }}>
                <span>Subtotal</span><span style={{ fontVariantNumeric:"tabular-nums" }}>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:B[500], marginBottom:6 }}>
                  <span>Desconto geral ({discount}%)</span><span>− {fmt(subtotal * discount / 100)}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:900, color:B[800], paddingTop:8, borderTop:`2px solid ${B[300]}`, marginTop:4 }}>
                <span>Total</span><span style={{ fontVariantNumeric:"tabular-nums" }}>{fmt(totalDisc)}</span>
              </div>
            </div>

            {/* Histórico */}
            {pedHist.length > 0 && (
              <div style={{ padding:"12px 14px", borderTop:`1px solid ${B[100]}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Pedidos anteriores</div>
                {pedHist.map((p, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:i<pedHist.length-1?`1px solid ${B[100]}`:undefined }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:B[500] }}>{p.num}</div>
                      <div style={{ fontSize:10, color:B[500] }}>{p.date}</div>
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <span style={{ fontSize:11, fontWeight:700, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(p.val)}</span>
                      <span style={{ fontSize:9, fontWeight:800, padding:"2px 6px", textTransform:"uppercase",
                        background: p.origin==="erp"?B[800]:B[150], color: p.origin==="erp"?B[0]:B[600] }}>
                        {p.origin==="erp"?"ERP":"Site"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop:`1px solid ${B[150]}`, padding:"10px 14px", display:"flex", gap:6, background:B[0] }}>
            <button onClick={() => setStep("produtos")} style={{ padding:"8px 12px", background:B[50], color:B[600], border:`1px solid ${B[200]}`, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              {Ic.chevL(12)} Voltar
            </button>
            <button onClick={() => setStep("condicoes")} style={{ flex:1, padding:"8px", background:B[500], color:B[0], border:"none", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
              Condições {Ic.chevR(12)}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: CONDIÇÕES ── */}
      {step === "condicoes" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>

            {/* Pagamento */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Condição de pagamento</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                {PAYMENT_TERMS.map(t => (
                  <button key={t} onClick={() => setPayment(t)} style={{
                    padding:"8px 6px", fontSize:11, fontWeight:700, cursor:"pointer",
                    background: payment===t ? B[800] : B[50],
                    color:      payment===t ? B[0]   : B[600],
                    border:     `1px solid ${payment===t ? B[800] : B[200]}`,
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Entrega */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Prazo de entrega</div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {DELIVERY_OPTIONS.map(d => (
                  <button key={d} onClick={() => setDelivery(d)} style={{
                    padding:"8px 12px", fontSize:11, fontWeight:600, cursor:"pointer", textAlign:"left",
                    background: delivery===d ? B[50]  : B[0],
                    color:      delivery===d ? B[700] : B[500],
                    border:     `1px solid ${delivery===d ? B[400] : B[200]}`,
                    borderLeft: `3px solid ${delivery===d ? B[500] : "transparent"}`,
                  }}>{d}</button>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Observações</div>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Instruções especiais, referência do cliente, local de entrega..."
                rows={3}
                style={{ width:"100%", padding:"8px 10px", border:`1px solid ${B[200]}`, background:B[50], fontSize:11, color:B[800], outline:"none", fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }}
              />
            </div>

            {/* Resumo final */}
            <div style={{ background:B[800], padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:B[300], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Resumo do pedido</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:B[400], marginBottom:4 }}>
                <span>{totalItems} produto{totalItems!==1?"s":""}</span>
                <span style={{ fontVariantNumeric:"tabular-nums" }}>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:B[400], marginBottom:4 }}>
                  <span>Desconto {discount}%</span><span>− {fmt(subtotal * discount / 100)}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:900, color:B[0], paddingTop:8, borderTop:`1px solid ${B[700]}`, marginTop:4 }}>
                <span>Total</span><span style={{ fontVariantNumeric:"tabular-nums" }}>{fmt(totalDisc)}</span>
              </div>
              <div style={{ marginTop:8, fontSize:10, color:B[400] }}>
                {payment} · {delivery}
              </div>
            </div>
          </div>

          {/* Botões de envio */}
          <div style={{ borderTop:`1px solid ${B[150]}`, padding:"10px 14px", display:"flex", flexDirection:"column", gap:6, background:B[0] }}>
            <button onClick={sendOrder} style={{
              padding:"11px", background:B[500], color:B[0], border:"none",
              fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:.3,
              display:"flex", alignItems:"center", justifyContent:"center", gap:7
            }}>
              {Ic.send(14)} Enviar pedido + WhatsApp
            </button>
            <button onClick={sendOrder} style={{
              padding:"9px", background:B[0], color:B[700], border:`1px solid ${B[300]}`,
              fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:.3,
              display:"flex", alignItems:"center", justifyContent:"center", gap:7
            }}>
              <span style={{ fontSize:8, fontWeight:900, background:B[800], color:B[0], padding:"2px 5px", letterSpacing:.5 }}>ERP</span>
              Enviar apenas ao ERP
            </button>
            <button onClick={() => setStep("resumo")} style={{ padding:"7px", background:"none", color:B[400], border:"none", fontSize:11, cursor:"pointer" }}>
              ← Voltar ao resumo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
            <PedidoPanel
              ac={ac}
              orderQty={orderQty} setOrderQty={setOrderQty}
              discount={discount} setDiscount={setDiscount}
              pedHist={pedHist}
              send={send}
            />
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

// ─────────────────────────────────────────────
// PAGE: PEDIDOS — mobile-first order taking
// ─────────────────────────────────────────────
function Pedidos({ isMobile }) {
  const [client, setClient]       = useState(CLIENTS.filter(c=>!c.prospect)[0]);
  const [cart, setCart]           = useState({});          // { productId: qty }
  const [cartOpen, setCartOpen]   = useState(false);
  const [activeCat, setActiveCat] = useState("Todos");
  const [search, setSearch]       = useState("");
  const [activePromo, setActivePromo] = useState(null);
  const [payment, setPayment]     = useState("30/60");
  const [delivery, setDelivery]   = useState("5 dias úteis");
  const [notes, setNotes]         = useState("");
  const [step, setStep]           = useState("catalog");   // catalog | cart | checkout | success
  const [comboAdded, setComboAdded] = useState({});

  const addToCart    = (id, qty=1) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id]||0)+qty) }));
  const setQty       = (id, qty)   => setCart(c => qty<=0 ? (({ [id]:_, ...rest })=>rest)(c) : { ...c, [id]: qty });
  const removeItem   = (id)        => setCart(c => (({ [id]:_, ...rest })=>rest)(c));

  const addCombo = (combo) => {
    combo.items.forEach(({id,qty}) => addToCart(id, qty));
    setComboAdded(a => ({ ...a, [combo.id]: true }));
    setTimeout(() => setComboAdded(a => ({ ...a, [combo.id]: false })), 2000);
  };

  const cartLines  = Object.entries(cart).filter(([,q])=>q>0);
  const cartCount  = cartLines.reduce((a,[,q])=>a+q,0);
  const cartTotal  = cartLines.reduce((a,[id,q])=>a+(PRODUCTS.find(p=>p.id===id)?.price||0)*q,0);

  const filteredProds = PRODUCTS.filter(p =>
    (activeCat==="Todos" || p.cat===activeCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase()))
  );

  const submitOrder = () => {
    setStep("success");
    setTimeout(() => { setCart({}); setStep("catalog"); }, 3000);
  };

  // ── TELA DE SUCESSO ──
  if (step==="success") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:16, padding:24 }}>
      <div style={{ width:64, height:64, background:B[500], display:"flex", alignItems:"center", justifyContent:"center", color:B[0] }}>{Ic.check(32)}</div>
      <div style={{ fontSize:18, fontWeight:800, color:B[800] }}>Pedido enviado!</div>
      <div style={{ fontSize:13, color:B[600], textAlign:"center" }}>Confirmação enviada ao ERP e mensagem WhatsApp disparada para {client?.name}</div>
      <div style={{ fontSize:22, fontWeight:900, color:B[500], fontVariantNumeric:"tabular-nums" }}>{fmt(cartTotal)}</div>
    </div>
  );

  // ── CHECKOUT ──
  if (step==="checkout") return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:B[0] }}>
      <div style={{ background:B[800], padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>setStep("cart")} style={{ background:"none",border:"none",color:B[300],cursor:"pointer",display:"flex" }}>{Ic.chevL(20)}</button>
        <div>
          <div style={{ fontSize:11, color:B[300], textTransform:"uppercase", letterSpacing:.8 }}>Finalizar pedido</div>
          <div style={{ fontSize:13, fontWeight:700, color:B[0] }}>{client?.name}</div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16 }}>

        {/* Resumo itens */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Itens do pedido</div>
          {cartLines.map(([id,q])=>{
            const p = PRODUCTS.find(x=>x.id===id);
            return (
              <div key={id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${B[100]}` }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:B[800] }}>{p?.name}</div>
                  <div style={{ fontSize:11, color:B[500] }}>{q}x · {fmt(p?.price||0)}/{p?.unit}</div>
                </div>
                <div style={{ fontWeight:800, color:B[700], fontVariantNumeric:"tabular-nums" }}>{fmt((p?.price||0)*q)}</div>
              </div>
            );
          })}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:10, borderTop:`2px solid ${B[300]}` }}>
            <span style={{ fontWeight:700, color:B[800] }}>Total</span>
            <span style={{ fontSize:18, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(cartTotal)}</span>
          </div>
        </div>

        {/* Pagamento */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Condição de pagamento</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {PAYMENT_TERMS.map(t=>(
              <button key={t} onClick={()=>setPayment(t)} style={{ padding:"10px 8px", fontSize:12, fontWeight:700, cursor:"pointer",
                background:payment===t?B[800]:B[50], color:payment===t?B[0]:B[600], border:`1px solid ${payment===t?B[800]:B[200]}` }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Entrega */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Prazo de entrega</div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {DELIVERY_OPTIONS.map(d=>(
              <button key={d} onClick={()=>setDelivery(d)} style={{ padding:"11px 14px", fontSize:12, fontWeight:600, cursor:"pointer", textAlign:"left",
                background:delivery===d?B[50]:B[0], color:delivery===d?B[800]:B[500],
                border:`1px solid ${delivery===d?B[400]:B[200]}`, borderLeft:`4px solid ${delivery===d?B[500]:"transparent"}` }}>{d}</button>
            ))}
          </div>
        </div>

        {/* Obs */}
        <div style={{ marginBottom:80 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Observações</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Instruções de entrega, referência do pedido..."
            style={{ width:"100%", padding:"10px 12px", border:`1px solid ${B[200]}`, fontSize:12, color:B[800], outline:"none", fontFamily:"inherit", resize:"none", boxSizing:"border-box", background:B[50] }} />
        </div>
      </div>

      {/* Botão finalizar */}
      <div style={{ position:"sticky", bottom:0, background:B[0], borderTop:`1px solid ${B[150]}`, padding:14, display:"flex", flexDirection:"column", gap:8 }}>
        <button onClick={submitOrder} style={{ padding:"14px", background:B[500], color:B[0], border:"none", fontSize:13, fontWeight:800, cursor:"pointer", letterSpacing:.3, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {Ic.send(16)} Confirmar e enviar ao ERP
        </button>
        <button onClick={submitOrder} style={{ padding:"10px", background:B[0], color:B[700], border:`1px solid ${B[300]}`, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <span style={{ fontSize:8, fontWeight:900, background:B[800], color:B[0], padding:"2px 5px" }}>ERP</span> Somente ERP — sem WhatsApp
        </button>
      </div>
    </div>
  );

  // ── CARRINHO ──
  if (step==="cart") return (
    <div style={{ display:"flex", flexDirection:"column", background:B[0], minHeight:"100%" }}>
      <div style={{ background:B[800], padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>setStep("catalog")} style={{ background:"none",border:"none",color:B[300],cursor:"pointer",display:"flex" }}>{Ic.chevL(20)}</button>
        <div>
          <div style={{ fontSize:11, color:B[300], textTransform:"uppercase", letterSpacing:.8 }}>Carrinho</div>
          <div style={{ fontSize:13, fontWeight:700, color:B[0] }}>{cartCount} item{cartCount!==1?"s":""}</div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {cartLines.length===0 ? (
          <div style={{ textAlign:"center", padding:"48px 24px", color:B[400] }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:12, opacity:.3 }}>{Ic.cart(40)}</div>
            <div style={{ fontSize:13, fontWeight:600 }}>Carrinho vazio</div>
          </div>
        ) : cartLines.map(([id,q])=>{
          const p = PRODUCTS.find(x=>x.id===id);
          return (
            <div key={id} style={{ padding:"14px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{p?.name}</div>
                <div style={{ fontSize:11, color:B[500], marginTop:2 }}>{p?.ref} · {fmt(p?.price||0)}/{p?.unit}</div>
                <div style={{ fontSize:12, fontWeight:800, color:B[600], marginTop:4, fontVariantNumeric:"tabular-nums" }}>{fmt((p?.price||0)*q)}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <button onClick={()=>setQty(id,q-1)} style={{ width:32,height:32,background:B[100],border:`1px solid ${B[200]}`,color:B[700],cursor:"pointer",fontWeight:900,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                <span style={{ fontSize:14,fontWeight:800,color:B[800],minWidth:24,textAlign:"center",fontFamily:"monospace" }}>{q}</span>
                <button onClick={()=>setQty(id,q+1)} style={{ width:32,height:32,background:B[500],border:"none",color:B[0],cursor:"pointer",fontWeight:900,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                <button onClick={()=>removeItem(id)} style={{ width:28,height:28,background:"none",border:`1px solid ${B[200]}`,color:B[400],cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>{Ic.x(12)}</button>
              </div>
            </div>
          );
        })}
      </div>
      {cartLines.length>0 && (
        <div style={{ position:"sticky", bottom:0, background:B[0], borderTop:`2px solid ${B[150]}`, padding:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:13, color:B[700] }}>{cartCount} item{cartCount!==1?"s":""}</span>
            <span style={{ fontSize:18, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(cartTotal)}</span>
          </div>
          <button onClick={()=>setStep("checkout")} style={{ width:"100%", padding:"14px", background:B[500], color:B[0], border:"none", fontSize:14, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            Finalizar pedido {Ic.chevR(16)}
          </button>
        </div>
      )}
    </div>
  );

  // ── CATÁLOGO ──
  return (
    <div style={{ display:"flex", flexDirection:"column", background:B[50], minHeight:"100%", position:"relative" }}>

      {/* Seletor de cliente */}
      <div style={{ background:B[800], padding:"12px 16px" }}>
        <div style={{ fontSize:9, color:B[400], textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Pedido para</div>
        <div style={{ display:"flex", gap:0, overflowX:"auto", paddingBottom:2 }}>
          {CLIENTS.filter(c=>!c.prospect).map(c=>(
            <button key={c.id} onClick={()=>setClient(c)} style={{
              padding:"7px 12px", background: client?.id===c.id?B[500]:"rgba(255,255,255,0.08)",
              color: client?.id===c.id?B[0]:B[400], border:"none", cursor:"pointer",
              fontSize:11, fontWeight:700, whiteSpace:"nowrap", flexShrink:0,
              borderRight: `1px solid ${B[700]}`,
            }}>{c.name.split(" ")[0]+" "+c.name.split(" ")[1]}</button>
          ))}
        </div>
      </div>

      {/* Busca */}
      <div style={{ background:B[0], padding:"10px 14px", borderBottom:`1px solid ${B[150]}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:"8px 12px" }}>
          <span style={{ color:B[400], display:"flex", flexShrink:0 }}>{Ic.search(15)}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produto ou código..."
            style={{ border:"none", background:"none", outline:"none", fontSize:13, color:B[800], flex:1, fontFamily:"inherit" }} />
          {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",color:B[400],cursor:"pointer",display:"flex" }}>{Ic.x(14)}</button>}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:100 }}>

        {/* PROMOÇÕES */}
        {!search && (
          <div style={{ padding:"14px 0 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 14px", marginBottom:10 }}>
              <span style={{ color:B[500], display:"flex" }}>{Ic.zap(14)}</span>
              <span style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.9 }}>Promoções ativas</span>
            </div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"0 14px 14px", scrollbarWidth:"none" }}>
              {PROMOTIONS.map(promo=>(
                <div key={promo.id} style={{ flexShrink:0, width:220, background:B[800], padding:"14px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, right:0, background:B[500], padding:"4px 10px", fontSize:10, fontWeight:900, color:B[0], letterSpacing:.5 }}>{promo.badge}</div>
                  <div style={{ fontSize:13, fontWeight:800, color:B[0], marginBottom:4, marginTop:8, lineHeight:1.3 }}>{promo.title}</div>
                  <div style={{ fontSize:11, color:B[300], marginBottom:10, lineHeight:1.4 }}>{promo.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:10, color:B[400] }}>{promo.expires}</span>
                    <button onClick={()=>{ promo.products.forEach(id=>addToCart(id,1)); }} style={{ padding:"6px 12px", background:B[500], color:B[0], border:"none", fontSize:10, fontWeight:700, cursor:"pointer", letterSpacing:.3 }}>
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMBOS */}
        {!search && (
          <div style={{ padding:"0 0 4px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 14px", marginBottom:10 }}>
              <span style={{ color:B[500], display:"flex" }}>{Ic.tag(14)}</span>
              <span style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.9 }}>Combos especiais</span>
            </div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"0 14px 14px", scrollbarWidth:"none" }}>
              {COMBOS.map(combo=>(
                <div key={combo.id} style={{ flexShrink:0, width:200, background:B[0], border:`1px solid ${B[200]}`, borderTop:`3px solid ${B[500]}`, padding:"12px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:B[500], textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{combo.tag}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:B[800], marginBottom:6, lineHeight:1.3 }}>{combo.name}</div>
                  <div style={{ marginBottom:8 }}>
                    {combo.items.map(({id,qty})=>{
                      const p=PRODUCTS.find(x=>x.id===id);
                      return <div key={id} style={{ fontSize:10, color:B[600], marginBottom:2 }}>{qty}x {p?.name}</div>;
                    })}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:10, color:B[400], textDecoration:"line-through" }}>{fmt(combo.originalPrice)}</div>
                      <div style={{ fontSize:15, fontWeight:900, color:B[700], fontVariantNumeric:"tabular-nums" }}>{fmt(combo.comboPrice)}</div>
                    </div>
                    <div style={{ fontSize:10, fontWeight:800, background:B[150], color:B[600], padding:"3px 7px" }}>
                      -{fmt(combo.saving)}
                    </div>
                  </div>
                  <button onClick={()=>addCombo(combo)} style={{
                    width:"100%", padding:"9px", fontSize:11, fontWeight:800, cursor:"pointer",
                    background: comboAdded[combo.id]?B[100]:B[500],
                    color:      comboAdded[combo.id]?B[500]:B[0],
                    border:     `1px solid ${comboAdded[combo.id]?B[400]:B[500]}`,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                  }}>
                    {comboAdded[combo.id] ? <>{Ic.check(12)} Adicionado</> : <>{Ic.plus(12)} Adicionar combo</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorias */}
        <div style={{ background:B[0], borderTop:`1px solid ${B[150]}`, borderBottom:`1px solid ${B[150]}` }}>
          <div style={{ display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
            {PRODUCT_CATS.map(cat=>(
              <button key={cat} onClick={()=>setActiveCat(cat)} style={{
                padding:"11px 14px", background:"none", border:"none", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                fontSize:11, fontWeight:700, letterSpacing:.3,
                color:       activeCat===cat?B[500]:B[400],
                borderBottom:activeCat===cat?`2px solid ${B[500]}`:"2px solid transparent",
                marginBottom:-1,
              }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Grid de produtos */}
        <div style={{ padding:10, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {filteredProds.map(p=>{
            const qty = cart[p.id]||0;
            const lowStock = p.stock<20;
            return (
              <div key={p.id} style={{
                background:B[0], border:`1px solid ${qty>0?B[400]:B[200]}`,
                borderTop:`3px solid ${qty>0?B[500]:B[200]}`,
                padding:"11px 11px 10px", display:"flex", flexDirection:"column", gap:6,
              }}>
                <div style={{ fontSize:9, color:B[400], fontFamily:"monospace" }}>{p.ref}</div>
                <div style={{ fontSize:12, fontWeight:700, color:B[800], lineHeight:1.3, flex:1 }}>{p.name}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:900, color:B[700], fontVariantNumeric:"tabular-nums" }}>{fmt(p.price)}</div>
                    <div style={{ fontSize:9, color: lowStock?"#B45309":B[400] }}>{lowStock?`⚠ ${p.stock} un`:p.unit}</div>
                  </div>
                  <div style={{ fontSize:9, color:B[400], textAlign:"right" }}>{p.cat}</div>
                </div>

                {qty===0 ? (
                  <button onClick={()=>addToCart(p.id)} style={{ padding:"9px", background:B[500], color:B[0], border:"none", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                    {Ic.plus(13)} Adicionar
                  </button>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:0, border:`1px solid ${B[400]}` }}>
                    <button onClick={()=>setQty(p.id,qty-1)} style={{ flex:1, padding:"8px 0", background:B[100], border:"none", color:B[700], cursor:"pointer", fontWeight:900, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                    <span style={{ flex:1, textAlign:"center", fontWeight:800, fontSize:14, color:B[800], fontFamily:"monospace" }}>{qty}</span>
                    <button onClick={()=>addToCart(p.id)} style={{ flex:1, padding:"8px 0", background:B[500], border:"none", color:B[0], cursor:"pointer", fontWeight:900, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
          {filteredProds.length===0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"32px", color:B[400], fontSize:13 }}>Nenhum produto encontrado</div>
          )}
        </div>
      </div>

      {/* Barra flutuante do carrinho */}
      {cartCount>0 && (
        <div style={{ position:"fixed", bottom: isMobile?68:16, left:isMobile?0:"auto", right:0, width:isMobile?"100%":"auto", padding:isMobile?"10px 14px":"0", zIndex:100, display:"flex", justifyContent: isMobile?"stretch":"flex-end" }}>
          <button onClick={()=>setStep("cart")} style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"space-between",
            background:B[800], color:B[0], border:"none", padding:"14px 20px", cursor:"pointer",
            boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
            maxWidth: isMobile?"none":340,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ position:"relative" }}>
                {Ic.cart(22)}
                <div style={{ position:"absolute", top:-6, right:-6, width:17, height:17, background:B[500], borderRadius:"50%", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</div>
              </div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:10, color:B[300], letterSpacing:.5 }}>{cartCount} item{cartCount!==1?"s":""} selecionados</div>
                <div style={{ fontSize:15, fontWeight:900, fontVariantNumeric:"tabular-nums" }}>{fmt(cartTotal)}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700 }}>
              Ver carrinho {Ic.chevR(16)}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

const NAV = [
  { id:"dashboard", label:"Início",    icon:Ic.home   },
  { id:"pedidos",   label:"Pedidos",   icon:Ic.cart   },
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
  const TITLES = { dashboard:"Dashboard", pedidos:"Tirar Pedido", conversas:"Conversas", clientes:"Clientes", metas:"Metas", gestao:"Gestão" };

  const renderPage = () => {
    if (page==="dashboard") return <Dashboard />;
    if (page==="pedidos")   return <Pedidos isMobile={isMobile} />;
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
