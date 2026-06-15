import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Sale, Product, Customer } from '../../types';
import { KpiCardsGrid } from './components/KpiCardsGrid';
import { SalesVelocityChart } from './components/SalesVelocityChart';


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

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartData = last7Days.map((date, idx) => {
    const daySales = sales.filter(s => {
      const sDate = new Date(s.timestamp);
      if (isNaN(sDate.getTime())) return false;
      
      // Fix for previously generated sales that lacked a year and parsed as 2001
      if (sDate.getFullYear() === 2001 && !s.timestamp.includes('2001')) {
        sDate.setFullYear(new Date().getFullYear());
      }
      
      return sDate.getFullYear() === date.getFullYear() &&
             sDate.getMonth() === date.getMonth() &&
             sDate.getDate() === date.getDate();
    });
    
    const total = daySales.reduce((acc, sale) => acc + sale.total, 0);
    return {
      name: idx === 6 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: total
    };
  });

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

      <div>
        <SalesVelocityChart data={chartData} />
      </div>
    </div>
  );
}
