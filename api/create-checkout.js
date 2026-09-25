import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'Abonnement Premium Easy Compare Market',
              description: 'Accès illimité et alertes de prix en temps réel',
            },
            unit_amount: 1499, // 14.99 AED
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}?success=true`,
      cancel_url: `${req.headers.origin}?canceled=true`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
