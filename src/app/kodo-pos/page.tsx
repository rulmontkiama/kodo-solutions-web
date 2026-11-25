'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Apple,
  Monitor,
  Key,
  ShieldCheck,
  Download,
  Loader2,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type VerifiedPortal = {
  license: {
    licenseKey: string;
    plan: string;
    planLabel: string;
    billingCycle: 'monthly' | 'yearly';
    expiryDate: string;
    email: string;
    hasBillingPortal: boolean;
  };
  release: {
    version: string;
    releaseDate: string;
    changelog: string;
    macFilename: string;
    winFilename: string;
  };
  r2Ready: boolean;
};

function DownloadPortalContent() {
  const searchParams = useSearchParams();
  const initialKey = searchParams.get('key') || '';

  const [os, setOs] = useState<'mac' | 'win'>('mac');
  const [licenseKey, setLicenseKey] = useState(initialKey);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');
  const [portal, setPortal] = useState<VerifiedPortal | null>(null);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('win')) setOs('win');
  }, []);

  const verifyKey = async (rawKey: string) => {
    const clean = rawKey.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: clean }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setPortal(null);
        setError(data.error || 'Clé de licence invalide ou expirée.');
      } else {
        setPortal(data);
      }
    } catch {
      setError('Erreur réseau lors de la vérification.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialKey) {
      verifyKey(initialKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyKey(licenseKey);
  };

  const handleBillingPortal = async () => {
    if (!portal?.license.licenseKey) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: portal.license.licenseKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Portail de facturation indisponible.');
      }
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full space-y-6 relative z-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-black uppercase tracking-widest mb-5">
          <Lock size={13} />
          <span>Espace Téléchargement Sécurisé</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight text-glow mb-3">
          Télécharger <span className="text-accent">Kōdo POS</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/60 font-medium">
          Saisissez votre clé de licence active pour accéder à la dernière version signée (macOS &amp; Windows) et aux mises à jour.
        </p>
      </div>

      {/* Main Card */}
      <div className="glass rounded-[2rem] p-7 sm:p-9 border border-foreground/10 shadow-2xl">
        {!portal ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="license-key-input"
                className="text-[11px] font-black uppercase tracking-widest text-foreground/55 mb-2 flex items-center gap-1.5"
              >
                <Key size={13} className="text-accent" /> Clé de licence Kōdo POS
              </label>
              <input
                id="license-key-input"
                type="text"
                required
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                placeholder="Ex: KODO-PRO-1M-A1B2-C3D4"
                className="w-full px-5 py-4 rounded-2xl bg-foreground/[0.04] border border-foreground/15 focus:border-accent outline-none font-mono text-sm sm:text-base text-foreground placeholder:text-foreground/30 uppercase tracking-wider"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-foreground hover:bg-foreground/90 text-background font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={17} />
                  <span>Débloquer mon téléchargement</span>
                </>
              )}
            </button>

            <p className="text-xs text-foreground/45 text-center font-medium">
              Les liens Cloudflare R2 générés sont privés et expirent automatiquement après 5 minutes.
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Active License Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-black text-foreground">
                    Licence {portal.license.planLabel} active
                  </div>
                  <div className="text-xs text-foreground/60 font-mono">
                    {portal.license.licenseKey} • Valide jusqu&apos;au {portal.license.expiryDate}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPortal(null)}
                className="text-xs font-bold text-foreground/55 hover:text-foreground cursor-pointer"
              >
                Changer de clé
              </button>
            </div>

            {/* OS Selector */}
            <div className="flex p-1 bg-foreground/[0.04] border border-foreground/10 rounded-xl">
              <button
                type="button"
                onClick={() => setOs('mac')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  os === 'mac'
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-foreground/65 hover:text-foreground'
                }`}
              >
                <Apple size={16} /> macOS (.dmg)
              </button>
              <button
                type="button"
                onClick={() => setOs('win')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  os === 'win'
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-foreground/65 hover:text-foreground'
                }`}
              >
                <Monitor size={16} /> Windows (.zip)
              </button>
            </div>

            {/* Direct Signed R2 Download */}
            <a
              href={`/api/download?os=${os}&key=${encodeURIComponent(portal.license.licenseKey)}`}
              className="w-full py-4 px-6 rounded-full bg-accent hover:opacity-90 text-white dark:text-black font-black text-sm shadow-xl shadow-accent/25 transition-all flex items-center justify-center gap-2.5"
            >
              <Download size={18} />
              <span>
                Télécharger v{portal.release.version} (
                {os === 'mac' ? portal.release.macFilename : portal.release.winFilename})
              </span>
            </a>

            {!portal.r2Ready && (
              <p className="text-xs text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-center">
                Ajoutez vos variables Cloudflare R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) pour activer le lien signé.
              </p>
            )}

            {/* Latest Release Notes */}
            <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/10 text-xs text-foreground/65 space-y-1.5">
              <div className="font-bold text-foreground flex items-center justify-between">
                <span>Dernière version : v{portal.release.version}</span>
                <span className="text-foreground/45 font-mono">{portal.release.releaseDate}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-line">{portal.release.changelog}</p>
            </div>

            {/* Stripe Billing Portal Button */}
            {portal.license.hasBillingPortal && (
              <button
                type="button"
                onClick={handleBillingPortal}
                disabled={portalLoading}
                className="w-full py-3 rounded-xl glass hover:bg-foreground/10 border border-foreground/10 text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <CreditCard size={15} className="text-accent" />
                <span>
                  {portalLoading
                    ? 'Ouverture du portail Stripe...'
                    : 'Gérer mon abonnement, changer d’offre ou télécharger mes factures'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Not subscribed yet CTA */}
      <div className="glass rounded-2xl p-5 border border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-foreground">Pas encore de licence Kōdo POS ?</p>
          <p className="text-xs text-foreground/55">
            Débloquez l&apos;installateur et les mises à jour dès 29€/mois, sans engagement.
          </p>
        </div>
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent hover:opacity-90 text-white dark:text-black text-xs font-black whitespace-nowrap transition-all"
        >
          <span>Choisir une offre</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function KodoPosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground bg-grid-pattern relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/15 blur-[120px] rounded-full pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 w-full z-40 glass border-b border-white/5 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
              <Image src="/logo-light.png" alt="Logo KŌDO Solutions - Mode sombre" width={32} height={32} className="h-8 w-auto drop-shadow-md hidden dark:block" />
              <Image src="/logo-dark.png" alt="Logo KŌDO Solutions - Mode clair" width={32} height={32} className="h-8 w-auto drop-shadow-md block dark:hidden" />
            </div>
            <span className="text-xl font-black tracking-widest text-foreground uppercase mt-1">KŌDO</span>
          </Link>
          <div className="space-x-6 text-sm text-foreground/70 font-medium flex items-center">
            <Link href="/#pricing" className="hover:text-foreground transition-colors">Tarifs</Link>
            <Link href="/#contact" className="text-foreground hover:text-accent transition-colors hidden sm:inline">Demander une démo</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-sm font-bold text-foreground/60">
              <Loader2 className="animate-spin text-accent" size={18} />
              Chargement...
            </div>
          }
        >
          <DownloadPortalContent />
        </Suspense>
      </main>

      <footer className="bg-foreground text-background py-8 text-center">
        <p className="text-sm font-medium opacity-80">
          &copy; {new Date().getFullYear()} Kōdo Solutions. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
