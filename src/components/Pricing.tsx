'use client';

import React, { useState } from 'react';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);

  const handleCheckout = async (plan: 'starter' | 'pro' | 'max') => {
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
          
          {/* Plan: Starter */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass p-10 rounded-[2.5rem] border border-foreground/10 flex flex-col justify-between relative bg-gradient-to-b from-foreground/5 to-transparent"
          >
            <div>
              <h3 className="text-2xl font-black text-foreground mb-2">Formule Starter</h3>
              <p className="text-xs text-foreground/60 font-medium mb-6">L&apos;essentiel pour démarrer votre caisse</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">39€</span>
                <span className="text-foreground/60 font-bold text-sm">/ mois</span>
              </div>

              <ul className="space-y-4 mb-10 text-sm font-semibold text-foreground/80">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Application Kōdo POS Mac</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Encaissement rapide & tickets</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Catalogue & Stocks simples</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Mises à jour automatisées</li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('starter')}
              disabled={loadingPlan === 'starter'}
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loadingPlan === 'starter' ? 'Chargement...' : 'Choisir Starter'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Plan: Pro (POPULAR) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ y: -8, scale: 1.05 }}
            animate={{
              boxShadow: ["0px 0px 0px rgba(var(--accent-rgb), 0)", "0px 0px 30px rgba(var(--accent-rgb), 0.3)", "0px 0px 0px rgba(var(--accent-rgb), 0)"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="glass p-10 rounded-[2.5rem] border-2 border-accent flex flex-col justify-between relative bg-gradient-to-b from-accent/10 to-transparent lg:scale-105 z-20 group"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
              🔥 FORMULE LA PLUS POPULAIRE
            </div>

            {/* Subtle internal animated glow */}
            <div className="absolute -inset-x-10 -top-10 h-32 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div>
              <h3 className="text-2xl font-black text-foreground mb-2 mt-2">Formule Pro</h3>
              <p className="text-xs text-foreground/60 font-medium mb-6">Le choix complet pour gérer votre commerce</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">79€</span>
                <span className="text-foreground/60 font-bold text-sm">/ mois</span>
              </div>

              <ul className="space-y-4 mb-10 text-sm font-semibold text-foreground/80">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Tout ce qui est inclus dans Starter</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Conforme NF525 & Clôtures Z</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Synchronisation Shopify & Cloud</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Analyse avancée & Multi-vendeurs</li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('pro')}
              disabled={loadingPlan === 'pro'}
              className="w-full bg-accent text-accent-foreground font-black py-4 rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {loadingPlan === 'pro' ? 'Chargement...' : 'Choisir Pro'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Plan: Max */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass p-10 rounded-[2.5rem] border border-foreground/10 flex flex-col justify-between relative bg-gradient-to-b from-foreground/5 to-transparent"
          >
            <div>
              <h3 className="text-2xl font-black text-foreground mb-2">Formule Max</h3>
              <p className="text-xs text-foreground/60 font-medium mb-6">Pour les commerces exigeants & multi-boutiques</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-foreground">149€</span>
                <span className="text-foreground/60 font-bold text-sm">/ mois</span>
              </div>

              <ul className="space-y-4 mb-10 text-sm font-semibold text-foreground/80">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Tout ce qui est inclus dans Pro</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Multi-boutiques & Stocks partagés</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Sauvegarde offline étendue & API</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-accent shrink-0" /> Support VIP ultra-prioritaire 24/7</li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('max')}
              disabled={loadingPlan === 'max'}
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loadingPlan === 'max' ? 'Chargement...' : 'Choisir Max'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

        </motion.div>

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
