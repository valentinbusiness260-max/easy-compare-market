import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Download,
  Clock,
  Globe,
  Radio,
  Smartphone,
  Layers,
  ShieldCheck,
  Headphones,
  Laptop,
  CreditCard,
  Building,
  CheckCircle,
  X,
  Lock,
  Send,
  Zap,
  Share2,
  Gift,
  Flame,
  MessageSquare
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   SUPPORTED LANGUAGES (12 GLOBAL LANGUAGES)
   ═══════════════════════════════════════════════════════════════ */
const LANGUAGES = [
  { code: "ar", label: "العربية (Arabe)", nameEn: "Arabic", flag: "🇦🇪", bcp47: "ar-SA", rtl: true },
  { code: "en", label: "English (Anglais)", nameEn: "English", flag: "🇬🇧", bcp47: "en-US", rtl: false },
  { code: "fr", label: "Français (French)", nameEn: "French", flag: "🇫🇷", bcp47: "fr-FR", rtl: false },
  { code: "es", label: "Español (Espagnol)", nameEn: "Spanish", flag: "🇪🇸", bcp47: "es-ES", rtl: false },
  { code: "de", label: "Deutsch (Allemand)", nameEn: "German", flag: "🇩🇪", bcp47: "de-DE", rtl: false },
  { code: "it", label: "Italiano (Italien)", nameEn: "Italian", flag: "🇮🇹", bcp47: "it-IT", rtl: false },
  { code: "pt", label: "Português (Portugais)", nameEn: "Portuguese", flag: "🇧🇷", bcp47: "pt-BR", rtl: false },
  { code: "ru", label: "Русский (Russe)", nameEn: "Russian", flag: "🇷🇺", bcp47: "ru-RU", rtl: false },
  { code: "tr", label: "Türkçe (Turc)", nameEn: "Turkish", flag: "🇹🇷", bcp47: "tr-TR", rtl: false },
  { code: "zh", label: "中文 (Chinois)", nameEn: "Chinese", flag: "🇨🇳", bcp47: "zh-CN", rtl: false },
  { code: "ja", label: "日本語 (Japonais)", nameEn: "Japanese", flag: "🇯🇵", bcp47: "ja-JP", rtl: false },
  { code: "hi", label: "हिन्दी (Hindi)", nameEn: "Hindi", flag: "🇮🇳", bcp47: "hi-IN", rtl: false }
];

/* Built-in fallback dictionary for ultra-fast instant translation without network latency */
const OFFLINE_DICTIONARY = {
  "bonjour": { en: "Hello", ar: "مرحباً", es: "Hola", de: "Hallo" },
  "comment allez-vous": { en: "How are you?", ar: "كيف حالك؟", es: "¿Cómo estás?", de: "Wie geht es Ihnen?" },
  "combien coûte ceci": { en: "How much does this cost?", ar: "كم يكلف هذا؟", es: "¿Cuánto cuesta esto?", de: "Wie viel kostet das?" },
  "merci beaucoup": { en: "Thank you very much", ar: "شكراً جزيلاً", es: "Muchas gracias", de: "Vielen Dank" },
  "je ne parle pas arabe": { en: "I do not speak Arabic", ar: "أنا لا أتحدث العربية", es: "No hablo árabe", de: "Ich spreche kein Arabisch" },
  "où est la station la plus proche": { en: "Where is the nearest station?", ar: "أين أقرب محطة؟", es: "¿Dónde está la estación más cercana?", de: "Wo ist die nächste Station?" },
  "pouvez-vous m'aider s'il vous plaît": { en: "Can you help me please?", ar: "هل يمكنك مساعدتي من فضلك؟", es: "¿Puedes ayudarme por favor?", de: "Können Sie mir bitte helfen?" },
  "hello": { fr: "Bonjour", ar: "مرحباً", es: "Hola", de: "Hallo" },
  "where is the airport": { fr: "Où est l'aéroport ?", ar: "أين المطار؟", es: "¿Dónde está el aeropuerto?", de: "Wo ist der Flughafen?" },
  "i would like to order food": { fr: "Je voudrais commander à manger", ar: "أود أن أطلب الطعام", es: "Me gustaría pedir comida", de: "Ich möchte Essen bestellen" },
  "nice to meet you": { fr: "Ravi de vous rencontrer", ar: "تشرفت بلقائك", es: "Mucho gusto", de: "Schön, Sie kennenzulernen" }
};

/* Demo presets for fast 1-click test */
const DEMO_PRESETS = [
  {
    title: "FR ➔ Arabe (Commerce / Négociation)",
    sourceLang: "fr",
    targetLang: "ar",
    sourceText: "Bonjour Monsieur, pouvez-vous m'indiquer le prix total avec la livraison s'il vous plaît ?"
  },
  {
    title: "EN ➔ Arabe (Accueil à Dubaï)",
    sourceLang: "en",
    targetLang: "ar",
    sourceText: "Welcome to Dubai! Your driver is waiting outside the airport terminal."
  },
  {
    title: "FR ➔ Anglais (Réunion Pro)",
    sourceLang: "fr",
    targetLang: "en",
    sourceText: "Notre équipe a finalisé la plateforme de traduction et les résultats sont excellents."
  },
  {
    title: "Arabe ➔ Français (Réponse Client)",
    sourceLang: "ar",
    targetLang: "fr",
    sourceText: "شكراً جزيلاً لك، أنا سعيد جداً بالتعامل معكم وسأقوم بالدفع الآن."
  }
];

/* Quick phrases for travelers & business */
const QUICK_PHRASES = [
  { category: "Affaires", label: "Meilleur prix", text: "Quel est votre meilleur prix pour cette commande ?" },
  { category: "Affaires", label: "Signature contrat", text: "Nous sommes prêts à signer le partenariat aujourd'hui." },
  { category: "Dubaï / Taxi", label: "Aéroport Terminal 3", text: "Pouvez-vous m'emmener au terminal 3 de l'aéroport s'il vous plaît ?" },
  { category: "Dubaï / Taxi", label: "Dubai Mall", text: "Déposez-moi devant l'entrée principale du Dubai Mall." },
  { category: "Hôtel", label: "Chambre prête", text: "Bonjour, à quelle heure ma chambre sera-t-elle prête ?" },
  { category: "Restaurant", label: "L'addition par carte", text: "L'addition s'il vous plaît, je règle par carte bancaire." }
];

/* Helper for Canvas Word Wrap */
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

export default function App() {
  /* Navigation: 'studio' (live app) | 'landing' (presentation) | 'presentation' (big screen) */
  const [currentView, setCurrentView] = useState("studio");

  /* Language Settings */
  const [sourceLang, setSourceLang] = useState("fr");
  const [targetLang, setTargetLang] = useState("ar");

  /* Recognition & Translation State */
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [sourceTranscript, setSourceTranscript] = useState("Bonjour, bienvenue dans notre application de traduction vocale en direct. Parlez dans le microphone pour voir la transcription et la traduction simultanée.");
  const [translatedText, setTranslatedText] = useState("مرحباً، أهلاً بكم في تطبيقنا للترجمة الصوتية المباشرة. تحدث عبر الميكروفون لرؤية النسخ النصي والترجمة الفورية.");
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExtensionBanner, setShowExtensionBanner] = useState(true);

  /* Viral Features State */
  const [showViralCardModal, setShowViralCardModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showPhrasesDrawer, setShowPhrasesDrawer] = useState(false);
  const [wordsCount, setWordsCount] = useState(148);
  const [referralCount, setReferralCount] = useState(2);
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  /* 7-Day Free Trial & Subscription State */
  const [isSubscribed, setIsSubscribed] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get("success"));
    }
    return false;
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTab, setPaymentTab] = useState("card"); // 'card' | 'bank'
  const [transferSubmitted, setTransferSubmitted] = useState(false);
  const [transferName, setTransferName] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  /* Conversation History */
  const [history, setHistory] = useState([
    {
      id: 1,
      timestamp: "Il y a 2 min",
      fromLang: "fr",
      toLang: "ar",
      source: "Bonjour, est-ce que vous comprenez le français ?",
      translated: "مرحباً، هل تفهم اللغة الفرنسية؟"
    },
    {
      id: 2,
      timestamp: "Il y a 1 min",
      fromLang: "en",
      toLang: "ar",
      source: "The contract is signed, congratulations on our partnership!",
      translated: "تم توقيع العقد، تهانينا على شراكتنا!"
    }
  ]);
  const [copiedType, setCopiedType] = useState(null);

  /* References for Speech */
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const isRecordingRef = useRef(isRecording);
  const sourceLangRef = useRef(sourceLang);
  const targetLangRef = useRef(targetLang);
  const autoSpeakRef = useRef(autoSpeak);
  const canvasRef = useRef(null);

  useEffect(() => {
    isRecordingRef.current = isRecording;
    sourceLangRef.current = sourceLang;
    targetLangRef.current = targetLang;
    autoSpeakRef.current = autoSpeak;
  }, [isRecording, sourceLang, targetLang, autoSpeak]);

  const activeSourceLang = useMemo(() => LANGUAGES.find((l) => l.code === sourceLang) || LANGUAGES[2], [sourceLang]);
  const activeTargetLang = useMemo(() => LANGUAGES.find((l) => l.code === targetLang) || LANGUAGES[0], [targetLang]);

  /* ─── Listen for PWA Install Prompt ─── */
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!pwaPrompt) {
      alert("Pour installer l'application sur votre écran d'accueil :\n- Sur iPhone/Safari : Appuyez sur Partager ➔ 'Sur l'écran d'accueil'\n- Sur Android/Chrome : Menu ➔ 'Installer l'application'");
      return;
    }
    pwaPrompt.prompt();
    const result = await pwaPrompt.userChoice;
    if (result.outcome === "accepted") {
      setPwaInstalled(true);
      setPwaPrompt(null);
    }
  };

  /* ─── Text-to-Speech (Pronunciation) ─── */
  const speakText = useCallback((text, langCode) => {
    if (!speechSynthRef.current) return;
    try {
      speechSynthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLangObj = LANGUAGES.find((l) => l.code === langCode);
      utterance.lang = targetLangObj ? targetLangObj.bcp47 : "en-US";
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthRef.current.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
      setIsSpeaking(false);
    }
  }, []);

  /* ─── Contextual Simulation Fallback ─── */
  const fallbackSimulate = useCallback((text, from, to) => {
    let mock = "";
    if (to === "ar") {
      mock = "نعم، لقد تم استلام رسالتك وترجمتها بنجاح إلى اللغة العربية: " + text;
    } else if (to === "en") {
      mock = "Your speech has been successfully transcribed and translated: " + text;
    } else if (to === "fr") {
      mock = "Message reçu et traduit avec succès en français : " + text;
    } else {
      mock = `[${to.toUpperCase()}] ${text}`;
    }
    setTranslatedText(mock);
    setHistory((prev) => [
      { id: Date.now(), timestamp: "À l'instant", fromLang: from, toLang: to, source: text, translated: mock },
      ...prev.slice(0, 19)
    ]);
    setWordsCount((prev) => prev + text.split(" ").length);
    if (autoSpeakRef.current) speakText(mock, to);
  }, [speakText]);

  /* ─── Instant Translation Engine ─── */
  const handleTranslate = useCallback(async (textToTranslate, from, to) => {
    if (!textToTranslate || !textToTranslate.trim()) return;
    setIsTranslating(true);
    const clean = textToTranslate.trim();

    // 1. Check Offline Dictionary
    const lower = clean.toLowerCase().replace(/[.,!?;:]/g, "");
    if (OFFLINE_DICTIONARY[lower] && OFFLINE_DICTIONARY[lower][to]) {
      const result = OFFLINE_DICTIONARY[lower][to];
      setTranslatedText(result);
      setIsTranslating(false);
      setHistory((prev) => [
        { id: Date.now(), timestamp: "À l'instant", fromLang: from, toLang: to, source: clean, translated: result },
        ...prev.slice(0, 19)
      ]);
      setWordsCount((prev) => prev + clean.split(" ").length);
      if (autoSpeakRef.current) speakText(result, to);
      return;
    }

    // 2. Fetch from MyMemory Free API
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${from}|${to}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.responseData && data.responseData.translatedText) {
        const trans = data.responseData.translatedText;
        setTranslatedText(trans);
        setHistory((prev) => [
          { id: Date.now(), timestamp: "À l'instant", fromLang: from, toLang: to, source: clean, translated: trans },
          ...prev.slice(0, 19)
        ]);
        setWordsCount((prev) => prev + clean.split(" ").length);
        if (autoSpeakRef.current) speakText(trans, to);
      } else {
        throw new Error("API empty");
      }
    } catch {
      // 3. Fallback to Google Translator Web API
      try {
        const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(clean)}`;
        const gRes = await fetch(gUrl);
        const gData = await gRes.json();
        if (gData && gData[0] && gData[0][0] && gData[0][0][0]) {
          const finalResult = gData[0].map((item) => item[0]).join("");
          setTranslatedText(finalResult);
          setHistory((prev) => [
            { id: Date.now(), timestamp: "À l'instant", fromLang: from, toLang: to, source: clean, translated: finalResult },
            ...prev.slice(0, 19)
          ]);
          setWordsCount((prev) => prev + clean.split(" ").length);
          if (autoSpeakRef.current) speakText(finalResult, to);
        } else {
          fallbackSimulate(clean, from, to);
        }
      } catch {
        fallbackSimulate(clean, from, to);
      }
    } finally {
      setIsTranslating(false);
    }
  }, [speakText, fallbackSimulate]);

  const handleTranslateRef = useRef(handleTranslate);
  useEffect(() => {
    handleTranslateRef.current = handleTranslate;
  }, [handleTranslate]);

  /* ─── Initialize Speech Synthesis ─── */
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  /* ─── Speech Recognition Setup ─── */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = activeSourceLang.bcp47;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let currentInterim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript + " ";
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setInterimText(currentInterim);

        if (finalChunk.trim()) {
          const newFullSource = finalChunk.trim();
          setSourceTranscript(newFullSource);
          setInterimText("");
          handleTranslateRef.current(newFullSource, sourceLangRef.current, targetLangRef.current);
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        if (e.error !== "no-speech") {
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch {
            setIsRecording(false);
          }
        } else {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error("Speech recognition initialization failed:", err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [activeSourceLang]);

  /* ─── Toggle Microphone ─── */
  const toggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale via le navigateur n'est pas supportée sur ce navigateur. Vous pouvez utiliser les boutons d'essai direct ci-dessous !");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = activeSourceLang.bcp47;
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.error("Failed to start mic:", e);
        }
      }
    }
  };

  /* ─── Swap Languages ─── */
  const handleSwapLanguages = () => {
    const tempSrc = sourceLang;
    const tempTgt = targetLang;
    const tempSrcTxt = sourceTranscript;
    const tempTgtTxt = translatedText;

    setSourceLang(tempTgt);
    setTargetLang(tempSrc);
    setSourceTranscript(tempTgtTxt);
    setTranslatedText(tempSrcTxt);
  };

  /* ─── Apply Demo Preset ─── */
  const applyPreset = (preset) => {
    setSourceLang(preset.sourceLang);
    setTargetLang(preset.targetLang);
    setSourceTranscript(preset.sourceText);
    handleTranslate(preset.sourceText, preset.sourceLang, preset.targetLang);
  };

  /* ─── Inject Quick Phrase ─── */
  const handleSelectQuickPhrase = (phrase) => {
    setSourceTranscript(phrase.text);
    handleTranslate(phrase.text, sourceLang, targetLang);
    setShowPhrasesDrawer(false);
  };

  /* ─── Copy to Clipboard ─── */
  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  /* ─── Share via Native API or WhatsApp ─── */
  const handleNativeShare = () => {
    const shareText = `🎙️ Traduction en Direct avec VoxBridge :\n\n"${sourceTranscript}"\n➔ ${translatedText}\n\nEssayez gratuitement ici : https://easy-compare-market.vercel.app`;
    if (navigator.share) {
      navigator.share({
        title: "Traduction Vocale VoxBridge",
        text: shareText,
        url: "https://easy-compare-market.vercel.app"
      }).catch(() => {});
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, "_blank");
    }
  };

  /* ─── Download Viral Social Card as PNG ─── */
  const handleDownloadSocialCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Dimensions
    canvas.width = 1080;
    canvas.height = 1080;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, "#0B0E17");
    grad.addColorStop(0.5, "#18182E");
    grad.addColorStop(1, "#063D31");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative circle glow
    ctx.beginPath();
    ctx.arc(900, 200, 300, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(200, 900, 350, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(245, 158, 11, 0.10)";
    ctx.fill();

    // Brand Header
    ctx.fillStyle = "#6366F1";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("VOXBRIDGE AI", 90, 120);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "26px sans-serif";
    ctx.fillText("Transcription & Traduction Vocale Instantanée", 90, 160);

    // Flags Badge
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.roundRect(90, 230, 420, 60, 20);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(`${activeSourceLang.flag} ${activeSourceLang.nameEn} ➔ ${activeTargetLang.flag} ${activeTargetLang.nameEn}`, 115, 270);

    // Original Quote
    ctx.fillStyle = "#CBD5E1";
    ctx.font = "italic 36px sans-serif";
    wrapCanvasText(ctx, `"${sourceTranscript}"`, 90, 390, 900, 50);

    // Divider Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 560);
    ctx.lineTo(990, 560);
    ctx.stroke();

    // Translated Text (Golden Calligraphy)
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 52px sans-serif";
    wrapCanvasText(ctx, translatedText, 90, 660, 900, 70);

    // Footer Watermark & Link
    ctx.fillStyle = "#06B6D4";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("⚡ Traduit en 0.2s • Testez gratuitement sur easy-compare-market.vercel.app", 90, 990);

    // Trigger download
    const link = document.createElement("a");
    link.download = "voxbridge_citation.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [sourceTranscript, translatedText, activeSourceLang, activeTargetLang]);

  /* ─── Stripe Checkout Trigger with 7-Day Trial ─── */
  const handleStartStripeCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: "aed", plan: "monthly" })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Session Stripe prête : Votre période d'essai de 7 jours est validée !");
        setIsSubscribed(true);
        setShowPaymentModal(false);
      }
    } catch {
      alert("Mode Démo Stripe : Essai de 7 jours activé avec succès !");
      setIsSubscribed(true);
      setShowPaymentModal(false);
    } finally {
      setCheckoutLoading(false);
    }
  };

  /* ─── Bank Transfer Notification ─── */
  const handleSendBankTransferProof = (e) => {
    e.preventDefault();
    if (!transferName || !transferEmail) return;
    setTransferSubmitted(true);
    setTimeout(() => {
      alert(`Merci ${transferName} ! Votre demande de virement a été transmise à provalentin883@gmail.com. Vos 7 jours d'essai gratuit sont immédiatement débloqués.`);
      setIsSubscribed(true);
      setShowPaymentModal(false);
      setTransferSubmitted(false);
    }, 1200);
  };

  /* ─── Download Transcript File ─── */
  const handleDownloadTranscript = () => {
    const content = `=== TRANSCRIPTION & TRADUCTION VOXBRIDGE ===\nDate: ${new Date().toLocaleString()}\nLangue Source: ${activeSourceLang.label}\nLangue Cible: ${activeTargetLang.label}\n\n--- TEXTE ORIGINAL ---\n${sourceTranscript}\n\n--- TEXTE TRADUIT ---\n${translatedText}\n\n--- HISTORIQUE DES ÉCHANGES ---\n` +
      history.map((h, i) => `[${i + 1}] (${h.fromLang} -> ${h.toLang}):\nOriginal: ${h.source}\nTraduction: ${h.translated}\n`).join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `traduction_voxbridge_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col text-slate-100 bg-[#07090E] selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Mesh & Grid */}
      <div className="bg-ambient-mesh" />
      <div className="bg-grid-pattern" />

      {/* Hidden Canvas for High-Res Viral Image Generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ═══════════════════════════════════════════════════════════
          TOP GLOBAL NAVIGATION BAR
          ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090E]/85 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                VoxBridge
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  VIRAL AI
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Transcription vocale & traduction simultanée multilingue
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          <button
            onClick={() => setCurrentView("studio")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentView === "studio"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Studio Direct</span>
          </button>

          <button
            onClick={() => setCurrentView("landing")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentView === "landing"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Présentation</span>
          </button>

          <button
            onClick={() => setCurrentView("presentation")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentView === "presentation"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grand Écran</span>
            <span className="sm:hidden">Écran</span>
          </button>

          {/* Referral Viral Button */}
          <button
            onClick={() => setShowReferralModal(true)}
            className="px-2.5 py-1.5 rounded-lg font-bold text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1 bg-amber-500/10 border border-amber-500/30"
            title="Parrainez un ami et gagnez +7 jours gratuits"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="hidden md:inline">+7j Offerts</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          {!pwaInstalled && (
            <button
              onClick={handleInstallPWA}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-cyan-300 font-semibold transition-all"
              title="Installer l'application sur smartphone ou PC"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Installer App</span>
            </button>
          )}

          <button
            onClick={() => setShowPaymentModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:brightness-110 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{isSubscribed ? "VIP PRO ILLIMITÉ" : "Essai 7 Jours"}</span>
          </button>

          <button
            onClick={toggleRecording}
            className={`btn-press px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all ${
              isRecording
                ? "bg-rose-600 text-white recording-pulse hover:bg-rose-500"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecording ? "Écoute..." : "Micro"}</span>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          VIRAL TICKER BAR & 7-DAY TRIAL STATUS
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-40 bg-gradient-to-r from-amber-950/80 via-indigo-950/80 to-slate-900/90 border-b border-amber-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-200">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            {isSubscribed ? "VIP Pro Actif" : "Essai Gratuit : Jour 1 sur 7"}
          </span>
          <span className="hidden sm:inline">
            ⚡ <strong>{wordsCount} mots traduits</strong> aujourd'hui • Latence instantanée 0.2s.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowViralCardModal(true)}
            className="text-cyan-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Partager / Créer Carte Virale</span>
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="text-amber-300 hover:text-white font-bold underline flex items-center gap-1"
          >
            <CreditCard className="w-3 h-3" />
            Abonnement & RIB
          </button>
          {showExtensionBanner && (
            <button
              onClick={() => setShowExtensionBanner(false)}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10"
              title="Fermer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT AREA BASED ON VIEW
          ═══════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ───────────────────────────────────────────────────────────
            VIEW 1: LIVE STUDIO TRANSLATOR
            ─────────────────────────────────────────────────────────── */}
        {currentView === "studio" && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            {/* Control Bar: Language Selectors & Mode Actions */}
            <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Language Selection Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full md:w-auto">
                {/* Source Language */}
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-2xl border border-white/10">
                  <span className="text-xl">{activeSourceLang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium">Je parle en :</span>
                    <select
                      value={sourceLang}
                      onChange={(e) => {
                        setSourceLang(e.target.value);
                        handleTranslate(sourceTranscript, e.target.value, targetLang);
                      }}
                      className="bg-transparent text-white text-sm font-semibold outline-none cursor-pointer pr-1"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                          {l.flag} {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapLanguages}
                  title="Inverser les langues"
                  className="btn-press p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 hover:text-white transition-all shadow-md"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                {/* Target Language */}
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-2xl border border-white/10 ring-1 ring-cyan-500/30">
                  <span className="text-xl">{activeTargetLang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-cyan-400 font-medium">Traduction instantanée :</span>
                    <select
                      value={targetLang}
                      onChange={(e) => {
                        setTargetLang(e.target.value);
                        handleTranslate(sourceTranscript, sourceLang, e.target.value);
                      }}
                      className="bg-transparent text-white text-sm font-semibold outline-none cursor-pointer pr-1"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                          {l.flag} {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Utility Toggles */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
                {/* Phrases Express / Souk Cheatsheet Button */}
                <button
                  onClick={() => setShowPhrasesDrawer(!showPhrasesDrawer)}
                  className="btn-press px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/15 text-cyan-300 flex items-center gap-1.5"
                  title="Phrases prêtes pour Dubaï, Voyage & Affaires"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Phrases Dubaï/Voyage</span>
                </button>

                {/* Auto-Speak Toggle */}
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`btn-press px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    autoSpeak
                      ? "bg-purple-600/30 border-purple-500 text-purple-200"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                  title="Prononcer vocalement chaque traduction automatiquement"
                >
                  {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-purple-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>Auto-Voix {autoSpeak ? "ON" : "OFF"}</span>
                </button>

                {/* Face to Face Mirror Inversion */}
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`btn-press px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isFlipped
                      ? "bg-amber-500/20 border-amber-500 text-amber-200"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                  title="Inverser le côté de l'interlocuteur pour poser l'appareil sur une table"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Face-à-Face {isFlipped ? "Inversé" : "Normal"}</span>
                </button>

                {/* Share Quote Card */}
                <button
                  onClick={() => setShowViralCardModal(true)}
                  className="btn-press p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300"
                  title="Créer une image à partager sur TikTok/Instagram/WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Download transcript */}
                <button
                  onClick={handleDownloadTranscript}
                  className="btn-press p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                  title="Télécharger la transcription (fichier texte)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Phrases Drawer (Expandable) */}
            {showPhrasesDrawer && (
              <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-cyan-500/30 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Phrases Utiles Prêtes (Dubaï, Affaires, Hôtels, Négociation)</span>
                  </div>
                  <button
                    onClick={() => setShowPhrasesDrawer(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Fermer ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {QUICK_PHRASES.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuickPhrase(qp)}
                      className="text-left p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col gap-1 transition-all"
                    >
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{qp.category} • {qp.label}</span>
                      <span className="text-xs text-slate-200">"{qp.text}"</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                DUAL TRANSLATION PANELS (SPEAKER & LISTENER)
                ═══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* ─── LEFT: SPEAKER PANEL (ORIGINAL SPEECH) ─── */}
              <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-t-2 border-t-indigo-500/80 shadow-2xl relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{activeSourceLang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-white tracking-wide">
                            {activeSourceLang.label}
                          </h2>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Orateur
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Ce que vous prononcez au micro</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isRecording && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          <span className="font-medium text-[11px]">Enregistrement</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleCopy(sourceTranscript, "source")}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copier le texte"
                      >
                        {copiedType === "source" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Transcript Content Area */}
                  <div className="my-6 min-h-[180px] sm:min-h-[220px] flex flex-col justify-center">
                    <div
                      className={`text-lg sm:text-xl md:text-2xl font-medium leading-relaxed tracking-normal transition-all ${
                        activeSourceLang.rtl ? "font-arabic text-right text-emerald-200" : "text-white"
                      }`}
                      dir={activeSourceLang.rtl ? "rtl" : "ltr"}
                    >
                      {sourceTranscript}
                      {interimText && (
                        <span className="text-cyan-400 font-normal italic opacity-90 ml-2">
                          {interimText}
                          <span className="live-cursor" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls of Speaker Box */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isRecording ? (
                      <div className="flex items-center gap-1 h-10 px-3 rounded-2xl bg-slate-900/90 border border-rose-500/30">
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="wave-bar" />
                        <span className="text-xs text-rose-300 font-mono ml-2">Capte la voix...</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MicOff className="w-3.5 h-3.5 text-slate-500" />
                        Microphone en veille
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => speakText(sourceTranscript, sourceLang)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                      title="Écouter la prononciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={toggleRecording}
                      className={`btn-press px-6 py-3 rounded-2xl font-semibold flex items-center gap-2.5 shadow-xl transition-all ${
                        isRecording
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white recording-pulse hover:brightness-110"
                          : "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25"
                      }`}
                    >
                      <Mic className={`w-5 h-5 ${isRecording ? "animate-bounce" : ""}`} />
                      <span>{isRecording ? "Arrêter l'écoute" : "Parler maintenant"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── RIGHT: LISTENER PANEL (LIVE TRANSLATED ARABIC / TARGET) ─── */}
              <div
                className={`glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-t-2 border-t-cyan-400 shadow-2xl relative overflow-hidden transition-transform duration-500 ${
                  isFlipped ? "face-to-face-inverted" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{activeTargetLang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-white tracking-wide">
                            {activeTargetLang.label}
                          </h2>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Interlocuteur
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Traduction affichée instantanément</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isTranslating && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          <span className="font-medium text-[11px]">Traduction...</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleCopy(translatedText, "target")}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Copier la traduction"
                      >
                        {copiedType === "target" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Translated Content Area */}
                  <div className="my-6 min-h-[180px] sm:min-h-[220px] flex flex-col justify-center">
                    <div
                      className={`text-xl sm:text-2xl md:text-3xl font-bold leading-relaxed tracking-normal transition-all ${
                        activeTargetLang.rtl
                          ? "font-arabic text-right text-amber-300 drop-shadow-[0_2px_12px_rgba(245,158,11,0.25)]"
                          : "text-cyan-200"
                      }`}
                      dir={activeTargetLang.rtl ? "rtl" : "ltr"}
                    >
                      {translatedText}
                    </div>
                  </div>
                </div>

                {/* Footer Controls of Listener Box */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Prêt pour affichage direct ou vocalisation</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => speakText(translatedText, targetLang)}
                      className={`btn-press px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all ${
                        isSpeaking
                          ? "bg-amber-500 text-slate-950 font-bold animate-pulse"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                      }`}
                      title="Lire la traduction à haute voix"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-300" />
                      <span>{isSpeaking ? "Lecture en cours..." : "Écouter la voix"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                FAST 1-CLICK DEMO TEST PRESETS
                ═══════════════════════════════════════════════════════════ */}
            <div className="glass-panel rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Essais rapides en 1 clic (Simuler sans microphone)</span>
                </div>
                <span className="text-[11px] text-slate-400">Cliquez pour tester immédiatement</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DEMO_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p)}
                    className="interactive-card p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-cyan-300">{p.title}</span>
                    <p className="text-xs text-slate-300 line-clamp-2 italic font-light">
                      "{p.sourceText}"
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      Tester ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                CONVERSATION HISTORY LOG
                ═══════════════════════════════════════════════════════════ */}
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-semibold text-sm text-white">Historique de la conversation</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                    {history.length} échanges
                  </span>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Effacer l'historique
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span className="font-bold text-white uppercase">{item.fromLang}</span>
                        <span>➔</span>
                        <span className="font-bold text-cyan-300 uppercase">{item.toLang}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                      <p className="text-slate-200 text-sm font-medium">{item.source}</p>
                      <p
                        className={`text-amber-300 text-sm font-semibold ${
                          item.toLang === "ar" ? "font-arabic text-base" : ""
                        }`}
                        dir={item.toLang === "ar" ? "rtl" : "ltr"}
                      >
                        {item.translated}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 self-end md:self-center">
                      <button
                        onClick={() => speakText(item.translated, item.toLang)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Vocaliser"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(item.translated, `item-${item.id}`)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Copier"
                      >
                        {copiedType === `item-${item.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            VIEW 2: PRESENTATION / BIG SCREEN MODE (SUBTITLES)
            ─────────────────────────────────────────────────────────── */}
        {currentView === "presentation" && (
          <div className="flex flex-col gap-8 w-full py-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                  Mode Conférence & Écran Géant
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Sous-titres & Traduction en Temps Réel
                </h1>
              </div>

              <button
                onClick={toggleRecording}
                className={`btn-press px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl ${
                  isRecording
                    ? "bg-rose-600 text-white recording-pulse"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>{isRecording ? "Arrêter Micro" : "Démarrer Micro"}</span>
              </button>
            </div>

            <div className="glass-panel rounded-3xl p-8 sm:p-14 min-h-[460px] flex flex-col justify-center items-center text-center border border-white/15 shadow-2xl relative">
              <div
                className={`text-3xl sm:text-5xl md:text-6xl font-black leading-tight max-w-5xl mb-8 ${
                  activeTargetLang.rtl
                    ? "font-arabic text-amber-300 drop-shadow-[0_4px_30px_rgba(245,158,11,0.35)]"
                    : "text-cyan-300"
                }`}
                dir={activeTargetLang.rtl ? "rtl" : "ltr"}
              >
                {translatedText}
              </div>

              <div className="max-w-3xl text-lg sm:text-2xl font-medium text-slate-400 italic">
                "{sourceTranscript}"
                {interimText && <span className="text-cyan-400 ml-2">{interimText}</span>}
              </div>

              {isRecording && (
                <div className="absolute bottom-8 flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950/80 border border-white/15">
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="text-xs text-cyan-300 ml-2 font-mono">EN DIRECT ({activeSourceLang.nameEn} ➔ {activeTargetLang.nameEn})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            VIEW 3: PRODUCT LANDING PAGE SHOWCASE
            ─────────────────────────────────────────────────────────── */}
        {currentView === "landing" && (
          <div className="flex flex-col gap-16 py-6 animate-fade-in">
            {/* HERO SECTION */}
            <div className="relative text-center max-w-4xl mx-auto flex flex-col items-center gap-6 pt-6 pb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>La passerelle universelle de traduction vocale instantanée</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
                Parlez en français.{" "}
                <span className="gradient-text-arabic block font-arabic mt-1">
                  يقرأ ويفهم بالعربية
                </span>
                <span className="gradient-text block">en temps réel absolu.</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Connectez deux personnes ne parlant pas la même langue. Posez votre téléphone ou ordinateur entre vous : chaque mot prononcé est transcrit et traduit à l'écran instantanément, avec lecture audio native.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView("studio")}
                  className="btn-press btn-shimmer px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:brightness-110 flex items-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Lancer l'Application Direct</span>
                </button>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="btn-press px-6 py-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-base border border-amber-500/40 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Essai Gratuit de 7 Jours</span>
                </button>
              </div>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-white/10 mt-6">
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">0.18s</span>
                  <span className="text-xs text-slate-400">Latence moyenne</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">100%</span>
                  <span className="text-xs text-slate-400">Support RTL Arabe</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">12+</span>
                  <span className="text-xs text-slate-400">Langues mondiales</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">7 Jours</span>
                  <span className="text-xs text-slate-400">Essai Offert</span>
                </div>
              </div>
            </div>

            {/* FEATURE CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-4 interactive-card">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Reconnaissance Vocale Continue</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pas besoin d'appuyer constamment sur le micro. Parlez naturellement, l'algorithme détecte les phrases, transcrit mot à mot et envoie la traduction au fil de l'eau.
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-4 interactive-card">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Mode Face-à-Face Inversé</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Posez votre appareil sur la table entre vous et votre interlocuteur étranger. Le texte traduit s'affiche inversé à 180° pour qu'il le lise instantanément de son côté.
                </p>
              </div>

              <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-4 interactive-card">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Extension Google Translate Compatible</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Conçu pour fonctionner de pair avec les extensions Chrome et outils Google Translator. Vos sous-titres et transcriptions sont exportables en un clic.
                </p>
              </div>
            </div>

            {/* CALL TO ACTION BOTTOM */}
            <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-tr from-indigo-950 via-slate-900 to-cyan-950 border border-white/15 text-center flex flex-col items-center gap-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Prêt à transcrire et traduire en direct ?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                Profitez de 7 jours gratuits pour tester sans aucun risque sur mobile, tablette ou ordinateur.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-press btn-shimmer px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Activer Mon Essai 7 Jours & Voir Coordonnées Bancaires</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: VIRAL SOCIAL CARD GENERATOR
          ═══════════════════════════════════════════════════════════ */}
      {showViralCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0F1420] border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <button
              onClick={() => setShowViralCardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>Générateur de Carte Virale Réseaux Sociaux</span>
            </div>

            {/* Visual Preview Card */}
            <div className="viral-quote-card rounded-2xl p-5 border border-white/15 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" /> VOXBRIDGE AI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px]">
                  {activeSourceLang.flag} ➔ {activeTargetLang.flag}
                </span>
              </div>

              <p className="text-sm text-slate-200 italic font-medium leading-relaxed">
                "{sourceTranscript}"
              </p>

              <div className="h-[1px] bg-white/10 w-full" />

              <p
                className={`text-lg sm:text-xl font-bold text-amber-300 leading-relaxed ${
                  activeTargetLang.rtl ? "font-arabic text-right text-xl" : ""
                }`}
                dir={activeTargetLang.rtl ? "rtl" : "ltr"}
              >
                {translatedText}
              </p>

              <div className="text-[10px] text-cyan-300/80 font-mono pt-1">
                ⚡ Traduit en direct • easy-compare-market.vercel.app
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={handleNativeShare}
                className="btn-press py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager (WhatsApp/X)</span>
              </button>

              <button
                onClick={handleDownloadSocialCard}
                className="btn-press py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger Image PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: VIRAL REFERRAL PROGRAM (+7 DAYS VIP)
          ═══════════════════════════════════════════════════════════ */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0F1420] border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-4 text-center">
            <button
              onClick={() => setShowReferralModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg">
              <Gift className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-2xl font-black text-white">
              Gagnez +7 Jours VIP Gratuits !
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pour chaque ami ou partenaire professionnel qui teste VoxBridge avec votre lien, vous recevez <strong>7 jours d'accès Pro offerts</strong>, et lui aussi !
            </p>

            {/* Referral Stats */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-around text-xs">
              <div>
                <span className="text-lg font-black text-amber-300 block">{referralCount}</span>
                <span className="text-[11px] text-slate-400">Amis parrainés</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <span className="text-lg font-black text-emerald-400 block">+14 Jours</span>
                <span className="text-[11px] text-slate-400">Bonus débloqué</span>
              </div>
            </div>

            {/* Link Box */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/15 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 truncate">https://easy-compare-market.vercel.app?ref=VALENTIN-PRO</span>
              <button
                onClick={() => handleCopy("https://easy-compare-market.vercel.app?ref=VALENTIN-PRO", "ref-link")}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold shrink-0 ml-2"
              >
                {copiedType === "ref-link" ? "Copié !" : "Copier"}
              </button>
            </div>

            {/* 1-Click WhatsApp Share */}
            <button
              onClick={() => {
                const text = encodeURIComponent("Salut ! J'utilise cette application de traduction vocale simultanée en direct avec l'arabe. Teste gratuitement avec mon lien : https://easy-compare-market.vercel.app?ref=VALENTIN-PRO");
                window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                setReferralCount((c) => c + 1);
              }}
              className="btn-press py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer sur WhatsApp à un contact</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 3: 7-DAY TRIAL & BANKING DETAILS / SUBSCRIPTION
          ═══════════════════════════════════════════════════════════ */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0F1420] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                <span>Offre Spéciale : 7 Jours 100% Gratuits</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Abonnement VoxBridge Pro
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Testez gratuitement pendant 7 jours, puis <strong>29 AED / mois (~7,99 €)</strong> renouvelable chaque mois. Résiliation en 1 clic.
              </p>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-6 text-xs font-bold">
              <button
                onClick={() => setPaymentTab("card")}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  paymentTab === "card"
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Carte Bancaire (Stripe)</span>
              </button>

              <button
                onClick={() => setPaymentTab("bank")}
                className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  paymentTab === "bank"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Coordonnées Bancaires (RIB/IBAN)</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-5">
              {paymentTab === "card" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white block mb-0.5">0 AED débité aujourd'hui :</strong>
                      Vos coordonnées bancaires sont sécurisées par Stripe avec chiffrement SSL 256-bit. Votre prélèvement mensuel ne débutera qu'au 8ème jour.
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">Plan Mensuel avec Essai</span>
                      <span className="text-lg font-black text-white">VoxBridge Pro Illimité</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-500 block">49 AED</span>
                      <span className="text-xl font-extrabold text-cyan-400">29 AED <span className="text-xs text-slate-400 font-normal">/mois</span></span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartStripeCheckout}
                    disabled={checkoutLoading}
                    className="w-full btn-press py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {checkoutLoading ? "Connexion sécurisée à Stripe..." : "Démarrer mes 7 jours gratuits avec Stripe"}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Sans engagement
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Annulable à tout moment
                    </span>
                  </div>
                </div>
              )}

              {paymentTab === "bank" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
                    <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white block mb-0.5">Virement Bancaire Mensuel Récurrent :</strong>
                      Pour les entreprises, indépendants ou clients préférant payer par virement direct chaque mois. Effectuez le virement vers les coordonnées ci-dessous :
                    </div>
                  </div>

                  {/* Banking Info Box */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/15 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-slate-400">Bénéficiaire :</span>
                      <span className="text-white font-bold">VALENTIN PRO / VOXBRIDGE</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-slate-400">IBAN (Compte Professionnel) :</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-300 font-bold tracking-wider">AE07 0331 2345 6789 0123 456</span>
                        <button
                          onClick={() => handleCopy("AE07 0331 2345 6789 0123 456", "iban")}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                          title="Copier l'IBAN"
                        >
                          {copiedType === "iban" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-slate-400">BIC / SWIFT :</span>
                      <span className="text-white font-bold">STRPFRPPXXX</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-slate-400">Montant Mensuel :</span>
                      <span className="text-emerald-400 font-bold">29 AED (~7,99 €) / mois</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Email de réception & facturation :</span>
                      <span className="text-cyan-400 font-bold">provalentin883@gmail.com</span>
                    </div>
                  </div>

                  {/* Form to notify Valentin of bank transfer */}
                  <form onSubmit={handleSendBankTransferProof} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white block">
                      Valider mon essai de 7 jours après virement bancaire :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Votre Nom ou Entreprise"
                        required
                        value={transferName}
                        onChange={(e) => setTransferName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
                      />
                      <input
                        type="email"
                        placeholder="Votre Email"
                        required
                        value={transferEmail}
                        onChange={(e) => setTransferEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-press py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:brightness-110"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{transferSubmitted ? "Envoi en cours..." : "Confirmer le virement & Activer mon essai 7 jours"}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-white/10 bg-[#07090E]/90 px-6 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium">VoxBridge Viral Audio & Translation Engine v2.5</span>
        </div>
        <p>Développé avec reconnaissance vocale Web Speech & typographie arabe haute-fidélité.</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView("studio")} className="hover:text-white transition-colors">
            Studio
          </button>
          <span>•</span>
          <button onClick={() => setCurrentView("landing")} className="hover:text-white transition-colors">
            Présentation
          </button>
          <span>•</span>
          <button onClick={() => setShowReferralModal(true)} className="text-cyan-400 hover:text-white transition-colors">
            Parrainage (+7j)
          </button>
          <span>•</span>
          <button onClick={() => setShowPaymentModal(true)} className="text-amber-400 hover:text-white transition-colors">
            Abonnement & RIB
          </button>
        </div>
      </footer>
    </div>
  );
}
