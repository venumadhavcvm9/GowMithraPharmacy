import { useState } from 'react';
import { Sale } from '../../../types';

export function useSalesHistory(sales: Sale[]) {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'All' | 'Cash' | 'UPI'>('All');
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<Sale | null>(null);

  const filteredSales = sales.filter((s) => {
    const matchesSearch = s.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          s.id.toLowerCase().includes(search.toLowerCase()) ||
                          s.customerPhone.includes(search);
    const matchesMode = filterMode === 'All' || s.paymentMode === filterMode;
    return matchesSearch && matchesMode;
  });

  return {
    search, setSearch,
    filterMode, setFilterMode,
    selectedSaleDetail, setSelectedSaleDetail,
    filteredSales
  };
}
