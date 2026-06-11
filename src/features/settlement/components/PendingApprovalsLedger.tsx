import React, { useState } from 'react';
import { Printer, Eye, X } from 'lucide-react';
import { PendingApproval } from '../../../types';

interface PendingApprovalsLedgerProps {
  pendingApprovals: PendingApproval[];
}

export function PendingApprovalsLedger({ pendingApprovals }: PendingApprovalsLedgerProps) {
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Pending Cash Approvals Ledger</h3>
          <p className="text-xs text-slate-400 font-medium">Daily Vault physical reconciliations filed awaiting audit clearances.</p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="border border-slate-200 hover:bg-slate-50 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap active:scale-[0.98]"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          Print Reconciliation Report
        </button>
      </div>

      <div className="overflow-x-auto text-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
              <th className="pb-3 font-medium">Cash Sale Category</th>
              <th className="pb-3 font-medium">Reconciled Amount</th>
              <th className="pb-3 font-medium">Receipt Ticket</th>
              <th className="pb-3 font-medium">Reason Statement</th>
              <th className="pb-3 font-medium">Approved Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5">
                  <p className="font-semibold text-slate-700 leading-tight">{p.saleTitle}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id} &bull; {p.timestamp}</p>
                </td>
                <td className="py-3.5 font-mono font-bold text-slate-800">₹{p.amount.toFixed(2)}</td>
                <td className="py-3.5">
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptUrl(p.receiptUrl)}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg p-2 flex items-center gap-1.5 font-semibold text-[11px] text-slate-600 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Slip
                  </button>
                </td>
                <td className="py-3.5 text-slate-500 text-xs truncate max-w-[200px]">{p.reason}</td>
                <td className="py-3.5 font-semibold">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${p.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : p.status === 'Rejected'
                      ? 'bg-red-50 text-red-700 font-bold'
                      : 'bg-amber-50 text-amber-700'
                    }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReceiptUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full relative overflow-hidden flex flex-col p-6 shadow-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedReceiptUrl(null)}
              className="absolute top-4 right-4 bg-slate-800 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-slate-800 text-base mb-1 mb-4">Secured Vault Deposit Image Reference</h4>
            <div className="bg-slate-100 border border-slate-200 text-center rounded-2xl overflow-hidden shadow-inner flex items-center justify-center h-[350px]">
              <img
                src={selectedReceiptUrl}
                alt="Vault receipt deposit slip slip"
                className="max-h-[350px] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
