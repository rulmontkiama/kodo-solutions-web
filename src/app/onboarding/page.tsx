/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    nomComplet: '',
    email: '',
    password: '',
    nomSalon: '',
    horaires: ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], // Jours ouverts par défaut
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
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions générales et la politique de confidentialité pour finaliser votre inscription.');
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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 selection:bg-foreground/10 relative overflow-hidden">

      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors font-semibold tracking-wider text-sm uppercase bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-full border border-foreground/10"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl glass border border-foreground/10 rounded-[32px] p-10 relative overflow-hidden shadow-2xl z-10">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/10">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="mb-10 mt-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-black tracking-tight mb-2 text-foreground">
            {step === 1 && "Créons votre Espace"}
            {step === 2 && "Vos Horaires"}
            {step === 3 && "Votre Carte"}
          </h1>
          <p className="text-foreground/50 text-sm font-medium">
            Étape {step} sur 3
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ETAPE 1 : Infos de base */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className="block text-sm font-bold tracking-wide uppercase text-foreground/70 mb-1.5 ml-1">Nom de l&apos;Établissement</label>
                <input type="text" name="nomSalon" required value={formData.nomSalon} onChange={handleChange} className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent focus:bg-foreground/10 transition-all placeholder-foreground/30 text-foreground" placeholder="Ex: Kōdo Studio" />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide uppercase text-foreground/70 mb-1.5 ml-1">Nom complet (Gérant)</label>
                <input type="text" name="nomComplet" required value={formData.nomComplet} onChange={handleChange} className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent focus:bg-foreground/10 transition-all placeholder-foreground/30 text-foreground" placeholder="Jean Dupont" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold tracking-wide uppercase text-foreground/70 mb-1.5 ml-1">Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent focus:bg-foreground/10 transition-all placeholder-foreground/30 text-foreground" placeholder="jean@mon-espace.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide uppercase text-foreground/70 mb-1.5 ml-1">Mot de passe</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-5 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent focus:bg-foreground/10 transition-all placeholder-foreground/30 text-foreground" placeholder="••••••••" />
                </div>
              </div>
            </div>
          )}

          {/* ETAPE 2 : Horaires */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <label className="block text-sm font-bold tracking-wide uppercase text-foreground/70 mb-1.5 ml-1 text-center">Sélectionnez vos jours d&apos;ouverture</label>
              <div className="flex flex-wrap gap-3 justify-center">
                {JOURS.map(jour => {
                  const isActive = formData.horaires.includes(jour);
                  return (
                    <button
                      key={jour}
                      type="button"
                      onClick={() => toggleJour(jour)}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${isActive ? 'bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20' : 'bg-foreground/5 text-foreground/50 border-foreground/10 hover:border-foreground/30 hover:text-foreground'}`}
                    >
                      {jour}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPE 3 : Staff et Prestations */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-3xl space-y-4">
                <h3 className="font-bold text-sm tracking-wide uppercase text-foreground/80 ml-1">Premier collaborateur</h3>
                <div>
                  <input type="text" name="prenomStaff" value={formData.prenomStaff} onChange={handleChange} className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent transition-all placeholder-foreground/30 text-foreground" placeholder="Prénom (ex: Alice)" />
                </div>
              </div>

              <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-3xl space-y-4">
                <h3 className="font-bold text-sm tracking-wide uppercase text-foreground/80 ml-1">Première prestation</h3>
                <div>
                  <input type="text" name="nomPrestation" value={formData.nomPrestation} onChange={handleChange} className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent transition-all mb-3 placeholder-foreground/30 text-foreground" placeholder="Nom (ex: Coupe Homme)" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input type="number" name="prixPrestation" value={formData.prixPrestation} onChange={handleChange} className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent transition-all pr-8 text-foreground" placeholder="Prix" />
                    <span className="absolute right-4 top-4 text-foreground/40 font-bold">€</span>
                  </div>
                  <div className="relative">
                    <select name="dureePrestation" value={formData.dureePrestation} onChange={handleChange} className="w-full px-5 py-4 bg-background border border-foreground/10 rounded-2xl focus:outline-none focus:border-accent transition-all appearance-none text-foreground font-medium">
                      <option value="15" className="bg-background">15 min</option>
                      <option value="30" className="bg-background">30 min</option>
                      <option value="45" className="bg-background">45 min</option>
                      <option value="60" className="bg-background">1h</option>
                      <option value="90" className="bg-background">1h30</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="onboarding_terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-foreground/20 text-accent focus:ring-accent/30 bg-foreground/5 cursor-pointer"
                  required
                />
                <label htmlFor="onboarding_terms" className="text-sm text-foreground/60 leading-tight">
                  J&apos;accepte la <a href="/politique-de-confidentialite" className="text-accent hover:underline" target="_blank">Politique de confidentialité</a> et les <a href="/cgv" className="text-accent hover:underline" target="_blank">Conditions Générales d&apos;Utilisation</a>.
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button type="button" onClick={prevStep} disabled={loading} className="w-1/3 py-4 px-4 bg-foreground/10 text-foreground font-bold rounded-2xl hover:bg-foreground/20 transition-all">
                Retour
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (step === 3 && !acceptedTerms)}
              className={`py-4 px-4 bg-accent text-accent-foreground font-bold rounded-2xl transition-all shadow-lg flex justify-center items-center ${step === 1 ? 'w-full' : 'flex-1'} ${loading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-[1.02] hover:shadow-accent/40 hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-accent-foreground" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
    </div>
  );
}
