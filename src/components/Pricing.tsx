'use client';

import React from 'react';
import { Zap, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Pricing() {
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

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6">
          <Zap size={14} className="text-accent" />
          PROGRAMME BÊTA PRIVÉ EN COURS
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 text-glow">
          Abonnements payants suspendus. <br />
          <span className="text-accent">Accès 100% Gratuit sur Candidature.</span>
        </h2>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
          Dans le cadre de notre banc d&apos;essai technique réservé aux boutiques de prêt-à-porter en Belgique, les offres commerciales payantes sont temporairement mises en suspense.
        </p>

        {/* Suspended pricing banner box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-10 md:p-12 rounded-[2.5rem] border-2 border-accent/40 bg-gradient-to-b from-accent/10 via-background to-transparent relative shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-accent/20 pointer-events-none">
            <Sparkles size={120} />
          </div>

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
              🎁 BÊTA FERMÉE & GRATUITE
            </span>

            <h3 className="text-2xl md:text-3xl font-black text-foreground">
              Rejoignez les boutiques partenaires pilotes
            </h3>

            <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
              Bénéficiez du logiciel d&apos;encaissement Kōdo POS gratuitement et participez directement à l&apos;amélioration des fonctionnalités métier avant le lancement commercial officiel.
            </p>

            <div className="pt-4">
              <Link
                href="/kodo-pos"
                className="inline-flex items-center justify-center gap-3 bg-accent text-accent-foreground font-black text-base px-8 py-4 rounded-full hover:scale-105 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              >
                Postuler au programme bêta
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Security / Legal badge */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-foreground/50 font-medium">
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Bêta-test B2B pour boutiques de vêtements</span>
          <span>•</span>
          <span>🇧🇪 Développeur Indépendant Belgique</span>
          <span>•</span>
          <span>📄 Convention de test encadrée</span>
        </div>

      </div>
    </section>
  );
}
