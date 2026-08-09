'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Download, Copy, Key, Gift, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [licenseData, setLicenseData] = useState<{
    licenseKey: string;
    referralCode: string;
  } | null>(null);

  useEffect(() => {
    // Generate fallback or fetch license details
    const mockKey = `KODO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const mockRef = `REF-KODO-${Math.floor(1000 + Math.random() * 9000)}`;

    const timer = setTimeout(() => {
      setLicenseData({
        licenseKey: mockKey,
        referralCode: mockRef,
      });
    }, 0);
    return () => clearTimeout(timer);
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/15 blur-[140px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full glass p-10 rounded-[3rem] border border-white/10 shadow-2xl relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 size={44} />
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
          Bienvenue dans la communauté <span className="text-accent">Kōdo</span> !
        </h1>
        <p className="text-foreground/70 font-medium text-lg mb-10 leading-relaxed">
          Votre paiement a été validé avec succès. Votre licence **Kōdo POS** est prête à être activée.
        </p>

        {/* License Key Box */}
        <div className="bg-black/40 border border-accent/30 p-6 rounded-2xl mb-8 text-left relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
              <Key size={16} /> Votre Clé de Licence Unique
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              Licence Active
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-xl">
            <code className="text-xl md:text-2xl font-mono font-black text-white tracking-widest select-all">
              {licenseData?.licenseKey || 'KODO-PRO-XXXX-XXXX-XXXX'}
            </code>
            <button
              onClick={() => copyToClipboard(licenseData?.licenseKey || '', 'key')}
              className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-accent-foreground px-4 py-2.5 rounded-lg text-xs font-bold transition-all shrink-0"
            >
              <Copy size={14} />
              {copiedKey ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Download Action Button */}
        <div className="mb-10">
          <a
            href="/Installation_Kodo_POS.dmg"
            download
            className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-200 text-black font-black py-5 px-8 rounded-full text-lg shadow-2xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all"
          >
            <Download size={22} />
            Télécharger Kōdo POS pour Mac (.dmg)
          </a>
          <p className="text-xs text-foreground/40 mt-3 font-medium">
            Compatible avec macOS 11.0+ (Apple Silicon & Intel)
          </p>
        </div>

        {/* Referral Card */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl text-left">
          <div className="flex items-center gap-3 mb-2">
            <Gift size={20} className="text-amber-400" />
            <h3 className="text-lg font-bold text-amber-300">Votre Code Parrainage (Offre 1 Mois Offert)</h3>
          </div>
          <p className="text-sm text-foreground/70 mb-4 font-medium leading-relaxed">
            Partagez votre code à vos confrères commerçants. Ils bénéficient de **-15%** et vous gagnez **1 mois offert** à chaque inscription !
          </p>

          <div className="flex items-center justify-between gap-4 bg-black/40 border border-amber-500/20 p-3 rounded-xl">
            <code className="text-lg font-mono font-bold text-amber-300">
              {licenseData?.referralCode || 'REF-KODO-1234'}
            </code>
            <button
              onClick={() => copyToClipboard(licenseData?.referralCode || '', 'ref')}
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <Copy size={14} />
              {copiedRef ? 'Copié !' : 'Copier mon code'}
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-white text-sm font-semibold transition-colors">
            Retour à l&apos;accueil <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white font-bold">Chargement de votre commande...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
