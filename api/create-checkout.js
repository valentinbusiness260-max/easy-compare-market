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
    const origin = req.headers.origin || 'https://easy-compare-market.vercel.app';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'Abonnement Premium — Easy Compare Market',
              description: 'Accès illimité, +10,000 produits et alertes de prix en temps réel',
              images: ['https://easy-compare-market.vercel.app/favicon.svg'],
            },
            unit_amount: 1499, // 14.99 AED
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}?canceled=true`,
      locale: 'fr',
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
