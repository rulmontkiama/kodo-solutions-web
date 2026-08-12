
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, email, referralCode } = body;

    if (!plan || !['starter', 'pro', 'max'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide (starter, pro, max)' }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodo-solutions-web.vercel.app';

    // Pricing definition
    const prices = {
      starter: { amount: 3900, name: 'Kōdo POS Starter — Abonnement Mensuel' },
      pro: { amount: 7900, name: 'Kōdo POS Pro — Abonnement Mensuel' },
      max: { amount: 14900, name: 'Kōdo POS Max — Abonnement Mensuel' },
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
              description: 'Accès complet au logiciel Kōdo POS, mises à jour à distance automatiques et support prioritaire.',
            },
            unit_amount: selectedPrice.amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
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
