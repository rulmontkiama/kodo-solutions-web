'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Store, CreditCard, PieChart, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function KodoPOSPage() {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      
      {/* Background Glows */}
      <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-10 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <Link href="/#services" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors font-semibold tracking-wider text-sm uppercase mb-12">
            <ArrowLeft size={16} /> Retour aux services
          </Link>

          {/* Hero Section */}
          <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl shadow-accent/10 mb-8">
                <Store size={40} className="text-accent" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold mb-4 tracking-wide">
                BÊTA FERMÉE FERME — RETAIL VÊTEMENTS (BELGIQUE)
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 text-glow">
                Kōdo <span className="text-accent">POS</span>
              </h1>
              <p className="text-xl text-foreground/70 font-medium leading-relaxed mb-8">
                Le système d&apos;encaissement spécialement pensé pour les boutiques de prêt-à-porter (gestion des tailles, couleurs, retours, arrondi espèces 5c).
              </p>
              <Link href="/kodo-pos" className="inline-block bg-accent text-accent-foreground font-black px-8 py-4 rounded-full tracking-widest uppercase text-sm hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--accent),0.4)] transition-all">
                Rejoindre le test bêta
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src="/images/pos_mockup.png" 
                  alt="Kōdo POS Terminal 3D Mockup" 
                  width={800} 
                  height={800}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Horeca / SCE 2.0 Refusal Banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-12 text-sm text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-4">
            <AlertTriangle size={24} className="shrink-0 text-amber-500 mt-0.5" />
            <div>
              <strong className="text-base font-bold">Important — Champ d&apos;application exclusif :</strong>
              <p className="mt-1 opacity-90">
                Kōdo POS est exclusivement développé pour le commerce de détail de vêtements. Il ne dispose pas de l&apos;homologation FDM / SCE 2.0 requise par le SPF Finances pour le secteur Horeca (restaurants, bars, cafés).
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-colors"
            >
              <CreditCard className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Encaissement Prêt-à-Porter</h3>
              <p className="text-foreground/60 leading-relaxed text-sm">
                Sélection instantanée par grille de tailles et couleurs. Gestion intégrée des retours, avoirs et arrondi légal belge sur espèces (5 centimes).
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-colors"
            >
              <PieChart className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Clôture Z & Audit Trail</h3>
              <p className="text-foreground/60 leading-relaxed text-sm">
                Rapports de fin de journée (Z) automatisés avec chaînage cryptographique des tickets pour assurer la traçabilité des ventes.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-colors"
            >
              <Store className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Gestion des Stocks & Variantes</h3>
              <p className="text-foreground/60 leading-relaxed text-sm">
                Décompte automatique par déclinaison (S/M/L/XL) lors de chaque transaction pour un suivi d&apos;inventaire exact.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass p-8 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-colors"
            >
              <ShieldCheck className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Banc d&apos;Essai « EN L’ÉTAT »</h3>
              <p className="text-foreground/60 leading-relaxed text-sm">
                Mise à disposition gratuite pour test opérationnel en parallèle de votre journal des recettes légal pour valider les usages métiers.
              </p>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-accent/10 rounded-[2.5rem] p-10 md:p-14 border border-accent/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
            
            <h2 className="text-3xl font-black mb-8 text-foreground tracking-tight relative z-10">
              Conditions du banc d&apos;essai
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/80 font-medium">Programme 100% gratuit en échange de vos retours d&apos;expérience.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/80 font-medium">Double tenue recommandée avec votre journal de caisse officiel.</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/80 font-medium">Installation locale rapide sous macOS et Windows.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/80 font-medium">Convention de test bêta à signer pour vos boutiques pilotes.</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
      </main>
      
      <footer className="bg-foreground text-background py-8 text-center mt-auto">
        <p className="text-sm font-medium opacity-80">
          &copy; {new Date().getFullYear()} Kōdo POS • Programme Bêta Fermé Commerce de Détail Belgique.
        </p>
      </footer>
    </div>
  );
}
