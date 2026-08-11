'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Key, ShieldX, PlayCircle, PlusCircle, CheckCircle2, Lock } from 'lucide-react';

type License = {
  id: string; // The license key itself
  license_key: string;
  status: 'active' | 'suspended' | 'expired';
  expiry_date: string;
  hardware_id: string;
  shop_name: string;
  activated_at?: string;
};

// Mock data since we are doing client side component, in real world we fetch from API
const MOCK_LICENSES: License[] = [
  { id: 'KODO-30YS-PRO-2056-51AB', license_key: 'KODO-30YS-PRO-2056-51AB', status: 'active', expiry_date: '2056-08-10', hardware_id: 'MAC-A1B2C3D4E5F6', shop_name: 'Kōdo Studio' },
  { id: 'KODO-MONTH-DEMO-2024-9999', license_key: 'KODO-MONTH-DEMO-2024-9999', status: 'expired', expiry_date: '2023-12-31', hardware_id: 'WIN-F6E5D4C3B2A1', shop_name: 'Boutique Test' },
];

export default function LicensesAdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchLicenses = async (pwd?: string) => {
    try {
      const authPwd = pwd || password || localStorage.getItem('kodo_admin_pwd');
      const res = await fetch('/api/admin/licenses', {
        headers: {
          'Authorization': `Bearer ${authPwd}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.licenses);
        setIsAuthenticated(true);
        localStorage.setItem('kodo_admin_auth', 'true');
        if (pwd) localStorage.setItem('kodo_admin_pwd', pwd);
      } else {
         console.error("Failed to fetch licenses from API, unauthorized");
         setIsAuthenticated(false);
         if (pwd) alert('Mot de passe incorrect');
      }
    } catch (e) {
      console.error("Failed to fetch licenses", e);
      if (pwd) alert('Erreur de connexion');
    }
  };

  useEffect(() => {
    // Check if auth token is in localStorage for simple protection
    const token = localStorage.getItem('kodo_admin_auth');
    if (token === 'true') {
      fetchLicenses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLicenses(password);
  };

  const filteredLicenses = licenses.filter(license =>
    license.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.license_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLicenseStatus = async (license: License) => {
    const newStatus = license.status === 'active' ? 'suspended' : 'active';

    // Optimistic update
    setLicenses(licenses.map(l => l.id === license.id ? { ...l, status: newStatus } : l));

    try {
      await fetch('/api/admin/licenses', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('kodo_admin_pwd')}`
        },
        body: JSON.stringify({ license_key: license.license_key, status: newStatus })
      });
    } catch (e) {
      console.error("Failed to update status", e);
      // Revert on error
      setLicenses(licenses.map(l => l.id === license.id ? { ...l, status: license.status } : l));
    }
  };

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/licenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('kodo_admin_pwd')}`
        },
        body: JSON.stringify({ shop_name: 'Nouvelle Boutique', plan: 'annual' })
      });
      if (res.ok) {
        fetchLicenses();
      }
    } catch (e) {
      console.error("Failed to generate license", e);
    }
    setIsGenerating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-sm">
          <div className="flex justify-center mb-6 text-[#FF7F7F]">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl text-white font-bold text-center mb-6">Accès Restreint</h2>
          <input
            type="password"
            placeholder="Mot de passe administrateur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white mb-4"
          />
          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8 font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#FF7F7F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-4 text-[#FF7F7F]">
              <Key size={14} /> Gestion des Licences POS
            </div>
            <h1 className="font-['Outfit'] text-3xl md:text-4xl font-black tracking-tight text-white">
              Licences & Sécurité
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Rechercher une licence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <button
              onClick={handleGenerateNew}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              <PlusCircle size={18} />
              {isGenerating ? 'Création...' : 'Nouvelle Licence'}
            </button>
          </div>
        </header>

        <div className="bg-white/5 backdrop-blur-[24px] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/50 text-xs uppercase font-bold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-5">Boutique</th>
                  <th className="px-6 py-5">Clé de Licence</th>
                  <th className="px-6 py-5">Expiration</th>
                  <th className="px-6 py-5">Statut</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLicenses.map((license, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={license.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-white text-base group-hover:text-[#FF7F7F] transition-colors">{license.shop_name}</div>
                      <div className="text-xs text-white/40 font-mono mt-1" title="Hardware ID">{license.hardware_id || 'Non associé'}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-md inline-block border border-indigo-500/20">
                        {license.license_key}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-white">{license.expiry_date}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        license.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        license.status === 'suspended' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {license.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button
                         onClick={() => toggleLicenseStatus(license)}
                         className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                           license.status === 'active'
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                         }`}
                       >
                         {license.status === 'active' ? <><ShieldX size={14}/> Suspendre</> : <><PlayCircle size={14}/> Réactiver</>}
                       </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredLicenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                      <ShieldCheck size={32} className="mx-auto mb-3 opacity-50" />
                      Aucune licence trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
