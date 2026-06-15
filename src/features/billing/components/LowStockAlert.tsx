import React from 'react';
import { Product } from '../../../types';
import { AlertTriangle } from 'lucide-react';

interface LowStockAlertProps {
  products: Product[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.filter(p => p.stock < 130 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock <= 0);

  const totalLowOrEmpty = lowStockProducts.length + outOfStockProducts.length;

  if (totalLowOrEmpty === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl shadow-sm mb-6 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-orange-800 font-bold">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm tracking-wide uppercase">Inventory Alert: Low Stock</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {outOfStockProducts.map(p => (
          <div key={`empty-${p.id}`} className="bg-white border border-red-100 p-2.5 rounded-lg flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-800">{p.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{p.code}</p>
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
              Out of Stock
            </span>
          </div>
        ))}

        {lowStockProducts.map(p => (
          <div key={`low-${p.id}`} className="bg-white border border-orange-100 p-2.5 rounded-lg flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-800">{p.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{p.code}</p>
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {p.stock} left
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
