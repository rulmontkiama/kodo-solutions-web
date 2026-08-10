"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Hero() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden bg-grid-pattern">
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

      <nav className="fixed top-0 left-0 right-0 w-full z-40 glass border-b border-white/5 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-widest text-foreground uppercase mt-1 transition-transform group-hover:scale-105 font-heading">KŌDO</span>
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-x-8 text-sm text-foreground/70 font-medium flex items-center"
          >
            <Link href="#services" className="hover:text-foreground transition-colors">Services</Link>
            <Link href="#contact" className="text-foreground hover:text-accent transition-colors">Demander une démo</Link>
            <ThemeToggle />
          </motion.div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mt-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase glass px-5 py-2.5 rounded-full mb-8 shadow-sm"
        >
          <Sparkles size={14} className="text-accent" />
          KŌDO SOLUTIONS
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[1.05] text-glow"
        >
          Le système d&apos;exploitation <br className="hidden md:block" /> de votre commerce.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-2xl text-foreground/60 mb-12 max-w-2xl font-medium leading-relaxed"
        >
          POS moderne, réservations intelligentes et présence digitale. 
          Propulsé par l&apos;IA pour les commerçants ambitieux.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 relative"
        >
          {/* Main CTA with continuous pulse/shine */}
          <Link href="/kodo-pos" className="relative group flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-background px-10 py-5 rounded-full font-bold shadow-2xl shadow-foreground/10 hover:shadow-foreground/20 hover:-translate-y-1 transition-all text-lg overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-background/20 to-transparent skew-x-12"
            />
            <span className="relative z-10">Obtenir Kōdo POS</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>

          <Link href="/services/bookings" className="group flex items-center gap-3 bg-transparent border border-foreground/20 hover:bg-foreground/5 text-foreground px-8 py-5 rounded-full font-bold hover:-translate-y-1 transition-all text-lg relative overflow-hidden">
            <span className="relative z-10">Kōdo Bookings</span>
            <span className="relative z-10 text-[11px] font-extrabold uppercase px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 rounded-full">Bientôt disponible</span>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
