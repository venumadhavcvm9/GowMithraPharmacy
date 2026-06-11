import React from 'react';
import { Sparkles } from 'lucide-react';
import { ReturnItem } from '../../../types';

interface ReturnsHistoryTableProps {
  returns: ReturnItem[];
}

export function ReturnsHistoryTable({ returns }: ReturnsHistoryTableProps) {
  return (
    <div className="lg:col-span-7 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        Returns & Re-Shelving Journal
      </h3>
      <p className="text-xs text-slate-400 font-medium mb-4">Chronological log of batch refund overrides and pharmaceutical reconciliations.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
              <th className="pb-3 font-medium">Refund ID</th>
              <th className="pb-3 font-medium">Invoice ID</th>
              <th className="pb-3 font-medium">Customer Details</th>
              <th className="pb-3 font-medium">Product / Qty</th>
              <th className="pb-3 font-medium text-right">Repaid Val</th>
            </tr>
          </thead>
          <tbody>
            {returns.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-semibold">
                  No historic product returns log listed yet.
                </td>
              </tr>
            ) : (
              returns.map((ret) => (
                <tr key={ret.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-700">{ret.id}</td>
                  <td className="py-3.5 font-mono text-xs text-slate-500">{ret.saleId}</td>
                  <td className="py-3.5">
                    <p className="font-semibold text-slate-700">{ret.customerName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 max-w-[140px] truncate">{ret.reason}</p>
                  </td>
                  <td className="py-3.5">
                    <p className="font-bold text-slate-600">{ret.productName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ret.quantity} unit{ret.quantity > 1 ? 's' : ''} re-stocked</p>
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-slate-800">
                    ₹{ret.refundAmount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
