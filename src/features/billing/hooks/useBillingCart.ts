import { useState } from 'react';
import { Product, Customer, Sale } from '../../../types';
import { useCustomerSearch } from './useCustomerSearch';
import { useCartState } from './useCartState';
import { useCheckout } from './useCheckout';

export function useBillingCart(
  products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  customers: Customer[], setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
  sales: Sale[], setSales: React.Dispatch<React.SetStateAction<Sale[]>>
) {
  const customerProps = useCustomerSearch(customers, setCustomers);
  const cartProps = useCartState();
  const checkoutProps = useCheckout(
    cartProps.cart, cartProps.setCart,
    customerProps.selectedCustomer, customerProps.setSelectedCustomer,
    setCustomers, setProducts, setSales
  );

  const [productQuery, setProductQuery] = useState('');
  const [colorFilter, setColorFilter] = useState('All');

  const colorsList = ['All', ...Array.from(new Set(products.map(p => p.color)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes((productQuery || '').toLowerCase()) ||
      (p.code || '').toLowerCase().includes((productQuery || '').toLowerCase());
    const matchesColor = colorFilter === 'All' || p.color === colorFilter;
    return matchesSearch && matchesColor;
  });

  const handleResetWorkspace = () => {
    cartProps.setCart([]);
    customerProps.setSelectedCustomer(null);
    customerProps.setPhoneSearch('');
    customerProps.setLookupFeedback({ type: null, message: '' });
  };

  return {
    ...customerProps,
    ...cartProps,
    ...checkoutProps,
    productQuery, setProductQuery,
    colorFilter, setColorFilter,
    colorsList, filteredProducts,
    handleResetWorkspace
  };
}
