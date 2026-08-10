'use client';

import { motion } from 'framer-motion';

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
          className="flex-1 w-full max-w-lg relative"
        >
          {/* Abstract Mockup container */}
          <div className="aspect-[4/3] rounded-3xl glass border border-foreground/10 p-4 shadow-2xl relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />

            {/* Header bar */}
            <div className="h-12 border-b border-foreground/5 flex items-center px-4 gap-3 relative z-10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 h-4 w-32 bg-foreground/5 rounded-full" />
            </div>

            {/* Content Area */}
            <div className="flex gap-4 p-4 h-[calc(100%-3rem)] relative z-10">
              {/* Sidebar */}
              <div className="w-1/4 flex flex-col gap-3">
                <div className="h-8 bg-foreground/5 rounded-lg w-full" />
                <div className="h-8 bg-foreground/5 rounded-lg w-3/4" />
                <div className="h-8 bg-foreground/5 rounded-lg w-5/6" />
                <div className="h-8 bg-accent/10 rounded-lg w-full mt-auto" />
              </div>

              {/* Main Grid */}
              <div className="flex-1 grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-foreground/5 rounded-xl h-24 border border-foreground/5"
                  />
                ))}
              </div>
            </div>

            {/* Floating Element 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 top-20 glass p-4 rounded-xl border border-foreground/10 shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">✓</div>
              <div>
                <div className="h-2 w-16 bg-foreground/20 rounded-full mb-2" />
                <div className="h-2 w-10 bg-foreground/10 rounded-full" />
              </div>
            </motion.div>

             {/* Floating Element 2 */}
             <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -left-6 bottom-10 glass p-4 rounded-xl border border-foreground/10 shadow-xl z-20 flex gap-2 flex-col"
            >
              <div className="h-3 w-20 bg-accent/40 rounded-full" />
              <div className="text-xl font-black text-foreground">1,450.00 €</div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
