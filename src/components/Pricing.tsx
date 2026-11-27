'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRICING_TIERS, type BillingCycle, type PlanKey } from '@/lib/pricing';

export default function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);

  const handleCheckout = async (plan: PlanKey) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billing,
          email: email.trim() || undefined,
          referralCode: referralCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection vers le paiement Stripe');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau. Veuillez réessayer.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-28 px-6 relative z-10 overflow-hidden bg-background">
      {/* Background decoration & Animated Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[160px] rounded-full pointer-events-none" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6">
            <Zap size={14} className="text-accent" />
            TARIFS CLAIRS &amp; SANS ENGAGEMENT
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 text-glow">
            Choisissez la formule <br className="hidden sm:block" /> adaptée à votre commerce.
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Logiciel Caisse Kōdo POS avec Journal chaîné SHA-256. Mises à jour automatisées, support prioritaire et sauvegarde locale sécurisée.
          </p>

          {/* Billing cycle toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1.5 rounded-full glass border border-foreground/10">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/65 hover:text-foreground'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                billing === 'annual'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/65 hover:text-foreground'
              }`}
            >
              <span>Annuel</span>
              <span className="px-2 py-0.5 rounded-full bg-accent text-white dark:text-black text-[10px] font-black">
                -20%
              </span>
            </button>
          </div>

          {/* Optional Email & Referral input */}
          <div className="mt-6 max-w-md mx-auto bg-foreground/5 border border-foreground/10 p-4 rounded-2xl">
            <input
              type="email"
              placeholder="Votre email (pour recevoir votre clé de licence)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent transition-colors mb-3"
            />
            {!showReferralInput ? (
              <button
                type="button"
                onClick={() => setShowReferralInput(true)}
                className="text-xs text-accent hover:underline font-bold flex items-center gap-1 mx-auto cursor-pointer"
              >
                <Gift size={12} /> Vous avez un code parrain ou de réduction ?
              </button>
            ) : (
              <input
                type="text"
                placeholder="Code Parrain / Promo (ex: REF-DUPONT-1234)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="w-full bg-background border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-600 dark:text-amber-300 placeholder-amber-500/40 focus:outline-none focus:border-amber-500 transition-colors uppercase font-mono"
              />
            )}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {PRICING_TIERS.map((tier) => {
            const price = billing === 'annual' ? tier.annualMonthlyPrice : tier.monthlyPrice;
            const isPopular = Boolean(tier.featured);

            return (
              <motion.div
                key={tier.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                }}
                whileHover={{ y: -8, scale: isPopular ? 1.05 : 1.02 }}
                className={
                  isPopular
                    ? 'glass p-10 rounded-[2.5rem] border-2 border-accent flex flex-col justify-between relative bg-gradient-to-b from-accent/10 to-transparent lg:scale-105 z-20 group shadow-[0_0_30px_rgba(239,68,68,0.18)]'
                    : 'glass p-10 rounded-[2.5rem] border border-foreground/10 flex flex-col justify-between relative bg-gradient-to-b from-foreground/5 to-transparent'
                }
              >
                {isPopular && (
                  <>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white dark:text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      🔥 FORMULE LA PLUS POPULAIRE
                    </div>
                    <div className="absolute -inset-x-10 -top-10 h-32 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </>
                )}

                <div>
                  <h3 className={`text-2xl font-black text-foreground mb-2 ${isPopular ? 'mt-2' : ''}`}>
                    Formule {tier.name}
                  </h3>
                  <p className="text-xs text-foreground/60 font-medium mb-6">{tier.tagline}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-foreground">{price}€</span>
                      <span className="text-foreground/60 font-bold text-sm">/ mois</span>
                    </div>
                    {billing === 'annual' && (
                      <p className="text-xs text-accent font-bold mt-1.5">
                        Facturé {tier.annualTotal}€ / an (au lieu de {tier.monthlyPrice * 12}€)
                      </p>
                    )}
                  </div>

                  {tier.inheritsLabel && (
                    <p className="text-xs font-extrabold uppercase tracking-wider text-accent mb-4">
                      {tier.inheritsLabel}
                    </p>
                  )}

                  <ul className="space-y-3.5 mb-10 text-sm font-semibold text-foreground/80">
                    {tier.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loadingPlan === tier.id}
                  className={
                    isPopular
                      ? 'w-full bg-accent text-white dark:text-black font-black py-4 rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60'
                      : 'w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60'
                  }
                >
                  {loadingPlan === tier.id ? 'Chargement...' : tier.ctaLabel}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security badge */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-foreground/50 font-medium">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Paiement 100% Sécurisé via Stripe</span>
          <span>•</span>
          <span>🔒 Journal d&apos;audit chaîné SHA-256 &amp; Clôtures Z</span>
          <span>•</span>
          <span>🚀 Activation &amp; Téléchargement Instantané</span>
        </div>

        <p className="mt-4 text-center text-[11px] text-foreground/45 font-medium">
          Logiciel B2B conçu pour le commerce de détail (retail, hors Horeca soumis au SCE). En souscrivant, vous acceptez nos{' '}
          <Link href="/cgv" className="underline hover:text-foreground transition-colors">
            CGV / CGU
          </Link>{' '}
          et notre{' '}
          <Link href="/politique-de-confidentialite" className="underline hover:text-foreground transition-colors">
            Politique de confidentialité
          </Link>
          .
        </p>

      </div>
    </section>
  );
}
