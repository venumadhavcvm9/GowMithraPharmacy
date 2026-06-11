import React from 'react';
import { Printer } from 'lucide-react';
import { Customer } from '../../../types';

interface CartFooterProps {
  cartLength: number;
  subtotal: number;
  grandTotal: number;
  selectedCustomer: Customer | null;
  paymentMode: 'Cash' | 'UPI';
  setPaymentMode: (mode: 'Cash' | 'UPI') => void;
  handleCheckout: () => void;
}

export function CartFooter({ cartLength, subtotal, grandTotal, selectedCustomer, paymentMode, setPaymentMode, handleCheckout }: CartFooterProps) {
  return (
    <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal price</span><span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
        </div>
        {selectedCustomer && selectedCustomer.outstandingBalance > 0 && (
          <div className="flex justify-between text-amber-600 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/10">
            <span>Add past due balance</span><span className="font-mono font-bold">₹{selectedCustomer.outstandingBalance.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-slate-800 border-t border-dashed border-slate-200 pt-3">
          <span>Total Billable</span>
          <span className="font-mono text-base text-emerald-600">
            ₹{(grandTotal + (selectedCustomer && selectedCustomer.outstandingBalance > 0 ? selectedCustomer.outstandingBalance : 0)).toFixed(2)}
          </span>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Payment Receipt Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setPaymentMode('Cash')} className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${paymentMode === 'Cash' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Cash Drawer</button>
          <button type="button" onClick={() => setPaymentMode('UPI')} className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${paymentMode === 'UPI' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>UPI QR Gateway</button>
        </div>
      </div>
      <button onClick={handleCheckout} disabled={cartLength === 0} className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${cartLength === 0 ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99] shadow-emerald-600/15'}`}>
        <Printer className="w-4 h-4" /> Complete Checkout & Print Invoice
      </button>
    </div>
  );
}
