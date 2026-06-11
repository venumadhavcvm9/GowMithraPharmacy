import React from 'react';
import { Customer } from '../../../types';

interface CreditLogAccountsProps {
  customers: Customer[];
  outstandingBal: number;
  setActiveTab: (tab: string) => void;
}

export function CreditLogAccounts({ customers, outstandingBal, setActiveTab }: CreditLogAccountsProps) {
  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Credit Log Accounts</h3>
          <span className="p-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-[10px] font-bold">Pending Recovers</span>
        </div>
        <p className="text-xs text-slate-400 font-medium mb-4">Unsettled outstanding account receivables.</p>
        <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
          {customers.map((cust) => (
            <div key={cust.id} className="flex justify-between items-center text-sm border-b border-dashed border-slate-100 pb-2.5 last:border-0 last:pb-0">
              <div>
                <p className="font-semibold text-slate-700 leading-tight">{cust.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cust.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800 font-mono">₹{cust.outstandingBalance.toFixed(2)}</p>
                <button onClick={() => setActiveTab('shop')} className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold leading-none mt-0.5 hover:underline">Clear balance</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4 mt-4">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Total Credit Receivables</span>
          <span className="font-bold text-slate-800 font-mono text-sm text-[15px]">₹{outstandingBal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
