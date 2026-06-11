import React from 'react';
import { Check, Sparkles, Printer } from 'lucide-react';
import { Sale } from '../../../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export function InvoiceModal({ isOpen, onClose, sale }: InvoiceModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
        <div className="bg-slate-900 text-white p-6 text-center space-y-1 relative">
          <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-2">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-lg tracking-tight">GowMithra Pharmacy Invoice</h4>
          <p className="text-[11px] text-slate-400">Reconciliation Receipt: #{sale.id}</p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-xs text-slate-500 space-y-1.5 border-b border-slate-100 pb-3">
            <div className="flex justify-between">
              <span>Audit Timestamp:</span>
              <span className="font-mono font-medium text-slate-700">{sale.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span>Patient / Buyer:</span>
              <span className="font-semibold text-slate-800">{sale.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Account:</span>
              <span className="font-mono font-medium text-slate-755">{sale.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>Settled Mode:</span>
              <span className="font-bold text-emerald-600 uppercase font-mono">{sale.paymentMode}</span>
            </div>
          </div>

          <div className="text-xs space-y-2.5 max-h-32 overflow-y-auto pr-1">
            {sale.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-slate-700">{it.productName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{it.dosage} x {it.quantity}</p>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  ₹{(it.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-800 pt-2 mt-1">
              <span>Final Net Paid</span>
              <span className="font-mono text-emerald-600 text-base">₹{sale.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 py-1.5 px-3 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Inventory batches adjusted
            </span>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Physical Copy
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition focus:ring-2 focus:ring-emerald-500"
          >
            Done / Close POS
          </button>
        </div>
      </div>
    </div>
  );
}
