'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Download,
  Copy,
  Key,
  Gift,
  ArrowRight,
  Loader2,
  AlertCircle,
  Apple,
  Monitor,
  CreditCard,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type VerifiedSession = {
  paid: boolean;
  licenseKey: string;
  plan: string;
  planLabel: string;
  billingCycle: 'monthly' | 'yearly';
  expiryDate: string;
  referralCode: string;
  email: string;
  latestVersion: string;
  r2Ready: boolean;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionData, setSessionData] = useState<VerifiedSession | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!sessionId) {
        if (active) {
          setError('Aucune session de paiement trouvée. Accédez au téléchargement avec votre clé de licence.');
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data.paid) {
          setError(data.error || 'Paiement non confirmé ou session expirée.');
        } else {
          setSessionData(data);
        }
      } catch {
        if (active) {
          setError('Erreur réseau lors de la vérification du paiement.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    verifySession();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const copyToClipboard = (text: string, type: 'key' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const openBillingPortal = async () => {
    if (!sessionData?.licenseKey) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: sessionData.licenseKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setPortalLoading(false);
    }
  };

  const buildDownloadHref = (os: 'mac' | 'win') => {
    const params = new URLSearchParams({ os });
    if (sessionData?.licenseKey) params.set('key', sessionData.licenseKey);
    if (sessionId) params.set('session_id', sessionId);
    return `/api/download?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="max-w-xl w-full glass p-10 rounded-[2.5rem] border border-foreground/10 text-center relative z-10">
        <Loader2 size={36} className="animate-spin text-accent mx-auto mb-5" />
        <h1 className="text-2xl font-black text-foreground mb-2">
          Vérification de votre paiement…
        </h1>
        <p className="text-sm text-foreground/60">
          Nous générons votre clé de licence sécurisée et préparons vos liens de téléchargement.
        </p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="max-w-xl w-full glass p-10 rounded-[2.5rem] border border-foreground/10 text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-3">
          Accès réservé aux abonnés
        </h1>
        <p className="text-sm text-foreground/65 mb-8 leading-relaxed">{error}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/kodo-pos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-foreground text-background font-bold text-sm"
          >
            <Key size={15} />
            <span>J&apos;ai déjà une clé</span>
          </Link>
          <Link
            href="/#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full glass text-foreground font-bold text-sm"
          >
            <span>Voir les offres</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full glass p-8 sm:p-10 rounded-[2.5rem] border border-foreground/10 shadow-2xl text-center relative z-10">
      <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={34} />
      </div>

      <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-black uppercase tracking-widest mb-4">
        Kōdo POS {sessionData.planLabel} • v{sessionData.latestVersion}
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3 text-glow">
        Paiement confirmé !
      </h1>
      <p className="text-sm sm:text-base text-foreground/65 font-medium mb-8">
        Votre licence est active jusqu&apos;au <strong>{sessionData.expiryDate}</strong> et a également été envoyée à{' '}
        <strong>{sessionData.email}</strong>.
      </p>

      {/* Real License Key Box */}
      <div className="bg-foreground/[0.04] border border-accent/35 p-5 rounded-2xl mb-7 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-accent flex items-center gap-1.5">
            <Key size={14} /> Votre clé de licence personnelle
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 bg-background/70 border border-foreground/10 p-3.5 rounded-xl">
          <code className="text-base sm:text-xl font-mono font-black text-foreground tracking-wider select-all break-all">
            {sessionData.licenseKey}
          </code>
          <button
            type="button"
            onClick={() => copyToClipboard(sessionData.licenseKey, 'key')}
            className="inline-flex items-center gap-1.5 bg-accent hover:opacity-90 text-white dark:text-black px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <Copy size={13} />
            {copiedKey ? 'Copié' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Protected Cloudflare R2 Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
        <a
          href={buildDownloadHref('mac')}
          className="flex items-center justify-center gap-2.5 bg-foreground hover:bg-foreground/90 text-background font-bold py-4 px-5 rounded-2xl text-sm shadow-xl transition-all hover:-translate-y-0.5"
        >
          <Apple size={18} />
          <span>Télécharger macOS (.dmg)</span>
          <Download size={15} />
        </a>
        <a
          href={buildDownloadHref('win')}
          className="flex items-center justify-center gap-2.5 glass hover:bg-foreground/10 border border-foreground/15 text-foreground font-bold py-4 px-5 rounded-2xl text-sm transition-all hover:-translate-y-0.5"
        >
          <Monitor size={18} className="text-accent" />
          <span>Télécharger Windows</span>
          <Download size={15} />
        </a>
      </div>

      {!sessionData.r2Ready && (
        <p className="text-xs text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 mb-7">
          Stockage Cloudflare R2 en attente de configuration des clés API sur le serveur.
        </p>
      )}

      {/* Referral Box */}
      {sessionData.referralCode && (
        <div className="bg-amber-500/10 border border-amber-500/25 p-5 rounded-2xl text-left mb-7">
          <div className="flex items-center gap-2 mb-1.5">
            <Gift size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-300">
              Votre code parrainage (-15 % / 1 mois offert)
            </h3>
          </div>
          <div className="flex items-center justify-between gap-3 bg-background/60 border border-amber-500/20 p-3 rounded-xl mt-2">
            <code className="text-sm font-mono font-bold text-amber-600 dark:text-amber-300">
              {sessionData.referralCode}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(sessionData.referralCode, 'ref')}
              className="inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
            >
              <Copy size={12} />
              {copiedRef ? 'Copié' : 'Copier'}
            </button>
          </div>
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-foreground/10">
        <button
          type="button"
          onClick={openBillingPortal}
          disabled={portalLoading}
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground/75 hover:text-accent transition-colors cursor-pointer"
        >
          <CreditCard size={14} />
          <span>{portalLoading ? 'Ouverture Stripe...' : 'Gérer mon abonnement & factures'}</span>
        </button>

        <Link
          href={`/kodo-pos?key=${encodeURIComponent(sessionData.licenseKey)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
        >
          <span>Ouvrir mon espace téléchargement</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
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
            <Link href="/kodo-pos" className="text-foreground hover:text-accent transition-colors hidden sm:inline">Téléchargement</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex items-center gap-3 text-sm font-bold text-foreground/70">
              <Loader2 className="animate-spin text-accent" size={20} />
              Chargement de votre commande...
            </div>
          }
        >
          <SuccessContent />
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
