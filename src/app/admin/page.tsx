'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Apple, Monitor, Search, ShieldCheck, Key, RefreshCw, Plus } from 'lucide-react';

type License = {
  id: string;
  key: string;
  lead_id: string;
  type: string;
  status: 'active' | 'suspended' | 'expired';
  created_at: string;
  expires_at: string;
};

type Lead = {
  id: string;
  shop_name: string;
  full_name: string;
  email: string;
  phone: string;
  operating_system: 'macOS' | 'Windows';
  created_at: string;
  status: 'pending' | 'contacted' | 'converted';
  has_license?: boolean;
  license_id?: string;
};

export default function AdminPortal() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'licenses'>('leads');
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, licensesRes] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/licenses')
      ]);
      const leadsData = await leadsRes.json();
      const licensesData = await licensesRes.json();
      setLeads(leadsData.leads || []);
      setLicenses(licensesData.licenses || []);
    } catch (error) {
      console.error('Erreur de chargement des données', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleGenerateLicense = async (leadId: string) => {
    setGeneratingFor(leadId);
    try {
      const res = await fetch('/api/admin/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, type: 'pro', validity_months: 12 })
      });
      if (res.ok) {
        fetchData(); // Rafraîchir les données
      }
    } catch (error) {
      console.error('Erreur génération licence', error);
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleUpdateLicenseStatus = async (licenseId: string, status: 'active' | 'suspended') => {
    try {
      await fetch('/api/admin/licenses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: licenseId, updates: { status } })
      });
      fetchData();
    } catch (error) {
      console.error('Erreur mise à jour licence', error);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#FF7F7F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-4 text-[#FF7F7F]">
              <ShieldCheck size={14} /> Portail Administrateur
            </div>
            <h1 className=" text-3xl md:text-4xl font-black tracking-tight text-white">
              Gestion des Leads
            </h1>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Rechercher un prospect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </header>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'leads' ? 'bg-[#FF7F7F] text-black shadow-lg shadow-[#FF7F7F]/20' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
          >
            Leads & Prospects
          </button>
          <button
            onClick={() => setActiveTab('licenses')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'licenses' ? 'bg-[#FF7F7F] text-black shadow-lg shadow-[#FF7F7F]/20' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
          >
            Licences Actives
          </button>

          <button onClick={fetchData} className="ml-auto p-3 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-[24px] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              {activeTab === 'leads' ? (
                <>
                  <thead className="bg-white/5 text-white/50 text-xs uppercase font-bold tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-6 py-5">Établissement</th>
                      <th className="px-6 py-5">Contact</th>
                      <th className="px-6 py-5">Système</th>
                      <th className="px-6 py-5">Statut</th>
                      <th className="px-6 py-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeads.map((lead, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={lead.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="font-bold text-white text-base group-hover:text-[#FF7F7F] transition-colors">{lead.shop_name}</div>
                          <div className="text-xs text-white/50">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-medium text-white">{lead.full_name}</div>
                          <div className="text-xs text-white/50">{lead.email}</div>
                          <div className="text-xs text-white/50">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                            {lead.operating_system === 'macOS' ? <Apple size={14} className="text-white" /> : <Monitor size={14} className="text-[#0078D7]" />}
                            <span className="font-semibold text-xs">{lead.operating_system}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            lead.status === 'contacted' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {lead.status === 'pending' ? 'En attente' : lead.status === 'contacted' ? 'Contacté' : 'Converti'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {!lead.has_license ? (
                            <button
                              onClick={() => handleGenerateLicense(lead.id)}
                              disabled={generatingFor === lead.id}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-colors"
                            >
                              {generatingFor === lead.id ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                              Générer Licence
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 text-white/50 rounded-xl text-xs font-bold">
                              <Key size={14} /> Licence Active
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                    {filteredLeads.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                          <Users size={32} className="mx-auto mb-3 opacity-50" />
                          Aucun prospect trouvé.
                        </td>
                      </tr>
                    )}
                    {loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                          <RefreshCw size={32} className="mx-auto mb-3 opacity-50 animate-spin" />
                          Chargement...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </>
              ) : (
                <>
                  <thead className="bg-white/5 text-white/50 text-xs uppercase font-bold tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-6 py-5">Clé de Licence</th>
                      <th className="px-6 py-5">Prospect Associé</th>
                      <th className="px-6 py-5">Abonnement</th>
                      <th className="px-6 py-5">Expiration</th>
                      <th className="px-6 py-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {licenses.map((license, index) => {
                      const associatedLead = leads.find(l => l.id === license.lead_id);
                      return (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={license.id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="font-mono font-bold text-white tracking-widest text-base group-hover:text-[#FF7F7F] transition-colors bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 inline-block">
                              {license.key}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-medium text-white">{associatedLead?.shop_name || 'Inconnu'}</div>
                            <div className="text-xs text-white/50">{associatedLead?.full_name}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-xs uppercase tracking-wider text-white/70">{license.type}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit ${
                                license.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                license.status === 'suspended' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {license.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm">
                            <div className="text-white">{new Date(license.expires_at).toLocaleDateString('fr-FR')}</div>
                            <div className="text-xs text-white/40">Créée le {new Date(license.created_at).toLocaleDateString('fr-FR')}</div>
                          </td>
                          <td className="px-6 py-5">
                            {license.status === 'active' ? (
                              <button
                                onClick={() => handleUpdateLicenseStatus(license.id, 'suspended')}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold transition-colors"
                              >
                                Suspendre
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateLicenseStatus(license.id, 'active')}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-colors"
                              >
                                Activer
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                    {licenses.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                          <Key size={32} className="mx-auto mb-3 opacity-50" />
                          Aucune licence générée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
