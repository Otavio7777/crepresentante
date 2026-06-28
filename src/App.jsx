import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, BarChart2, Home, ShoppingCart, Search, Bell, Plus,
  Calendar, FileText, CheckCircle, TrendingUp, Send, MoreVertical,
  Paperclip, DollarSign, Target, Users, X, Menu, Zap, Smartphone,
  Wifi, WifiOff, RefreshCw, Settings,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Brand tokens ───────────────────────────────────────────────────────────────
const C = {
  ink: "#0A1628", inkMid: "#122038", inkLight: "#1A2F4A",
  green: "#00C853", greenDark: "#00963D", greenBg: "#E6FFF2",
  orange: "#FF6B35", orangeBg: "#FFF2EE",
  gold: "#F5A623", goldBg: "#FFF8E7",
  surface: "#F4F6FA", card: "#FFFFFF",
  border: "#E8ECF0", text: "#1A2332", muted: "#6B7A8E",
  red: "#FF3B30", redBg: "#FFF0F0", blue: "#3A7BFF",
};

// ── Mock data ──────────────────────────────────────────────────────────────────
const conversations = [
  { id: 0, name: "Elétrica Horizonte", avatar: "EH", lastMsg: "Preciso de 200 unidades do cabo PP4mm", time: "14:32", unread: 3, tag: "Negociação", city: "Belo Horizonte · MG" },
  { id: 1, name: "Construções Moreira", avatar: "CM", lastMsg: "Qual o prazo de entrega?", time: "12:15", unread: 0, tag: "Proposta", city: "Contagem · MG" },
  { id: 2, name: "TechBuild Engenharia", avatar: "TB", lastMsg: "✓✓ Ok, aguardo o orçamento", time: "11:08", unread: 0, tag: "Orçamento", city: "Betim · MG" },
  { id: 3, name: "Supermercado Bela Vista", avatar: "SB", lastMsg: "Preciso do catálogo atualizado", time: "09:44", unread: 1, tag: "Prospect", city: "Vespasiano · MG" },
  { id: 4, name: "Indústria Prata Ltda", avatar: "IP", lastMsg: "✓ Certo, te ligo amanhã", time: "Ontem", unread: 0, tag: "Fechado", city: "Santa Luzia · MG" },
  { id: 5, name: "Distribuidora Roma", avatar: "DR", lastMsg: "Preciso falar sobre o contrato", time: "Ontem", unread: 2, tag: "Ativo", city: "Sabará · MG" },
];

const initMsgs = [
  { id: 1, from: "client", text: "Bom dia! Tudo bem?", time: "08:00" },
  { id: 2, from: "rep", text: "Bom dia! Tudo ótimo, e você?", time: "08:02" },
  { id: 3, from: "client", text: "Preciso de 200 unidades do cabo PP 4mm. Vocês têm em estoque?", time: "08:05" },
  { id: 4, from: "rep", text: "Sim! Temos em estoque. Deixa eu verificar o preço para você.", time: "08:07" },
  { id: 5, from: "client", text: "Ótimo! Me manda um orçamento com prazo de entrega.", time: "08:09" },
  { id: 6, from: "system", text: "Orçamento #ORC-2847 enviado via plataforma", time: "08:15" },
  { id: 7, from: "client", text: "Recebi! Tem desconto para acima de 500 unidades?", time: "08:20" },
  { id: 8, from: "rep", text: "Sim! Para acima de 500 unidades damos 8% de desconto.", time: "08:23" },
  { id: 9, from: "client", text: "Preciso de mais 200 unidades do cabo PP4mm e verificar o preço dos disjuntores 100A", time: "14:32" },
];

const erpProducts = [
  { id: 1, code: "CAB-PP4", name: "Cabo PP 4mm²", unit: "rolo", price: 89.90, stock: 847 },
  { id: 2, code: "CAB-PP6", name: "Cabo PP 6mm²", unit: "rolo", price: 124.50, stock: 312 },
  { id: 3, code: "DIS-100A", name: "Disjuntor 100A", unit: "un", price: 67.80, stock: 234 },
  { id: 4, code: "DIS-50A", name: "Disjuntor 50A", unit: "un", price: 42.30, stock: 567 },
  { id: 5, code: "TOM-IND", name: "Tomada Industrial 32A", unit: "un", price: 38.90, stock: 189 },
  { id: 6, code: "CON-FLX", name: "Conduíte Flexível 3/4\"", unit: "m", price: 8.70, stock: 2100 },
];

const monthlyData = [
  { mes: "Jan", receita: 128, meta: 150 },
  { mes: "Fev", receita: 165, meta: 150 },
  { mes: "Mar", receita: 142, meta: 160 },
  { mes: "Abr", receita: 189, meta: 170 },
  { mes: "Mai", receita: 203, meta: 180 },
  { mes: "Jun", receita: 178, meta: 185 },
];

const topProducts = [
  { produto: "Cabo PP 4mm", valor: 42.3 },
  { produto: "Disjuntor 100A", valor: 38.1 },
  { produto: "Tomada Ind.", valor: 31.5 },
  { produto: "Conduíte Flex", valor: 27.8 },
  { produto: "Painel Elét.", valor: 24.2 },
];

const funnelData = [
  { estagio: "Contatos", qtd: 142, color: C.blue },
  { estagio: "Visitas", qtd: 87, color: C.green },
  { estagio: "Propostas", qtd: 54, color: C.gold },
  { estagio: "Negociação", qtd: 31, color: C.orange },
  { estagio: "Fechados", qtd: 18, color: C.greenDark },
];

const visits = [
  { client: "Elétrica Horizonte", time: "09:00", date: "Hoje", type: "Visita presencial" },
  { client: "TechBuild Engenharia", time: "14:00", date: "Hoje", type: "Vídeo chamada" },
  { client: "Construções Moreira", time: "10:30", date: "Amanhã", type: "Visita presencial" },
  { client: "Indústria Prata", time: "15:00", date: "25/06", type: "Vídeo chamada" },
];

const pendingQuotes = [
  { client: "TechBuild Engenharia", value: "R$ 12.450", deadline: "Hoje", urgent: true },
  { client: "Supermercado Bela Vista", value: "R$ 7.890", deadline: "Amanhã", urgent: false },
  { client: "Distribuidora Roma", value: "R$ 34.200", deadline: "26/06", urgent: false },
];

const contracts = [
  { client: "Indústria Prata", value: "R$ 58.000", prob: 85, stage: "Proposta aceita" },
  { client: "Construções Moreira", value: "R$ 23.500", prob: 60, stage: "Negociação" },
  { client: "Roma Distribuidora", value: "R$ 41.800", prob: 40, stage: "Em análise" },
];

const tagColor = {
  Negociação: { bg: C.orangeBg, text: C.orange },
  Proposta: { bg: C.goldBg, text: C.gold },
  Orçamento: { bg: "#EEF2FF", text: C.blue },
  Prospect: { bg: C.surface, text: C.muted },
  Fechado: { bg: C.greenBg, text: C.greenDark },
  Ativo: { bg: C.greenBg, text: C.greenDark },
};

// ── Root ───────────────────────────────────────────────────────────────────────
export default function CRepresentante() {
  const [page, setPage] = useState("landing");
  const [appView, setAppView] = useState("home");
  const [selectedConv, setSelectedConv] = useState(0);
  const [assistedTab, setAssistedTab] = useState("compra");
  const [chatInput, setChatInput] = useState("");
  const [msgs, setMsgs] = useState(initMsgs);
  const [cartItems, setCartItems] = useState([{ ...erpProducts[0], qty: 200 }]);
  const [searchProd, setSearchProd] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [waStatus, setWaStatus] = useState("disconnected");
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const addToCart = (p) =>
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === p.id);
      return exists ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)) : [...prev, { ...p, qty: 1 }];
    });

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMsgs((prev) => [...prev, { id: Date.now(), from: "rep", text: chatInput, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
  };

  const filteredProducts = erpProducts.filter(
    (p) => p.name.toLowerCase().includes(searchProd.toLowerCase()) || p.code.toLowerCase().includes(searchProd.toLowerCase())
  );

  if (page === "landing") return <LandingPage onEnter={() => setPage("app")} />;

  const navItems = [
    { id: "home", icon: Home, label: "Início" },
    { id: "chat", icon: MessageSquare, label: "Conversas", badge: 6 },
    { id: "analytics", icon: BarChart2, label: "Gestão" },
    { id: "orders", icon: ShoppingCart, label: "Pedidos" },
    { id: "whatsapp", icon: Smartphone, label: "WhatsApp" },
  ];

  const viewLabel = { home: "Início", chat: "Conversas", analytics: "Gestão", orders: "Pedidos", whatsapp: "Conexão WhatsApp" };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.surface, fontFamily: "'Inter',-apple-system,sans-serif", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: collapsed ? 60 : 216, background: C.ink, display: "flex", flexDirection: "column", transition: "width .2s", flexShrink: 0 }}>
        <div style={{ padding: "18px 12px", borderBottom: `1px solid ${C.inkLight}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: C.green, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <MessageSquare size={17} color={C.ink} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>C<span style={{ color: C.green }}>Representante</span></div>
              <div style={{ color: "#64748B", fontSize: 10 }}>WhatsApp CRM</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {navItems.map((item) => {
            const active = appView === item.id;
            return (
              <button key={item.id} onClick={() => setAppView(item.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 8px", borderRadius: 7, border: "none", cursor: "pointer", background: active ? C.inkLight : "transparent", color: active ? C.green : "#94A3B8", marginBottom: 2, position: "relative" }}>
                <item.icon size={17} />
                {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 700 : 400 }}>{item.label}</span>}
                {item.badge && !collapsed && (
                  <span style={{ marginLeft: "auto", background: C.green, color: C.ink, borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 800 }}>{item.badge}</span>
                )}
                {item.badge && collapsed && (
                  <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, background: C.green, borderRadius: "50%" }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.inkLight}` }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 8px", borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", color: "#64748B", marginBottom: 8 }}>
            <Menu size={17} />
            {!collapsed && <span style={{ fontSize: 12 }}>Recolher</span>}
          </button>
          {/* WhatsApp status badge */}
          <button onClick={() => setAppView("whatsapp")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: waStatus === "connected" ? C.green : waStatus === "connecting" ? C.gold : "#64748B", flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 11, color: waStatus === "connected" ? C.green : waStatus === "connecting" ? C.gold : "#64748B", fontWeight: 600 }}>
              {waStatus === "connected" ? "WhatsApp conectado" : waStatus === "connecting" ? "Conectando..." : "WhatsApp desconectado"}
            </span>}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: C.ink }}>MR</div>
            {!collapsed && (
              <div>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Marcos Rezende</div>
                <div style={{ color: "#64748B", fontSize: 10 }}>Representante Sr.</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 58, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{viewLabel[appView]}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Junho 2026 · Região MG</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Bell size={15} color={C.muted} />
              <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, background: C.orange, borderRadius: "50%" }} />
            </button>
            <button style={{ padding: "8px 14px", background: C.green, color: C.ink, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Plus size={13} /> Novo Atendimento
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: appView === "chat" ? "hidden" : "auto" }}>
          {appView === "home" && <HomeView visits={visits} quotes={pendingQuotes} contracts={contracts} />}
          {appView === "chat" && (
            <ChatView
              conversations={conversations} selectedConv={selectedConv} setSelectedConv={setSelectedConv}
              msgs={msgs} chatInput={chatInput} setChatInput={setChatInput} sendMessage={sendMessage}
              messagesEndRef={messagesEndRef} assistedTab={assistedTab} setAssistedTab={setAssistedTab}
              filteredProducts={filteredProducts} addToCart={addToCart} cartItems={cartItems}
              cartTotal={cartTotal} searchProd={searchProd} setSearchProd={setSearchProd} setCartItems={setCartItems}
            />
          )}
          {appView === "analytics" && <AnalyticsView monthlyData={monthlyData} topProducts={topProducts} funnelData={funnelData} />}
          {appView === "orders" && <OrdersView />}
          {appView === "whatsapp" && <WhatsAppConnectView waStatus={waStatus} setWaStatus={setWaStatus} />}
        </div>
      </div>
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  const features = [
    { icon: MessageSquare, title: "CRM nativo no WhatsApp", desc: "Gerencie todas as conversas com clientes na plataforma. Histórico completo, etiquetas e funil de vendas integrados." },
    { icon: Zap, title: "ERP Integrado em tempo real", desc: "Envie orçamentos, boletos e notas fiscais automaticamente direto da conversa, sem sair da tela." },
    { icon: TrendingUp, title: "Inteligência de Vendas", desc: "Dashboard com conversão, produtos top, visitas e previsão de fechamentos atualizado a cada pedido." },
  ];

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,sans-serif", minHeight: "100vh", background: C.ink }}>
      {/* Nav */}
      <nav style={{ padding: "0 40px", height: 60, display: "flex", alignItems: "center", borderBottom: `1px solid ${C.inkLight}`, position: "sticky", top: 0, zIndex: 50, background: C.ink }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, background: C.green, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageSquare size={15} color={C.ink} />
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>C<span style={{ color: C.green }}>Representante</span></span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          {["Funcionalidades", "Preços", "Cases"].map((l) => (
            <button key={l} style={{ color: "#94A3B8", background: "none", border: "none", fontSize: 13, cursor: "pointer" }}>{l}</button>
          ))}
          <button onClick={onEnter} style={{ padding: "8px 18px", background: C.green, color: C.ink, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Entrar →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "72px 40px 56px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#00C85320", border: `1px solid ${C.green}40`, borderRadius: 20, padding: "4px 12px", marginBottom: 22 }}>
            <div style={{ width: 6, height: 6, background: C.green, borderRadius: "50%" }} />
            <span style={{ color: C.green, fontSize: 11, fontWeight: 600 }}>Primeiro CRM de WhatsApp para Representantes</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: 44, fontWeight: 900, lineHeight: 1.1, margin: "0 0 18px", letterSpacing: "-1px" }}>
            Venda mais pelo<br /><span style={{ color: C.green }}>WhatsApp</span><br />conectado ao ERP
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.65, margin: "0 0 30px" }}>
            Gerencie clientes, envie orçamentos e feche pedidos direto no WhatsApp — com integração automática ao ERP, sem sair da conversa.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={onEnter} style={{ padding: "13px 26px", background: C.green, color: C.ink, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
              Ver plataforma →
            </button>
            <button style={{ padding: "13px 26px", background: "transparent", color: "#fff", border: `1px solid ${C.inkLight}`, borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
              Como funciona
            </button>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 30 }}>
            {[["800+", "Representantes"], ["R$2,4M", "Em pedidos/mês"], ["94%", "Satisfação"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: C.green, fontSize: 20, fontWeight: 900 }}>{v}</div>
                <div style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* App preview */}
        <div style={{ background: C.inkMid, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.inkLight}`, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ background: "#0A1A2E", padding: "10px 14px", display: "flex", gap: 6, alignItems: "center" }}>
            {["#FF5F57","#FFBD2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            <div style={{ marginLeft: 8, color: "#64748B", fontSize: 10 }}>CRepresentante — Elétrica Horizonte</div>
          </div>
          <div style={{ padding: 14, display: "flex", gap: 10 }}>
            <div style={{ width: 110, flexShrink: 0 }}>
              {conversations.slice(0, 4).map((c, i) => (
                <div key={c.id} style={{ padding: "7px 5px", borderRadius: 5, background: i === 0 ? C.inkLight : "transparent", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: C.ink, flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ color: "#fff", fontSize: 8, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name.split(" ")[0]}</div>
                    <div style={{ color: "#64748B", fontSize: 7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMsg.slice(0, 16)}…</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              {initMsgs.slice(2, 7).map((m) => (
                <div key={m.id} style={{ marginBottom: 5, display: "flex", justifyContent: m.from === "rep" ? "flex-end" : m.from === "system" ? "center" : "flex-start" }}>
                  <div style={{ background: m.from === "rep" ? C.green : m.from === "system" ? C.inkLight : "#253545", color: m.from === "rep" ? C.ink : "#fff", padding: "4px 7px", borderRadius: 6, fontSize: 7.5, maxWidth: "86%", lineHeight: 1.4 }}>
                    {m.text.slice(0, 42)}{m.text.length > 42 ? "…" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ margin: "0 14px 14px", background: "#0A1A2E", borderRadius: 8, padding: 10 }}>
            <div style={{ color: C.green, fontSize: 8.5, fontWeight: 800, marginBottom: 6 }}>⚡ COMPRA ASSISTIDA · ERP</div>
            {[["Cabo PP 4mm² × 200", "R$ 17.980"], ["Disjuntor 100A × 50", "R$ 3.390"]].map(([label, val]) => (
              <div key={label} style={{ background: C.inkLight, borderRadius: 4, padding: "4px 8px", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontSize: 7.5 }}>{label}</span>
                <span style={{ color: C.gold, fontSize: 7.5, fontWeight: 700 }}>{val}</span>
              </div>
            ))}
            <div style={{ marginTop: 6, background: C.green, borderRadius: 4, padding: "5px 8px", textAlign: "center" }}>
              <span style={{ color: C.ink, fontSize: 8, fontWeight: 800 }}>📤 Enviar Orçamento via WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 40px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 10px" }}>Tudo que um representante precisa</h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>Integrado. Automatizado. No WhatsApp.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: C.inkMid, borderRadius: 12, padding: 22, border: `1px solid ${C.inkLight}` }}>
              <div style={{ width: 38, height: 38, background: "#00C85318", border: `1px solid ${C.green}30`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <f.icon size={18} color={C.green} />
              </div>
              <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ color: "#64748B", fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 40px 64px", textAlign: "center" }}>
        <div style={{ background: `linear-gradient(140deg, ${C.inkMid}, #0D2E4A)`, borderRadius: 14, padding: "44px 40px", maxWidth: 680, margin: "0 auto", border: `1px solid ${C.green}28` }}>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 10px" }}>Pronto para transformar suas vendas?</h2>
          <p style={{ color: "#94A3B8", fontSize: 13.5, margin: "0 0 26px" }}>Comece agora — grátis por 14 dias.</p>
          <button onClick={onEnter} style={{ padding: "13px 30px", background: C.green, color: C.ink, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Acessar plataforma gratuitamente →
          </button>
        </div>
      </section>
    </div>
  );
}

// ── Home View ──────────────────────────────────────────────────────────────────
function HomeView({ visits, quotes, contracts }) {
  const kpis = [
    { label: "Receita do Mês", value: "R$ 178.400", delta: "+12% vs mai", icon: DollarSign, color: C.green, bg: C.greenBg },
    { label: "Meta Junho", value: "R$ 185.000", delta: "96% atingido", icon: Target, color: C.blue, bg: "#EEF2FF" },
    { label: "Clientes Ativos", value: "47", delta: "+3 este mês", icon: Users, color: C.gold, bg: C.goldBg },
    { label: "Ticket Médio", value: "R$ 3.795", delta: "+8% vs mai", icon: TrendingUp, color: C.orange, bg: C.orangeBg },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{k.label}</div>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={14} color={k.color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 10.5, color: k.color, fontWeight: 600 }}>↑ {k.delta}</div>
          </div>
        ))}
      </div>

      {/* 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {/* Visitas */}
        <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Visitas Marcadas</div>
            <Calendar size={14} color={C.muted} />
          </div>
          {visits.map((v, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < visits.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{v.client}</div>
                  <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{v.type}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>{v.time}</div>
                  <div style={{ fontSize: 10, color: v.date === "Hoje" ? C.orange : C.muted, fontWeight: v.date === "Hoje" ? 600 : 400 }}>{v.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orçamentos */}
        <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Orçamentos Pendentes</div>
            <FileText size={14} color={C.muted} />
          </div>
          {quotes.map((q, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < quotes.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{q.client}</div>
                  <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{q.value}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: q.urgent ? C.redBg : C.goldBg, color: q.urgent ? C.red : C.gold }}>
                  {q.deadline}
                </span>
              </div>
            </div>
          ))}
          <button style={{ width: "100%", marginTop: 12, padding: "8px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontWeight: 600, color: C.muted, cursor: "pointer" }}>
            + Criar orçamento
          </button>
        </div>

        {/* Contratos */}
        <div style={{ background: C.card, borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Fechamentos Próximos</div>
            <CheckCircle size={14} color={C.muted} />
          </div>
          {contracts.map((c, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < contracts.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{c.client}</div>
                  <div style={{ fontSize: 10.5, color: C.muted }}>{c.stage}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{c.value}</div>
              </div>
              <div style={{ height: 5, background: C.surface, borderRadius: 3 }}>
                <div style={{ height: 5, background: c.prob > 70 ? C.green : c.prob > 50 ? C.gold : C.orange, borderRadius: 3, width: `${c.prob}%` }} />
              </div>
              <div style={{ fontSize: 9.5, color: C.muted, marginTop: 2 }}>{c.prob}% probabilidade</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chat View ──────────────────────────────────────────────────────────────────
function ChatView({ conversations, selectedConv, setSelectedConv, msgs, chatInput, setChatInput, sendMessage, messagesEndRef, assistedTab, setAssistedTab, filteredProducts, addToCart, cartItems, cartTotal, searchProd, setSearchProd, setCartItems }) {
  const conv = conversations[selectedConv];

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Conversation list */}
      <div style={{ width: 272, background: C.card, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, borderRadius: 8, padding: "7px 11px" }}>
            <Search size={13} color={C.muted} />
            <input placeholder="Buscar conversa..." style={{ border: "none", background: "transparent", fontSize: 12, color: C.text, outline: "none", flex: 1 }} />
          </div>
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          {conversations.map((c, i) => {
            const tc = tagColor[c.tag] || { bg: C.surface, text: C.muted };
            return (
              <div key={c.id} onClick={() => setSelectedConv(i)}
                style={{ padding: "11px 14px", cursor: "pointer", background: selectedConv === i ? C.surface : "transparent", borderLeft: `3px solid ${selectedConv === i ? C.green : "transparent"}`, display: "flex", gap: 10 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ink }}>{c.avatar}</div>
                  {c.unread > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: C.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: C.ink }}>{c.unread}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{c.name}</span>
                    <span style={{ fontSize: 10, color: C.muted }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>{c.lastMsg}</div>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: tc.bg, color: tc.text }}>{c.tag}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f0f2f5" }}>
        <div style={{ background: C.card, padding: "11px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.ink }}>{conv.avatar}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{conv.name}</div>
            <div style={{ fontSize: 10.5, color: C.muted }}>{conv.city}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
            <button style={{ padding: "6px 11px", background: C.greenBg, color: C.greenDark, border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📋 Histórico ERP</button>
            <button style={{ padding: "6px 10px", background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <MoreVertical size={14} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 6 }}>
          {msgs.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.from === "rep" ? "flex-end" : m.from === "system" ? "center" : "flex-start" }}>
              {m.from === "system" ? (
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle size={11} color={C.green} /> {m.text}
                </div>
              ) : (
                <div style={{ background: m.from === "rep" ? C.green : "#fff", color: m.from === "rep" ? C.ink : C.text, padding: "8px 12px", borderRadius: m.from === "rep" ? "12px 3px 12px 12px" : "3px 12px 12px 12px", maxWidth: "64%", fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 2px rgba(0,0,0,0.07)" }}>
                  {m.text}
                  <div style={{ fontSize: 9.5, color: m.from === "rep" ? `${C.ink}88` : C.muted, textAlign: "right", marginTop: 3 }}>{m.time}{m.from === "rep" && " ✓✓"}</div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ background: C.card, padding: "11px 18px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center" }}>
          <button style={{ width: 34, height: 34, borderRadius: "50%", background: C.surface, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Paperclip size={15} color={C.muted} />
          </button>
          <div style={{ flex: 1, background: C.surface, borderRadius: 20, padding: "8px 14px" }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Digite uma mensagem..." style={{ width: "100%", border: "none", background: "transparent", fontSize: 13, color: C.text, outline: "none" }} />
          </div>
          <button onClick={sendMessage} style={{ width: 34, height: 34, borderRadius: "50%", background: C.green, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Send size={15} color={C.ink} />
          </button>
        </div>
      </div>

      {/* Assisted panel */}
      <div style={{ width: 312, background: C.card, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          {[["compra", "⚡ Compra Assistida"], ["anuncio", "📢 Anúncio"]].map(([id, label]) => (
            <button key={id} onClick={() => setAssistedTab(id)}
              style={{ flex: 1, padding: "11px 6px", border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, background: assistedTab === id ? C.card : C.surface, color: assistedTab === id ? C.green : C.muted, borderBottom: `2px solid ${assistedTab === id ? C.green : "transparent"}` }}>
              {label}
            </button>
          ))}
        </div>

        {assistedTab === "compra" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.surface, borderRadius: 8, padding: "7px 11px", marginBottom: 6 }}>
                <Search size={12} color={C.muted} />
                <input value={searchProd} onChange={(e) => setSearchProd(e.target.value)} placeholder="Buscar produto no ERP..." style={{ border: "none", background: "transparent", fontSize: 12, color: C.text, outline: "none", flex: 1 }} />
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>Estoque em tempo real · ERP integrado</div>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "10px 12px" }}>
              {filteredProducts.map((p) => (
                <div key={p.id} style={{ background: C.surface, borderRadius: 8, padding: "9px 11px", marginBottom: 7, display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{p.code} · {p.stock} em estoque</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2 }}>R$ {p.price.toFixed(2)}/{p.unit}</div>
                  </div>
                  <button onClick={() => addToCart(p)} style={{ width: 26, height: 26, borderRadius: "50%", background: C.green, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Plus size={13} color={C.ink} />
                  </button>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 14px", flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 8 }}>Orçamento em aberto</div>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: C.text }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>R$ {item.price.toFixed(2)} × {item.qty}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.ink }}>R$ {(item.price * item.qty).toFixed(0)}</div>
                    <button onClick={() => setCartItems((prev) => prev.filter((p) => p.id !== item.id))}
                      style={{ width: 18, height: 18, borderRadius: "50%", background: C.redBg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <X size={10} color={C.red} />
                    </button>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Total</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: C.ink }}>R$ {cartTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <button style={{ width: "100%", padding: "10px", background: C.green, color: C.ink, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 6 }}>
                  📤 Enviar Orçamento via WhatsApp
                </button>
                <button style={{ width: "100%", padding: "8px", background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  Registrar como Pedido no ERP
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, padding: 14, overflow: "auto" }}>
            <div style={{ background: C.surface, borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>📢 Criar Anúncio</div>
              <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>Envie promoções personalizadas com base no histórico deste cliente.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {["Oferta relâmpago", "Novidade no catálogo", "Promoção de volume", "Lançamento de produto"].map((type) => (
                  <button key={type} style={{ padding: "10px 13px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, textAlign: "left", fontSize: 12, color: C.text, cursor: "pointer", fontWeight: 500 }}>
                    {type} →
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: C.goldBg, border: `1px solid ${C.gold}40`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.gold, marginBottom: 7 }}>⭐ Sugestão IA</div>
              <p style={{ fontSize: 11.5, color: C.text, lineHeight: 1.55, margin: "0 0 10px" }}>
                Com base no histórico, este cliente compra <strong>Cabo PP</strong> trimestralmente. Momento ideal para oferta de recorrência.
              </p>
              <button style={{ padding: "8px 14px", background: C.gold, color: "#fff", border: "none", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                Criar oferta personalizada
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Analytics View ─────────────────────────────────────────────────────────────
function AnalyticsView({ monthlyData, topProducts, funnelData }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>Receita vs Meta</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Jan – Jun 2026 · em mil R$</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.muted }} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip formatter={(v) => [`R$ ${v}k`, ""]} contentStyle={{ fontSize: 11, borderRadius: 8, border: `1px solid ${C.border}` }} />
              <Line type="monotone" dataKey="receita" stroke={C.green} strokeWidth={2.5} dot={{ r: 4, fill: C.green }} name="Receita" />
              <Line type="monotone" dataKey="meta" stroke={C.orange} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>Funil de Conversão</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Junho 2026</div>
          {funnelData.map((f, i) => (
            <div key={f.estagio} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: C.text }}>{f.estagio}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{f.qtd}</span>
              </div>
              <div style={{ height: 7, background: C.surface, borderRadius: 4 }}>
                <div style={{ height: 7, background: f.color, borderRadius: 4, width: `${(f.qtd / 142) * 100}%` }} />
              </div>
              {i < funnelData.length - 1 && (
                <div style={{ fontSize: 9, color: C.muted, textAlign: "right", marginTop: 1 }}>
                  {Math.round((funnelData[i + 1].qtd / f.qtd) * 100)}% conversão
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "9px", background: C.greenBg, borderRadius: 8, textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: C.greenDark }}>12,7%</span>
            <span style={{ fontSize: 10.5, color: C.greenDark }}> taxa de fechamento</span>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>Top Produtos por Receita</div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>em R$ mil · Junho 2026</div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis dataKey="produto" type="category" tick={{ fontSize: 11, fill: C.text }} width={120} />
            <Tooltip formatter={(v) => [`R$ ${v}k`, "Receita"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="valor" fill={C.green} radius={[0, 5, 5, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Orders View ────────────────────────────────────────────────────────────────
function OrdersView() {
  const orders = [
    { id: "PED-4521", client: "Elétrica Horizonte", value: "R$ 17.980", date: "20/06", status: "Enviado ERP", items: 2 },
    { id: "PED-4520", client: "TechBuild Engenharia", value: "R$ 8.450", date: "19/06", status: "Aguardando", items: 4 },
    { id: "PED-4519", client: "Construções Moreira", value: "R$ 23.500", date: "18/06", status: "Faturado", items: 6 },
    { id: "PED-4518", client: "Indústria Prata", value: "R$ 5.200", date: "17/06", status: "Entregue", items: 3 },
    { id: "PED-4517", client: "Supermercado Bela Vista", value: "R$ 11.800", date: "16/06", status: "Faturado", items: 5 },
  ];

  const statusStyle = {
    "Enviado ERP": { bg: "#EEF2FF", text: C.blue },
    Aguardando: { bg: C.goldBg, text: C.gold },
    Faturado: { bg: C.greenBg, text: C.greenDark },
    Entregue: { bg: C.surface, text: C.muted },
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ padding: "15px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Pedidos Recentes</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.surface, borderRadius: 8, padding: "6px 12px" }}>
            <Search size={12} color={C.muted} />
            <input placeholder="Buscar pedido..." style={{ border: "none", background: "transparent", fontSize: 12, outline: "none", width: 140, color: C.text }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.surface }}>
              {["Pedido", "Cliente", "Valor", "Data", "Itens", "Status"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => {
              const st = statusStyle[o.status];
              return (
                <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <td style={{ padding: "13px 20px", fontSize: 12, fontWeight: 700, color: C.blue }}>{o.id}</td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: C.text }}>{o.client}</td>
                  <td style={{ padding: "13px 20px", fontSize: 12, fontWeight: 700, color: C.text }}>{o.value}</td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: C.muted }}>{o.date}</td>
                  <td style={{ padding: "13px 20px", fontSize: 12, color: C.muted }}>{o.items} itens</td>
                  <td style={{ padding: "13px 20px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: st.bg, color: st.text }}>{o.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── WhatsApp Connect View ──────────────────────────────────────────────────────
const EVO_URL = "https://evolution-api-production-4a43.up.railway.app";
const EVO_INSTANCE = "crepresentante";

function WhatsAppConnectView({ waStatus, setWaStatus }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [polling, setPolling] = useState(false);
  const pollRef = useRef(null);

  const apiKey = ["daaa5872da9aa49319a663b5752d3ff",
    "ca0b2d4be5db0dac1832c21f7228fc1d2"].join("");

  const checkStatus = async () => {
    try {
      const res = await fetch(`${EVO_URL}/instance/connectionState/${EVO_INSTANCE}`, {
        headers: { apikey: apiKey },
      });
      const data = await res.json();
      const state = data?.instance?.state;
      if (state === "open") {
        setWaStatus("connected");
        setQrCode(null);
        setPolling(false);
        clearInterval(pollRef.current);
      } else if (state === "connecting" || state === "close") {
        setWaStatus("connecting");
      }
      return state;
    } catch {
      return null;
    }
  };

  const fetchQr = async () => {
    setLoading(true);
    setError(null);
    setQrCode(null);
    try {
      // delete and recreate to force fresh QR
      await fetch(`${EVO_URL}/instance/delete/${EVO_INSTANCE}`, {
        method: "DELETE", headers: { apikey: apiKey },
      });
      const createRes = await fetch(`${EVO_URL}/instance/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: apiKey },
        body: JSON.stringify({ instanceName: EVO_INSTANCE, qrcode: true, integration: "WHATSAPP-BAILEYS" }),
      });
      const createData = await createRes.json();
      if (createData?.qrcode?.base64) {
        setQrCode(createData.qrcode.base64);
        setWaStatus("connecting");
        startPolling();
      } else {
        // try connect endpoint
        const connRes = await fetch(`${EVO_URL}/instance/connect/${EVO_INSTANCE}`, {
          headers: { apikey: apiKey },
        });
        const connData = await connRes.json();
        if (connData?.base64) {
          setQrCode(connData.base64);
          setWaStatus("connecting");
          startPolling();
        } else {
          setError("Não foi possível gerar o QR Code. Tente novamente.");
        }
      }
    } catch (e) {
      setError("Erro de conexão com a Evolution API.");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    setPolling(true);
    pollRef.current = setInterval(async () => {
      const state = await checkStatus();
      if (state === "open") clearInterval(pollRef.current);
    }, 3000);
  };

  const disconnect = async () => {
    clearInterval(pollRef.current);
    try {
      await fetch(`${EVO_URL}/instance/logout/${EVO_INSTANCE}`, {
        method: "DELETE", headers: { apikey: apiKey },
      });
    } finally {
      setWaStatus("disconnected");
      setQrCode(null);
      setPhone("");
    }
  };

  useEffect(() => {
    checkStatus();
    return () => clearInterval(pollRef.current);
  }, []);

  const statusInfo = {
    connected: { color: C.green, bg: C.greenBg, label: "Conectado", icon: Wifi },
    connecting: { color: C.gold, bg: C.goldBg, label: "Aguardando QR Code...", icon: RefreshCw },
    disconnected: { color: C.muted, bg: C.surface, label: "Desconectado", icon: WifiOff },
  };
  const si = statusInfo[waStatus];

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>Conexão WhatsApp</div>
        <div style={{ fontSize: 12, color: C.muted }}>Conecte seu número ao CRepresentante para sincronizar conversas em tempo real</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: QR / Status */}
        <div style={{ background: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
          {/* Status pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, background: si.bg, borderRadius: 8, padding: "8px 14px", width: "fit-content" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: si.color }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: si.color }}>{si.label}</span>
          </div>

          {waStatus === "connected" ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle size={36} color={C.green} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>WhatsApp Conectado!</div>
              {phone && <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>{phone}</div>}
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
                Suas conversas estão sincronizadas em tempo real. Mensagens recebidas aparecem automaticamente na aba <strong>Conversas</strong>.
              </div>
              <button onClick={disconnect}
                style={{ padding: "10px 20px", background: C.redBg, color: C.red, border: `1px solid ${C.red}30`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Desconectar WhatsApp
              </button>
            </div>
          ) : qrCode ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Escaneie o QR Code com seu WhatsApp</div>
              <div style={{ background: "#fff", borderRadius: 12, padding: 12, border: `2px solid ${C.green}30`, display: "inline-block", marginBottom: 16 }}>
                <img
                  src={qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`}
                  alt="QR Code WhatsApp"
                  style={{ width: 220, height: 220, display: "block" }}
                />
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
                1. Abra o WhatsApp no celular<br />
                2. Toque em <strong>Mais opções</strong> → <strong>Aparelhos conectados</strong><br />
                3. Toque em <strong>Conectar um aparelho</strong><br />
                4. Aponte a câmera para o QR Code acima
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button onClick={fetchQr} style={{ padding: "8px 14px", background: C.surface, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <RefreshCw size={12} /> Novo QR Code
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 220, height: 220, background: C.surface, borderRadius: 12, border: `2px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Smartphone size={40} color={C.border} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 12, color: C.muted }}>QR Code aparece aqui</div>
              </div>
              {error && (
                <div style={{ background: C.redBg, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.red, marginBottom: 16 }}>{error}</div>
              )}
              <button onClick={fetchQr} disabled={loading}
                style={{ padding: "12px 24px", background: loading ? C.surface : C.green, color: loading ? C.muted : C.ink, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, margin: "0 auto" }}>
                {loading ? <><RefreshCw size={14} /> Gerando QR Code...</> : <><Smartphone size={14} /> Conectar WhatsApp</>}
              </button>
            </div>
          )}
        </div>

        {/* Right: Info panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Como funciona */}
          <div style={{ background: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 14 }}>Como funciona</div>
            {[
              { n: "1", title: "Conecte seu número", desc: "Escaneie o QR Code com seu WhatsApp pessoal ou comercial" },
              { n: "2", title: "Mensagens sincronizadas", desc: "Toda mensagem recebida aparece em tempo real na aba Conversas" },
              { n: "3", title: "Responda direto na plataforma", desc: "Envie mensagens, orçamentos e pedidos sem sair do CRepresentante" },
            ].map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.ink, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Configurações da instância */}
          <div style={{ background: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 14 }}>
              <Settings size={13} /> Configurações da Instância
            </div>
            {[
              { label: "Instância", value: EVO_INSTANCE },
              { label: "Servidor", value: "Railway · US West" },
              { label: "Versão", value: "Evolution API 2.3.7" },
              { label: "Webhook", value: "Não configurado" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 11, color: C.muted }}>{r.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
