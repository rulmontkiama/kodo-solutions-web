'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Apple, Monitor, Search, ShieldCheck } from 'lucide-react';

type Lead = {
  id: string;
  shop_name: string;
  full_name: string;
  email: string;
  phone: string;
  operating_system: 'macOS' | 'Windows';
  created_at: string;
  status: 'pending' | 'contacted' | 'converted';
};

// Mock data for the portal since we can't fetch from actual Firestore easily without auth here
const MOCK_LEADS: Lead[] = [
  { id: '1', shop_name: 'Kōdo Studio', full_name: 'Jean Dupont', email: 'jean@mon-espace.com', phone: '+32 470 12 34 56', operating_system: 'macOS', created_at: new Date().toISOString(), status: 'pending' },
  { id: '2', shop_name: 'Salon Beauté', full_name: 'Marie L.', email: 'marie@salon.be', phone: '+32 490 98 76 54', operating_system: 'Windows', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'contacted' },
];

export default function AdminPortal() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter(lead =>
    lead.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-8 font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#FF7F7F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-4 text-[#FF7F7F]">
              <ShieldCheck size={14} /> Portail Administrateur
            </div>
            <h1 className="font-['Outfit'] text-3xl md:text-4xl font-black tracking-tight text-white">
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

        <div className="bg-white/5 backdrop-blur-[24px] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-white/50 text-xs uppercase font-bold tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-5">Établissement</th>
                  <th className="px-6 py-5">Contact</th>
                  <th className="px-6 py-5">Système</th>
                  <th className="px-6 py-5">Statut</th>
                  <th className="px-6 py-5">Date</th>
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
                    <td className="px-6 py-5 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </motion.tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                      <Users size={32} className="mx-auto mb-3 opacity-50" />
                      Aucun prospect trouvé.
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
