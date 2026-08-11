
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, email, referralCode } = body; // plan = 'BASIC', 'PRO', or 'ENTERPRISE'

    if (!plan || !['BASIC', 'PRO', 'ENTERPRISE'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide (BASIC, PRO, ENTERPRISE)' }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodo-solutions-web.vercel.app';

    // Pricing definition
    const prices = {
      BASIC: { amount: 3900, name: 'Kōdo Starter (BASIC) — Abonnement Mensuel', desc: 'Encaissement simple et gestion des stocks de base.' },
      PRO: { amount: 7900, name: 'Kōdo Pro (PRO) — Abonnement Mensuel', desc: 'Synchronisation Shopify, module certifié NF525 et statistiques avancées.' },
      ENTERPRISE: { amount: 14900, name: 'Kōdo Max (ENTERPRISE) — Abonnement Mensuel', desc: 'Gestion multi-caisses, support prioritaire et fonctionnalités illimitées.' },
    };

    const selectedPrice = prices[plan as keyof typeof prices];

    // Build Stripe Checkout Session line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: selectedPrice.name,
              description: selectedPrice.desc,
            },
            unit_amount: selectedPrice.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      allow_promotion_codes: true, // Enables promo code input on Stripe Checkout
      metadata: {
        plan,
        referralCode: referralCode || '',
      },
      success_url: `${domain}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${domain}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Erreur API Stripe Checkout:', error);
    return NextResponse.json(
      { error:  (error as Error).message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
