import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  ArrowLeftRight,
  Search,
  ScanLine,
  Bell,
  User,
  Home,
  ChevronRight,
  ChevronLeft,
  Check,
  Droplet,
  Sparkles,
  Smartphone,
  Baby,
  Grid3x3,
  CreditCard,
  Wallet,
} from "lucide-react";

const BLUE = "#1568C0";
const BLUE_DARK = "#0C447C";
const INK = "#181818";
const PAPER = "#F7F6F2";

const CATEGORIES = [
  { id: "eau", label: "Eau", icon: Droplet, color: "#1568C0", bg: "#E6F1FB", active: true },
  { id: "epicerie", label: "Épicerie", icon: ShoppingBag, color: "#D85A30", bg: "#FAECE7", active: false },
  { id: "maison", label: "Maison", icon: Sparkles, color: "#0F6E56", bg: "#E1F5EE", active: false },
  { id: "tech", label: "High-tech", icon: Smartphone, color: "#854F0B", bg: "#FAEEDA", active: false },
  { id: "bebe", label: "Bébé", icon: Baby, color: "#993556", bg: "#FBEAF0", active: false },
  { id: "tout", label: "Tout voir", icon: Grid3x3, color: "#534AB7", bg: "#EEEDFE", active: false },
];

const PRODUCTS = [
  {
    id: "masafi-500",
    name: "Masafi eau 500ml x12",
    brand: "Masafi",
    trend: [58, 62, 60, 68, 50, 40, 32],
    prices: { Carrefour: 12.5, "Amazon.ae": 13.9, Lulu: 14.25 },
  },
  {
    id: "alain-1500",
    name: "Al Ain eau 1.5L x6",
    brand: "Al Ain",
    trend: [40, 45, 42, 50, 48, 44, 38],
    prices: { "Amazon.ae": 14.6, Carrefour: 15.2, Lulu: 15.9 },
  },
  {
    id: "maidubai-500",
    name: "Mai Dubai eau 500ml x12",
    brand: "Mai Dubai",
    trend: [55, 50, 52, 46, 42, 44, 41],
    prices: { Lulu: 11.75, Carrefour: 12.1, "Amazon.ae": 12.9 },
  },
  {
    id: "arwa-1500",
    name: "Arwa eau 1.5L x6",
    brand: "Arwa",
    trend: [30, 34, 38, 33, 36, 30, 27],
    prices: { Carrefour: 13.4, Lulu: 13.6, "Amazon.ae": 14.1 },
  },
];

function cheapest(prices) {
  const entries = Object.entries(prices);
  return entries.reduce((a, b) => (b[1] < a[1] ? b : a));
}

function Phone({ children, footer }) {
  return (
    <div
      style={{
        width: 340,
        height: 660,
        background: "#fff",
        borderRadius: 34,
        border: `8px solid ${INK}`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: INK,
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px 8px" }}>{children}</div>
      {footer}
    </div>
  );
}

function TopBar({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: INK }}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: BLUE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ShoppingBag size={14} color="#fff" />
      </div>
      <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: -0.2 }}>{title || "Easy Compare Market"}</span>
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#F0EFEA", fg: "#5F5E5A" },
    accent: { bg: "#E6F1FB", fg: BLUE_DARK },
    success: { bg: "#EAF3DE", fg: "#3B6D11" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        background: t.bg,
        color: t.fg,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 20,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "home", icon: Home, label: "Accueil" },
    { id: "search", icon: Search, label: "Recherche" },
    { id: "alerts", icon: Bell, label: "Alertes" },
    { id: "profile", icon: User, label: "Profil" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: "1px solid #ECEAE3",
        padding: "10px 6px 14px",
        background: "#fff",
      }}
    >
      {items.map((it) => {
        const active = screen === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setScreen(it.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: active ? BLUE : "#9B9A93",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function HomeScreen({ goSearch, goDetail }) {
  return (
    <div>
      <TopBar />
      <div
        style={{
          background: `linear-gradient(135deg, ${BLUE}, ${BLUE_DARK})`,
          borderRadius: 18,
          padding: "16px 16px 18px",
          marginBottom: 16,
          color: "#fff",
        }}
      >
        <p style={{ fontSize: 12, opacity: 0.85, margin: 0 }}>Bonjour 👋</p>
        <p style={{ fontSize: 16, fontWeight: 700, margin: "3px 0 0", letterSpacing: -0.2 }}>
          Trouve le meilleur prix en un clin d'œil
        </p>
        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.18)",
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Essai gratuit — 5 jours restants
        </div>
      </div>

      <button
        onClick={goSearch}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: PAPER,
          border: "1px solid #ECEAE3",
          borderRadius: 14,
          padding: "11px 12px",
          marginBottom: 16,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <Search size={16} color="#9B9A93" />
        <span style={{ fontSize: 13, color: "#9B9A93", flex: 1 }}>Rechercher un produit</span>
        <ScanLine size={16} color={BLUE} />
      </button>

      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>Catégories</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => (c.active ? goSearch() : null)}
              style={{
                background: c.bg,
                border: "none",
                borderRadius: 14,
                padding: "12px 6px",
                textAlign: "center",
                cursor: c.active ? "pointer" : "default",
                opacity: c.active ? 1 : 0.55,
              }}
            >
              <Icon size={19} color={c.color} />
              <p style={{ fontSize: 10, fontWeight: 700, margin: "6px 0 0", color: c.color }}>{c.label}</p>
              {!c.active && (
                <p style={{ fontSize: 8, margin: "2px 0 0", color: c.color }}>Bientôt</p>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: "#FAEEDA",
          borderRadius: 14,
          padding: 13,
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#854F0B", margin: 0, letterSpacing: 0.3 }}>SPONSORISÉ</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#633806", margin: "3px 0 0" }}>
            -20% sur l'eau Carrefour cette semaine
          </p>
        </div>
        <ChevronRight size={18} color="#633806" />
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>Recherches récentes</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {PRODUCTS.slice(0, 2).map((p) => {
          const [retailer, price] = cheapest(p.prices);
          return (
            <button
              key={p.id}
              onClick={() => goDetail(p)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ECEAE3",
                borderRadius: 12,
                padding: "9px 12px",
                background: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</span>
              <span style={{ fontSize: 12, color: "#5F5E5A" }}>{price.toFixed(2)} AED</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SearchScreen({ goBack, goDetail }) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  return (
    <div>
      <TopBar title="Rechercher" onBack={goBack} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: PAPER,
          border: "1px solid #ECEAE3",
          borderRadius: 14,
          padding: "10px 12px",
          marginBottom: 6,
        }}
      >
        <Search size={16} color="#9B9A93" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Masafi, Al Ain..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            flex: 1,
            fontFamily: "inherit",
          }}
        />
        <ScanLine size={16} color={BLUE} />
      </div>
      <p style={{ fontSize: 11, color: "#9B9A93", margin: "8px 0 12px" }}>
        {results.length} produit{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((p) => {
          const [retailer, price] = cheapest(p.prices);
          return (
            <button
              key={p.id}
              onClick={() => goDetail(p)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ECEAE3",
                borderRadius: 12,
                padding: "11px 12px",
                background: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Droplet size={15} color={BLUE} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{price.toFixed(2)} AED</p>
                <p style={{ fontSize: 9, color: "#5F5E5A", margin: 0 }}>{retailer}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailScreen({ product, goBack }) {
  const [alertOn, setAlertOn] = useState(false);
  const sorted = Object.entries(product.prices).sort((a, b) => a[1] - b[1]);
  const max = Math.max(...product.trend);
  return (
    <div>
      <TopBar title={product.name} onBack={goBack} />
      <div
        style={{
          background: "#E6F1FB",
          borderRadius: 16,
          padding: 22,
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Droplet size={40} color={BLUE} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
        <p style={{ fontSize: 11, color: "#5F5E5A", margin: 0 }}>Meilleur prix actuel</p>
        <Pill tone="success">-17% vs hier</Pill>
      </div>
      <p style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {sorted[0][1].toFixed(2)} AED{" "}
        <span style={{ fontSize: 13, fontWeight: 500, color: "#5F5E5A" }}>chez {sorted[0][0]}</span>
      </p>

      <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 8px" }}>Tendance sur 7 jours</p>
      <div style={{ height: 60, display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 16 }}>
        {product.trend.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(v / max) * 100}%`,
              background: i === product.trend.length - 1 ? BLUE : "#E6E4DC",
              borderRadius: 3,
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 8px" }}>Comparaison des retailers</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {sorted.map(([retailer, price], i) => (
          <div
            key={retailer}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: i === 0 ? `2px solid ${BLUE}` : "1px solid #ECEAE3",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div>
              {i === 0 && <Pill tone="accent">Meilleur prix</Pill>}
              <p style={{ fontSize: 13, margin: i === 0 ? "4px 0 0" : 0 }}>{retailer}</p>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{price.toFixed(2)} AED</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setAlertOn((v) => !v)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: 11,
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 12,
            border: `1px solid ${alertOn ? BLUE : "#ECEAE3"}`,
            background: alertOn ? "#E6F1FB" : "#fff",
            color: alertOn ? BLUE : INK,
            cursor: "pointer",
          }}
        >
          <Bell size={14} />
          {alertOn ? "Alerte activée" : "Alerte prix"}
        </button>
        <button
          style={{
            flex: 1.5,
            background: BLUE,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: 11,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Commander chez {sorted[0][0]}
        </button>
      </div>
    </div>
  );
}

function AlertsScreen() {
  return (
    <div>
      <TopBar title="Alertes de prix" />
      <div style={{ textAlign: "center", padding: "40px 12px" }}>
        <Bell size={28} color="#C9C7BC" />
        <p style={{ fontSize: 13, fontWeight: 600, margin: "12px 0 4px" }}>Aucune alerte pour l'instant</p>
        <p style={{ fontSize: 11, color: "#9B9A93", margin: 0 }}>
          Active une alerte depuis la fiche d'un produit pour être prévenu d'une baisse de prix.
        </p>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const [lang, setLang] = useState("Français");
  const rows = [
    { icon: ArrowLeftRight, label: "Langue", value: lang, onClick: () => setLang(lang === "Français" ? "English" : lang === "English" ? "العربية" : "Français") },
    { icon: CreditCard, label: "Moyen de paiement", value: "Carte •• 4417" },
    { icon: Wallet, label: "Botim connecté", value: "Oui" },
    { icon: Bell, label: "Alertes de prix", value: "" },
  ];
  return (
    <div>
      <TopBar title="Profil" />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#E6F1FB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: BLUE_DARK,
            fontSize: 15,
          }}
        >
          SA
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Sami A.</p>
          <p style={{ fontSize: 11, color: "#9B9A93", margin: "2px 0 0" }}>Dubai, UAE</p>
        </div>
      </div>

      <div
        style={{
          background: "#EAF3DE",
          borderRadius: 14,
          padding: 12,
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#3B6D11", margin: 0 }}>Abonnement actif</p>
          <p style={{ fontSize: 10, color: "#3B6D11", margin: "2px 0 0" }}>Renouvellement le 21 sept.</p>
        </div>
        <Check size={18} color="#3B6D11" />
      </div>

      {rows.map((r, i) => {
        const Icon = r.icon;
        return (
          <button
            key={i}
            onClick={r.onClick}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 2px",
              borderBottom: "1px solid #ECEAE3",
              background: "none",
              border: "none",
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "#ECEAE3",
              cursor: r.onClick ? "pointer" : "default",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon size={16} color="#5F5E5A" />
              <span style={{ fontSize: 13 }}>{r.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11, color: "#9B9A93" }}>{r.value}</span>
              <ChevronRight size={13} color="#9B9A93" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function EasyCompareMarketPrototype() {
  const [screen, setScreen] = useState("home");
  const [detailProduct, setDetailProduct] = useState(null);

  const goSearch = () => setScreen("search");
  const goDetail = (p) => {
    setDetailProduct(p);
    setScreen("detail");
  };
  const goBackFromSearch = () => setScreen("home");
  const goBackFromDetail = () => setScreen(detailProduct ? "search" : "home");

  let content;
  if (screen === "home") content = <HomeScreen goSearch={goSearch} goDetail={goDetail} />;
  else if (screen === "search") content = <SearchScreen goBack={goBackFromSearch} goDetail={goDetail} />;
  else if (screen === "detail") content = <DetailScreen product={detailProduct} goBack={goBackFromDetail} />;
  else if (screen === "alerts") content = <AlertsScreen />;
  else if (screen === "profile") content = <ProfileScreen />;

  const showNav = screen !== "detail";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 12px",
        background: PAPER,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Phone footer={showNav ? <BottomNav screen={screen} setScreen={setScreen} /> : null}>
        {content}
      </Phone>
      <p style={{ marginTop: 18, fontSize: 11, color: "#9B9A93", textAlign: "center", maxWidth: 320 }}>
        Prototype cliquable — données d'exemple. Cherche "Masafi" ou "Al Ain" pour tester la comparaison.
      </p>
    </div>
  );
}
