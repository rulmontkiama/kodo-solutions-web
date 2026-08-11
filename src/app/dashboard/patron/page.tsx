'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, Receipt, Package, AlertTriangle, Lock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PatronDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = async (pwd?: string) => {
    try {
      const authPwd = pwd || password || localStorage.getItem('kodo_patron_pwd');
      const res = await fetch('/api/dashboard/patron', {
        headers: {
          'Authorization': `Bearer ${authPwd}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        setIsAuthenticated(true);
        localStorage.setItem('kodo_patron_auth', 'true');
        if (pwd) localStorage.setItem('kodo_patron_pwd', pwd);
      } else {
        console.error("Failed to fetch dashboard data, unauthorized");
        setIsAuthenticated(false);
        if (pwd) alert('Mot de passe incorrect');
      }
    } catch (e) {
       console.error("Failed to fetch dashboard data", e);
       if (pwd) alert('Erreur de connexion');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('kodo_patron_auth');
    if (token === 'true') {
      fetchDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardData(password);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-sm">
          <div className="flex justify-center mb-6 text-[#FF7F7F]">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl text-white font-bold text-center mb-6">Accès Gérant</h2>
          <input
            type="password"
            placeholder="Mot de passe"
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
    <div className="min-h-screen bg-[#0B0B0F] text-white p-4 md:p-8 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/15 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#FF7F7F]/15 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase mb-2 text-indigo-400">
            <TrendingUp size={14} /> Kōdo Cloud Sync
          </div>
          <h1 className="font-['Outfit'] text-2xl md:text-4xl font-black tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-1">Activité en direct de votre établissement</p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 text-sm font-semibold">Chiffre d'Affaires</h3>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Receipt size={20} />
              </div>
            </div>
            <div className="font-['Outfit'] text-4xl font-black">€ {dashboardData?.kpi?.totalSales?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</div>
            <div className="text-emerald-400 text-sm font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +12% par rapport à hier
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 text-sm font-semibold">Tickets Édités</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShoppingCart size={20} />
              </div>
            </div>
            <div className="font-['Outfit'] text-4xl font-black">{dashboardData?.kpi?.totalTickets || 0}</div>
            <div className="text-white/40 text-sm font-medium mt-2">
              Aujourd'hui
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/60 text-sm font-semibold">Panier Moyen</h3>
              <div className="w-10 h-10 rounded-full bg-[#FF7F7F]/20 flex items-center justify-center text-[#FF7F7F]">
                <Package size={20} />
              </div>
            </div>
            <div className="font-['Outfit'] text-4xl font-black">€ {dashboardData?.kpi?.averageBasket?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</div>
            <div className="text-white/40 text-sm font-medium mt-2">
              Aujourd'hui
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-3xl"
          >
            <h3 className="font-['Outfit'] text-xl font-bold mb-6">Évolution des ventes</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData?.hourlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#13131A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#FF7F7F' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6 text-[#FF7F7F]">
              <AlertTriangle size={20} />
              <h3 className="font-['Outfit'] text-xl font-bold text-white">Alertes Stocks</h3>
            </div>

            <div className="flex-1 space-y-4">
              {dashboardData?.stockAlerts?.map((alert: any) => (
                <div key={alert.id} className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{alert.name}</h4>
                    <p className="text-xs text-white/40 mt-1">Seuil: {alert.threshold}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#FF7F7F]">{alert.current}</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-white/30">Restant</div>
                  </div>
                </div>
              ))}
              {!dashboardData?.stockAlerts?.length && (
                 <div className="text-center text-white/40 py-8 text-sm">
                   Aucune alerte de stock.
                 </div>
              )}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors">
              Voir tout l'inventaire
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
