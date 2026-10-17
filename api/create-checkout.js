import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ message: 'Stripe secret key not configured.' });
  }

  const stripe = new Stripe(secretKey);

  try {
    const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'https://easy-compare-market.vercel.app');
    const { currency = 'aed', plan = 'monthly' } = req.body || {};

    const priceAmount = plan === 'annual' ? 24900 : 2900; // 29 AED/month or 249 AED/year

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'VoxBridge Pro — Traduction Vocale & Transcription Illimitée',
              description: 'Essai gratuit de 7 jours inclus, puis abonnement mensuel renouvelable. Accès illimité aux 40+ langues, voix IA et transcription en direct.',
              images: ['https://images.unsplash.com/photo-1589254065878-42c9da997008?w=300&h=300&fit=crop'],
            },
            unit_amount: priceAmount,
            recurring: {
              interval: plan === 'annual' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7, // 7 days 100% free trial before first charge!
        description: 'Essai gratuit 7 jours puis abonnement VoxBridge Pro',
      },
      success_url: `${origin}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=true`,
      locale: 'fr',
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
