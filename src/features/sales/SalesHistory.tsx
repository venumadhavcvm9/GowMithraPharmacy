import React from 'react';
import { Sale } from '../../types';
import { useSalesHistory } from './hooks/useSalesHistory';
import { SalesJournalTable } from './components/SalesJournalTable';
import { TransactionInspector } from './components/TransactionInspector';

interface SalesHistoryProps {
  sales: Sale[];
}

export default function SalesHistory({ sales }: SalesHistoryProps) {
  const {
    search, setSearch,
    filterMode, setFilterMode,
    selectedSaleDetail, setSelectedSaleDetail,
    filteredSales
  } = useSalesHistory(sales);

  return (
    <div id="sales-history-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <SalesJournalTable 
        search={search} setSearch={setSearch}
        filterMode={filterMode} setFilterMode={setFilterMode}
        filteredSales={filteredSales}
        setSelectedSaleDetail={setSelectedSaleDetail}
      />
      <TransactionInspector 
        selectedSaleDetail={selectedSaleDetail} 
        setSelectedSaleDetail={setSelectedSaleDetail} 
      />
    </div>
  );
}
