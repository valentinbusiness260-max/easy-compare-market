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
  Gift,
  Download,
  ExternalLink,
  Copy,
  Apple
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Uses Environment Variable if available, fallback to test key for demo
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51UO67QQZ4erOPMFkrioLYbDWoWFyiZXtqP1nUGJBGbO2JhgOTRK78JQ9pLB2yx7queAKVB2iehCCyGl2jnihWyUn005XNVatKZ";
const stripePromise = loadStripe(stripeKey);

/* ═══════════════════ DESIGN TOKENS ═══════════════════ */
const BLUE = "#1568C0";
const BLUE_DARK = "#0C447C";
const INK = "#181818";
const PAPER = "#F7F6F2";

/* ═══════════════════ STATIC DATA ═══════════════════ */
const CATEGORIES = [
  { id: "water", label: "Water", icon: Droplet, color: "#1568C0", bg: "#E6F1FB", active: true },
  { id: "grocery", label: "Grocery", icon: ShoppingBag, color: "#D85A30", bg: "#FAECE7", active: true },
  { id: "home", label: "Home", icon: Sparkles, color: "#0F6E56", bg: "#E1F5EE", active: true },
  { id: "tech", label: "Tech", icon: Smartphone, color: "#854F0B", bg: "#FAEEDA", active: true },
  { id: "baby", label: "Baby", icon: Baby, color: "#993556", bg: "#FBEAF0", active: true },
  { id: "all", label: "See All", icon: Grid3x3, color: "#534AB7", bg: "#EEEDFE", active: true },
];

const LOCAL_PRODUCTS = [
  // Water
  {
    id: "masafi-500", category: "water", name: "Masafi Water 500ml x12", brand: "Masafi",
    trend: [58, 62, 60, 68, 50, 40, 32], prices: { Carrefour: 10.5, "Amazon.ae": 13.9, Lulu: 14.25 },
    oldPrice: 16.5, promo: "FLASH", image_url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200&h=200&fit=crop"
  },
  {
    id: "alain-1500", category: "water", name: "Al Ain Water 1.5L x6", brand: "Al Ain",
    trend: [40, 45, 42, 50, 48, 44, 38], prices: { "Amazon.ae": 12.6, Carrefour: 15.2, Lulu: 15.9 },
    oldPrice: 18.0, promo: "-30%", image_url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=200&h=200&fit=crop"
  },
  // Grocery
  {
    id: "basmati-rice", category: "grocery", name: "Tilda Basmati Rice 5kg", brand: "Tilda",
    trend: [150, 145, 148, 140, 130, 125, 120], prices: { Lulu: 45.5, Carrefour: 52.0, "Amazon.ae": 50.0 },
    oldPrice: 65.0, promo: "HOT DEAL", image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop"
  },
  {
    id: "nutella-750", category: "grocery", name: "Nutella Chocolate Spread 750g", brand: "Nutella",
    trend: [80, 82, 75, 70, 72, 65, 60], prices: { Carrefour: 22.5, "Amazon.ae": 24.0, Lulu: 26.5 },
    oldPrice: 32.0, promo: "-25%", image_url: "https://images.unsplash.com/photo-1588661668264-a032890fc2f1?w=200&h=200&fit=crop"
  },
  // Home
  {
    id: "fairy-lemon", category: "home", name: "Fairy Dishwashing Liquid 1L", brand: "Fairy",
    trend: [30, 28, 25, 22, 20, 18, 15], prices: { "Amazon.ae": 12.0, Carrefour: 14.5, Lulu: 15.0 },
    oldPrice: 19.5, promo: "-40%", image_url: "https://images.unsplash.com/photo-1585233157597-9e776e0e3b97?w=200&h=200&fit=crop"
  },
  {
    id: "tide-pods", category: "home", name: "Tide Pods 3-in-1, 30 Count", brand: "Tide",
    trend: [90, 85, 80, 75, 70, 65, 60], prices: { Carrefour: 40.0, Lulu: 45.0, "Amazon.ae": 48.0 },
    oldPrice: 60.0, promo: "FLASH", image_url: "https://images.unsplash.com/photo-1585233157597-9e776e0e3b97?w=200&h=200&fit=crop"
  },
  // Tech
  {
    id: "airpods-pro", category: "tech", name: "AirPods Pro (2nd Gen)", brand: "Apple",
    trend: [950, 920, 900, 880, 850, 820, 790], prices: { "Amazon.ae": 750.0, Carrefour: 799.0, Lulu: 820.0 },
    oldPrice: 999.0, promo: "-25%", image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&h=200&fit=crop"
  },
  // Baby
  {
    id: "pampers-premium", category: "baby", name: "Pampers Premium Care, Size 4", brand: "Pampers",
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

function getRetailerUrl(retailer, productName) {
  const query = encodeURIComponent(productName);
  const r = String(retailer).toLowerCase();
  if (r.includes("carrefour")) {
    return `https://www.carrefouruae.com/mafuae/en/search?keyword=${query}`;
  } else if (r.includes("amazon")) {
    return `https://www.amazon.ae/s?k=${query}`;
  } else if (r.includes("lulu")) {
    return `https://www.luluhypermarket.com/en-ae/search/?text=${query}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(retailer + ' ' + productName)}`;
}

/* ═══════════════════ HOOKS ═══════════════════ */

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsInstalled(standalone);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === 'accepted') setIsInstalled(true);
    return outcome === 'accepted';
  };

  return { canInstall: !!deferredPrompt, isInstalled, isIOS, triggerInstall };
}

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
            brand: p.brands || "Unknown brand",
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
            padding: `calc(14px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) 8px calc(16px + env(safe-area-inset-left))`,
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
        width: 360,
        height: 700,
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
          text: 'Check out this amazing app to compare prices and save money! 💸',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      alert("Sharing not supported on this browser. Copy the link instead!");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      {onBack && (
        <button
          onClick={onBack}
          className="ecm-btn-bounce"
          style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: INK }}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {!onBack && (
        <div
          style={{
            width: 28,
            height: 28,
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
      <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.2, flex: 1 }}>{title || "Easy Compare Market"}</span>
      
      {shareable && (
        <button
          onClick={handleShare}
          className="ecm-pulse ecm-btn-bounce"
          style={{
            background: "#E6F1FB",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BLUE,
            cursor: "pointer",
          }}
        >
          <Share2 size={18} />
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
        fontWeight: 700,
        padding: "4px 10px",
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
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "alerts", icon: Download, label: "Installer" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: "1px solid #ECEAE3",
        padding: isMobile
          ? `10px 6px calc(14px + env(safe-area-inset-bottom))`
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
            className="ecm-btn-bounce"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: active ? BLUE : "#9B9A93",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
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
          borderRadius: 12,
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
        borderRadius: 12,
        objectFit: "cover",
        flexShrink: 0,
        background: "#F0EFEA",
        ...style,
      }}
    />
  );
}

/* ═══════════════════ SCREENS ═══════════════════ */

/* ═══════════════════ INSTALL SCREEN ═══════════════════ */

function InstallScreen() {
  const { canInstall, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const APP_URL = "https://easy-compare-market.vercel.app";

  const handleInstall = async () => {
    setInstalling(true);
    await triggerInstall();
    setInstalling(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(APP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Easy Compare Market 🛒',
          text: '💸 J\'utilise cette app pour comparer les prix Carrefour, Amazon.ae et Lulu ! Installe-la gratuitement 👇',
          url: APP_URL,
        });
      } catch (_) {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="ecm-fade-up" style={{ paddingBottom: 20 }}>
      <TopBar title="Installer l'app" />

      {/* Hero banner */}
      <div
        className="ecm-gradient-animated"
        style={{
          borderRadius: 24,
          padding: "28px 24px",
          marginBottom: 24,
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(21,104,192,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 12 }}>📲</div>
        <p style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px", letterSpacing: -0.3 }}>
          {isInstalled ? "App déjà installée ! 🎉" : "Installe l'app gratuitement"}
        </p>
        <p style={{ fontSize: 13, opacity: 0.85, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
          {isInstalled
            ? "Tu peux maintenant partager l'app avec tes amis !"
            : "Compare les prix depuis ton écran d'accueil, sans navigateur."}
        </p>
      </div>

      {/* Install section */}
      {!isInstalled && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#5F5E5A", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>
            📥 Installation
          </p>

          {/* Android / Desktop */}
          {canInstall && (
            <button
              onClick={handleInstall}
              className="ecm-pulse ecm-btn-bounce"
              style={{
                width: "100%",
                background: BLUE,
                color: "#fff",
                border: "none",
                borderRadius: 18,
                padding: "18px 20px",
                fontSize: 16,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 10px 25px rgba(21,104,192,0.3)",
                marginBottom: 12,
              }}
            >
              <Download size={22} />
              {installing ? "Installation..." : "Installer sur mon téléphone"}
            </button>
          )}

          {/* iOS instructions */}
          {isIOS && (
            <div
              style={{
                background: "#F0F7FF",
                border: "1.5px solid #BDD9F7",
                borderRadius: 18,
                padding: "18px 20px",
                marginBottom: 12,
              }}
            >
              <p style={{ fontWeight: 800, fontSize: 15, margin: "0 0 14px", color: BLUE_DARK, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🍎</span> Sur iPhone / iPad
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { step: "1", text: "Appuie sur le bouton Partager", icon: "⬆️" },
                  { step: "2", text: "Sélectionne \"Sur l'écran d'accueil\"", icon: "➕" },
                  { step: "3", text: "Appuie sur \"Ajouter\" — c'est installé !", icon: "✅" },
                ].map(({ step, text, icon }) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: BLUE, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>{icon} {text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no prompt and not iOS */}
          {!canInstall && !isIOS && (
            <div
              style={{
                background: "#F7F6F2",
                border: "1.5px solid #ECEAE3",
                borderRadius: 18,
                padding: "18px 20px",
                marginBottom: 12,
              }}
            >
              <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 6px", color: INK }}>📱 Sur Android (Chrome)</p>
              <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 12px", lineHeight: 1.5, fontWeight: 500 }}>
                Ouvre ce lien dans Chrome, puis appuie sur <strong>"Ajouter à l'écran d'accueil"</strong> dans le menu ⋮
              </p>
              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: BLUE,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={16} /> Ouvrir dans Chrome
              </a>
            </div>
          )}
        </div>
      )}

      {/* Share section */}
      <p style={{ fontSize: 14, fontWeight: 800, color: "#5F5E5A", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>
        📤 Partager avec des amis
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {/* Share button */}
        <button
          onClick={handleShare}
          className="ecm-btn-bounce"
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #25D366, #1DA851)",
            color: "#fff",
            border: "none",
            borderRadius: 18,
            padding: "18px 20px",
            fontSize: 16,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 8px 20px rgba(37,211,102,0.25)",
          }}
        >
          <Share2 size={20} />
          Partager avec mes amis
        </button>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="ecm-btn-bounce"
          style={{
            width: "100%",
            background: copied ? "#EAF3DE" : "#F0EFEA",
            color: copied ? "#3B6D11" : INK,
            border: `1.5px solid ${copied ? "#B6DFA0" : "#ECEAE3"}`,
            borderRadius: 18,
            padding: "16px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.25s",
          }}
        >
          <Copy size={18} />
          <span style={{ flex: 1, textAlign: "left", fontSize: 13, color: "#5F5E5A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {APP_URL}
          </span>
          <span style={{ fontWeight: 800, color: copied ? "#3B6D11" : BLUE, flexShrink: 0 }}>
            {copied ? "Copié ✓" : "Copier"}
          </span>
        </button>
      </div>

      {/* Stats viral */}
      <div style={{ background: "#FFF8E7", borderRadius: 18, padding: "16px 20px", border: "1.5px solid #F5DFA0" }}>
        <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 12px", color: "#854F0B", display: "flex", alignItems: "center", gap: 8 }}>
          <Gift size={16} /> Programme de parrainage
        </p>
        <p style={{ fontSize: 13, color: "#5F5E5A", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
          Chaque ami que tu invites te rapporte <strong style={{ color: "#D4A843" }}>50 AED</strong> de crédit. Partage maintenant et commence à gagner ! 🎁
        </p>
      </div>
    </div>
  );
}

function SubscriptionScreen({ goBack, email }) {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if coming back from successful checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setSuccess(true);
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleShareToUnlock = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Easy Compare Market 🛒',
          text: 'Découvre cette app géniale pour comparer les prix. On gagne tous les deux 50 AED de crédit si tu t\'inscris ! 👇',
          url: window.location.origin + "?ref=VIP",
        });
        alert("Merci d'avoir partagé ! Ton compte sera crédité si ton ami s'inscrit.");
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      alert("Partage ce lien: " + window.location.origin + "?ref=VIP");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe) return;

    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' });
      const { id, message } = await res.json();
      
      if (id) {
        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) {
          console.error(error);
          setLoading(false);
        }
      } else {
        alert("Erreur: " + message);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Impossible de se connecter au serveur de paiement.");
    }
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
        
        <div style={{ background: "#FFF8E7", borderRadius: 16, padding: "20px", marginTop: 24, border: "1.5px solid #F5DFA0" }}>
          <p style={{ fontWeight: 800, fontSize: 16, margin: "0 0 10px", color: "#854F0B" }}>🎁 Rends l'app Virale !</p>
          <p style={{ fontSize: 13, color: "#5F5E5A", margin: "0 0 16px", lineHeight: 1.5 }}>
            Partage ton lien exclusif. Pour chaque ami qui s'abonne, tu reçois 1 mois gratuit !
          </p>
          <button
            onClick={handleShareToUnlock}
            className="ecm-btn-bounce"
            style={{
              background: "#D4A843", color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%"
            }}
          >
            Inviter un ami
          </button>
        </div>

        <button
          onClick={goBack}
          className="ecm-btn-bounce"
          style={{
            background: BLUE, color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 30, width: "100%", boxShadow: "0 10px 20px rgba(21, 104, 192, 0.2)"
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="ecm-fade-up" style={{ paddingBottom: 24 }}>
      <TopBar title="Abonnement Premium" onBack={goBack} />
      
      <div className="ecm-plan-card recommended ecm-pulse" style={{ marginBottom: 20, marginTop: 15 }}>
        <h3 style={{ margin: "10px 0 5px", color: BLUE_DARK, fontSize: 18, fontWeight: 800 }}>Plan VIP Premium</h3>
        <div style={{ fontSize: 32, fontWeight: 800, margin: "10px 0", color: INK }}>
          14.99 <span style={{fontSize: 14, fontWeight: 600, color: "#5F5E5A"}}>AED / mois</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 10px", textAlign: "left", fontSize: 13, display: "flex", flexDirection: "column", gap: 12 }}>
          <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#EAF3DE", padding: 4, borderRadius: "50%", color: "#3B6D11" }}><Check size={14} /></div>
            Comparaison de prix en temps réel
          </li>
          <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#EAF3DE", padding: 4, borderRadius: "50%", color: "#3B6D11" }}><Check size={14} /></div>
            Accès à +10,000 produits exclusifs
          </li>
          <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#EAF3DE", padding: 4, borderRadius: "50%", color: "#3B6D11" }}><Check size={14} /></div>
            Alertes instantanées de baisse de prix
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <button
          disabled={!stripe || loading}
          type="submit"
          className={loading ? "" : "ecm-pulse ecm-btn-bounce"}
          style={{
            background: BLUE,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: 18,
            fontSize: 16,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
            boxShadow: "0 10px 20px rgba(21, 104, 192, 0.3)"
          }}
        >
          {loading ? "Redirection vers Stripe..." : "S'abonner via Stripe"}
        </button>
        <p style={{ fontSize: 12, color: "#9B9A93", textAlign: "center", margin: 0, fontWeight: 500 }}>
          🔒 Paiement Sécurisé 256-bit par Stripe
        </p>
      </form>
    </div>
  );
}

function HomeScreen({ goSearch, goDetail, activeCategory, setActiveCategory }) {
  return (
    <div>
      <TopBar shareable={true} />
      
      {/* Viral Banner */}
      <div
        className="ecm-gradient-animated"
        style={{
          borderRadius: 20,
          padding: "24px 20px",
          marginBottom: 20,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(21,104,192,0.25)"
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 14, opacity: 0.9, margin: "0 0 6px", fontWeight: 600 }}>Hello 👋</p>
          <p style={{ fontSize: 20, fontWeight: 800, margin: "0 0 16px", letterSpacing: -0.3, lineHeight: 1.2 }}>
            Save money on your daily purchases.
          </p>
          <div
            className="ecm-bounce-in"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#E53935",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 24,
              fontSize: 12,
              fontWeight: 800,
              boxShadow: "0 4px 12px rgba(229,57,53,0.4)"
            }}
          >
            <Clock size={16} /> FLASH SALE: UP TO -50% TODAY
          </div>
        </div>
      </div>

      <button
        onClick={goSearch}
        className="ecm-btn-bounce"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: PAPER,
          border: "2px solid #ECEAE3",
          borderRadius: 16,
          padding: "16px",
          marginBottom: 24,
          cursor: "pointer",
          textAlign: "left",
          boxShadow: "0 6px 15px rgba(0,0,0,0.02)"
        }}
      >
        <Search size={20} color="#9B9A93" />
        <span style={{ fontSize: 15, color: "#9B9A93", flex: 1, fontWeight: 600 }}>Search a product...</span>
        <ScanLine size={20} color={BLUE} />
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <p style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Categories</p>
        <span style={{ fontSize: 12, color: BLUE, fontWeight: 700 }}>See all</span>
      </div>
      
      <div className="ecm-h-scroll" style={{ marginBottom: 24, paddingBottom: 10 }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.id || (activeCategory === 'all' && c.id === 'all');
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className="ecm-btn-bounce"
              style={{
                background: isActive ? c.color : c.bg,
                color: isActive ? "#fff" : c.color,
                border: "none",
                borderRadius: 18,
                padding: "14px 18px",
                textAlign: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 80,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive ? `0 8px 20px ${c.color}40` : "none"
              }}
            >
              <Icon size={24} />
              <p style={{ fontSize: 12, fontWeight: 800, margin: "10px 0 0" }}>{c.label}</p>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>Top Deals 🔥</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LOCAL_PRODUCTS.filter(p => activeCategory === 'all' || p.category === activeCategory).map((p, idx) => {
          const [retailer, price] = cheapest(p.prices);
          return (
            <button
              key={p.id}
              className="ecm-card ecm-fade-up ecm-btn-bounce"
              onClick={() => goDetail(p)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px",
                cursor: "pointer",
                textAlign: "left",
                animationDelay: `${idx * 0.05}s`
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <ProductImage src={p.image_url} size={60} style={{ border: "1px solid #ECEAE3" }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      margin: "0 0 4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: INK
                    }}
                  >
                    {p.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#9B9A93", margin: "0 0 8px", fontWeight: 500 }}>
                    {p.brand}
                  </p>
                  {p.promo && <span className="ecm-promo-badge" style={{ background: "#FFF0F0", color: "#E53935" }}>{p.promo}</span>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                {p.oldPrice && <p className="ecm-old-price" style={{ margin: "0 0 4px" }}>{p.oldPrice.toFixed(2)} AED</p>}
                <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#E53935" }}>
                  {price.toFixed(2)}
                </p>
                <p style={{ fontSize: 10, color: "#5F5E5A", margin: "4px 0 0", fontWeight: 700 }}>at {retailer}</p>
              </div>
            </button>
          );
        })}
        {LOCAL_PRODUCTS.filter(p => activeCategory === 'all' || p.category === activeCategory).length === 0 && (
          <p style={{ fontSize: 14, color: "#9B9A93", textAlign: "center", padding: "30px 0", fontWeight: 500 }}>No promotions in this category at the moment.</p>
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
      <TopBar title="Search" onBack={goBack} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          padding: "8px 12px",
          borderRadius: 10,
          background: isOnline ? "#EAF3DE" : "#FAECE7",
          fontSize: 12,
          fontWeight: 700,
          color: isOnline ? "#3B6D11" : "#D85A30",
        }}
      >
        {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        {isOnline ? "Online: 10M+ products available" : "Offline: Local products only"}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: PAPER,
          border: `2px solid ${query.length > 0 ? BLUE : "#ECEAE3"}`,
          borderRadius: 16,
          padding: "14px 16px",
          marginBottom: 16,
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: query.length > 0 ? "0 4px 15px rgba(21, 104, 192, 0.1)" : "none"
        }}
      >
        <Search size={20} color="#9B9A93" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: water, rice, milk..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 15,
            fontWeight: 600,
            flex: 1,
            fontFamily: "inherit",
            color: INK,
          }}
        />
        {loading ? (
          <div className="ecm-spinner" style={{ width: 20, height: 20, borderWidth: 3 }} />
        ) : (
          <ScanLine size={20} color={BLUE} />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading && (
           <>
             <div className="ecm-skeleton" style={{ height: 80, width: "100%", marginBottom: 6 }}></div>
             <div className="ecm-skeleton" style={{ height: 80, width: "100%", marginBottom: 6 }}></div>
             <div className="ecm-skeleton" style={{ height: 80, width: "100%" }}></div>
           </>
        )}
        {!loading && displayProducts.map((p, idx) => {
          const [retailer, price] = cheapest(p.prices);
          return (
            <button
              key={p.id || idx}
              className="ecm-card ecm-fade-up ecm-btn-bounce"
              onClick={() => goDetail(p)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <ProductImage src={p.image_url} size={48} style={{ border: "1px solid #ECEAE3" }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </p>
                  <p style={{ fontSize: 12, color: "#9B9A93", margin: "4px 0 0", fontWeight: 500 }}>
                    {p.brand}
                    {p.quantity ? ` · ${p.quantity}` : ""}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                <p style={{ fontSize: 16, fontWeight: 800, margin: 0, color: BLUE_DARK }}>
                  {price.toFixed(2)}
                </p>
                <p style={{ fontSize: 10, color: "#5F5E5A", margin: "4px 0 0", fontWeight: 600 }}>at {retailer}</p>
              </div>
            </button>
          );
        })}

        {!loading && query.length >= 2 && displayProducts.length === 0 && (
          <div className="ecm-fade-up" style={{ textAlign: "center", padding: "50px 16px" }}>
            <Search size={36} color="#C9C7BC" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>No products found</p>
            <p style={{ fontSize: 13, color: "#9B9A93", margin: 0, fontWeight: 500 }}>
              We couldn't find this item, try a different keyword!
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
  const [selectedRetailer, setSelectedRetailer] = useState(sorted[0][0]);
  const trend = product.trend || generateTrend(product.id);
  const max = Math.max(...trend);

  const discount = Math.round(((sorted[sorted.length - 1][1] - sorted[0][1]) / sorted[sorted.length - 1][1]) * 100);

  // Gamification FOMO
  const viewers = useMemo(() => Math.floor(Math.random() * 20) + 3, []);

  const handleBuyNow = (retailerName = selectedRetailer) => {
    const url = getRetailerUrl(retailerName, product.name);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="ecm-fade-up">
      <TopBar title={product.name} onBack={goBack} shareable={true} />
      
      <div
        style={{
          background: "linear-gradient(135deg, #F7F6F2, #E6F1FB)",
          borderRadius: 22,
          padding: 28,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)"
        }}
      >
        <div style={{ position: "absolute", top: 14, left: 14, background: "#FFF0F0", color: "#E53935", padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
          <Flame size={14} /> {viewers} people are viewing
        </div>
        {product.image_url ? (
          <ProductImage src={product.image_url} size={160} style={{ borderRadius: 20, boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }} />
        ) : (
          <Droplet size={80} color={BLUE} />
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          {product.brand && (
            <p style={{ fontSize: 13, color: "#9B9A93", margin: "0 0 6px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {product.brand} {product.quantity ? ` · ${product.quantity}` : ""}
            </p>
          )}
          <p style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{product.name}</p>
        </div>
        {product.promo ? (
          <Pill tone="danger">{product.promo}</Pill>
        ) : (
          <Pill tone="success">-{discount}%</Pill>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 28 }}>
        <p style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: -1, color: product.promo ? "#E53935" : INK }}>
          {sorted[0][1].toFixed(2)} <span style={{ fontSize: 16 }}>AED</span>
        </p>
        {product.oldPrice && <p className="ecm-old-price" style={{ fontSize: 18 }}>{product.oldPrice.toFixed(2)}</p>}
      </div>

      <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>Price Trend (7 days)</p>
      <div style={{ height: 80, display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 28, padding: "12px", background: "#fff", borderRadius: 14, border: "1px solid #ECEAE3" }}>
        {trend.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(v / max) * 100}%`,
              background: i === trend.length - 1 ? BLUE : "#E6F1FB",
              borderRadius: 6,
              transition: "height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              position: "relative"
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>Where to buy?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {sorted.map(([retailer, price], i) => {
          const isSelected = selectedRetailer === retailer;
          return (
            <div
              key={retailer}
              className="ecm-card ecm-btn-bounce"
              onClick={() => {
                setSelectedRetailer(retailer);
                handleBuyNow(retailer);
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: isSelected ? `2px solid ${BLUE}` : "1px solid #ECEAE3",
                padding: "16px 20px",
                background: isSelected ? "#F9FCFF" : "#fff",
                cursor: "pointer"
              }}
            >
              <div>
                {i === 0 && <span style={{ fontSize: 11, color: BLUE, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Best Deal · </span>}
                <p style={{ fontSize: 16, fontWeight: 800, margin: i === 0 ? "2px 0 0" : 0, color: INK }}>{retailer}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: INK }}>{price.toFixed(2)} AED</p>
                <span style={{ fontSize: 11, color: BLUE, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                  Acheter <ExternalLink size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => setAlertOn((v) => !v)}
          className="ecm-btn-bounce"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 18,
            fontSize: 14,
            fontWeight: 800,
            borderRadius: 16,
            border: `2px solid ${alertOn ? BLUE : "#ECEAE3"}`,
            background: alertOn ? "#E6F1FB" : "#fff",
            color: alertOn ? BLUE : INK,
            cursor: "pointer",
          }}
        >
          <Bell size={20} className={alertOn ? "ecm-wobble" : ""} />
          {alertOn ? "Alert On" : "Price Alert"}
        </button>
        <button
          onClick={() => handleBuyNow(selectedRetailer)}
          className="ecm-pulse ecm-btn-bounce"
          style={{
            flex: 1.5,
            background: BLUE,
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: 18,
            fontSize: 16,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(21,104,192,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ goSubscription }) {
  const [lang, setLang] = useState("English");
  const rows = [
    {
      icon: ArrowLeftRight,
      label: "Language",
      value: lang,
      onClick: () =>
        setLang(lang === "English" ? "العربية" : "English"),
    },
    { icon: Gift, label: "Invite Friends", value: "Earn 50 AED", onClick: () => {
      if(navigator.share) navigator.share({title: 'Join me on Easy Compare!', url: window.location.href})
    }},
    { icon: Wallet, label: "Botim Connected", value: "Yes" },
    { icon: Bell, label: "Active Alerts", value: "3" },
  ];
  return (
    <div className="ecm-fade-up">
      <TopBar title="My Profile" shareable={true} />
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28, padding: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1568C0, #0C447C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#fff",
            fontSize: 22,
            boxShadow: "0 8px 15px rgba(21,104,192,0.2)"
          }}
        >
          VA
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 20, margin: 0 }}>Valentin A.</p>
          <p style={{ fontSize: 14, color: "#9B9A93", margin: "6px 0 0", fontWeight: 600 }}>Member since 2026</p>
        </div>
      </div>

      <div
        onClick={goSubscription}
        className="ecm-card ecm-pulse ecm-btn-bounce"
        style={{
          background: "linear-gradient(135deg, #181818, #2D2D2D)",
          color: "#fff",
          border: "none",
          padding: 24,
          marginBottom: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Sparkles size={18} color="#D4A843" />
            <p style={{ fontSize: 16, fontWeight: 800, color: "#D4A843", margin: 0 }}>Upgrade to VIP</p>
          </div>
          <p style={{ fontSize: 13, color: "#A0A0A0", margin: 0, fontWeight: 500 }}>Unlimited Access + Real-time Alerts</p>
        </div>
        <ChevronRight size={24} color="#D4A843" />
      </div>

      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #ECEAE3", overflow: "hidden" }}>
        {rows.map((r, i) => {
          const Icon = r.icon;
          const isLast = i === rows.length - 1;
          const isHighlight = r.icon === Gift;
          return (
            <button
              key={i}
              onClick={r.onClick}
              className="ecm-btn-bounce"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                background: isHighlight ? "#FFF8E7" : "none",
                border: "none",
                borderBottom: isLast ? "none" : "1px solid #ECEAE3",
                cursor: r.onClick ? "pointer" : "default",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ background: isHighlight ? "#D4A843" : "#F0EFEA", padding: 10, borderRadius: 12, color: isHighlight ? "#fff" : "#5F5E5A" }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: isHighlight ? "#854F0B" : INK }}>{r.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: isHighlight ? "#D4A843" : "#9B9A93" }}>{r.value}</span>
                <ChevronRight size={18} color={isHighlight ? "#D4A843" : "#D1D0CA"} />
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
  const [activeCategory, setActiveCategory] = useState('all');

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
  else if (screen === "alerts") content = <InstallScreen />;
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
        <p style={{ marginTop: 24, fontSize: 13, color: "#9B9A93", textAlign: "center", maxWidth: 360, lineHeight: 1.5, fontWeight: 500 }}>
          Viral Demo — 🔥 Deals, 👀 FOMO, 📤 Native Share, 💳 Stripe Ready & PWA.
        </p>
      )}
    </>
  );
}
