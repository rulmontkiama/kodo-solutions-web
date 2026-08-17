/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    password: '',
    nomSalon: '',
    horaires: ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    prenomStaff: '',
    nomPrestation: '',
    prixPrestation: '',
    dureePrestation: '30'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleJour = (jour: string) => {
    setFormData(prev => ({
      ...prev,
      horaires: prev.horaires.includes(jour)
        ? prev.horaires.filter(j => j !== jour)
        : [...prev.horaires, jour]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de votre espace');
      }

      router.push(`/reservation/${data.slug}`);
    } catch (err: any) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden bg-grid-pattern font-['Outfit']">
      {/* Background decoration & Animated Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        animate={{
          y: [0, 50, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-20 w-72 h-72 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, -60, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>{step === 1 ? "Retour à l'accueil" : "Étape précédente"}</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl z-10 mt-20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6 shadow-sm"
          >
            <Sparkles size={14} className="text-accent" />
            KŌDO BOOKINGS
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-foreground text-glow">
            {step === 1 && "Créons votre Espace"}
            {step === 2 && "Vos Horaires"}
            {step === 3 && "Votre Carte"}
          </h1>
          <p className="text-foreground/60 text-base font-medium">
            Étape {step} sur 3
          </p>
        </div>

        <div className="glass border border-foreground/10 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/10">
            <div
              className="h-full bg-foreground transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ETAPE 1 : Infos de base */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">
                    Nom de l&apos;Établissement
                  </label>
                  <input
                    type="text"
                    name="nomSalon"
                    required
                    value={formData.nomSalon}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                    placeholder="Ex: Kōdo Studio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">
                    Nom complet (Gérant)
                  </label>
                  <input
                    type="text"
                    name="nomComplet"
                    required
                    value={formData.nomComplet}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                      placeholder="jean@mon-espace.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground/80 mb-2 ml-1">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ETAPE 2 : Horaires */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <label className="block text-sm font-semibold text-foreground/80 mb-2 text-center">
                  Sélectionnez vos jours d&apos;ouverture
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {JOURS.map(jour => {
                    const isActive = formData.horaires.includes(jour);
                    return (
                      <button
                        key={jour}
                        type="button"
                        onClick={() => toggleJour(jour)}
                        className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-foreground text-background shadow-lg scale-105'
                            : 'bg-foreground/5 text-foreground/60 border border-foreground/10 hover:border-foreground/20 hover:text-foreground'
                        }`}
                      >
                        {jour}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ETAPE 3 : Staff et Prestations */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-3xl space-y-4">
                  <h3 className="font-bold text-base text-foreground ml-1">Premier collaborateur</h3>
                  <div>
                    <input
                      type="text"
                      name="prenomStaff"
                      value={formData.prenomStaff}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 transition-all font-medium"
                      placeholder="Prénom (ex: Alice)"
                    />
                  </div>
                </div>

                <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-3xl space-y-4">
                  <h3 className="font-bold text-base text-foreground ml-1">Première prestation</h3>
                  <div>
                    <input
                      type="text"
                      name="nomPrestation"
                      value={formData.nomPrestation}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 transition-all mb-4 font-medium"
                      placeholder="Nom (ex: Coupe Homme)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        name="prixPrestation"
                        value={formData.prixPrestation}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 transition-all pr-10 font-medium"
                        placeholder="Prix"
                      />
                      <span className="absolute right-4 top-4 text-foreground/40 font-bold">€</span>
                    </div>
                    <div className="relative">
                      <select
                        name="dureePrestation"
                        value={formData.dureePrestation}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl text-foreground focus:outline-none focus:border-foreground/30 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="15" className="bg-background text-foreground">15 min</option>
                        <option value="30" className="bg-background text-foreground">30 min</option>
                        <option value="45" className="bg-background text-foreground">45 min</option>
                        <option value="60" className="bg-background text-foreground">1h</option>
                        <option value="90" className="bg-background text-foreground">1h30</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className="w-1/3 py-4 px-5 bg-foreground/10 text-foreground font-bold rounded-2xl hover:bg-foreground/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                <span>{step === 1 ? 'Accueil' : 'Retour'}</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 px-5 bg-foreground text-background font-bold rounded-2xl hover:bg-foreground/90 transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    Génération...
                  </span>
                ) : step === 3 ? (
                  'Créer mon Kōdo Bookings'
                ) : (
                  'Continuer'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
