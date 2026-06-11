import React from 'react';
import { FileCheck } from 'lucide-react';
import { Sale } from '../../../types';

interface ReconciliationStatsProps {
  cashSales: Sale[];
  upiSales: Sale[];
  netCashDrawer: number;
  upiTotal: number;
  combinedTotal: number;
}

export function ReconciliationStats({ cashSales, upiSales, netCashDrawer, upiTotal, combinedTotal }: ReconciliationStatsProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4 text-emerald-500" />
          Day Sale Reconciliation
        </h3>
        <p className="text-xs text-slate-400 font-medium">Daily balances aggregated by payment mode formats.</p>
      </div>

      <div className="space-y-3.5 my-5 pb-4">
        <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/10 flex justify-between items-center text-sm">
          <div>
            <p className="font-bold text-slate-800">Cash Receipts Drawer</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{cashSales.length} cash transactions</p>
          </div>
          <span className="font-mono font-bold text-emerald-700 text-base">₹{netCashDrawer.toFixed(2)}</span>
        </div>

        <div className="bg-purple-650/5 p-4 rounded-xl border border-purple-500/10 flex justify-between items-center text-sm">
          <div>
            <p className="font-bold text-slate-800">Online Gateway Total</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{upiSales.length} UPI transactions</p>
          </div>
          <span className="font-mono font-bold text-purple-700 text-base">₹{upiTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
        <span className="font-semibold text-slate-500">Gross Vault Turnover</span>
        <span className="font-mono font-bold text-slate-800 text-lg">₹{combinedTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
