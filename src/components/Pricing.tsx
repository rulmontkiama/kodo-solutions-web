'use client';

import React, { useState } from 'react';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleWaitlist = async (plan: 'monthly' | 'annual' | 'lifetime') => {
    if (!email.trim()) {
      alert("Veuillez entrer une adresse email valide pour rejoindre la liste d'attente.");
      return;
    }

    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Waitlist - ${plan.toUpperCase()}`,
          email: email.trim(),
          service: `Kodo POS Waitlist (Code: ${referralCode.trim() || 'Aucun'})`,
        }),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 5000);
      } else {
        alert('Erreur lors de l\'inscription à la liste d\'attente');
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
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6 border-amber-500/30">
            <Zap size={14} className="text-amber-500" />
            BÊTA FERMÉE - LISTE D&apos;ATTENTE
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 text-glow">
            L&apos;excellence a un prix, <br className="hidden sm:block" /> <span className="text-accent">la patience aussi.</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed mb-4">
            Kōdo POS est actuellement en <strong className="text-foreground">bêta fermée</strong>. Inscrivez-vous pour sécuriser votre accès et vos tarifs de lancement.
          </p>
          <p className="text-md text-foreground/50 max-w-2xl mx-auto font-medium leading-relaxed">
            Logiciel Caisse Kōdo POS certifié conforme. Mises à jour automatisées, support prioritaire et sauvegarde cloud incluse.
          </p>

          {/* Optional Email & Referral input */}
          <div className="mt-8 max-w-md mx-auto bg-foreground/5 border border-foreground/10 p-4 rounded-2xl relative">
            {successMsg && (
              <div className="absolute -top-12 left-0 right-0 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 p-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-md">
                Merci ! Vous êtes sur la liste d&apos;attente. 🎉
              </div>
            )}
            <input
              type="email"
              placeholder="Votre email pour rejoindre la liste d'attente"
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
          
          {/* Plan: Monthly */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
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
              onClick={() => handleWaitlist('monthly')}
              disabled={loadingPlan === 'monthly'}
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loadingPlan === 'monthly' ? 'Chargement...' : 'Rejoindre la liste d\'attente'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Plan: Annual (POPULAR) */}
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
              🔥 2 MOIS OFFERTS — RECOMMANDÉ
            </div>

            {/* Subtle internal animated glow */}
            <div className="absolute -inset-x-10 -top-10 h-32 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

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
              onClick={() => handleWaitlist('annual')}
              disabled={loadingPlan === 'annual'}
              className="w-full bg-accent text-accent-foreground font-black py-4 rounded-full hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {loadingPlan === 'annual' ? 'Chargement...' : 'Rejoindre la liste d\'attente (2 mois offerts)'}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Plan: Lifetime */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
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
              onClick={() => handleWaitlist('lifetime')}
              disabled={loadingPlan === 'lifetime'}
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loadingPlan === 'lifetime' ? 'Chargement...' : 'Rejoindre la liste d\'attente (À Vie)'}
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
