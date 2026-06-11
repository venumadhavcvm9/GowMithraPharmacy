import { useState } from 'react';
import { Customer, Product, Sale, CartItem } from '../../../types';
import { api } from '../../../services/api';

export function useCheckout(
  cart: CartItem[], setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  selectedCustomer: Customer | null, setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>,
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>
) {
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI'>('Cash');
  const [checkedOutSale, setCheckedOutSale] = useState<Sale | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);

  const subtotal = cart.reduce((val, i) => val + (i.product.price * i.quantity), 0);
  const grandTotal = subtotal;

  const finalizeCheckout = async () => {
    const currentCustomerName = selectedCustomer ? selectedCustomer.name : 'Walk-in Customer';
    const currentCustomerPhone = selectedCustomer ? selectedCustomer.phone : 'N/A';

    try {
      const payload = {
        customerName: currentCustomerName,
        customerPhone: currentCustomerPhone,
        items: cart.map(item => ({ id: item.product.id, productName: item.product.name, dosage: item.product.dosage, price: item.product.price, quantity: item.quantity })),
        total: parseFloat(grandTotal.toFixed(2)),
        paymentMode: paymentMode
      };

      const response = await api.post('/pharmacy/checkout', payload);
      const dbSale = response.data;

      const newSale: Sale = {
        id: dbSale.transaction_id || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: payload.customerName, customerPhone: payload.customerPhone,
        items: payload.items, total: payload.total,
        paymentMode: payload.paymentMode as 'Cash' | 'UPI',
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
      };

      setProducts(prev => prev.map(p => {
        const orderedItem = cart.find(item => item.product.id === p.id);
        if (orderedItem) return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        return p;
      }));

      if (selectedCustomer && selectedCustomer.outstandingBalance > 0) {
        setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, outstandingBalance: 0.00 } : c));
        setSelectedCustomer(prev => prev ? { ...prev, outstandingBalance: 0.00 } : null);
      }

      setSales(prev => [newSale, ...prev]);
      setCheckedOutSale(newSale);
      setIsInvoiceOpen(true);
      setCart([]);
    } catch (err) { alert('Checkout failed! Could not reach the backend.'); }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Your billing counter is empty! Please add products before checking out.');
    if (paymentMode === 'UPI') setIsUpiModalOpen(true);
    else finalizeCheckout();
  };

  return { paymentMode, setPaymentMode, checkedOutSale, isInvoiceOpen, setIsInvoiceOpen, isUpiModalOpen, setIsUpiModalOpen, subtotal, grandTotal, finalizeCheckout, handleCheckout };
}
