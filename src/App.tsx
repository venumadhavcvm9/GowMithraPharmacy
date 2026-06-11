import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Settings, HelpCircle, Lock } from 'lucide-react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import Login from './features/auth/Login';
import { useAppStorage } from './hooks/useAppStorage';
import { AppRouter } from './routes/AppRouter';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('rx_user'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('rx_user');
    return saved ? JSON.parse(saved) : null;
  });

  const storage = useAppStorage(user, isAuthenticated);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingApprovalsCount = storage.pendingApprovals.filter(p => p.status === 'Pending').length;

  const handleLogout = async () => {
    try { await api.post('/auth/logout', {}); } catch (err) {}
    finally {
      localStorage.removeItem('rx_user');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <Login 
        onLoginSuccess={(userData) => {
          localStorage.setItem('rx_user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div id="application-layout" className="flex h-screen bg-slate-50 font-sans text-slate-700 antialiased overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingApprovalsCount={pendingApprovalsCount} />
      <div id="main-content-scroller" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header id="top-control-banner" className="bg-white border-b border-slate-200/80 px-8 py-4.5 flex-shrink-0 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })} ST</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3 text-right focus:outline-none hover:bg-slate-50 p-1.5 rounded-xl transition">
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || user?.full_name || 'Pharmacist'}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{user?.role === 'PHARMACY_OWNER' ? 'Pharmacy Owner' : 'Terminal Manager'}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm cursor-pointer">
                  {(user?.name || user?.full_name || 'P')[0]?.toUpperCase()}
                </div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                  <button onClick={() => { handleLogout(); setShowDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition">Logout</button>
                </div>
              )}
            </div>
            <div id="header-utilities" className="flex items-center border-l border-slate-250/60 pl-3 gap-1">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Settings config"><Settings className="w-4 h-4" /></button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Help guidelines"><HelpCircle className="w-4 h-4" /></button>
              <button onClick={handleLogout} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Sign out"><Lock className="w-4 h-4" /></button>
            </div>
          </div>
        </header>
        <main id="active-viewport-scroll" className="flex-1 overflow-y-auto p-8 relative bg-slate-50">
          <AppRouter activeTab={activeTab} setActiveTab={setActiveTab} {...storage} />
        </main>
      </div>
    </div>
  );
}
