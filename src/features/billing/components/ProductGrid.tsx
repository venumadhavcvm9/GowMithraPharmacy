import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Product, CartItem } from '../../../types';

interface ProductGridProps {
  filteredProducts: Product[];
  cart: CartItem[];
  handleAddToCart: (p: Product) => void;
}

export function ProductGrid({ filteredProducts, cart, handleAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
      {filteredProducts.length === 0 ? (
        <div className="col-span-2 text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-semibold">No medical product matches current query parameters.</p>
        </div>
      ) : (
        filteredProducts.map((p) => {
          const cartQty = cart.find(i => i.product.id === p.id)?.quantity || 0;
          const isOutOfStock = p.stock <= 0;

          return (
            <div key={p.id} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] transition-all bg-white relative flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start gap-1">
                  <span
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${(p.color || 'White').toLowerCase() === 'white' ? '#f1f5f9' : (p.color || 'White').toLowerCase()}15`,
                      color: (p.color || 'White').toLowerCase() === 'white' ? '#475569' : (p.color || 'White'),
                      border: `1px solid ${(p.color || 'White').toLowerCase() === 'white' ? '#cbd5e1' : (p.color || 'White')}25`
                    }}
                  >
                    {p.color || 'White'} ({p.dosage || 'Std'})
                  </span>
                  <span className="text-[10px] font-mono font-medium text-slate-400">{p.code}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-2">{p.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{p.category}</p>
              </div>

              <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">M.R.P</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">₹{p.price.toFixed(2)}</span>
                </div>

                {isOutOfStock ? (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 py-1 px-2.5 rounded-lg">
                    Depleted State
                  </span>
                ) : (
                  <button onClick={() => handleAddToCart(p)} className="bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 active:scale-95 shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Add
                    {cartQty > 0 && <span className="bg-white text-emerald-700 w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] ml-1.5">{cartQty}</span>}
                  </button>
                )}
              </div>

              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${p.stock < 100 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500'}`}>
                  Stock: {p.stock}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
