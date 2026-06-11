import React from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

interface ReturnSearchProps {
  saleSearch: string;
  setSaleSearch: (val: string) => void;
  searchError: string;
  successInfo: string;
  handleLocateSale: () => void;
}

export function ReturnSearch({ saleSearch, setSaleSearch, searchError, successInfo, handleLocateSale }: ReturnSearchProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Find Invoice ID</label>
      <div className="flex gap-2">
        <input 
          type="text" placeholder="e.g. TXN-4029, TXN-4028..." value={saleSearch}
          onChange={(e) => setSaleSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLocateSale()}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-semibold"
        />
        <button onClick={handleLocateSale} className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1 transition">
          <Search className="w-3.5 h-3.5" /> Locate
        </button>
      </div>
      {searchError && <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{searchError}</p>}
      {successInfo && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 font-semibold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />{successInfo}
        </div>
      )}
    </div>
  );
}
