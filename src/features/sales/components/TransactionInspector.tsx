import React from 'react';
import { Sparkles, Printer } from 'lucide-react';
import { Sale } from '../../../types';

interface TransactionInspectorProps {
  selectedSaleDetail: Sale | null;
  setSelectedSaleDetail: (val: Sale | null) => void;
}

export function TransactionInspector({ selectedSaleDetail, setSelectedSaleDetail }: TransactionInspectorProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4 min-h-[300px]">
      {selectedSaleDetail ? (
        <div className="space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Audit Verified Approved</span>
              <h4 className="font-bold text-slate-800 text-base mt-2">Txn: {selectedSaleDetail.id}</h4>
            </div>
            <button onClick={() => setSelectedSaleDetail(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
          </div>
          <div className="text-xs text-slate-500 space-y-2">
            <div className="flex justify-between"><span>Verification Timestamp:</span><span className="font-mono font-medium text-slate-805">{selectedSaleDetail.timestamp}</span></div>
            <div className="flex justify-between"><span>Customer Counterpart:</span><span className="font-semibold text-slate-800">{selectedSaleDetail.customerName}</span></div>
            <div className="flex justify-between"><span>Invoicing Contact:</span><span className="font-mono">{selectedSaleDetail.customerPhone}</span></div>
          </div>
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dispensed Medical Stocks</p>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {selectedSaleDetail.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-medium text-slate-755">
                  <span>{item.productName} ({item.dosage}) <span className="text-slate-400">x{item.quantity}</span></span>
                  <span className="font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200/60 pt-2 mt-2 flex justify-between font-bold text-slate-850 text-xs">
              <span>Total Net Settled</span><span className="font-mono text-emerald-700">₹{selectedSaleDetail.total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => window.print()} className="w-full bg-slate-800 hover:bg-slate-900 border border-transparent text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1">
            <Printer className="w-4 h-4" /> Re-Print Duplicate Receipt
          </button>
        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center text-center opacity-40 py-12">
          <Sparkles className="w-10 h-10 text-slate-400 mb-2 stroke-[1.5]" />
          <p className="text-xs font-bold text-slate-500">Invoice Inspector Inactive.</p>
          <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Select any transaction on the left to review items, dosages, quantities, and audit slips.</p>
        </div>
      )}
    </div>
  );
}
