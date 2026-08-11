'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Monitor, ChevronRight, CheckCircle2, ShieldCheck, Download, Loader2, ArrowLeft } from 'lucide-react';

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
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    // Détection OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOs('Windows');
    } else if (userAgent.includes('mac')) {

      setOs('macOS');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions générales et la politique de confidentialité.');
      return;
    }
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
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">

      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors font-semibold tracking-wider text-sm uppercase bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-full border border-foreground/10"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

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
            className="inline-flex items-center justify-center mb-6"
          >
            <span className="font-black text-3xl tracking-widest text-foreground uppercase">KŌDO</span>
          </motion.div>
          <h1 className=" text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
            Obtenir Kōdo POS
          </h1>
          <p className="text-foreground/50 text-lg">Le système de caisse ultra-premium pour les commerçants ambitieux.</p>
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-foreground/5 backdrop-blur-[24px] border border-foreground/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
            >
              {/* Internal subtle glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />

              {/* OS Selector */}
              <div className="flex p-1 bg-foreground/5 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setOs('macOS')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${os === 'macOS' ? 'bg-foreground text-background shadow-lg' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                >
                  <Apple size={18} className={os === 'macOS' ? 'fill-background' : ''} /> macOS
                </button>
                <button
                  type="button"
                  onClick={() => setOs('Windows')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${os === 'Windows' ? 'bg-foreground text-[#0078D7] shadow-lg' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
                >
                  <Monitor size={18} /> Windows
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm text-center flex items-center justify-center gap-2">
                  <ShieldCheck size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <input type="text" name="shop_name" required value={formData.shop_name} onChange={handleChange} placeholder="Nom de l'établissement" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all" />
                  </div>
                  <div className="relative group">
                    <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} placeholder="Prénom & Nom" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all" />
                  </div>
                  <div className="relative group">
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email professionnel" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all" />
                  </div>
                  <div className="relative group">
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Numéro de téléphone" className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-5 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 focus:bg-foreground/10 transition-all" />
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="kodo_pos_terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-foreground/20 text-accent focus:ring-accent/30 bg-foreground/5 cursor-pointer"
                    required
                  />
                  <label htmlFor="kodo_pos_terms" className="text-xs text-foreground/60 leading-tight text-left">
                    J&apos;accepte la <a href="/politique-de-confidentialite" className="text-accent hover:underline" target="_blank">Politique de confidentialité</a> et les <a href="/cgv" className="text-accent hover:underline" target="_blank">Conditions Générales d&apos;Utilisation</a>.
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !acceptedTerms}
                    className="w-full relative group overflow-hidden bg-foreground text-background font-bold text-lg rounded-xl py-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {/* Button hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    {loading ? 'Préparation...' : `Télécharger pour ${os}`}
                  </button>
                </div>

                <p className="text-center text-xs text-foreground/40 mt-4 flex items-center justify-center gap-3">
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
              className="bg-foreground/5 backdrop-blur-[24px] border border-foreground/10 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 text-emerald-500">
                <CheckCircle2 size={40} />
              </div>

              <h2 className=" text-3xl font-bold mb-4 text-foreground">Votre téléchargement est prêt.</h2>
              <p className="text-foreground/60 mb-10 leading-relaxed">
                Merci de faire confiance à Kōdo POS. Lancez l&apos;installateur ci-dessous pour démarrer l&apos;expérience.
              </p>

              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center gap-3 w-full py-5 px-6 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                <Download size={20} />
                Télécharger {os === 'macOS' ? 'Kōdo POS.dmg' : 'Kōdo POS.exe'}
              </a>

              <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 text-left">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> Instructions d&apos;installation {os}
                </h3>
                {os === 'macOS' ? (
                  <ul className="space-y-3 text-sm text-foreground/60">
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/30" /> <span>Si un message &quot;Développeur non vérifié&quot; apparaît :</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/30" /> <span>Faites un <strong>clic droit</strong> (ou Ctrl+clic) sur l&apos;application.</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/30" /> <span>Sélectionnez <strong>Ouvrir</strong> dans le menu contextuel.</span></li>
                  </ul>
                ) : (
                  <ul className="space-y-3 text-sm text-foreground/60">
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/30" /> <span>Si Windows Defender SmartScreen bloque l&apos;app :</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/30" /> <span>Cliquez sur <strong>Informations complémentaires</strong>.</span></li>
                    <li className="flex gap-2 items-start"><ChevronRight size={16} className="shrink-0 mt-0.5 text-foreground/30" /> <span>Cliquez ensuite sur le bouton <strong>Exécuter quand même</strong>.</span></li>
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
