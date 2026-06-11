import React from 'react';
import { ReturnItem, Sale, Product } from '../../types';
import { useReturns } from './hooks/useReturns';
import { NewReturnForm } from './components/NewReturnForm';
import { ReturnsHistoryTable } from './components/ReturnsHistoryTable';

interface ReturnsLogProps {
  returns: ReturnItem[];
  setReturns: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
  sales: Sale[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ReturnsLog({ returns, setReturns, sales, setProducts }: ReturnsLogProps) {
  const returnProps = useReturns(returns, setReturns, sales, setProducts);

  return (
    <div id="returns-log-tabs" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <NewReturnForm {...returnProps} />
      <ReturnsHistoryTable returns={returns} />
    </div>
  );
}
