import React from 'react';
import { CornerUpLeft } from 'lucide-react';

interface ReturnDetailsFormProps {
  matchedSale: any;
  selectedProductIdx: number;
  setSelectedProductIdx: (val: number) => void;
  returnQty: number;
  setReturnQty: (val: number) => void;
  returnReason: string;
  setReturnReason: (val: string) => void;
  handleSubmitReturn: (e: React.FormEvent) => void;
}

export function ReturnDetailsForm({
  matchedSale, selectedProductIdx, setSelectedProductIdx,
  returnQty, setReturnQty, returnReason, setReturnReason, handleSubmitReturn
}: ReturnDetailsFormProps) {
  return (
    <form onSubmit={handleSubmitReturn} className="border-t border-slate-100 pt-4 space-y-4">
      <div className="bg-slate-50/70 p-3.5 rounded-xl text-xs space-y-1.5 border border-slate-200/50">
        <p className="font-bold text-slate-850">Invoice Metadata Loaded</p>
        <div className="flex justify-between text-slate-500">
          <span>Buyer Account:</span><span className="font-semibold text-slate-700">{matchedSale.customerName}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Original Total Paid:</span><span className="font-mono font-bold text-slate-800">₹{matchedSale.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Item to Return</label>
        <select
          value={selectedProductIdx} onChange={(e) => { setSelectedProductIdx(parseInt(e.target.value)); setReturnQty(1); }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white font-semibold text-slate-700"
        >
          {matchedSale.items.map((it: any, idx: number) => (
            <option key={idx} value={idx}>{it.productName} ({it.dosage}) &mdash; ₹{it.price.toFixed(2)} [Max {it.quantity}]</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1 col-span-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Quantity</label>
          <input 
            type="number" min="1" max={selectedProductIdx >= 0 ? matchedSale.items[selectedProductIdx].quantity : 1}
            value={returnQty} onChange={(e) => setReturnQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-center font-mono font-bold text-slate-800"
          />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reason / Notes</label>
          <input 
            type="text" placeholder="Reason for refund..." value={returnReason} onChange={(e) => setReturnReason(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white font-semibold text-slate-700" required
          />
        </div>
      </div>
      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10">
        <CornerUpLeft className="w-4 h-4" /> Approve Return & Log Refund
      </button>
    </form>
  );
}
