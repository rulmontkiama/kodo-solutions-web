'use client';

import React, { useState } from 'react';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);

  const handleCheckout = async (plan: 'monthly' | 'annual' | 'lifetime') => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
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
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6">
            <Zap size={14} className="text-accent" />
            TARIFS CLAIRS & SANS ENGAGEMENT
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 text-glow">
            Choisissez la formule <br className="hidden sm:block" /> adaptée à votre commerce.
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Logiciel Caisse Kōdo POS certifié conforme. Mises à jour automatisées, support prioritaire et sauvegarde cloud incluse.
          </p>

          {/* Optional Email & Referral input */}
          <div className="mt-8 max-w-md mx-auto bg-foreground/5 border border-foreground/10 p-4 rounded-2xl">
            <input
              type="email"
              placeholder="Votre email (pour recevoir votre clé de licence)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-accent transition-colors mb-3"
            />
            {!showReferralInput ? (
              <button
                onClick={() => setShowReferralInput(true)}
                className="text-xs text-accent hover:underline font-bold flex items-center gap-1 mx-auto"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan: Monthly */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass p-10 rounded-[2.5rem] border border-foreground/10 flex flex-col justify-between relative bg-gradient-to-b from-foreground/5 to-transparent"
          >
            <div>
              <h3 className="text-2xl font-black text-foreground mb-2">Offre Mensuelle</h3>
              <p className="text-xs text-foreground/60 font-medium mb-6">Flexibilité totale, résiliable à tout moment</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">29€</span>
                <span className="text-foreground/60 font-bold text-sm">/ mois</span>
              </div>

              <ul className="space-y-4 mb-10 text-sm font-semibold text-foreground/80">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Application Kōdo POS Mac</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Mises à jour à distance illimitées</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Rapports Z & Export Comptables</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Support client prioritaire</li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loadingPlan === 'monthly'}
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loadingPlan === 'monthly' ? 'Chargement...' : 'Choisir Mensuel'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Plan: Annual (POPULAR) */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass p-10 rounded-[2.5rem] border-2 border-accent shadow-2xl shadow-accent/20 flex flex-col justify-between relative bg-gradient-to-b from-accent/10 to-transparent scale-105 z-20"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              🔥 2 MOIS OFFERTS — RECOMMANDÉ
            </div>

            <div>
              <h3 className="text-2xl font-black text-foreground mb-2 mt-2">Offre Annuelle</h3>
              <p className="text-xs text-foreground/60 font-medium mb-6">Économisez 58€ par an avec l&apos;engagement annuel</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">290€</span>
                <span className="text-foreground/60 font-bold text-sm">/ an</span>
              </div>

              <ul className="space-y-4 mb-10 text-sm font-semibold text-foreground/80">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Tout ce qui est inclus dans Mensuel</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> 2 Mois gratuits inclus (290€ au lieu de 348€)</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Multi-postes & imprimantes thermiques</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Synchro Cloud Firebase & Shopify</li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('annual')}
              disabled={loadingPlan === 'annual'}
              className="w-full bg-accent text-accent-foreground font-black py-4 rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {loadingPlan === 'annual' ? 'Chargement...' : 'Profiter des 2 Mois Offerts'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Plan: Lifetime */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass p-10 rounded-[2.5rem] border border-foreground/10 flex flex-col justify-between relative bg-gradient-to-b from-foreground/5 to-transparent"
          >
            <div>
              <h3 className="text-2xl font-black text-foreground mb-2">Licence À Vie</h3>
              <p className="text-xs text-foreground/60 font-medium mb-6">Un seul paiement, accès à vie sans abonnement</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">690€</span>
                <span className="text-foreground/60 font-bold text-sm">une fois</span>
              </div>

              <ul className="space-y-4 mb-10 text-sm font-semibold text-foreground/80">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Licence définitive illimitée</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Aucune redevance mensuelle</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Mises à jour majeures à vie</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Installation & Paramétrage inclus</li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('lifetime')}
              disabled={loadingPlan === 'lifetime'}
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loadingPlan === 'lifetime' ? 'Chargement...' : 'Acheter la Licence à Vie'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

        </div>

        {/* Security badge */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-foreground/50 font-medium">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Paiement 100% Sécurisé via Stripe</span>
          <span>•</span>
          <span>🔒 Norme NF525 & Conforme Loi de Finance</span>
          <span>•</span>
          <span>🚀 Activation & Téléchargement Instantané</span>
        </div>

      </div>
    </section>
  );
}
