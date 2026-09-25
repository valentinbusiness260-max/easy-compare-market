import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Wifi,
  WifiOff,
  Package,
  Clock,
  Share2,
  Users,
  Flame,
  Gift
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialisation Stripe en mode test
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

/* ═══════════════════ DESIGN TOKENS ═══════════════════ */
const BLUE = "#1568C0";
const BLUE_DARK = "#0C447C";
const INK = "#181818";
const PAPER = "#F7F6F2";

/* ═══════════════════ STATIC DATA ═══════════════════ */
const CATEGORIES = [
  { id: "eau", label: "Eau", icon: Droplet, color: "#1568C0", bg: "#E6F1FB", active: true },
  { id: "epicerie", label: "Épicerie", icon: ShoppingBag, color: "#D85A30", bg: "#FAECE7", active: true },
  { id: "maison", label: "Maison", icon: Sparkles, color: "#0F6E56", bg: "#E1F5EE", active: true },
  { id: "tech", label: "High-tech", icon: Smartphone, color: "#854F0B", bg: "#FAEEDA", active: true },
  { id: "bebe", label: "Bébé", icon: Baby, color: "#993556", bg: "#FBEAF0", active: true },
  { id: "tout", label: "Tout voir", icon: Grid3x3, color: "#534AB7", bg: "#EEEDFE", active: true },
];

const LOCAL_PRODUCTS = [
  // Eau
  {
    id: "masafi-500", category: "eau", name: "Masafi eau 500ml x12", brand: "Masafi",
    trend: [58, 62, 60, 68, 50, 40, 32], prices: { Carrefour: 10.5, "Amazon.ae": 13.9, Lulu: 14.25 },
    oldPrice: 16.5, promo: "FLASH", image_url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200&h=200&fit=crop"
  },
  {
    id: "alain-1500", category: "eau", name: "Al Ain eau 1.5L x6", brand: "Al Ain",
    trend: [40, 45, 42, 50, 48, 44, 38], prices: { "Amazon.ae": 12.6, Carrefour: 15.2, Lulu: 15.9 },
    oldPrice: 18.0, promo: "-30%", image_url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200&h=200&fit=crop"
  },
  // Epicerie
  {
    id: "riz-basmati", category: "epicerie", name: "Riz Basmati Tilda 5kg", brand: "Tilda",
    trend: [150, 145, 148, 140, 130, 125, 120], prices: { Lulu: 45.5, Carrefour: 52.0, "Amazon.ae": 50.0 },
    oldPrice: 65.0, promo: "HOT DEAL", image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop"
  },
  {
    id: "nutella-750", category: "epicerie", name: "Nutella Pâte à tartiner 750g", brand: "Nutella",
    trend: [80, 82, 75, 70, 72, 65, 60], prices: { Carrefour: 22.5, "Amazon.ae": 24.0, Lulu: 26.5 },
    oldPrice: 32.0, promo: "-25%", image_url: "https://images.unsplash.com/photo-1588661668264-a032890fc2f1?w=200&h=200&fit=crop"
  },
  // Maison
  {
    id: "fairy-lemon", category: "maison", name: "Fairy Liquide Vaisselle Citron 1L", brand: "Fairy",
    trend: [30, 28, 25, 22, 20, 18, 15], prices: { "Amazon.ae": 12.0, Carrefour: 14.5, Lulu: 15.0 },
    oldPrice: 19.5, promo: "-40%", image_url: "https://images.unsplash.com/photo-1585233157597-9e776e0e3b97?w=200&h=200&fit=crop"
  },
  {
    id: "tide-pods", category: "maison", name: "Tide Pods 3 en 1, 30 capsules", brand: "Tide",
    trend: [90, 85, 80, 75, 70, 65, 60], prices: { Carrefour: 40.0, Lulu: 45.0, "Amazon.ae": 48.0 },
    oldPrice: 60.0, promo: "FLASH", image_url: "https://images.unsplash.com/photo-1585233157597-9e776e0e3b97?w=200&h=200&fit=crop"
  },
  // Tech
  {
    id: "airpods-pro", category: "tech", name: "AirPods Pro (2e gén)", brand: "Apple",
    trend: [950, 920, 900, 880, 850, 820, 790], prices: { "Amazon.ae": 750.0, Carrefour: 799.0, Lulu: 820.0 },
    oldPrice: 999.0, promo: "-25%", image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&h=200&fit=crop"
  },
  // Bebe
  {
    id: "pampers-premium", category: "bebe", name: "Pampers Premium Care, Taille 4", brand: "Pampers",
    trend: [110, 105, 100, 95, 90, 85, 80], prices: { Lulu: 65.0, Carrefour: 70.0, "Amazon.ae": 72.0 },
    oldPrice: 95.0, promo: "HOT DEAL", image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&h=200&fit=crop"
  }
];

/* ═══════════════════ UTILITY FUNCTIONS ═══════════════════ */

function cheapest(prices) {
  const entries = Object.entries(prices);
  return entries.reduce((a, b) => (b[1] < a[1] ? b : a));
}

function generatePrices(identifier) {
  const str = String(identifier);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);
  const basePrice = 8 + (hash % 42); 
  const variation = (hash % 100) / 1000; 
  return {
    Carrefour: parseFloat((basePrice * (0.95 + variation)).toFixed(2)),
    "Amazon.ae": parseFloat((basePrice * (1.02 + variation * 0.5)).toFixed(2)),
    Lulu: parseFloat((basePrice * (1.08 - variation * 0.3)).toFixed(2)),
  };
}

function generateTrend(identifier) {
  const str = String(identifier);
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = ((seed << 3) + str.charCodeAt(i)) | 0;
  }
  seed = Math.abs(seed);
  const trend = [];
  for (let i = 0; i < 7; i++) {
    seed = (seed * 16807 + 11) % 2147483647;
    trend.push(20 + (seed % 60));
  }
  return trend;
}

/* ═══════════════════ HOOKS ═══════════════════ */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    if (mql.matches !== isMobile) setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint, isMobile]);

  return isMobile;
}

function useProductSearch(query, debounceMs = 400) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const abortRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (navigator.onLine !== isOnline) setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  useEffect(() => {
    if (!query || query.length < 2) {
      if (results.length !== 0) setResults([]);
      if (loading) setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=12&fields=code,product_name,brands,image_small_url,quantity`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "EasyCompareMarket/1.0" },
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        const products = (data.products || [])
          .filter((p) => p.product_name)
          .map((p) => ({
            id: p.code || Math.random().toString(36).slice(2),
            name: p.product_name,
            brand: p.brands || "Marque inconnue",
            image_url: p.image_small_url || null,
            quantity: p.quantity || "",
            prices: generatePrices(p.code || p.product_name),
            trend: generateTrend(p.code || p.product_name),
            fromApi: true,
          }));

        setResults(products);
        setLoading(false);
        setIsOnline(true);
      } catch (err) {
        if (err.name === "AbortError") return;
        setIsOnline(false);
        const local = LOCAL_PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(local);
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, debounceMs]);

  return { results, loading, isOnline };
}

/* ═══════════════════ UI COMPONENTS ═══════════════════ */

function AppShell({ children, footer, isMobile }) {
  if (isMobile) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100dvh",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', system-ui, sans-serif",
          color: INK,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `calc(14px + var(--safe-top, 0px)) calc(16px + var(--safe-right, 0px)) 8px calc(16px + var(--safe-left, 0px))`,
          }}
        >
          {children}
        </div>
        {footer}
      </div>
    );
  }

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

function TopBar({ title, onBack, shareable = false }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Easy Compare Market',
          text: 'Regarde cette app incroyable pour comparer les prix et faire des économies ! 💸',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      alert("Partage non supporté sur ce navigateur. Copiez le lien !");
    }
  };

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
      {!onBack && (
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
      )}
      <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: -0.2, flex: 1 }}>{title || "Easy Compare Market"}</span>
      
      {shareable && (
        <button
          onClick={handleShare}
          className="ecm-pulse"
          style={{
            background: "#E6F1FB",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BLUE,
            cursor: "pointer",
          }}
        >
          <Share2 size={16} />
        </button>
      )}
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "#F0EFEA", fg: "#5F5E5A" },
    accent: { bg: "#E6F1FB", fg: BLUE_DARK },
    success: { bg: "#EAF3DE", fg: "#3B6D11" },
    danger: { bg: "#FFF0F0", fg: "#E53935" },
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

function BottomNav({ screen, setScreen, isMobile }) {
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
        padding: isMobile
          ? `10px 6px calc(14px + var(--safe-bottom, 0px))`
          : "10px 6px 14px",
        background: "#fff",
        position: "relative",
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
              transition: "color 0.2s, transform 0.2s",
              transform: active ? "scale(1.05)" : "scale(1)"
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

function ProductImage({ src, size = 40, style = {} }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          background: "#E6F1FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...style,
        }}
      >
        <Package size={size * 0.5} color={BLUE} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        objectFit: "cover",
        flexShrink: 0,
        background: "#F0EFEA",
        ...style,
      }}
    />
  );
}

/* ═══════════════════ SCREENS ═══════════════════ */

function SubscriptionScreen({ goBack, email }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="ecm-fade-up" style={{ textAlign: "center", padding: "40px 12px" }}>
        <TopBar title="Abonnement Confirmé" onBack={goBack} />
        <div className="ecm-scale-pop" style={{ marginTop: 40, marginBottom: 20 }}>
          <Check size={64} color="#3B6D11" style={{ background: "#EAF3DE", borderRadius: "50%", padding: 12 }} />
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800 }}>Paiement Réussi ! 🎉</h2>
        <p style={{ color: "#5F5E5A", fontSize: 14, lineHeight: 1.5 }}>
          Félicitations, tu es maintenant Premium ! Un reçu a été envoyé à <strong>{email}</strong>.
        </p>
        <button
          onClick={goBack}
          style={{
            background: BLUE,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 24px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 30,
            width: "100%"
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="ecm-fade-up">
      <TopBar title="Abonnement Premium" onBack={goBack} />
      
      <div className="ecm-plan-card recommended ecm-pulse" style={{ marginBottom: 20, marginTop: 15 }}>
        <h3 style={{ margin: "10px 0 5px", color: BLUE_DARK, fontSize: 18, fontWeight: 800 }}>Plan VIP Premium</h3>
        <div style={{ fontSize: 32, fontWeight: 800, margin: "10px 0", color: INK }}>
          14.99 <span style={{fontSize: 14, fontWeight: 600, color: "#5F5E5A"}}>AED / mois</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 10px", textAlign: "left", fontSize: 13, display: "flex", flexDirection: "column", gap: 12 }}>
          <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#EAF3DE", padding: 4, borderRadius: "50%", color: "#3B6D11" }}><Check size={14} /></div>
            Comparaison des prix en temps réel
          </li>
          <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#EAF3DE", padding: 4, borderRadius: "50%", color: "#3B6D11" }}><Check size={14} /></div>
            Accès à +10,000 produits exclusifs
          </li>
          <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#EAF3DE", padding: 4, borderRadius: "50%", color: "#3B6D11" }}><Check size={14} /></div>
            Alertes de baisse de prix instantanées
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ padding: "16px 12px", border: "1px solid #ECEAE3", borderRadius: 12, background: "#FAFAFA" }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#181818',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': {
                  color: '#9B9A93',
                },
              },
            },
          }} />
        </div>
        
        <button
          disabled={!stripe || loading}
          type="submit"
          className={loading ? "" : "ecm-pulse"}
          style={{
            background: BLUE,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: 16,
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
            boxShadow: "0 10px 20px rgba(21, 104, 192, 0.2)"
          }}
        >
          {loading ? "Traitement sécurisé..." : "Activer mon compte Premium"}
        </button>
        <p style={{ fontSize: 11, color: "#9B9A93", textAlign: "center", margin: 0 }}>
          Paiement sécurisé crypté 256-bit
        </p>
      </form>
    </div>
  );
}

function HomeScreen({ goSearch, goDetail, activeCategory, setActiveCategory }) {
  return (
    <div>
      <TopBar shareable={true} />
      
      {/* Banner Viral */}
      <div
        className="ecm-gradient-animated"
        style={{
          borderRadius: 18,
          padding: "20px 18px",
          marginBottom: 16,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(21,104,192,0.25)"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 13, opacity: 0.9, margin: "0 0 4px", fontWeight: 500 }}>Bonjour 👋</p>
          <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 12px", letterSpacing: -0.3, lineHeight: 1.2 }}>
            Fais des économies sur tes achats quotidiens.
          </p>
          <div
            className="ecm-bounce-in"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#E53935",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(229,57,53,0.4)"
            }}
          >
            <Clock size={14} /> VENTE FLASH : -50% AUJOURD'HUI
          </div>
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
          padding: "14px 16px",
          marginBottom: 20,
          cursor: "pointer",
          textAlign: "left",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <Search size={18} color="#9B9A93" />
        <span style={{ fontSize: 14, color: "#9B9A93", flex: 1, fontWeight: 500 }}>Rechercher un produit...</span>
        <ScanLine size={18} color={BLUE} />
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Catégories</p>
        <span style={{ fontSize: 11, color: BLUE, fontWeight: 600 }}>Voir tout</span>
      </div>
      
      <div className="ecm-h-scroll" style={{ marginBottom: 20, paddingBottom: 8 }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.id || (activeCategory === 'tout' && c.id === 'tout');
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                background: isActive ? c.color : c.bg,
                color: isActive ? "#fff" : c.color,
                border: "none",
                borderRadius: 16,
                padding: "12px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 76,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive ? `0 8px 20px ${c.color}40` : "none"
              }}
            >
              <Icon size={22} />
              <p style={{ fontSize: 11, fontWeight: 700, margin: "8px 0 0" }}>{c.label}</p>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>Top Promotions 🔥</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LOCAL_PRODUCTS.filter(p => activeCategory === 'tout' || p.category === activeCategory).map((p, idx) => {
          const [retailer, price] = cheapest(p.prices);
          return (
            <button
              key={p.id}
              className="ecm-card ecm-fade-up"
              onClick={() => goDetail(p)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                cursor: "pointer",
                textAlign: "left",
                animationDelay: `${idx * 0.05}s`
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <ProductImage src={p.image_url} size={56} style={{ border: "1px solid #ECEAE3" }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      margin: "0 0 2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: INK
                    }}
                  >
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#9B9A93", margin: "0 0 6px" }}>
                    {p.brand}
                  </p>
                  {p.promo && <span className="ecm-promo-badge" style={{ background: "#FFF0F0", color: "#E53935" }}>{p.promo}</span>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                {p.oldPrice && <p className="ecm-old-price" style={{ margin: "0 0 2px" }}>{p.oldPrice.toFixed(2)} AED</p>}
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#E53935" }}>
                  {price.toFixed(2)}
                </p>
                <p style={{ fontSize: 9, color: "#5F5E5A", margin: "2px 0 0", fontWeight: 600 }}>chez {retailer}</p>
              </div>
            </button>
          );
        })}
        {LOCAL_PRODUCTS.filter(p => activeCategory === 'tout' || p.category === activeCategory).length === 0 && (
          <p style={{ fontSize: 13, color: "#9B9A93", textAlign: "center", padding: "20px 0" }}>Aucune promotion dans cette catégorie pour le moment.</p>
        )}
      </div>
    </div>
  );
}

function SearchScreen({ goBack, goDetail }) {
  const [query, setQuery] = useState("");
  const { results, loading, isOnline } = useProductSearch(query);

  const displayProducts = query.length < 2 ? LOCAL_PRODUCTS : results;

  return (
    <div>
      <TopBar title="Rechercher" onBack={goBack} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
          padding: "6px 10px",
          borderRadius: 8,
          background: isOnline ? "#EAF3DE" : "#FAECE7",
          fontSize: 11,
          fontWeight: 700,
          color: isOnline ? "#3B6D11" : "#D85A30",
        }}
      >
        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        {isOnline ? "Connecté : 10M+ produits dispos" : "Hors ligne : base restreinte"}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: PAPER,
          border: `2px solid ${query.length > 0 ? BLUE : "#ECEAE3"}`,
          borderRadius: 14,
          padding: "12px 14px",
          marginBottom: 10,
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: query.length > 0 ? "0 4px 15px rgba(21, 104, 192, 0.1)" : "none"
        }}
      >
        <Search size={18} color="#9B9A93" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: eau, riz, lait..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            flex: 1,
            fontFamily: "inherit",
            color: INK,
          }}
        />
        {loading ? (
          <div className="ecm-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
        ) : (
          <ScanLine size={18} color={BLUE} />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading && (
           <>
             <div className="ecm-skeleton" style={{ height: 72, width: "100%", marginBottom: 4 }}></div>
             <div className="ecm-skeleton" style={{ height: 72, width: "100%", marginBottom: 4 }}></div>
             <div className="ecm-skeleton" style={{ height: 72, width: "100%" }}></div>
           </>
        )}
        {!loading && displayProducts.map((p, idx) => {
          const [retailer, price] = cheapest(p.prices);
          return (
            <button
              key={p.id || idx}
              className="ecm-card ecm-fade-up"
              onClick={() => goDetail(p)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <ProductImage src={p.image_url} size={44} style={{ border: "1px solid #ECEAE3" }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#9B9A93", margin: "2px 0 0" }}>
                    {p.brand}
                    {p.quantity ? ` · ${p.quantity}` : ""}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800, margin: 0, color: BLUE_DARK }}>
                  {price.toFixed(2)}
                </p>
                <p style={{ fontSize: 9, color: "#5F5E5A", margin: "2px 0 0" }}>chez {retailer}</p>
              </div>
            </button>
          );
        })}

        {!loading && query.length >= 2 && displayProducts.length === 0 && (
          <div className="ecm-fade-up" style={{ textAlign: "center", padding: "40px 12px" }}>
            <Search size={32} color="#C9C7BC" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>Aucun produit trouvé</p>
            <p style={{ fontSize: 12, color: "#9B9A93", margin: 0 }}>
              Nous ne trouvons pas ce produit, essayez un synonyme !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailScreen({ product, goBack }) {
  const [alertOn, setAlertOn] = useState(false);
  const sorted = Object.entries(product.prices).sort((a, b) => a[1] - b[1]);
  const trend = product.trend || generateTrend(product.id);
  const max = Math.max(...trend);

  const discount = Math.round(((sorted[sorted.length - 1][1] - sorted[0][1]) / sorted[sorted.length - 1][1]) * 100);

  // Gamification FOMO
  const viewers = useMemo(() => Math.floor(Math.random() * 20) + 3, []);

  return (
    <div className="ecm-fade-up">
      <TopBar title={product.name} onBack={goBack} shareable={true} />
      
      <div
        style={{
          background: "linear-gradient(135deg, #F7F6F2, #E6F1FB)",
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)"
        }}
      >
        <div style={{ position: "absolute", top: 12, left: 12, background: "#FFF0F0", color: "#E53935", padding: "4px 8px", borderRadius: 20, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
          <Flame size={12} /> {viewers} personnes regardent
        </div>
        {product.image_url ? (
          <ProductImage src={product.image_url} size={140} style={{ borderRadius: 16, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }} />
        ) : (
          <Droplet size={70} color={BLUE} />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 6 }}>
        <div>
          {product.brand && (
            <p style={{ fontSize: 12, color: "#9B9A93", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {product.brand} {product.quantity ? ` · ${product.quantity}` : ""}
            </p>
          )}
          <p style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{product.name}</p>
        </div>
        {product.promo ? (
          <Pill tone="danger">{product.promo}</Pill>
        ) : (
          <Pill tone="success">-{discount}%</Pill>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
        <p style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1, color: product.promo ? "#E53935" : INK }}>
          {sorted[0][1].toFixed(2)} <span style={{ fontSize: 14 }}>AED</span>
        </p>
        {product.oldPrice && <p className="ecm-old-price" style={{ fontSize: 16 }}>{product.oldPrice.toFixed(2)}</p>}
      </div>

      <p style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>Tendance des prix (7 jours)</p>
      <div style={{ height: 70, display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 24, padding: "10px 10px", background: "#fff", borderRadius: 12, border: "1px solid #ECEAE3" }}>
        {trend.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(v / max) * 100}%`,
              background: i === trend.length - 1 ? BLUE : "#E6F1FB",
              borderRadius: 4,
              transition: "height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              position: "relative"
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>Où acheter ?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {sorted.map(([retailer, price], i) => (
          <div
            key={retailer}
            className="ecm-card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: i === 0 ? `2px solid ${BLUE}` : "1px solid #ECEAE3",
              padding: "14px 16px",
              background: i === 0 ? "#F9FCFF" : "#fff"
            }}
          >
            <div>
              {i === 0 && <span style={{ fontSize: 10, color: BLUE, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Meilleure offre</span>}
              <p style={{ fontSize: 14, fontWeight: 700, margin: i === 0 ? "2px 0 0" : 0 }}>{retailer}</p>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{price.toFixed(2)} AED</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setAlertOn((v) => !v)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 16,
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 16,
            border: `2px solid ${alertOn ? BLUE : "#ECEAE3"}`,
            background: alertOn ? "#E6F1FB" : "#fff",
            color: alertOn ? BLUE : INK,
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transform: alertOn ? "scale(0.98)" : "scale(1)"
          }}
        >
          <Bell size={18} className={alertOn ? "ecm-wobble" : ""} />
          {alertOn ? "Alerte activée" : "Alerte prix"}
        </button>
        <button
          className="ecm-pulse"
          style={{
            flex: 1.5,
            background: BLUE,
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: 16,
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 8px 20px rgba(21,104,192,0.3)"
          }}
        >
          Acheter maintenant
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ goSubscription }) {
  const [lang, setLang] = useState("Français");
  const rows = [
    {
      icon: ArrowLeftRight,
      label: "Langue",
      value: lang,
      onClick: () =>
        setLang(lang === "Français" ? "English" : lang === "English" ? "العربية" : "Français"),
    },
    { icon: Gift, label: "Inviter des amis", value: "Gagner 50 AED", onClick: () => {
      if(navigator.share) navigator.share({title: 'Rejoins-moi sur Easy Compare!', url: window.location.href})
    }},
    { icon: Wallet, label: "Botim connecté", value: "Oui" },
    { icon: Bell, label: "Alertes de prix actives", value: "3" },
  ];
  return (
    <div className="ecm-fade-up">
      <TopBar title="Mon Profil" shareable={true} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 12 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1568C0, #0C447C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#fff",
            fontSize: 20,
            boxShadow: "0 8px 15px rgba(21,104,192,0.2)"
          }}
        >
          VA
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>Valentin A.</p>
          <p style={{ fontSize: 13, color: "#9B9A93", margin: "4px 0 0", fontWeight: 500 }}>Membre depuis 2026</p>
        </div>
      </div>

      <div
        onClick={goSubscription}
        className="ecm-card ecm-pulse"
        style={{
          background: "linear-gradient(135deg, #181818, #2D2D2D)",
          color: "#fff",
          border: "none",
          padding: 20,
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Sparkles size={16} color="#D4A843" />
            <p style={{ fontSize: 15, fontWeight: 800, color: "#D4A843", margin: 0 }}>Passer Premium VIP</p>
          </div>
          <p style={{ fontSize: 12, color: "#A0A0A0", margin: 0 }}>Accès illimité + Alertes en temps réel</p>
        </div>
        <ChevronRight size={22} color="#D4A843" />
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ECEAE3", overflow: "hidden" }}>
        {rows.map((r, i) => {
          const Icon = r.icon;
          const isLast = i === rows.length - 1;
          const isHighlight = r.icon === Gift;
          return (
            <button
              key={i}
              onClick={r.onClick}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: isHighlight ? "#FFF8E7" : "none",
                border: "none",
                borderBottom: isLast ? "none" : "1px solid #ECEAE3",
                cursor: r.onClick ? "pointer" : "default",
                textAlign: "left",
                transition: "background 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ background: isHighlight ? "#D4A843" : "#F0EFEA", padding: 8, borderRadius: 10, color: isHighlight ? "#fff" : "#5F5E5A" }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: isHighlight ? "#854F0B" : INK }}>{r.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isHighlight ? "#D4A843" : "#9B9A93" }}>{r.value}</span>
                <ChevronRight size={16} color={isHighlight ? "#D4A843" : "#D1D0CA"} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════ ROOT ═══════════════════ */

export default function EasyCompareMarketPrototype() {
  const isMobile = useIsMobile();
  const [screen, setScreen] = useState("home");
  const [detailProduct, setDetailProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('tout');

  const goSearch = () => setScreen("search");
  const goDetail = (p) => {
    setDetailProduct(p);
    setScreen("detail");
  };
  const goSubscription = () => setScreen("subscription");
  const goBackToHome = () => setScreen("home");

  let content;
  if (screen === "home") content = <HomeScreen goSearch={goSearch} goDetail={goDetail} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />;
  else if (screen === "search") content = <SearchScreen goBack={goBackToHome} goDetail={goDetail} />;
  else if (screen === "detail") content = <DetailScreen product={detailProduct} goBack={() => setScreen(detailProduct && detailProduct.fromApi ? "search" : "home")} />;
  else if (screen === "profile") content = <ProfileScreen goSubscription={goSubscription} />;
  else if (screen === "subscription") content = <Elements stripe={stripePromise}><SubscriptionScreen goBack={goBackToHome} email="provalentin883@gmail.com" /></Elements>;
  else content = <div />;

  const showNav = screen !== "detail" && screen !== "subscription";

  return (
    <>
      <AppShell
        isMobile={isMobile}
        footer={showNav ? <BottomNav screen={screen} setScreen={setScreen} isMobile={isMobile} /> : null}
      >
        {content}
      </AppShell>
      {!isMobile && (
        <p style={{ marginTop: 24, fontSize: 12, color: "#9B9A93", textAlign: "center", maxWidth: 360, lineHeight: 1.5 }}>
          Démo virale — promotions 🔥, FOMO 👀, partage natif 📤, paiement Stripe 💳 et PWA prête à installer.
        </p>
      )}
    </>
  );
}
