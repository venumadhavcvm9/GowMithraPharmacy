import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';

interface CatalogHeaderProps {
  productQuery: string;
  setProductQuery: (val: string) => void;
  colorFilter: string;
  setColorFilter: (val: string) => void;
  colorsList: string[];
}

export function CatalogHeader({ productQuery, setProductQuery, colorFilter, setColorFilter, colorsList }: CatalogHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
        <ShoppingBag className="w-4 h-4 text-emerald-500" />
        2. Pharmacy Medicine Catalog
      </h3>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search medicine name / SKU..." value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
          />
        </div>
        <select
          value={colorFilter} onChange={(e) => setColorFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:bg-white outline-none font-semibold text-slate-600"
        >
          {colorsList.map(c => (
            <option key={c} value={c}>Badge: {c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
