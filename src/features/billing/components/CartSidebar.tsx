import React from 'react';
import { FileCheck2, Trash2 } from 'lucide-react';
import { CartItem, Customer } from '../../../types';
import { CartItemList } from './CartItemList';
import { CartFooter } from './CartFooter';

interface CartSidebarProps {
  cart: CartItem[];
  handleResetWorkspace: () => void;
  handleUpdateQuantity: (productId: string, delta: number) => void;
  handleRemoveItem: (productId: string) => void;
  subtotal: number;
  grandTotal: number;
  selectedCustomer: Customer | null;
  paymentMode: 'Cash' | 'UPI';
  setPaymentMode: (mode: 'Cash' | 'UPI') => void;
  handleCheckout: () => void;
}

export function CartSidebar({
  cart, handleResetWorkspace, handleUpdateQuantity, handleRemoveItem,
  subtotal, grandTotal, selectedCustomer, paymentMode, setPaymentMode, handleCheckout
}: CartSidebarProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col h-[520px] justify-between overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-500" /> Active Order Receipt
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Counter Terminal #019</p>
        </div>
        {cart.length > 0 && (
          <button onClick={handleResetWorkspace} className="text-[10px] text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Clear POS
          </button>
        )}
      </div>

      <CartItemList cart={cart} handleUpdateQuantity={handleUpdateQuantity} handleRemoveItem={handleRemoveItem} />
      
      <CartFooter 
        cartLength={cart.length} subtotal={subtotal} grandTotal={grandTotal} 
        selectedCustomer={selectedCustomer} paymentMode={paymentMode} 
        setPaymentMode={setPaymentMode} handleCheckout={handleCheckout} 
      />
    </div>
  );
}
