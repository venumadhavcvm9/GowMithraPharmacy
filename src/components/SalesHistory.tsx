import React, { useState } from 'react';
import { BarChart3, Search, Eye, Filter, Sparkles, Printer } from 'lucide-react';
import { Sale } from '../types';

interface SalesHistoryProps {
  sales: Sale[];
}

export default function SalesHistory({ sales }: SalesHistoryProps) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Cash' | 'UPI'>('All');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  const filteredSales = sales.filter((s) => {
    const matchesSearch = s.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.customerPhone.includes(search);
    const matchesMode = filterMode === 'All' || s.paymentMode === filterMode;
    return matchesSearch && matchesMode;
  });

  return (
    <div id="sales-history-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Sales Transactions Journal (7-col) */}
      <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Store Audit & Sales Database
            </h3>
            <p className="text-xs text-slate-400 font-medium">Reconciled audit logs for current accounting period.</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Txn ID / Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs w-40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Toggle Mode */}
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as 'All' | 'Cash' | 'UPI')}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs focus:bg-white outline-none font-semibold text-slate-600"
            >
              <option value="All">All Payments</option>
              <option value="Cash">Cash Ledger</option>
              <option value="UPI">UPI Gateway</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="pb-3 font-medium">Reconciled SKU ID</th>
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Patient Details</th>
                <th className="pb-3 font-medium">Payment Mode</th>
                <th className="pb-3 font-medium text-right">Invoice Sum</th>
                <th className="pb-3 font-medium text-right">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-slate-400 font-bold">
                    No matching checkout sales registered.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-mono font-semibold text-indigo-600 text-xs">{s.id}</td>
                    <td className="py-3.5 text-xs text-slate-500">{s.timestamp}</td>
                    <td className="py-3">
                      <p className="font-semibold text-slate-700">{s.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.customerPhone}</p>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.paymentMode === 'UPI' 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {s.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-800">
                      ₹{s.total.toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => setSelectedSaleDetail(s)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Inspector Panel (4-col Overlay-like aspect) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4 min-h-[300px]">
        {selectedSaleDetail ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Audit Verified Approved
                </span>
                <h4 className="font-bold text-slate-800 text-base mt-2">Txn: {selectedSaleDetail.id}</h4>
              </div>
              <button 
                onClick={() => setSelectedSaleDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Verification Timestamp:</span>
                <span className="font-mono font-medium text-slate-805">{selectedSaleDetail.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Counterpart:</span>
                <span className="font-semibold text-slate-800">{selectedSaleDetail.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Invoicing Contact:</span>
                <span className="font-mono">{selectedSaleDetail.customerPhone}</span>
              </div>
            </div>

            {/* Prescribed Items */}
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
                <span>Total Net Settled</span>
                <span className="font-mono text-emerald-700">₹{selectedSaleDetail.total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-900 border border-transparent text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
            >
              <Printer className="w-4 h-4" />
              Re-Print Duplicate Receipt
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

    </div>
  );
}
