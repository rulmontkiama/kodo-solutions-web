'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Monitor, ChevronRight, CheckCircle2, ShieldCheck, Download, Loader2, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

type OS = 'macOS' | 'Windows';

export default function KodoPosPage() {
  const [os, setOs] = useState<OS>('macOS');
  const [formData, setFormData] = useState({
    shop_name: '',
    full_name: '',
    email: '',
    phone: '',
    city: '',
    accepted_terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Détection OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
      setOs('Windows');
    } else if (userAgent.includes('mac')) {
      setOs('macOS');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.accepted_terms) {
      setError("Vous devez accepter les conditions d'évaluation de la bêta fermée.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/pos-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, operating_system: os })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission de la candidature');
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
    <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans'] py-12">

      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FF7F7F]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-2xl shadow-[#FF7F7F]/20 backdrop-blur-md"
          >
            <span className="font-['Outfit'] font-black text-3xl bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">K</span>
          </motion.div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3 tracking-wide">
            PROGRAMME BÊTA FERMÉ ET FERME — COMMERCE DE VÊTEMENT (BELGIQUE)
          </div>
          <h1 className="font-['Outfit'] text-3xl md:text-4xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Candidature Programme Test Bêta Kōdo POS
          </h1>
          <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
            Logiciel d&apos;encaissement spécialisé pour boutiques de prêt-à-porter en Belgique (tailles, couleurs, retours, arrondi 5c).
          </p>
        </div>

        {/* Warning banner Horeca & Strict Retail Scope */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>Périmètre d&apos;utilisation strictement limité :</strong>
            <p className="mt-1 text-white/70">
              Kōdo POS est exclusivement conçu pour les magasins de vêtements de détail. Il <strong>ne dispose d&apos;aucune homologation FDM / SCE 2.0</strong> requise pour le secteur Horeca (cafés, restaurants, snacks).
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 backdrop-blur-[24px] border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              {/* Internal subtle glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF7F7F]/50 to-transparent opacity-50" />

              {/* OS Selector */}
              <div className="flex p-1 bg-white/5 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setOs('macOS')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${os === 'macOS' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  <Apple size={18} className={os === 'macOS' ? 'fill-black' : ''} /> macOS
                </button>
                <button
                  type="button"
                  onClick={() => setOs('Windows')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${os === 'Windows' ? 'bg-white text-[#0078D7] shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  <Monitor size={18} /> Windows
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center flex items-center justify-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" name="shop_name" required value={formData.shop_name} onChange={handleChange} placeholder="Nom de la boutique de vêtements" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="Ville (ex: Bruxelles, Liège...)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} placeholder="Prénom & Nom du gérant" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email professionnel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                </div>

                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Numéro de téléphone portable / fixe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />

                {/* Accept Terms Checkbox */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 mt-4 text-xs text-white/70">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="accepted_terms"
                      checked={formData.accepted_terms}
                      onChange={handleChange}
                      className="mt-0.5 rounded bg-white/10 border-white/20 text-[#FF7F7F] focus:ring-0"
                    />
                    <span className="leading-snug">
                      J&apos;accepte les conditions de test bêta « EN L&apos;ÉTAT » (AS IS), la gratuité du prototype et je m&apos;engage à maintenir mon journal des recettes habituel conformément à la législation belge.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-white text-black font-bold text-base rounded-xl py-3.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {/* Button hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                    {loading ? 'Soumission en cours...' : `Accéder au test bêta (${os})`}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400" /> 100% Gratuit — Bêta Fermée</span>
                  <Link href="/cgv" className="hover:text-white transition-colors underline flex items-center gap-1">
                    <FileText size={12} /> Conditions & CGU
                  </Link>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-[24px] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="font-['Outfit'] text-2xl font-bold mb-2 text-white">Candidature enregistrée !</h2>
              <p className="text-white/60 text-xs mb-6 leading-relaxed max-w-sm mx-auto">
                Votre candidature pour la boutique <strong>{formData.shop_name}</strong> a bien été enregistrée. Vous pouvez télécharger la version de test bêta ci-dessous.
              </p>

              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              >
                <Download size={18} />
                Télécharger {os === 'macOS' ? 'Kōdo POS (DMG)' : 'Kōdo POS (EXE)'}
              </a>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left text-xs space-y-2 text-white/60">
                <h3 className="font-semibold text-white flex items-center gap-2 text-xs">
                  <ShieldCheck size={14} className="text-emerald-400" /> Rappel légal d&apos;utilisation
                </h3>
                <p>
                  1. Kōdo POS est fourni « EN L&apos;ÉTAT » à titre d&apos;essai technique gratuit.
                </p>
                <p>
                  2. Conservez votre journal de recettes officiel en parallèle pendant la phase de test.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legal footer info */}
        <p className="text-center text-xs text-white/30 mt-6">
          Kōdo POS • Développeur Indépendant (Belgique) • Prototype Bêta Prêt-à-Porter
        </p>
      </motion.div>
    </div>
  );
}
