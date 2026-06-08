import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Undo2, 
  UserPlus, 
  BarChart3, 
  Stethoscope, 
  Receipt,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingApprovalsCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, pendingApprovalsCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: '1. Dashboard', icon: LayoutDashboard, desc: 'Overview & metrics' },
    { id: 'shop', name: '2. Shop & Billing', icon: ShoppingBag, desc: 'POS order counter' },
    { id: 'returns', name: '3. Returns', icon: Undo2, desc: 'Refund & prescriptions counter' },
    { id: 'new-user', name: '4. Register Customer', icon: UserPlus, desc: 'Add users & tracking' },
    { id: 'sales', name: '5. Sales Log', icon: BarChart3, desc: 'Transaction journals' },
    { id: 'doctors', name: '6. Area Doctors', icon: Stethoscope, desc: 'Nearby practitioners' },
    { id: 'eod', name: '7. EOD Settlement', icon: Receipt, desc: 'Cash deposit & approvals', badge: pendingApprovalsCount },
  ];

  return (
    <aside id="sidebar-container" className="w-80 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div id="sidebar-header" className="p-6 border-b border-slate-800 flex items-center gap-4">
        <div id="brand-logo-badge" className="relative flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30 group cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-white/20 blur-md rounded-full transform scale-0 group-hover:scale-150 transition-transform duration-500"></div>
          <Activity className="w-6 h-6 text-white relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 id="brand-name" className="font-bold text-2xl leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight truncate">MediSync</h1>
          <span id="brand-tagline" className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5 truncate">Pharmacy ERP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav" className="flex-1 p-4 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
          Management Console
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                isActive 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-medium' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">{item.name}</p>
                <p className={`text-[10px] mt-1 truncate ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {item.desc}
                </p>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center justify-center min-w-[20px] h-5 ${
                  isActive ? 'bg-white text-emerald-600' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Utility Footer Footer */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
        <span className="text-[10px] font-mono text-slate-500">
          Terminal Status: <span className="text-emerald-500 font-bold">ONLINE</span>
        </span>
      </div>
    </aside>
  );
}
