import React from 'react';
import { BarChart3, Search, Eye } from 'lucide-react';
import { Sale } from '../../../types';

interface SalesJournalTableProps {
  search: string; setSearch: (val: string) => void;
  filterMode: 'All' | 'Cash' | 'UPI'; setFilterMode: (val: 'All' | 'Cash' | 'UPI') => void;
  filteredSales: Sale[];
  setSelectedSaleDetail: (val: Sale | null) => void;
}

export function SalesJournalTable({ search, setSearch, filterMode, setFilterMode, filteredSales, setSelectedSaleDetail }: SalesJournalTableProps) {
  return (
    <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-500" /> Store Audit & Sales Database
          </h3>
          <p className="text-xs text-slate-400 font-medium">Reconciled audit logs for current accounting period.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search Txn ID / Name..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs w-40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <select value={filterMode} onChange={(e) => setFilterMode(e.target.value as 'All' | 'Cash' | 'UPI')} className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs focus:bg-white outline-none font-semibold text-slate-600">
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
              <tr><td colSpan={6} className="py-10 text-center text-xs text-slate-400 font-bold">No matching checkout sales registered.</td></tr>
            ) : (
              filteredSales.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-mono font-semibold text-indigo-600 text-xs">{s.id}</td>
                  <td className="py-3.5 text-xs text-slate-500">{s.timestamp}</td>
                  <td className="py-3"><p className="font-semibold text-slate-700">{s.customerName}</p><p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.customerPhone}</p></td>
                  <td className="py-3"><span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${s.paymentMode === 'UPI' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'}`}>{s.paymentMode}</span></td>
                  <td className="py-3 text-right font-mono font-bold text-slate-800">₹{s.total.toFixed(2)}</td>
                  <td className="py-3 text-right"><button onClick={() => setSelectedSaleDetail(s)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition"><Eye className="w-3.5 h-3.5" /></button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
