/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, CheckCircle2, ShieldCheck, Download, Loader2, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type OS = 'macOS' | 'Windows';

export default function KodoPosPage() {
  const [os, setOs] = useState<OS>('macOS');
  const [formData, setFormData] = useState({
    shop_name: '',
    full_name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Détection OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOs('Windows');
    } else if (userAgent.includes('mac')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOs('macOS');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/pos-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, operating_system: os })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission');
      }

      setDownloadUrl(data.downloadUrl);
      setSuccess(true);
    } catch (err: any) {
      setError((err as Error).message);
    } finally {
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
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg z-10 mt-20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-6 shadow-sm"
          >
            <Sparkles size={14} className="text-accent" />
            KŌDO POS
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-foreground text-glow">
            Obtenir Kōdo POS
          </h1>
          <p className="text-foreground/60 text-base font-medium">
            Le système de caisse ultra-premium pour les commerçants ambitieux.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-foreground/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {/* Internal subtle glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />

              {/* OS Selector */}
              <div className="flex p-1 bg-foreground/5 border border-foreground/10 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setOs('macOS')}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    os === 'macOS'
                      ? 'bg-foreground text-background shadow-lg'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  macOS
                </button>
                <button
                  type="button"
                  onClick={() => setOs('Windows')}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    os === 'Windows'
                      ? 'bg-foreground text-background shadow-lg'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  Windows
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center flex items-center justify-center gap-2 font-medium">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      name="shop_name"
                      required
                      value={formData.shop_name}
                      onChange={handleChange}
                      placeholder="Nom de l'établissement"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Prénom & Nom"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email professionnel"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Numéro de téléphone"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl px-5 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 focus:bg-foreground/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-foreground text-background font-bold text-lg rounded-2xl py-4 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    {loading ? 'Préparation...' : `Télécharger pour ${os}`}
                  </button>
                </div>

                <p className="text-center text-xs text-foreground/50 mt-4 flex items-center justify-center gap-3 font-medium">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-500" /> Zéro Abonnement Caché</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-accent" /> Mode Hors-Ligne Assuré</span>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass border border-foreground/10 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

              <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 text-emerald-500">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="text-3xl font-bold mb-4 text-foreground">Votre téléchargement est prêt.</h2>
              <p className="text-foreground/60 mb-10 leading-relaxed font-medium">
                Merci de faire confiance à Kōdo POS. Lancez l&apos;installateur ci-dessous pour démarrer l&apos;expérience.
              </p>

              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center gap-3 w-full py-5 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                <Download size={20} />
                Télécharger {os === 'macOS' ? 'Kōdo POS.dmg' : 'Kōdo POS.exe'}
              </a>

              <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 text-left">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> Instructions d&apos;installation {os}
                </h3>
                {os === 'macOS' ? (
                  <ul className="space-y-3 text-sm text-foreground/70 font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/40" /> <span>Si un message &quot;Développeur non vérifié&quot; apparaît :</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/40" /> <span>Faites un <strong>clic droit</strong> (ou Ctrl+clic) sur l&apos;application.</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/40" /> <span>Sélectionnez <strong>Ouvrir</strong> dans le menu contextuel.</span></li>
                  </ul>
                ) : (
                  <ul className="space-y-3 text-sm text-foreground/70 font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/40" /> <span>Si Windows Defender SmartScreen bloque l&apos;app :</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/40" /> <span>Cliquez sur <strong>Informations complémentaires</strong>.</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/40" /> <span>Cliquez ensuite sur le bouton <strong>Exécuter quand même</strong>.</span></li>
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
