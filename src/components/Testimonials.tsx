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
    <section className="py-24 px-6 relative z-10 bg-foreground/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 text-glow">
            Adopté par les <span className="text-accent">commerçants</span> ambitieux
          </h2>
          <p className="text-foreground/60 font-medium">Rejoignez ceux qui font déjà confiance à Kōdo Solutions.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-3xl border border-foreground/10 hover:border-accent/30 transition-colors"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8 italic">&quot;{t.content}&quot;</p>
              <div className="mt-auto">
                <div className="font-bold text-foreground">{t.name}</div>
                <div className="text-xs text-foreground/50">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
