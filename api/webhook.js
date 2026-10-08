// api/webhook.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody.toString('utf8'), sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Call Resend API or any other email service to notify the owner
    const email = process.env.NOTIFICATION_EMAIL || 'provalentin883@gmail.com';
    console.log(`Payment successful for session ${session.id}. Send email to ${email}`);
    
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Acme <onboarding@resend.dev>',
          to: [email],
          subject: 'Nouveau Paiement Premium ! 💰',
          html: `<strong>Félicitations !</strong> Un nouveau client vient de s'abonner au plan Premium (14.99 AED) sur Easy Compare Market.`
        })
      });
    } catch (e) {
      console.error("Erreur lors de l'envoi de l'email", e);
    }
  }

  res.status(200).json({ received: true });
}
