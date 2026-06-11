import React from 'react';
import { User, UserPlus, RefreshCw } from 'lucide-react';
import { Customer } from '../../../types';

interface CustomerLookupProps {
  phoneSearch: string;
  setPhoneSearch: (val: string) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (val: Customer | null) => void;
  lookupFeedback: { type: 'success' | 'error' | 'info' | null; message: string };
  setLookupFeedback: (val: { type: 'success' | 'error' | 'info' | null; message: string }) => void;
  handleFetchCustomer: () => void;
  onNavigateToRegister?: () => void;
}

export function CustomerLookup({
  phoneSearch, setPhoneSearch,
  selectedCustomer, setSelectedCustomer,
  lookupFeedback, setLookupFeedback,
  handleFetchCustomer, onNavigateToRegister
}: CustomerLookupProps) {
  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
          <User className="w-4 h-4 text-emerald-500" />
          1. Customer Ledger Lookup
        </h3>
        <button
          onClick={() => onNavigateToRegister && onNavigateToRegister()}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Register Customer
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search customer records (e.g. Pranay, Bob, or Phone Number)..."
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchCustomer()}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
          />
        </div>
        <button
          onClick={handleFetchCustomer}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Fetch Data
        </button>
      </div>

      {lookupFeedback.message && (
        <div className={`text-xs p-3 rounded-xl border flex items-center gap-2 justify-between ${lookupFeedback.type === 'success'
          ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800'
          : lookupFeedback.type === 'error'
            ? 'bg-red-50/60 border-red-100 text-red-800'
            : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
          <p className="font-semibold">{lookupFeedback.message}</p>
          {selectedCustomer && (
            <button
              onClick={() => {
                setSelectedCustomer(null);
                setPhoneSearch('');
                setLookupFeedback({ type: null, message: '' });
              }}
              className="text-[10px] font-bold underline cursor-pointer hover:text-slate-900"
            >
              Unlink
            </button>
          )}
        </div>
      )}

      {selectedCustomer && (
        <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/10 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Linked Patient</p>
            <p className="font-bold text-slate-800 mt-0.5">{selectedCustomer.name}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Contact Phone</p>
            <p className="font-mono font-semibold text-slate-700 mt-0.5">{selectedCustomer.phone}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Email Coordinates</p>
            <p className="font-semibold text-slate-600 truncate mt-0.5">{selectedCustomer.email}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Outstanding Balance</p>
            <p className={`font-mono font-bold mt-0.5 ${selectedCustomer.outstandingBalance > 0 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
              ₹{selectedCustomer.outstandingBalance.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
