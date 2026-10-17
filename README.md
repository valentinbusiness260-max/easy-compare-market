# VoxBridge — Transcription & Traduction Vocale en Direct 🎙️🌐

Application web progressive (PWA) cinématographique et ultra-réactive de **transcription vocale continue** et de **traduction simultanée multilingue** (Français, Arabe avec support RTL complet, Anglais, Espagnol, etc.) intégrant un **essai gratuit de 7 jours**, un système d'abonnement Stripe et les coordonnées bancaires professionnelles.

---

## 🌟 Fonctionnalités Clés

1. **🎙️ Studio de Reconnaissance Vocale en Continu**
   - Moteur Web Speech API temps réel avec retranscription mot à mot (*interim speech results*).
   - Onde sonore animée (*sound wave visualizer*) réagissant à l'état du micro.
   - 4 raccourcis d'essais en 1 clic pour tester immédiatement sans micro.

2. **🌍 Traduction Instantanée & Typographie Arabe Pure**
   - Prise en charge bidirectionnelle : Français ➔ Arabe, Anglais ➔ Arabe, Arabe ➔ Français, etc.
   - Affichage RTL (*Right-to-Left*) natif avec la police Google **Cairo** pour un rendu élégant.
   - Moteur hybride : Dictionnaire local instantané + API MyMemory + Fallback Google Translator.

3. **🔄 Mode Conversation Face-à-Face Inversé**
   - Bouton de bascule 180° pour poser un téléphone ou une tablette au milieu d'une table entre deux personnes parlant des langues différentes.

4. **🔊 Vocalisation Native (Text-to-Speech)**
   - Prononciation à voix haute des traductions avec voix et accents natifs (`ar-SA`, `en-US`, `fr-FR`).
   - Mode auto-vocalisation débrayable.

5. **⏳ Essai Gratuit de 7 Jours & Monétisation**
   - Période d'essai de 7 jours offerte sans engagement.
   - Paiement sécurisé par **Carte Bancaire (Stripe Checkout)** configuré avec `trial_period_days: 7`.
   - Virement Bancaire Direct (RIB / IBAN professionnel international).
   - Webhook Vercel avec notifications automatiques vers `provalentin883@gmail.com`.

6. **🖥️ Mode Conférence / Grand Écran & Landing Page**
   - Mode sous-titres géants pour vidéoconférences ou présentations publiques.
   - Landing page vitrine haut de gamme avec métriques de confiance et cas d'usage (Dubaï, Tourisme, Médical).

---

## 🚀 Installation & Développement Local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Tester la qualité du code (0 warning, 0 error)
npm run lint

# Compiler pour la production
npm run build
```

---

## ☁️ Déploiement Vercel

Le projet est configuré pour un déploiement continu sur Vercel avec fonctions serverless `/api` :
```bash
# Déploiement direct
npx vercel --prod
```
