'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Monitor, ChevronRight, CheckCircle2, ShieldCheck, Download, Loader2 } from 'lucide-react';

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
    // Removing the synchronous state setting to avoid cascading renders
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">

      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FF7F7F]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-2xl shadow-[#FF7F7F]/20 backdrop-blur-md"
          >
            <span className="font-['Outfit'] font-black text-3xl bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">K</span>
          </motion.div>
          <h1 className="font-['Outfit'] text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Obtenir Kōdo POS
          </h1>
          <p className="text-white/50 text-lg">Le système de caisse ultra-premium pour les commerçants ambitieux.</p>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 backdrop-blur-[24px] border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              {/* Internal subtle glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF7F7F]/50 to-transparent opacity-50" />

              {/* OS Selector */}
              <div className="flex p-1 bg-white/5 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setOs('macOS')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${os === 'macOS' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  <Apple size={18} className={os === 'macOS' ? 'fill-black' : ''} /> macOS
                </button>
                <button
                  type="button"
                  onClick={() => setOs('Windows')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${os === 'Windows' ? 'bg-white text-[#0078D7] shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  <Monitor size={18} /> Windows
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center flex items-center justify-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <input type="text" name="shop_name" required value={formData.shop_name} onChange={handleChange} placeholder="Nom de l'établissement" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                  </div>
                  <div className="relative group">
                    <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} placeholder="Prénom & Nom" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                  </div>
                  <div className="relative group">
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email professionnel" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                  </div>
                  <div className="relative group">
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Numéro de téléphone" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7F7F]/50 focus:bg-white/10 transition-all" />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-white text-black font-bold text-lg rounded-xl py-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {/* Button hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    {loading ? 'Préparation...' : `Télécharger pour ${os}`}
                  </button>
                </div>

                <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400" /> Zéro Abonnement Caché</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-[#FF7F7F]" /> Mode Hors-Ligne Assuré</span>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-[24px] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

              <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 text-emerald-400">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="font-['Outfit'] text-3xl font-bold mb-4 text-white">Votre téléchargement est prêt.</h2>
              <p className="text-white/60 mb-10 leading-relaxed">
                Merci de faire confiance à Kōdo POS. Lancez l&apos;installateur ci-dessous pour démarrer l&apos;expérience.
              </p>

              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center gap-3 w-full py-5 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                <Download size={20} />
                Télécharger {os === 'macOS' ? 'Kōdo POS.dmg' : 'Kōdo POS.exe'}
              </a>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" /> Instructions d&apos;installation {os}
                </h3>
                {os === 'macOS' ? (
                  <ul className="space-y-3 text-sm text-white/60">
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-white/30" /> <span>Si un message &quot;Développeur non vérifié&quot; apparaît :</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-white/30" /> <span>Faites un <strong>clic droit</strong> (ou Ctrl+clic) sur l&apos;application.</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-white/30" /> <span>Sélectionnez <strong>Ouvrir</strong> dans le menu contextuel.</span></li>
                  </ul>
                ) : (
                  <ul className="space-y-3 text-sm text-white/60">
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-white/30" /> <span>Si Windows Defender SmartScreen bloque l&apos;app :</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-white/30" /> <span>Cliquez sur <strong>Informations complémentaires</strong>.</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-white/30" /> <span>Cliquez ensuite sur le bouton <strong>Exécuter quand même</strong>.</span></li>
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
