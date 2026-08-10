'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sophie M.",
    role: "Gérante de Boutique",
    content: "Depuis que nous utilisons Kōdo POS, la gestion de notre inventaire est devenue un jeu d'enfant. L'interface est incroyablement fluide.",
    rating: 5
  },
  {
    name: "Thomas L.",
    role: "Restaurateur",
    content: "Le système est robuste et n'a jamais planté en plein service. L'intégration des réservations (à venir) nous a convaincus de choisir l'offre annuelle.",
    rating: 5
  },
  {
    name: "Julie C.",
    role: "Salon de Beauté",
    content: "Design magnifique, prise en main en moins d'une heure pour toute l'équipe. Le support client est très réactif.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 px-6 relative z-10 bg-background overflow-hidden border-t border-foreground/5">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-foreground/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6">
            <Star size={14} className="text-accent fill-accent" />
            ILS NOUS FONT CONFIANCE
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 text-glow">
            Adopté par les <span className="text-accent">commerçants</span> ambitieux
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-medium">Rejoignez ceux qui font déjà confiance à Kōdo Solutions pour transformer leur activité.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative glass p-10 rounded-[2.5rem] border border-foreground/10 hover:border-accent/40 transition-all duration-500 flex flex-col h-full bg-gradient-to-br from-foreground/5 to-transparent shadow-lg hover:shadow-2xl hover:shadow-accent/20"
            >
              {/* Internal glowing blob on hover */}
              <div className="absolute -inset-x-10 -top-10 h-32 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex gap-1 mb-8">
                  {[...Array(t.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 + i * 0.1, type: "spring", stiffness: 300 }}
                    >
                      <Star size={20} className="fill-amber-500 text-amber-500 drop-shadow-sm" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-10 text-lg font-medium italic flex-grow">&quot;{t.content}&quot;</p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-foreground text-lg shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{t.name}</div>
                    <div className="text-sm text-foreground/60 font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
