import React from 'react';
import BriefDashboard from '../features/dashboard/BriefDashboard';
import BillingWorkspace from '../features/billing/BillingWorkspace';
import ReturnsLog from '../features/returns/ReturnsLog';
import NewUserForm from '../features/customers/NewUserForm';
import SalesHistory from '../features/sales/SalesHistory';
import DoctorDirectory from '../features/doctors/DoctorDirectory';
import EodSettlement from '../features/settlement/EodSettlement';
import { Product, Customer, Doctor, Sale, PendingApproval, ReturnItem } from '../types';

interface AppRouterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  pendingApprovals: PendingApproval[];
  setPendingApprovals: React.Dispatch<React.SetStateAction<PendingApproval[]>>;
  returns: ReturnItem[];
  setReturns: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
}

export function AppRouter({
  activeTab, setActiveTab,
  products, setProducts,
  customers, setCustomers,
  doctors, setDoctors,
  sales, setSales,
  pendingApprovals, setPendingApprovals,
  returns, setReturns
}: AppRouterProps) {
  switch (activeTab) {
    case 'dashboard':
      return <BriefDashboard sales={sales} products={products} customers={customers} setActiveTab={setActiveTab} />;
    case 'shop':
      return (
        <BillingWorkspace
          products={products} setProducts={setProducts}
          customers={customers} setCustomers={setCustomers}
          sales={sales} setSales={setSales}
          onNavigateToRegister={() => setActiveTab('new-user')}
        />
      );
    case 'returns':
      return <ReturnsLog returns={returns} setReturns={setReturns} sales={sales} setProducts={setProducts} />;
    case 'new-user':
      return <NewUserForm customers={customers} setCustomers={setCustomers} />;
    case 'sales':
      return <SalesHistory sales={sales} />;
    case 'doctors':
      return <DoctorDirectory doctors={doctors} setDoctors={setDoctors} />;
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
}
