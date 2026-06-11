import React from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface DepositFormProps {
  depositAmount: string;
  setDepositAmount: (val: string) => void;
  depositReason: string;
  setDepositReason: (val: string) => void;
  successMsg: string;
}

export function DepositForm({ depositAmount, setDepositAmount, depositReason, setDepositReason, successMsg }: DepositFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Deposit Cash Box</h4>
        <p className="text-xs text-slate-400 font-medium">Courier daily offline cash drawer directly to bank vault.</p>
      </div>
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 font-semibold text-xs flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {successMsg}
        </div>
      )}
      <div className="space-y-1.5 text-xs font-semibold">
        <label className="text-slate-500">Physical Cash Transfer Amount (₹)</label>
        <input
          type="number" step="0.01" placeholder="e.g. 1500.00" value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500" required
        />
      </div>
      <div className="space-y-1.5 text-xs font-semibold">
        <label className="text-slate-500">Reason / Reference Notes</label>
        <input
          type="text" value={depositReason} onChange={(e) => setDepositReason(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-700 font-medium" required
        />
      </div>
      <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.99]">
        <Send className="w-3.5 h-3.5" /> Dispatch & Send for Approval
      </button>
    </div>
  );
}
