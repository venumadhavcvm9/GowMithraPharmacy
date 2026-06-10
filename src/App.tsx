import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  User,
  Clock,
  Calendar,
  Settings,
  HelpCircle,
  Lock
} from 'lucide-react';

// Live states seed structures
import {
  initialProducts,
  initialCustomers,
  initialDoctors,
  initialSales,
  initialPendingApprovals,
  initialReturns
} from './data';
import { Product, Customer, Doctor, Sale, PendingApproval, ReturnItem } from './types';
import { api } from './services/api';

// Modular Workspace Panels
import Sidebar from './components/Sidebar';
import BriefDashboard from './components/BriefDashboard';
import BillingWorkspace from './components/BillingWorkspace';
import ReturnsLog from './components/ReturnsLog';
import NewUserForm from './components/NewUserForm';
import SalesHistory from './components/SalesHistory';
import DoctorDirectory from './components/DoctorDirectory';
import EodSettlement from './components/EodSettlement';
import Login from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);

  // Storage hooks representing operational variables
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rx_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('rx_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('rx_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('rx_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(() => {
    const saved = localStorage.getItem('rx_approvals');
    return saved ? JSON.parse(saved) : initialPendingApprovals;
  });

  const [returns, setReturns] = useState<ReturnItem[]>(() => {
    const saved = localStorage.getItem('rx_returns');
    return saved ? JSON.parse(saved) : initialReturns;
  });

  // Clock state
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rx_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rx_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('rx_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('rx_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('rx_approvals', JSON.stringify(pendingApprovals));
  }, [pendingApprovals]);

  useEffect(() => {
    localStorage.setItem('rx_returns', JSON.stringify(returns));
  }, [returns]);

  // Fetch live data from backend APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, salesRes, setRes, retRes, doctorsRes] = await Promise.all([
          api.get('/pharmacy/inventory').catch(() => null),
          api.get('/pharmacy/sales').catch(() => null),
          api.get('/pharmacy/settlements').catch(() => null),
          api.get('/pharmacy/returns').catch(() => null),
          api.get('/area-doctors/public').catch(() => null)
        ]);

        if (invRes?.success && invRes.data.length > 0) setProducts(invRes.data);
        if (salesRes?.success && salesRes.data.length > 0) setSales(salesRes.data);
        if (setRes?.success && setRes.data.length > 0) setPendingApprovals(setRes.data);
        if (retRes?.success && retRes.data.length > 0) setReturns(retRes.data);
        if (doctorsRes?.data && doctorsRes.data.length > 0) {
          const mappedDoctors = doctorsRes.data.map((d: any) => ({
            id: String(d.doctor_id || d.id),
            name: d.full_name,
            specialty: 'Area Doctor',
            phone: d.mobile,
            availability: 'Available',
            clinic: d.address || 'Public Clinic'
          }));
          setDoctors(mappedDoctors);
        }
      } catch (err) {
        console.error("Failed to fetch initial backend data", err);
      }
    };
    fetchData();
  }, []);

  // Extract count of approvals that are pending
  const pendingApprovalsCount = pendingApprovals.filter(p => p.status === 'Pending').length;

  // Header helpers
  const todayStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Render view router based on selected navigation tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <BriefDashboard
            sales={sales}
            products={products}
            customers={customers}
            setActiveTab={setActiveTab}
          />
        );
      case 'shop':
        return (
          <BillingWorkspace
            products={products}
            setProducts={setProducts}
            customers={customers}
            setCustomers={setCustomers}
            sales={sales}
            setSales={setSales}
            onNavigateToRegister={() => setActiveTab('new-user')}
          />
        );
      case 'returns':
        return (
          <ReturnsLog
            returns={returns}
            setReturns={setReturns}
            sales={sales}
            setProducts={setProducts}
          />
        );
      case 'new-user':
        return (
          <NewUserForm
            customers={customers}
            setCustomers={setCustomers}
          />
        );
      case 'sales':
        return <SalesHistory sales={sales} />;
      case 'doctors':
        return (
          <DoctorDirectory
            doctors={doctors}
            setDoctors={setDoctors}
          />
        );
      case 'eod':
        return (
          <EodSettlement
            sales={sales}
            pendingApprovals={pendingApprovals}
            setPendingApprovals={setPendingApprovals}
          />
        );
      default:
        return (
          <div className="text-center py-20 bg-white border rounded-3xl p-6">
            <span className="text-sm font-semibold text-slate-500">Workspace Selection Offline</span>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div id="application-layout" className="flex h-screen bg-slate-50 font-sans text-slate-700 antialiased overflow-hidden">

      {/* Sidebar Navigation Left Rail */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Workspace Frame */}
      <div id="main-content-scroller" className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Dynamic Upper Control Dashboard Banner */}
        <header id="top-control-banner" className="bg-white border-b border-slate-200/80 px-8 py-4.5 flex-shrink-0 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{todayStr}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeStr} ST</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User welcome block */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 text-right focus:outline-none hover:bg-slate-50 p-1.5 rounded-xl transition"
              >
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Srihas Kammala</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Terminal Manager</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-sm cursor-pointer">
                  Sk
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                  <button
                    onClick={() => {
                      setIsAuthenticated(false);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Extra header utilities */}
            <div id="header-utilities" className="flex items-center border-l border-slate-250/60 pl-3 gap-1">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Settings config">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Help guidelines">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main id="active-viewport-scroll" className="flex-1 overflow-y-auto p-8 relative bg-slate-50">
          {renderContent()}
        </main>

      </div>
    </div>
  );
}
