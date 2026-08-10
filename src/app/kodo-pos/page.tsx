/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';

export default function KodoPosPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    salon: '',
    os: 'mac' // Default OS
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        body: JSON.stringify(formData)
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

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 selection:bg-gray-200">
        <div className="w-full max-w-md bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-12 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-[#F9F9F9] rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
            ✨
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight mb-3 text-black">C&apos;est prêt !</h1>
          <p className="text-gray-500 font-medium mb-8">
            Bienvenue dans Kōdo POS. Vous pouvez télécharger l&apos;application macOS ci-dessous.
          </p>
          <a
            href={downloadUrl}
            download
            className="w-full py-4 px-4 bg-black text-white font-medium rounded-2xl hover:bg-gray-800 transition-all shadow-sm flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger pour Mac
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 flex items-center justify-center p-6 selection:bg-gray-200">
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] p-10">
        
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-black text-white rounded-[24px] mx-auto mb-6 flex items-center justify-center font-bold text-2xl shadow-sm">
            K
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight mb-2 text-black">Obtenir Kōdo POS</h1>
          <p className="text-gray-500 text-sm font-medium">L&apos;application de caisse ultra-minimaliste.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Prénom & Nom</label>
            <input
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all placeholder-gray-400"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email pro</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all placeholder-gray-400"
              placeholder="jean@mon-espace.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Nom de l&apos;Établissement</label>
            <input
              type="text"
              name="salon"
              required
              value={formData.salon}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#F9F9F9] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all placeholder-gray-400"
              placeholder="Ex: Kōdo Studio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Système d&apos;exploitation</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, os: 'mac' })}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  formData.os === 'mac'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-[#F9F9F9] text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.111 13.56c-1.393.076-2.885-.888-3.414-2.146-.576-1.353-.087-3.238.895-4.223.957-.96 2.37-1.352 3.327-1.285.048.87.52 1.95 1.155 2.628.665.71 1.764 1.182 2.613 1.134-.14 1.488-1.077 3.013-2.316 3.655-1.066.55-2.022.42-2.26.237zm-3.268.04c-1.01.12-2.145-.713-3.037-1.428-1.125-.904-2.268-2.433-2.268-4.324 0-2.476 1.42-3.824 2.87-3.824 1.107 0 2.052.705 2.673.705.62 0 1.706-.827 3.06-.705 1.096.098 2.083.565 2.72 1.472-2.34 1.347-1.927 4.542.483 5.46-.574 1.41-1.293 2.78-2.52 4.14-1.01 1.118-1.96 2.22-3.22 2.12l-.76-.062zM14.652 4.5c-.886.136-1.895.736-2.463 1.48-.5.656-.882 1.62-.733 2.502.946-.05 1.996-.64 2.544-1.393.52-.716.89-1.684.71-2.56-.016-.01-.036-.02-.058-.02z"/>
                </svg>
                Mac OS
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, os: 'windows' })}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  formData.os === 'windows'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-[#F9F9F9] text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                </svg>
                Windows
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-4">
            <input
              type="checkbox"
              id="acceptTerms"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
            />
            <label htmlFor="acceptTerms" className="text-xs leading-tight text-gray-500 font-medium select-none cursor-pointer">
              J&apos;accepte les <a href="/cgv" target="_blank" className="underline hover:text-black font-semibold">Conditions Générales de Vente (CGV)</a> et la <a href="/politique-de-confidentialite" target="_blank" className="underline hover:text-black font-semibold">Politique de Confidentialité</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className="w-full py-4 px-4 bg-black text-white font-medium rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex justify-center items-center mt-8"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Préparation...
              </span>
            ) : (
              'Télécharger l\'application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
