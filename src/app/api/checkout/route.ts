import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const PLAN_ALIAS_MAP: Record<string, 'starter' | 'pro' | 'max'> = {
  starter: 'starter',
  essentiel: 'starter',
  pro: 'pro',
  max: 'max',
  omnicanal: 'max',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, email, referralCode, billing } = body;

    const normalizedPlan = typeof plan === 'string' ? PLAN_ALIAS_MAP[plan.toLowerCase()] : undefined;

    if (!normalizedPlan) {
      return NextResponse.json(
        { error: 'Plan invalide (essentiel/starter, pro, omnicanal/max)' },
        { status: 400 }
      );
    }

    const billingCycle: 'monthly' | 'yearly' =
      billing === 'annual' || billing === 'yearly' ? 'yearly' : 'monthly';
    const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodo-solutions-web.vercel.app';

    // Radical tier pricing: Essentiel 29€ / Pro 69€ / Omnicanal 149€ (-20% annual)
    const prices = {
      monthly: {
        starter: { amount: 2900, name: 'Kōdo POS Essentiel — Abonnement Mensuel' },
        pro: { amount: 6900, name: 'Kōdo POS Pro — Abonnement Mensuel' },
        max: { amount: 14900, name: 'Kōdo POS Omnicanal — Abonnement Mensuel' },
      },
      yearly: {
        starter: { amount: 27600, name: 'Kōdo POS Essentiel — Abonnement Annuel (-20%)' },
        pro: { amount: 66000, name: 'Kōdo POS Pro — Abonnement Annuel (-20%)' },
        max: { amount: 142800, name: 'Kōdo POS Omnicanal — Abonnement Annuel (-20%)' },
      },
    };

    const selectedPrice = prices[billingCycle][normalizedPlan];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: selectedPrice.name,
              description:
                'Accès complet au logiciel Kōdo POS avec journal chaîné SHA-256, mode hors-ligne SQLite et mises à jour automatiques.',
            },
            unit_amount: selectedPrice.amount,
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email || undefined,
      allow_promotion_codes: true,
      metadata: {
        plan: normalizedPlan,
        billing_cycle: billingCycle,
        referralCode: referralCode || '',
        customer_email: email || '',
      },
      success_url: `${domain}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${normalizedPlan}`,
      cancel_url: `${domain}/#pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Erreur API Stripe Checkout:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
