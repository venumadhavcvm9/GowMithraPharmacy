import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Sale, Product, Customer } from '../../types';
import { KpiCardsGrid } from './components/KpiCardsGrid';
import { SalesVelocityChart } from './components/SalesVelocityChart';
import { CreditLogAccounts } from './components/CreditLogAccounts';

interface BriefDashboardProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  setActiveTab: (tab: string) => void;
}

export default function BriefDashboard({ sales, products, customers, setActiveTab }: BriefDashboardProps) {
  const totalSalesVal = sales.reduce((acc, sale) => acc + sale.total, 0);
  const cashSalesVal = sales.filter(s => s.paymentMode === 'Cash').reduce((acc, s) => acc + s.total, 0);
  const upiSalesVal = sales.filter(s => s.paymentMode === 'UPI').reduce((acc, s) => acc + s.total, 0);
  const outstandingBal = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

  const recentDaysSales = [320, 410, 290, 580, 490, totalSalesVal];
  const maxDaySales = Math.max(...recentDaysSales, 1);

  return (
    <div id="dashboard-tab" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Store Performance Overview</h2>
          <p className="text-sm text-slate-500">Real-time statistics for pharmaceutical sales, reconciliation, and audit logs.</p>
        </div>
        <button onClick={() => setActiveTab('shop')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md shadow-emerald-600/15 group">
          Open POS Counter <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <KpiCardsGrid totalSalesVal={totalSalesVal} cashSalesVal={cashSalesVal} upiSalesVal={upiSalesVal} salesCount={sales.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesVelocityChart recentDaysSales={recentDaysSales} maxDaySales={maxDaySales} />
        <CreditLogAccounts customers={customers} outstandingBal={outstandingBal} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
