import React from 'react';
import { Activity, IndianRupee, CreditCard } from 'lucide-react';

interface KpiCardsGridProps {
  totalSalesVal: number;
  cashSalesVal: number;
  upiSalesVal: number;
  salesCount: number;
}

export function KpiCardsGrid({ totalSalesVal, cashSalesVal, upiSalesVal, salesCount }: KpiCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <span className="p-2.5 bg-indigo-100/60 text-indigo-700 rounded-xl"><Activity className="w-5 h-5" /></span>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">Gross Total</span>
        </div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-4">Calculated Revenue</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">₹{totalSalesVal.toFixed(2)}</p>
        <div className="mt-2 text-xs text-slate-400 font-medium">From {salesCount} orders settled</div>
      </div>
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <span className="p-2.5 bg-sky-100/60 text-sky-700 rounded-xl"><IndianRupee className="w-5 h-5" /></span>
          <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">Cash Drawer</span>
        </div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-4">EOD Cash Collected</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">₹{cashSalesVal.toFixed(2)}</p>
        <div className="mt-2 text-xs text-slate-400 font-medium">Awaiting vault deposit approval</div>
      </div>
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <span className="p-2.5 bg-purple-100/60 text-purple-700 rounded-xl"><CreditCard className="w-5 h-5" /></span>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">UPI Gateway</span>
        </div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-4">UPI Settlement</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">₹{upiSalesVal.toFixed(2)}</p>
        <div className="mt-2 text-xs text-slate-400 font-medium">Deposited directly to bank</div>
      </div>
    </div>
  );
}
