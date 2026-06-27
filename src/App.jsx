import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Brand ───────────────────────────────────
const B = {
  900:"#1a2654", 800:"#263b7e", 700:"#2d4a99",
  600:"#3557b5", 500:"#3d64cc", 400:"#7a9adf",
  300:"#b3c7ef", 200:"#d4e0f7", 150:"#e6edfb",
  100:"#f0f5fd", 50:"#f7faff",  0:"#ffffff",
};

// ─── Icons ────────────────────────────────────
const SVG = {
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  chat:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  user:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  funnel:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  target:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  bar:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  send:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  back:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  search:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  menu:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  zap:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  tag:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  trend:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  cal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="0"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  file:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  phone:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.6 1.37h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  map:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chevR:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  filter:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  sort:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="10" y2="14"/><line x1="21" y1="18" x2="10" y2="18"/></svg>,
};
const Ic = ({ n, s=20, c="currentColor" }) => (
  <span style={{ display:"inline-flex", width:s, height:s, color:c, flexShrink:0 }}>{SVG[n]}</span>
);

// ─── Data ─────────────────────────────────────
const CONTACTS = [
  { id:1,  name:"Roberto Pinheiro",   company:"Metalúrgica Pinheiro", role:"Diretor Comercial", phone:"(31) 99201-4455", email:"roberto@metalurgica.com.br", city:"Belo Horizonte", av:"RP", stage:"Fechamento",  val:28500, lastContact:"há 2h",  tags:["Cliente","VIP"],         unread:3, notes:"Decisor principal. Prefere WhatsApp." },
  { id:2,  name:"Carlos Alves",       company:"Distribuidora Alves",  role:"Gerente de Compras", phone:"(31) 98800-2211", email:"carlos@distralves.com.br",  city:"Contagem",       av:"CA", stage:"Proposta",    val:15200, lastContact:"há 1d",  tags:["Cliente"],               unread:0, notes:"Sempre pede desconto. Comparar com concorrentes." },
  { id:3,  name:"João Monteiro",      company:"Ferragens Monteiro",   role:"Proprietário",       phone:"(31) 97700-3344", email:"joao@ferragensmonteiro.com", city:"Betim",          av:"JM", stage:"Negociação",  val:9800,  lastContact:"há 3h",  tags:["Cliente","Recorrente"],  unread:1, notes:"Compra mensalmente. Bom histórico." },
  { id:4,  name:"Marcos Savassi",     company:"Grupo Savassi",        role:"CEO",                phone:"(31) 99900-5566", email:"marcos@gruposavassi.com.br", city:"Belo Horizonte", av:"MS", stage:"Prospect",    val:0,     lastContact:"há 5d",  tags:["Prospect","Alto valor"], unread:0, notes:"Indicação do Roberto. Alto potencial." },
  { id:5,  name:"Ana Central",        company:"AutoPeças Central",    role:"Compradora",         phone:"(31) 98100-7788", email:"ana@autopecascentral.com",   city:"Vespasiano",     av:"AC", stage:"Qualificado", val:4300,  lastContact:"há 30m", tags:["Cliente","Urgente"],     unread:5, notes:"Precisa de rolamentos urgente esta semana." },
  { id:6,  name:"Paulo Lima",         company:"Construtora Lima",     role:"Dir. Suprimentos",   phone:"(31) 96600-9900", email:"paulo@construtoralima.com",  city:"Nova Lima",      av:"PL", stage:"Fechamento",  val:67000, lastContact:"há 1h",  tags:["Cliente","VIP"],         unread:2, notes:"Maior cliente da carteira. Contrato anual." },
  { id:7,  name:"Fernanda Madeira",   company:"MadeiraMad Premium",   role:"Compradora",         phone:"(31) 95500-1122", email:"fernanda@madeiramad.com",    city:"Sabará",         av:"FM", stage:"Prospect",    val:0,     lastContact:"há 2d",  tags:["Prospect"],              unread:0, notes:"Abordagem inicial feita. Aguardar retorno." },
  { id:8,  name:"Leandro Eletro",     company:"EletroSul Comercial",  role:"Gerente Geral",      phone:"(31) 94400-3344", email:"leandro@eletrosul.com.br",   city:"Belo Horizonte", av:"LE", stage:"Proposta",    val:22100, lastContact:"há 6h",  tags:["Cliente","Recorrente"],  unread:0, notes:"Faz pedidos trimestrais." },
  { id:9,  name:"Beatriz Horizonte",  company:"Ind. Horizonte",       role:"Diretora",           phone:"(31) 93300-4455", email:"beatriz@indhorizonte.com",   city:"Contagem",       av:"BH", stage:"Prospect",    val:0,     lastContact:"há 7d",  tags:["Prospect","Alto valor"], unread:0, notes:"Empresa grande. Processo de aprovação longo." },
  { id:10, name:"Rodrigo Vespas",     company:"Vespas Indústria",     role:"Comprador Sênior",   phone:"(31) 92200-5566", email:"rodrigo@vespas.ind.br",      city:"Vespasiano",     av:"RV", stage:"Qualificado", val:6800,  lastContact:"há 1d",  tags:["Cliente"],               unread:0, notes:"Recém qualificado. Mandar catálogo." },
];

const CLIENTS = CONTACTS.filter(c=>c.stage!=="Prospect");
const ALL_TAGS = ["Todos","VIP","Cliente","Prospect","Recorrente","Urgente","Alto valor"];
const ALL_CITIES = ["Todas", ...new Set(CONTACTS.map(c=>c.city))];

const PRODUCTS = [
  { id:"P01", cat:"Válvulas",    name:"Válvula V200",            price:285,  stock:120, unit:"un", ref:"VLV-200"  },
  { id:"P02", cat:"Válvulas",    name:"Válvula V350 Industrial", price:490,  stock:44,  unit:"un", ref:"VLV-350"  },
  { id:"P03", cat:"Válvulas",    name:"Válvula Esfera 1/2",      price:68,   stock:200, unit:"un", ref:"VLV-E12"  },
  { id:"P04", cat:"Rolamentos",  name:"Rolamento 6205",          price:42,   stock:48,  unit:"un", ref:"ROL-6205" },
  { id:"P05", cat:"Rolamentos",  name:"Rolamento 6305",          price:58,   stock:12,  unit:"un", ref:"ROL-6305" },
  { id:"P06", cat:"Rolamentos",  name:"Rolamento 6208 2RS",      price:74,   stock:30,  unit:"un", ref:"ROL-6208" },
  { id:"P07", cat:"Fixação",     name:"Parafuso Sextavado M12",  price:1.80, stock:5000,unit:"cx", ref:"PAR-M12"  },
  { id:"P08", cat:"Fixação",     name:"Porca Sextavada M12",     price:0.90, stock:8000,unit:"cx", ref:"PRC-M12"  },
  { id:"P10", cat:"Transmissão", name:"Correia Dentada T5",      price:34,   stock:200, unit:"un", ref:"COR-T5"   },
  { id:"P11", cat:"Transmissão", name:"Polia Alumínio 80mm",     price:87,   stock:60,  unit:"un", ref:"POL-080"  },
  { id:"P12", cat:"Hidráulico",  name:"Mangueira Hidráulica 3/4",price:28.5, stock:300, unit:"mt", ref:"MAN-34"   },
  { id:"P13", cat:"Hidráulico",  name:"Conector Reto 3/4",       price:12,   stock:400, unit:"un", ref:"CON-34"   },
  { id:"P14", cat:"Elétrico",    name:"Cabo PP 2x2.5mm",         price:8.90, stock:1000,unit:"mt", ref:"CAB-225"  },
  { id:"P15", cat:"Elétrico",    name:"Disjuntor DIN 20A",       price:32,   stock:150, unit:"un", ref:"DIS-20A"  },
];
const CATS = ["Todos", ...new Set(PRODUCTS.map(p=>p.cat))];
const PROMOS = [
  { id:"PR1", title:"Válvulas em Destaque", sub:"V200 + V350 com 12% OFF", badge:"−12%", pids:["P01","P02"] },
  { id:"PR2", title:"Rolamentos da Semana",  sub:"Leve 5 pague 4 na linha", badge:"5×4",  pids:["P04","P05"] },
  { id:"PR3", title:"Fixação em Atacado",    sub:"+500cx com 8% desconto",  badge:"−8%",  pids:["P07","P08"] },
];
const COMBOS = [
  { id:"C1", name:"Kit Hidráulico",   items:[{id:"P12",q:10},{id:"P13",q:5}],  orig:427, price:360, save:67,  tag:"Top" },
  { id:"C2", name:"Pack Rolamentos",  items:[{id:"P04",q:5},{id:"P05",q:3}],   orig:360, price:295, save:65,  tag:"Limitado" },
  { id:"C3", name:"Kit Transmissão",  items:[{id:"P10",q:2},{id:"P11",q:1}],   orig:155, price:125, save:30,  tag:"Novo" },
  { id:"C4", name:"Fixação M12 Pack", items:[{id:"P07",q:50},{id:"P08",q:50}], orig:135, price:105, save:30,  tag:"Econômico" },
];
const PAYMENT  = ["À vista","7 dias","14 dias","21 dias","30/60","30/60/90","45/90/135"];
const DELIVERY = ["Retirada","3 dias úteis","5 dias úteis","7 dias úteis","10 dias úteis","A combinar"];
const MONTH_DATA = [
  {m:"Jan",v:42000,t:50000},{m:"Fev",v:58000,t:50000},{m:"Mar",v:47000,t:55000},
  {m:"Abr",v:63000,t:55000},{m:"Mai",v:71000,t:60000},{m:"Jun",v:55000,t:60000},
];
const CHATS_DATA = {
  1:[{f:"c",t:"Bom dia! Preciso do orçamento das válvulas.",h:"09:14"},{f:"m",t:"Vou gerar agora pelo sistema.",h:"09:15"},{f:"m",t:"Orçamento #2847 — 50× Válvula V200\nTotal: R$ 14.250,00 · Validade: 10 dias",h:"09:16"},{f:"c",t:"Podem incluir mais 20 unidades?",h:"09:31"},{f:"c",t:"E qual o prazo de entrega?",h:"09:45"}],
  5:[{f:"c",t:"Oi, quero ver o catálogo de rolamentos.",h:"14:02"},{f:"m",t:"Boa tarde! Enviando catálogo.",h:"14:03"},{f:"c",t:"Especialmente 6205 e 6305 para esta semana.",h:"14:11"},{f:"m",t:"6205 — 48 un em BH. 6305 — 12 un. Faço reserva?",h:"14:15"}],
  3:[{f:"c",t:"Proposta da semana passada, conseguiu revisar?",h:"11:00"},{f:"m",t:"Aprovado desconto de 5%.",h:"11:05"},{f:"c",t:"Precisamos parcelar em 3× sem juros.",h:"11:20"}],
  6:[{f:"c",t:"Bom dia, quando chegam os materiais para obra?",h:"08:30"},{f:"m",t:"Previsão 02/07. Acompanhando com a logística.",h:"08:45"},{f:"c",t:"Pode adiantar mais 5 toneladas de aço?",h:"09:10"}],
};

const fmt = n => "R$\u00a0" + (+n).toLocaleString("pt-BR", {minimumFractionDigits:0});
const pct = (a,b) => Math.round(a/b*100);

// ─── Primitives ───────────────────────────────
const Av = ({ lbl, sz=36, bg=B[800] }) => (
  <div style={{ width:sz, height:sz, background:bg, color:B[0], display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*.33, fontWeight:700, flexShrink:0, letterSpacing:.5 }}>{lbl}</div>
);

const Tag = ({ label, variant="default" }) => {
  const v = { default:{bg:B[150],c:B[700]}, vip:{bg:"#fef3c7",c:"#92400e"}, urgente:{bg:"#fee2e2",c:"#991b1b"}, prospect:{bg:"#f0fdf4",c:"#166534"} }[variant]||{bg:B[150],c:B[700]};
  return <span style={{ fontSize:9, fontWeight:800, padding:"2px 7px", textTransform:"uppercase", letterSpacing:.5, background:v.bg, color:v.c }}>{label}</span>;
};

const tagVariant = t => ({ VIP:"vip", Urgente:"urgente", Prospect:"prospect" }[t]||"default");

// ─── SIDEBAR ──────────────────────────────────
const SIDE_ITEMS = [
  { section:"Principal" },
  { id:"home",      label:"Início",             icon:"home"   },
  { id:"pedidos",   label:"Tirar Pedido",        icon:"cart"   },
  { id:"conversas", label:"Conversas",           icon:"chat"   },
  { section:"Clientes" },
  { id:"contatos",  label:"Carteira de Contatos",icon:"user"   },
  { id:"funil",     label:"Funil de Vendas",     icon:"funnel" },
  { section:"Performance" },
  { id:"metas",     label:"Metas",               icon:"target" },
  { id:"gestao",    label:"Gestão",              icon:"bar"    },
];

function Sidebar({ open, onClose, tab, setTab }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(15,20,50,0.55)", zIndex:200, backdropFilter:"blur(2px)" }} />
      )}
      {/* Drawer */}
      <div style={{
        position:"fixed", top:0, left:0, bottom:0, width:272,
        background:B[0], zIndex:201,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition:"transform .25s cubic-bezier(.4,0,.2,1)",
        display:"flex", flexDirection:"column", boxShadow: open?"4px 0 32px rgba(15,20,50,0.18)":"none",
      }}>
        {/* Header do drawer */}
        <div style={{ background:B[800], padding:"16px 20px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <img src="/logo.svg" alt="CRepresentante" style={{ height:28, filter:"brightness(0) invert(1)" }}
            onError={e=>{ e.target.style.display="none"; e.target.nextSibling.style.display="block"; }}
          />
          <span style={{ display:"none", fontSize:14, fontWeight:900, color:B[0] }}>CRepresentante</span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", padding:8 }}>
            <Ic n="x" s={18} c={B[0]} />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {SIDE_ITEMS.map((item, i) => {
            if (item.section) return (
              <div key={i} style={{ padding:"14px 20px 6px", fontSize:9, fontWeight:800, color:B[400], textTransform:"uppercase", letterSpacing:1.2 }}>{item.section}</div>
            );
            const active = tab===item.id;
            return (
              <button key={item.id} onClick={()=>{ setTab(item.id); onClose(); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:14,
                padding:"13px 20px", background:active?B[100]:"none",
                borderLeft:active?`3px solid ${B[800]}`:"3px solid transparent",
                border:"none", cursor:"pointer", textAlign:"left", fontFamily:"inherit",
              }}>
                <Ic n={item.icon} s={20} c={active?B[800]:B[400]} />
                <span style={{ fontSize:14, fontWeight:active?700:500, color:active?B[800]:B[600] }}>{item.label}</span>
                {active && <span style={{ marginLeft:"auto" }}><Ic n="chevR" s={14} c={B[400]} /></span>}
              </button>
            );
          })}
        </div>

        {/* User footer */}
        <div style={{ borderTop:`1px solid ${B[150]}`, padding:"14px 20px", display:"flex", alignItems:"center", gap:12, background:B[50] }}>
          <Av lbl="CS" sz={40} bg={B[800]} />
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>Carlos Souza</div>
            <div style={{ fontSize:11, color:B[500] }}>Rep. Comercial · MG</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PAGE: CARTEIRA DE CONTATOS ───────────────
function Contatos() {
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("Todos");
  const [activeCity, setActiveCity] = useState("Todas");
  const [sort, setSort]           = useState("nome");
  const [selected, setSelected]   = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  let list = CONTACTS
    .filter(c =>
      (activeTag==="Todos" || c.tags.includes(activeTag)) &&
      (activeCity==="Todas" || c.city===activeCity) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.company.toLowerCase().includes(search.toLowerCase()) ||
       c.phone.includes(search))
    )
    .sort((a,b) => sort==="nome" ? a.name.localeCompare(b.name) : sort==="empresa" ? a.company.localeCompare(b.company) : b.val-a.val);

  // ── Detalhe do contato ──
  if (selected) {
    const c = CONTACTS.find(x=>x.id===selected);
    return (
      <div style={{ display:"flex", flexDirection:"column", minHeight:"100%" }}>
        {/* Topbar */}
        <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>setSelected(null)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",padding:4 }}>
            <Ic n="back" s={22} c={B[800]} />
          </button>
          <div style={{ flex:1, fontSize:13, fontWeight:700, color:B[800] }}>Contato</div>
        </div>

        {/* Hero do contato */}
        <div style={{ background:B[800], padding:"24px 20px 20px", display:"flex", gap:16, alignItems:"center" }}>
          <Av lbl={c.av} sz={56} bg={B[600]} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:800, color:B[0] }}>{c.name}</div>
            <div style={{ fontSize:13, color:B[300], marginTop:2 }}>{c.role}</div>
            <div style={{ fontSize:12, color:B[400], marginTop:1 }}>{c.company}</div>
            <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
              {c.tags.map(t=><Tag key={t} label={t} variant={tagVariant(t)} />)}
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${B[150]}` }}>
          {[["phone","Ligar"],["chat","WhatsApp"],["cal","Visita"],["file","Orçar"]].map(([icon,lbl])=>(
            <button key={lbl} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"14px 8px",background:B[0],border:"none",borderRight:`1px solid ${B[150]}`,cursor:"pointer" }}>
              <Ic n={icon} s={20} c={B[800]} />
              <span style={{ fontSize:9,fontWeight:700,color:B[600],textTransform:"uppercase",letterSpacing:.4 }}>{lbl}</span>
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {/* Informações */}
          <div style={{ background:B[0], margin:"1px 0" }}>
            <div style={{ padding:"12px 16px 0", fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.8 }}>Informações</div>
            {[
              { icon:"phone", label:"Telefone",     val:c.phone    },
              { icon:"mail",  label:"E-mail",        val:c.email    },
              { icon:"map",   label:"Cidade",        val:c.city     },
              { icon:"user",  label:"Cargo",         val:c.role     },
              { icon:"funnel",label:"Estágio",       val:c.stage    },
            ].map(row=>(
              <div key={row.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderBottom:`1px solid ${B[100]}` }}>
                <Ic n={row.icon} s={18} c={B[400]} />
                <div>
                  <div style={{ fontSize:10, color:B[400], marginBottom:2 }}>{row.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:B[800] }}>{row.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          {c.val>0 && (
            <div style={{ background:B[0], margin:"1px 0", padding:"14px 16px" }}>
              <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:10 }}>Pipeline</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:11, color:B[500] }}>Valor em negociação</div>
                  <div style={{ fontSize:24, fontWeight:900, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(c.val)}</div>
                </div>
                <Tag label={c.stage} variant={tagVariant(c.stage)} />
              </div>
            </div>
          )}

          {/* Notas */}
          <div style={{ background:B[0], margin:"1px 0", padding:"14px 16px" }}>
            <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Notas do representante</div>
            <div style={{ fontSize:13, color:B[700], lineHeight:1.6, background:B[50], padding:"12px 14px", borderLeft:`3px solid ${B[800]}` }}>{c.notes}</div>
          </div>

          {/* Último contato */}
          <div style={{ background:B[0], margin:"1px 0", padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.8 }}>Último contato</div>
              <span style={{ fontSize:12, color:B[500] }}>{c.lastContact}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Lista principal ──
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100%" }}>
      {/* Busca */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, padding:"10px 14px" }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:B[50], border:`1px solid ${B[200]}`, padding:"10px 12px" }}>
            <Ic n="search" s={16} c={B[400]} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nome, empresa ou telefone..."
              style={{ border:"none",background:"none",outline:"none",fontSize:14,color:B[800],flex:1,fontFamily:"inherit" }} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",display:"flex" }}><Ic n="x" s={15} c={B[400]} /></button>}
          </div>
          <button onClick={()=>setShowFilters(f=>!f)} style={{ padding:"10px 12px",background:showFilters?B[800]:B[50],border:`1px solid ${showFilters?B[800]:B[200]}`,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
            <Ic n="filter" s={16} c={showFilters?B[0]:B[600]} />
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div style={{ background:B[50], borderBottom:`1px solid ${B[150]}`, padding:"10px 14px" }}>
          {/* Tags */}
          <div style={{ fontSize:9, fontWeight:800, color:B[500], textTransform:"uppercase", letterSpacing:.8, marginBottom:7 }}>Tag</div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", marginBottom:12 }}>
            {ALL_TAGS.map(t=>(
              <button key={t} onClick={()=>setActiveTag(t)} style={{ flexShrink:0,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",background:activeTag===t?B[800]:B[0],color:activeTag===t?B[0]:B[600],border:`1px solid ${activeTag===t?B[800]:B[200]}` }}>{t}</button>
            ))}
          </div>
          {/* Cidades */}
          <div style={{ fontSize:9, fontWeight:800, color:B[500], textTransform:"uppercase", letterSpacing:.8, marginBottom:7 }}>Cidade</div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", marginBottom:8 }}>
            {ALL_CITIES.map(c=>(
              <button key={c} onClick={()=>setActiveCity(c)} style={{ flexShrink:0,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",background:activeCity===c?B[800]:B[0],color:activeCity===c?B[0]:B[600],border:`1px solid ${activeCity===c?B[800]:B[200]}` }}>{c}</button>
            ))}
          </div>
          {/* Sort */}
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:9, fontWeight:800, color:B[500], textTransform:"uppercase", letterSpacing:.8 }}>Ordenar:</span>
            {[["nome","Nome"],["empresa","Empresa"],["valor","Valor"]].map(([v,l])=>(
              <button key={v} onClick={()=>setSort(v)} style={{ padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",background:sort===v?B[800]:B[0],color:sort===v?B[0]:B[600],border:`1px solid ${sort===v?B[800]:B[200]}` }}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {/* Contagem */}
      <div style={{ padding:"8px 16px", background:B[50], borderBottom:`1px solid ${B[150]}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:B[500] }}>{list.length} contato{list.length!==1?"s":""}</span>
        <button style={{ fontSize:11, fontWeight:700, color:B[800], background:"none", border:`1px solid ${B[300]}`, padding:"5px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
          <Ic n="plus" s={13} c={B[800]} /> Novo
        </button>
      </div>

      {/* Lista */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {list.map(c=>(
          <div key={c.id} onClick={()=>setSelected(c.id)} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start", cursor:"pointer", activeBackground:B[50] }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <Av lbl={c.av} sz={44} bg={B[800]} />
              {c.unread>0 && <div style={{ position:"absolute",top:-3,right:-3,width:17,height:17,background:B[500],borderRadius:"50%",fontSize:9,fontWeight:900,color:B[0],display:"flex",alignItems:"center",justifyContent:"center" }}>{c.unread}</div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:14, fontWeight:700, color:B[800] }}>{c.name}</span>
                <span style={{ fontSize:11, color:B[400], flexShrink:0 }}>{c.lastContact}</span>
              </div>
              <div style={{ fontSize:12, color:B[500], marginBottom:4 }}>{c.company}</div>
              <div style={{ fontSize:11, color:B[400], marginBottom:6, display:"flex", alignItems:"center", gap:5 }}>
                <Ic n="map" s={12} c={B[400]} />{c.city}
              </div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {c.tags.slice(0,2).map(t=><Tag key={t} label={t} variant={tagVariant(t)} />)}
                </div>
                {c.val>0 && <span style={{ fontSize:12, fontWeight:800, color:B[800], fontVariantNumeric:"tabular-nums" }}>{fmt(c.val)}</span>}
              </div>
            </div>
            <Ic n="chevR" s={16} c={B[300]} />
          </div>
        ))}
        {list.length===0 && (
          <div style={{ textAlign:"center", padding:"48px 24px", color:B[400] }}>
            <div style={{ fontSize:13, fontWeight:600 }}>Nenhum contato encontrado</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PAGE: FUNIL ──────────────────────────────
const STAGES = ["Fechamento","Negociação","Proposta","Qualificado","Prospect"];
function Funil() {
  return (
    <div>
      {/* Resumo */}
      <div style={{ background:B[0], padding:"14px 16px", borderBottom:`1px solid ${B[150]}`, display:"flex", gap:16 }}>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:900, color:B[800] }}>{CONTACTS.length}</div>
          <div style={{ fontSize:10, color:B[500], textTransform:"uppercase", letterSpacing:.6 }}>Total</div>
        </div>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:900, color:B[800] }}>{fmt(CONTACTS.reduce((a,c)=>a+c.val,0))}</div>
          <div style={{ fontSize:10, color:B[500], textTransform:"uppercase", letterSpacing:.6 }}>Pipeline</div>
        </div>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:900, color:B[800] }}>34%</div>
          <div style={{ fontSize:10, color:B[500], textTransform:"uppercase", letterSpacing:.6 }}>Conversão</div>
        </div>
      </div>

      {/* Funil visual */}
      <div style={{ padding:"16px 16px 8px", background:B[0], borderBottom:`1px solid ${B[150]}` }}>
        <div style={{ fontSize:10, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>Funil visual</div>
        {STAGES.map((s,i)=>{
          const n=CONTACTS.filter(c=>c.stage===s).length;
          const w=[100,78,58,40,25][i];
          const op=1-i*.12;
          return (
            <div key={s} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:B[600], marginBottom:5 }}>
                <span style={{ fontWeight:700, textTransform:"uppercase", letterSpacing:.4 }}>{s}</span>
                <span style={{ fontWeight:800, color:B[800] }}>{n}</span>
              </div>
              <div style={{ background:B[100], height:28, position:"relative" }}>
                <div style={{ position:"absolute",left:0,top:0,height:"100%",width:`${w}%`,background:`rgba(38,59,126,${op})`,display:"flex",alignItems:"center",paddingLeft:10 }}>
                  <span style={{ fontSize:10,color:B[0],fontWeight:700 }}>{w}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Por estágio */}
      {STAGES.map(stage=>{
        const cs=CONTACTS.filter(c=>c.stage===stage);
        if(!cs.length) return null;
        const total=cs.reduce((a,c)=>a+c.val,0);
        return (
          <div key={stage} style={{ marginBottom:1 }}>
            <div style={{ padding:"10px 16px", background:B[800], display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, fontWeight:800, color:B[0], textTransform:"uppercase", letterSpacing:.8 }}>{stage}</span>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                {total>0 && <span style={{ fontSize:11, fontWeight:700, color:B[300], fontVariantNumeric:"tabular-nums" }}>{fmt(total)}</span>}
                <span style={{ fontSize:10, fontWeight:800, background:"rgba(255,255,255,0.15)", color:B[0], padding:"2px 8px" }}>{cs.length}</span>
              </div>
            </div>
            {cs.map(c=>(
              <div key={c.id} style={{ background:B[0], borderBottom:`1px solid ${B[100]}`, padding:"12px 16px", display:"flex", gap:12, alignItems:"center" }}>
                <Av lbl={c.av} sz={38} bg={B[700]} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:B[800] }}>{c.name}</div>
                  <div style={{ fontSize:11, color:B[500] }}>{c.company} · {c.city}</div>
                  {c.val>0 && <div style={{ fontSize:14, fontWeight:900, color:B[800], marginTop:4, fontVariantNumeric:"tabular-nums" }}>{fmt(c.val)}</div>}
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button style={{ padding:"8px",background:B[800],border:"none",cursor:"pointer",display:"flex" }}><Ic n="chat" s={16} c={B[0]} /></button>
                  <button style={{ padding:"8px",background:B[50],border:`1px solid ${B[200]}`,cursor:"pointer",display:"flex" }}><Ic n="file" s={16} c={B[600]} /></button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── PAGE: HOME ───────────────────────────────
function Home() {
  return (
    <div style={{ paddingBottom:24 }}>
      <div style={{ background:B[800], padding:"20px 20px 24px" }}>
        <div style={{ fontSize:12, color:B[300], marginBottom:4 }}>Bom dia, Carlos 👋</div>
        <div style={{ display:"flex", gap:0, marginBottom:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:B[400] }}>Realizado</div>
            <div style={{ fontSize:28, fontWeight:900, color:B[0], letterSpacing:-1, fontVariantNumeric:"tabular-nums" }}>R$55k</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:B[400] }}>Meta</div>
            <div style={{ fontSize:28, fontWeight:900, color:B[300], letterSpacing:-1 }}>R$60k</div>
          </div>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ fontSize:11, color:B[400] }}>Atingimento</div>
            <div style={{ fontSize:28, fontWeight:900, color:"#ffd166", letterSpacing:-1 }}>91%</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.2)", height:6 }}>
          <div style={{ width:"91%", height:6, background:B[300] }} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:B[200] }}>
        {[
          {l:"Visitas marcadas",   v:"8",   s:"3 esta semana",   n:"cal"   },
          {l:"Orçamentos abertos", v:"14",  s:"R$142k em aberto",n:"file"  },
          {l:"Contratos p/ fechar",v:"3",   s:"R$97.500",        n:"check" },
          {l:"Taxa de conversão",  v:"34%", s:"+6pp vs. maio",   n:"trend" },
        ].map(({l,v,s,n})=>(
          <div key={l} style={{ background:B[0], padding:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:10, color:B[500], fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{l}</span>
              <Ic n={n} s={16} c={B[400]} />
            </div>
            <div style={{ fontSize:26, fontWeight:900, color:B[800], letterSpacing:-1 }}>{v}</div>
            <div style={{ fontSize:11, color:B[400], marginTop:4 }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ background:B[0], margin:"1px 0", padding:"16px 16px 8px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6, marginBottom:12 }}>Vendas vs Meta</div>
        <ResponsiveContainer width="100%" height={150}>
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
      <div style={{ background:B[0], margin:"1px 0" }}>
        <div style={{ padding:"12px 16px 0", fontSize:11, fontWeight:700, color:B[700], textTransform:"uppercase", letterSpacing:.6 }}>Carteira de contatos</div>
        {CONTACTS.slice(0,4).map(c=>(
          <div key={c.id} style={{ padding:"10px 16px", borderBottom:`1px solid ${B[100]}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <Av lbl={c.av} sz={32} bg={B[800]} />
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:B[800] }}>{c.name}</div>
                <div style={{ fontSize:11, color:B[500] }}>{c.company}</div>
              </div>
            </div>
            <Tag label={c.stage} variant={tagVariant(c.stage)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: PEDIDOS ────────────────────────────
function Pedidos() {
  const [clientId,setClientId]=useState(CONTACTS[0].id);
  const [cart,setCart]=useState({});
  const [screen,setScreen]=useState("cat");
  const [cat,setCat]=useState("Todos");
  const [search,setSearch]=useState("");
  const [pay,setPay]=useState("30/60");
  const [del,setDel]=useState("5 dias úteis");
  const [notes,setNotes]=useState("");
  const [flash,setFlash]=useState({});

  const client=CONTACTS.find(c=>c.id===clientId);
  const lines=Object.entries(cart).filter(([,q])=>q>0);
  const count=lines.reduce((a,[,q])=>a+q,0);
  const total=lines.reduce((a,[id,q])=>a+(PRODUCTS.find(p=>p.id===id)?.price||0)*q,0);
  const filtered=PRODUCTS.filter(p=>(cat==="Todos"||p.cat===cat)&&(p.name.toLowerCase().includes(search.toLowerCase())||p.ref.toLowerCase().includes(search.toLowerCase())));

  const add=id=>{setCart(c=>({...c,[id]:(c[id]||0)+1}));setFlash(f=>({...f,[id]:true}));setTimeout(()=>setFlash(f=>({...f,[id]:false})),500);};
  const set=(id,q)=>q<=0?setCart(c=>(({[id]:_,...r})=>r)(c)):setCart(c=>({...c,[id]:q}));
  const addCombo=cb=>cb.items.forEach(({id,q})=>setCart(c=>({...c,[id]:(c[id]||0)+q})));

  if(screen==="done") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",gap:20,padding:32,textAlign:"center"}}>
      <div style={{width:80,height:80,background:B[800],display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={40} c={B[0]} /></div>
      <div>
        <div style={{fontSize:22,fontWeight:900,color:B[800]}}>Pedido enviado!</div>
        <div style={{fontSize:13,color:B[500],marginTop:8,lineHeight:1.6}}>ERP registrado · WhatsApp enviado para<br/><strong>{client?.name}</strong></div>
        <div style={{fontSize:28,fontWeight:900,color:B[800],margin:"20px 0 4px",fontVariantNumeric:"tabular-nums"}}>{fmt(total)}</div>
        <div style={{fontSize:12,color:B[400]}}>{pay} · {del}</div>
      </div>
      <button onClick={()=>{setCart({});setScreen("cat");}} style={{padding:"14px 40px",background:B[800],color:B[0],border:"none",fontSize:14,fontWeight:800,cursor:"pointer",marginTop:8}}>Novo Pedido</button>
    </div>
  );

  if(screen==="checkout") return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{background:B[0],borderBottom:`1px solid ${B[150]}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setScreen("cart")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}><Ic n="back" s={22} c={B[800]} /></button>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800,color:B[800]}}>Finalizar</div><div style={{fontSize:11,color:B[500]}}>{client?.name}</div></div>
        <div style={{fontSize:16,fontWeight:900,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt(total)}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:B[50],borderTop:`3px solid ${B[800]}`,border:`1px solid ${B[150]}`,padding:"12px 14px"}}>
          <div style={{fontSize:10,fontWeight:800,color:B[700],textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Resumo</div>
          {lines.map(([id,q])=>{const p=PRODUCTS.find(x=>x.id===id);return(<div key={id} style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}><span style={{color:B[700]}}>{q}× {p?.name}</span><span style={{fontWeight:700,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt((p?.price||0)*q)}</span></div>);})}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:`1px solid ${B[200]}`,marginTop:6}}><span style={{fontSize:14,fontWeight:800,color:B[800]}}>Total</span><span style={{fontSize:16,fontWeight:900,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt(total)}</span></div>
        </div>
        <div><div style={{fontSize:10,fontWeight:800,color:B[700],textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Pagamento</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>{PAYMENT.map(t=>(<button key={t} onClick={()=>setPay(t)} style={{padding:"12px 6px",fontSize:12,fontWeight:700,cursor:"pointer",background:pay===t?B[800]:B[0],color:pay===t?B[0]:B[600],border:`1px solid ${pay===t?B[800]:B[200]}`}}>{t}</button>))}</div></div>
        <div><div style={{fontSize:10,fontWeight:800,color:B[700],textTransform:"uppercase",letterSpacing:.7,marginBottom:10}}>Entrega</div><div style={{display:"flex",flexDirection:"column",gap:6}}>{DELIVERY.map(d=>(<button key={d} onClick={()=>setDel(d)} style={{padding:"13px 16px",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",background:del===d?B[800]:B[0],color:del===d?B[0]:B[700],border:`1px solid ${del===d?B[800]:B[200]}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>{d}{del===d&&<Ic n="check" s={16} c={B[300]} />}</button>))}</div></div>
        <div><div style={{fontSize:10,fontWeight:800,color:B[700],textTransform:"uppercase",letterSpacing:.7,marginBottom:8}}>Observações</div><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Instruções de entrega..." style={{width:"100%",padding:"12px",border:`1px solid ${B[200]}`,fontSize:13,color:B[800],outline:"none",fontFamily:"inherit",resize:"none",boxSizing:"border-box",background:B[50]}} /></div>
        <div style={{height:16}} />
      </div>
      <div style={{background:B[0],borderTop:`1px solid ${B[150]}`,padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>setScreen("done")} style={{padding:"16px",background:B[800],color:B[0],border:"none",fontSize:14,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Ic n="send" s={16} c={B[0]} /> Confirmar e enviar</button>
        <button onClick={()=>setScreen("done")} style={{padding:"11px",background:B[0],color:B[600],border:`1px solid ${B[200]}`,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span style={{fontSize:8,fontWeight:900,background:B[800],color:B[0],padding:"2px 5px"}}>ERP</span> Somente ERP</button>
      </div>
    </div>
  );

  if(screen==="cart") return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{background:B[0],borderBottom:`1px solid ${B[150]}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setScreen("cat")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}><Ic n="back" s={22} c={B[800]} /></button>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:800,color:B[800]}}>Carrinho</div><div style={{fontSize:11,color:B[500]}}>{count} item{count!==1?"s":""} · {client?.name}</div></div>
        <div style={{fontSize:16,fontWeight:900,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt(total)}</div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {lines.length===0?(<div style={{textAlign:"center",padding:"60px 24px",color:B[300]}}><div style={{display:"flex",justifyContent:"center",marginBottom:16,opacity:.3}}><Ic n="cart" s={52} /></div><div style={{fontSize:15,fontWeight:700,color:B[500]}}>Carrinho vazio</div></div>):lines.map(([id,q])=>{const p=PRODUCTS.find(x=>x.id===id);return(<div key={id} style={{background:B[0],borderBottom:`1px solid ${B[100]}`,padding:"14px 16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontSize:13,fontWeight:700,color:B[800]}}>{p?.name}</div><div style={{fontSize:11,color:B[500]}}>{p?.ref} · {fmt(p?.price||0)}/{p?.unit}</div></div><div style={{fontWeight:900,fontSize:15,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt((p?.price||0)*q)}</div></div><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{display:"flex",border:`1px solid ${B[300]}`}}><button onClick={()=>set(id,q-1)} style={{width:44,height:44,background:B[100],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="minus" s={16} c={B[800]} /></button><span style={{width:48,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,color:B[800],fontFamily:"monospace"}}>{q}</span><button onClick={()=>set(id,q+1)} style={{width:44,height:44,background:B[800],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="plus" s={16} c={B[0]} /></button></div><button onClick={()=>set(id,0)} style={{marginLeft:"auto",padding:"8px 14px",background:B[50],border:`1px solid ${B[200]}`,color:B[400],fontSize:11,fontWeight:700,cursor:"pointer"}}>Remover</button></div></div>);})}
      </div>
      {lines.length>0&&(<div style={{background:B[0],borderTop:`2px solid ${B[800]}`,padding:"14px 16px"}}><button onClick={()=>setScreen("checkout")} style={{width:"100%",padding:"16px",background:B[800],color:B[0],border:"none",fontSize:14,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>Finalizar pedido <Ic n="send" s={16} c={B[0]} /></button></div>)}
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{background:B[0],borderBottom:`1px solid ${B[150]}`}}>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",padding:"8px 12px 0",gap:4}}>
          {CONTACTS.filter(c=>c.stage!=="Prospect").map(c=>(
            <button key={c.id} onClick={()=>setClientId(c.id)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:6,padding:"6px 10px 10px",background:"none",border:"none",cursor:"pointer",borderBottom:clientId===c.id?`2px solid ${B[800]}`:"2px solid transparent",marginBottom:-1}}>
              <Av lbl={c.av} sz={22} bg={clientId===c.id?B[800]:B[300]} />
              <span style={{fontSize:11,fontWeight:clientId===c.id?800:500,color:clientId===c.id?B[800]:B[500],whiteSpace:"nowrap"}}>{c.company.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        <div style={{padding:"8px 12px 10px"}}><div style={{display:"flex",alignItems:"center",gap:8,background:B[50],border:`1px solid ${B[200]}`,padding:"10px 12px"}}><Ic n="search" s={17} c={B[400]} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produto ou código..." style={{border:"none",background:"none",outline:"none",fontSize:14,color:B[800],flex:1,fontFamily:"inherit"}} />{search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Ic n="x" s={16} c={B[400]} /></button>}</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:count>0?72:24}}>
        {!search&&(<div style={{padding:"14px 0 0"}}><div style={{padding:"0 14px 10px",display:"flex",alignItems:"center",gap:6}}><Ic n="zap" s={14} c={B[800]} /><span style={{fontSize:11,fontWeight:800,color:B[800],textTransform:"uppercase",letterSpacing:.7}}>Promoções ativas</span></div><div style={{display:"flex",gap:10,overflowX:"auto",scrollbarWidth:"none",padding:"0 14px 14px"}}>{PROMOS.map(pr=>(<div key={pr.id} style={{flexShrink:0,width:230,background:B[800],padding:"14px",position:"relative"}}><div style={{position:"absolute",top:0,right:0,background:B[500],padding:"5px 10px",fontSize:10,fontWeight:900,color:B[0]}}>{pr.badge}</div><div style={{fontSize:14,fontWeight:800,color:B[0],marginTop:10,marginBottom:4}}>{pr.title}</div><div style={{fontSize:11,color:B[300],marginBottom:14,lineHeight:1.4}}>{pr.sub}</div><button onClick={()=>pr.pids.forEach(add)} style={{padding:"9px 16px",background:B[0],color:B[800],border:"none",fontSize:11,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Ic n="plus" s={12} c={B[800]} /> Adicionar</button></div>))}</div></div>)}
        {!search&&(<div style={{padding:"4px 0 8px"}}><div style={{padding:"0 14px 10px",display:"flex",alignItems:"center",gap:6}}><Ic n="tag" s={14} c={B[800]} /><span style={{fontSize:11,fontWeight:800,color:B[800],textTransform:"uppercase",letterSpacing:.7}}>Combos especiais</span></div><div style={{display:"flex",gap:10,overflowX:"auto",scrollbarWidth:"none",padding:"0 14px 14px"}}>{COMBOS.map(cb=>(<div key={cb.id} style={{flexShrink:0,width:190,background:B[0],border:`1px solid ${B[200]}`,borderTop:`3px solid ${B[800]}`,padding:"12px"}}><div style={{fontSize:9,fontWeight:800,color:B[500],textTransform:"uppercase",marginBottom:4}}>{cb.tag}</div><div style={{fontSize:12,fontWeight:800,color:B[800],marginBottom:6,lineHeight:1.3}}>{cb.name}</div><div style={{marginBottom:8}}>{cb.items.map(({id,q})=>{const p=PRODUCTS.find(x=>x.id===id);return<div key={id} style={{fontSize:10,color:B[500],marginBottom:2}}>{q}× {p?.name}</div>;})}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:10}}><div><div style={{fontSize:10,color:B[400],textDecoration:"line-through"}}>{fmt(cb.orig)}</div><div style={{fontSize:16,fontWeight:900,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt(cb.price)}</div></div><div style={{fontSize:10,fontWeight:800,background:B[150],color:B[700],padding:"3px 7px"}}>−{fmt(cb.save)}</div></div><button onClick={()=>addCombo(cb)} style={{width:"100%",padding:"10px",background:B[800],color:B[0],border:"none",fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Ic n="plus" s={12} c={B[0]} /> Adicionar</button></div>))}</div></div>)}
        <div style={{background:B[0],borderTop:`1px solid ${B[150]}`,borderBottom:`1px solid ${B[150]}`,position:"sticky",top:0,zIndex:10}}><div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>{CATS.map(c=>(<button key={c} onClick={()=>setCat(c)} style={{flexShrink:0,padding:"12px 14px",background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",color:cat===c?B[800]:B[400],borderBottom:cat===c?`2px solid ${B[800]}`:"2px solid transparent",marginBottom:-1}}>{c}</button>))}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:10}}>
          {filtered.map(p=>{const q=cart[p.id]||0,fl=flash[p.id],low=p.stock<20;return(<div key={p.id} style={{background:B[0],border:`1px solid ${q>0?B[800]:B[200]}`,borderTop:`3px solid ${q>0?B[800]:B[150]}`,padding:"12px 11px 10px",display:"flex",flexDirection:"column",gap:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:9,color:B[400],fontFamily:"monospace",fontWeight:700}}>{p.ref}</span>{q>0&&<span style={{fontSize:9,fontWeight:900,background:B[800],color:B[0],padding:"1px 6px"}}>{q}</span>}</div><div style={{fontSize:12,fontWeight:700,color:B[800],lineHeight:1.35,flex:1}}>{p.name}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}><div><div style={{fontSize:15,fontWeight:900,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt(p.price)}</div><div style={{fontSize:9,color:B[400]}}>/{p.unit}</div></div>{low&&<span style={{fontSize:9,fontWeight:700,color:"#b45309",background:"#fff7ed",padding:"2px 5px"}}>⚠ {p.stock}</span>}</div>{q===0?(<button onClick={()=>add(p.id)} style={{padding:"11px 0",background:fl?B[300]:B[800],color:B[0],border:"none",fontSize:12,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"background .2s"}}>{fl?<Ic n="check" s={13} c={B[0]} />:<Ic n="plus" s={13} c={B[0]} />}{fl?"Adicionado":"Adicionar"}</button>):(<div style={{display:"flex",overflow:"hidden",border:`1px solid ${B[800]}`}}><button onClick={()=>set(p.id,q-1)} style={{flex:1,padding:"10px 0",background:B[100],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="minus" s={15} c={B[800]} /></button><span style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:15,color:B[800],background:B[0],fontFamily:"monospace"}}>{q}</span><button onClick={()=>add(p.id)} style={{flex:1,padding:"10px 0",background:B[800],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="plus" s={15} c={B[0]} /></button></div>)}</div>);})}
        </div>
      </div>
      {count>0&&(<button onClick={()=>setScreen("cart")} style={{position:"sticky",bottom:0,width:"100%",background:B[800],color:B[0],border:"none",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",flexShrink:0}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{position:"relative"}}><Ic n="cart" s={24} c={B[0]} /><div style={{position:"absolute",top:-6,right:-6,width:18,height:18,background:B[500],borderRadius:"50%",fontSize:10,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{count}</div></div><div style={{textAlign:"left"}}><div style={{fontSize:10,color:B[300]}}>{count} item{count!==1?"s":""}</div><div style={{fontSize:16,fontWeight:900,fontVariantNumeric:"tabular-nums"}}>{fmt(total)}</div></div></div><div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:800}}>Ver carrinho <Ic n="chevR" s={16} c={B[0]} /></div></button>)}
    </div>
  );
}

// ─── PAGE: CONVERSAS ──────────────────────────
function Conversas() {
  const [activeId,setActiveId]=useState(null);
  const [msgs,setMsgs]=useState({...CHATS_DATA});
  const [input,setInput]=useState("");
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,activeId]);
  const send=()=>{if(!input.trim())return;const now=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});setMsgs(m=>({...m,[activeId]:[...(m[activeId]||[]),{f:"m",t:input,h:now}]}));setInput("");};
  const ac=CONTACTS.find(c=>c.id===activeId);
  if(activeId) return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{background:B[800],padding:"12px 16px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button onClick={()=>setActiveId(null)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}><Ic n="back" s={22} c={B[0]} /></button>
        <Av lbl={ac?.av} sz={34} bg={B[600]} />
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:B[0]}}>{ac?.name}</div><div style={{fontSize:10,color:B[300]}}>{ac?.company}</div></div>
        <button style={{padding:"7px 12px",background:B[600],color:B[0],border:"none",fontSize:10,fontWeight:800,cursor:"pointer"}}>Orçamento</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px",background:B[50],display:"flex",flexDirection:"column",gap:8}}>
        {(msgs[activeId]||[]).map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.f==="m"?"flex-end":"flex-start"}}><div style={{maxWidth:"75%",padding:"10px 13px",background:m.f==="m"?B[800]:B[0],border:m.f==="m"?"none":`1px solid ${B[200]}`}}><div style={{fontSize:13,color:m.f==="m"?B[0]:B[800],whiteSpace:"pre-wrap",lineHeight:1.5}}>{m.t}</div><div style={{fontSize:10,color:m.f==="m"?B[300]:B[400],marginTop:5,textAlign:"right"}}>{m.h}</div></div></div>))}
        <div ref={endRef} />
      </div>
      <div style={{background:B[0],padding:"10px 14px",display:"flex",gap:8,borderTop:`1px solid ${B[150]}`,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Digite uma mensagem..." style={{flex:1,padding:"11px 13px",border:`1px solid ${B[200]}`,background:B[50],fontSize:13,color:B[800],outline:"none",fontFamily:"inherit"}} />
        <button onClick={send} style={{width:44,height:44,background:B[800],border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="send" s={17} c={B[0]} /></button>
      </div>
    </div>
  );
  return(
    <div>
      {CONTACTS.map(c=>{const last=(msgs[c.id]||[]).at(-1);return(<div key={c.id} onClick={()=>setActiveId(c.id)} style={{display:"flex",gap:12,padding:"14px 16px",background:B[0],borderBottom:`1px solid ${B[100]}`,cursor:"pointer",alignItems:"center"}}><div style={{position:"relative"}}><Av lbl={c.av} sz={44} bg={B[800]} />{c.unread>0&&<div style={{position:"absolute",top:-3,right:-3,width:17,height:17,background:B[500],borderRadius:"50%",fontSize:9,fontWeight:900,color:B[0],display:"flex",alignItems:"center",justifyContent:"center"}}>{c.unread}</div>}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:14,fontWeight:700,color:B[800]}}>{c.name}</span><span style={{fontSize:11,color:B[400]}}>há {c.lastContact.replace("há ","")}</span></div><div style={{fontSize:12,color:B[500]}}>{c.company}</div><div style={{fontSize:11,color:B[400],overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{last?.t?.split("\n")[0]||"Sem mensagens"}</div></div><Ic n="chevR" s={16} c={B[300]} /></div>);})}
    </div>
  );
}

// ─── PAGE: MAIS ───────────────────────────────
function Mais({ setTab }) {
  const [sub,setSub]=useState("metas");
  return(
    <div>
      <div style={{background:B[0],display:"flex",borderBottom:`1px solid ${B[150]}`}}>
        {[["metas","Metas"],["gestao","Gestão"]].map(([id,lbl])=>(<button key={id} onClick={()=>setSub(id)} style={{flex:1,padding:"14px",background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:sub===id?800:500,color:sub===id?B[800]:B[400],borderBottom:sub===id?`2px solid ${B[800]}`:"2px solid transparent",marginBottom:-1}}>{lbl}</button>))}
      </div>
      {sub==="metas"&&(<div><div style={{background:B[0],padding:"20px 16px",borderBottom:`1px solid ${B[150]}`}}><div style={{fontSize:11,fontWeight:700,color:B[700],textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>Meta Junho 2025</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:28,fontWeight:900,color:B[800]}}>R$55k <span style={{fontSize:14,color:B[400],fontWeight:500}}>/ R$60k</span></div><div style={{fontSize:24,fontWeight:900,color:B[800]}}>91%</div></div><div style={{background:B[150],height:10}}><div style={{width:"91%",height:10,background:B[800]}} /></div><div style={{fontSize:12,color:B[500],marginTop:8}}>Faltam R$5.000 para bater a meta</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:B[200]}}>{[["Visitas","21","25"],["Propostas","14","20"],["Fechamentos","18","22"],["NPS","82","—"]].map(([l,v,m])=>(<div key={l} style={{background:B[0],padding:"16px"}}><div style={{fontSize:10,fontWeight:700,color:B[600],textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</div><div style={{fontSize:26,fontWeight:900,color:B[800]}}>{v}<span style={{fontSize:12,color:B[400],fontWeight:500}}>/{m}</span></div>{m!=="—"&&<div style={{background:B[150],height:4,marginTop:8}}><div style={{width:`${pct(+v,+m)}%`,height:4,background:B[800]}} /></div>}</div>))}</div><div style={{background:B[0],padding:"16px 16px 8px",margin:"1px 0"}}><div style={{fontSize:11,fontWeight:700,color:B[700],textTransform:"uppercase",letterSpacing:.6,marginBottom:12}}>Vendas esta semana</div><ResponsiveContainer width="100%" height={140}><AreaChart data={[{d:"Seg",v:8200},{d:"Ter",v:12400},{d:"Qua",v:6800},{d:"Qui",v:15000},{d:"Sex",v:9100},{d:"Sáb",v:3500}]}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={B[800]} stopOpacity={0.15}/><stop offset="95%" stopColor={B[800]} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="2 4" stroke={B[150]} /><XAxis dataKey="d" tick={{fontSize:10,fill:B[400]}} axisLine={false} tickLine={false} /><YAxis tick={{fontSize:9,fill:B[400]}} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`} /><Tooltip formatter={v=>fmt(v)} contentStyle={{border:`1px solid ${B[200]}`,borderRadius:0,fontSize:11}} /><Area type="monotone" dataKey="v" stroke={B[800]} strokeWidth={2} fill="url(#ag)" name="Vendas" dot={{fill:B[800],r:3,strokeWidth:0}} /></AreaChart></ResponsiveContainer></div></div>)}
      {sub==="gestao"&&(<div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:B[200]}}>{[["Pipeline total","R$147k","6 oportunidades"],["Ticket médio","R$18k","+12% vs maio"],["Ciclo de venda","18 dias","Média fechamento"],["Conversão","34%","+6pp vs maio"],["Msgs WhatsApp","312","Enviadas em jun"],["Clientes ativos","8","3 prospects"]].map(([l,v,s])=>(<div key={l} style={{background:B[0],padding:"16px",borderTop:`3px solid ${B[800]}`}}><div style={{fontSize:10,fontWeight:700,color:B[600],textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</div><div style={{fontSize:22,fontWeight:900,color:B[800],letterSpacing:-1}}>{v}</div><div style={{fontSize:11,color:B[400],marginTop:4}}>{s}</div></div>))}</div><div style={{background:B[0],margin:"1px 0"}}><div style={{padding:"12px 16px 0",fontSize:11,fontWeight:700,color:B[700],textTransform:"uppercase",letterSpacing:.6}}>Orçamentos pendentes</div>{[{n:"#2847",c:"Metalúrgica Pinheiro",v:14250,s:"Aguardando"},{n:"#2848",c:"Construtora Lima",v:67000,s:"Aprovado"},{n:"#2849",c:"EletroSul Comercial",v:22100,s:"Em revisão"},{n:"#2850",c:"AutoPeças Central",v:4300,s:"Aguardando"}].map((o,i)=>(<div key={i} style={{padding:"12px 16px",borderBottom:`1px solid ${B[100]}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:800,color:B[600],fontFamily:"monospace"}}>{o.n}</div><div style={{fontSize:12,color:B[700],marginTop:1}}>{o.c}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:B[800],fontVariantNumeric:"tabular-nums"}}>{fmt(o.v)}</div><Tag label={o.s} /></div></div>))}</div></div>)}
    </div>
  );
}

// ─── NAV TABS ─────────────────────────────────
const TABS = [
  { id:"home",       label:"Início",   icon:"home"  },
  { id:"pedidos",    label:"Pedidos",  icon:"cart"  },
  { id:"conversas",  label:"Chat",     icon:"chat"  },
  { id:"contatos",   label:"Contatos", icon:"user"  },
  { id:"mais",       label:"Mais",     icon:"bar"   },
];

// ─── APP ──────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState("home");
  const [sideOpen, setSideOpen] = useState(false);

  const LABELS = { home:"Início", pedidos:"Tirar Pedido", conversas:"Conversas", contatos:"Carteira de Contatos", funil:"Funil de Vendas", metas:"Metas", gestao:"Gestão", mais:"Mais" };

  const renderPage = () => {
    if (tab==="home")      return <Home />;
    if (tab==="pedidos")   return <Pedidos />;
    if (tab==="conversas") return <Conversas />;
    if (tab==="contatos")  return <Contatos />;
    if (tab==="funil")     return <Funil />;
    if (tab==="mais")      return <Mais setTab={setTab} />;
    return <Home />;
  };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:B[50], height:"100dvh", display:"flex", flexDirection:"column", overflow:"hidden", maxWidth:430, margin:"0 auto", position:"relative" }}>

      <Sidebar open={sideOpen} onClose={()=>setSideOpen(false)} tab={tab} setTab={setTab} />

      {/* ── Header ── */}
      <div style={{ background:B[0], borderBottom:`1px solid ${B[150]}`, flexShrink:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px 0" }}>
          {/* Hamburger */}
          <button onClick={()=>setSideOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:6, marginLeft:-6 }}>
            <Ic n="menu" s={22} c={B[800]} />
          </button>
          {/* Logo */}
          <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
            <img src="/logo.svg" alt="CRepresentante" style={{ height:28, objectFit:"contain" }}
              onError={e=>{ e.target.style.display="none"; document.getElementById("lf").style.display="block"; }}
            />
            <span id="lf" style={{ display:"none", fontSize:15, fontWeight:900, color:B[800] }}>CRepresentante</span>
          </div>
          {/* Notificação + avatar */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button style={{ background:"none", border:"none", cursor:"pointer", position:"relative", display:"flex", padding:4 }}>
              <Ic n="bell" s={21} c={B[600]} />
              <div style={{ position:"absolute", top:3, right:3, width:7, height:7, background:"#ef4444", borderRadius:"50%", border:`1.5px solid ${B[0]}` }} />
            </button>
            <Av lbl="CS" sz={30} bg={B[800]} />
          </div>
        </div>
        {/* Page label */}
        <div style={{ padding:"6px 16px 10px" }}>
          <span style={{ fontSize:12, fontWeight:800, color:B[700], textTransform:"uppercase", letterSpacing:.8 }}>{LABELS[tab]}</span>
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
            <Ic n={t.icon} s={tab===t.id?21:19} c={tab===t.id?B[800]:B[300]} />
            <span style={{ fontSize:9, fontWeight:tab===t.id?800:500, color:tab===t.id?B[800]:B[400], letterSpacing:.2 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
