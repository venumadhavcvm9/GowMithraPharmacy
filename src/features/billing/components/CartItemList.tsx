import React from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { CartItem } from '../../../types';

interface CartItemListProps {
  cart: CartItem[];
  handleUpdateQuantity: (productId: string, delta: number) => void;
  handleRemoveItem: (productId: string) => void;
}

export function CartItemList({ cart, handleUpdateQuantity, handleRemoveItem }: CartItemListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
          <ShoppingBag className="w-12 h-12 text-slate-400 stroke-[1.5] mb-2" />
          <p className="text-xs font-bold text-slate-500">POS Billing Basket is Empty.</p>
          <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Select items with target labels from the medicine catalog to start constructing an invoice receipt.</p>
        </div>
      ) : (
        cart.map((item) => (
          <div key={item.product.id} className="flex justify-between items-center gap-4 border-b border-dashed border-slate-100 pb-3.5 last:border-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-700 text-sm truncate">{item.product.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{item.product.dosage} &bull; ₹{item.product.price.toFixed(2)}/unit</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleUpdateQuantity(item.product.id, -1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition active:scale-95 border border-slate-100">
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono font-bold text-xs w-6 text-center text-slate-800">{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.product.id, 1)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition active:scale-95 border border-slate-100">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="text-right w-20 flex-shrink-0">
              <p className="font-mono font-bold text-slate-800 text-xs">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemoveItem(item.product.id)} className="text-[10px] text-slate-400 hover:text-red-500 transition mt-0.5">Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
