'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductMockups() {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-2">
            DESIGN PREMIUM
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight text-glow">
            Une interface pensée <br /> pour la <span className="text-accent">rapidité</span>.
          </h2>
          <p className="text-lg text-foreground/60 font-medium">
            Kōdo POS est conçu avec une obsession pour l&apos;expérience utilisateur.
            Moins de clics, plus d&apos;efficacité, pour que vous puissiez vous concentrer sur vos clients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring" }}
          className="flex-1 w-full relative"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-accent/15 blur-[80px] rounded-full -z-10" />

          <div className="rounded-[32px] glass border border-foreground/10 p-2 shadow-2xl relative bg-background flex items-center justify-center group perspective-[1000px]">
            <motion.div
              whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full relative"
            >
              <Image
                src="/pos-ui.png"
                alt="Kōdo POS Interface"
                width={1200}
                height={800}
                className="rounded-[24px] w-full h-auto object-cover border border-foreground/5 shadow-md"
              />
            </motion.div>

            {/* Floating Element 1 - Notification */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-8 top-16 glass p-4 rounded-2xl border border-foreground/10 shadow-2xl flex items-center gap-4 z-20 bg-background/90 backdrop-blur-xl hidden sm:flex"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Paiement validé</div>
                <div className="text-xs text-foreground/60">Il y a à l&apos;instant</div>
              </div>
            </motion.div>

             {/* Floating Element 2 - Stats */}
             <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -left-8 bottom-16 glass p-5 rounded-2xl border border-foreground/10 shadow-2xl z-20 flex gap-1 flex-col bg-background/90 backdrop-blur-xl hidden sm:flex"
            >
              <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">Chiffre du jour</div>
              <div className="text-3xl font-black text-foreground">1 450,00 €</div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +12% par rapport à hier
              </div>
            </motion.div>

            {/* Floating Element 3 - Ticket */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
              className="absolute right-12 -bottom-10 glass p-4 rounded-2xl border border-foreground/10 shadow-2xl z-20 flex gap-3 flex-col bg-background/90 backdrop-blur-xl hidden sm:flex w-48"
            >
              <div className="flex justify-between items-center border-b border-foreground/10 pb-2">
                <span className="text-xs font-bold text-foreground/80">Ticket en attente</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Client : Marie D.</div>
                <div className="text-xs text-foreground/60 mt-1">Soin visage + Coupe</div>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
