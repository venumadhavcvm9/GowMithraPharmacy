import React from 'react';
import { Undo2 } from 'lucide-react';
import { ReturnSearch } from './ReturnSearch';
import { ReturnDetailsForm } from './ReturnDetailsForm';

interface NewReturnFormProps {
  saleSearch: string;
  setSaleSearch: (val: string) => void;
  matchedSale: any;
  searchError: string;
  selectedProductIdx: number;
  setSelectedProductIdx: (val: number) => void;
  returnQty: number;
  setReturnQty: (val: number) => void;
  returnReason: string;
  setReturnReason: (val: string) => void;
  successInfo: string;
  handleLocateSale: () => void;
  handleSubmitReturn: (e: React.FormEvent) => void;
}

export function NewReturnForm({
  saleSearch, setSaleSearch, matchedSale, searchError,
  selectedProductIdx, setSelectedProductIdx,
  returnQty, setReturnQty, returnReason, setReturnReason,
  successInfo, handleLocateSale, handleSubmitReturn
}: NewReturnFormProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-5">
      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
        <Undo2 className="w-4 h-4 text-emerald-500" /> Log Customer Product Return
      </h3>
      <p className="text-xs text-slate-400 font-medium">Re-shelf pharmaceuticals and process cash/UPI credits immediately on approved returns.</p>

      <ReturnSearch 
        saleSearch={saleSearch} setSaleSearch={setSaleSearch}
        searchError={searchError} successInfo={successInfo} handleLocateSale={handleLocateSale}
      />

      {matchedSale && (
        <ReturnDetailsForm 
          matchedSale={matchedSale} selectedProductIdx={selectedProductIdx}
          setSelectedProductIdx={setSelectedProductIdx} returnQty={returnQty}
          setReturnQty={setReturnQty} returnReason={returnReason} setReturnReason={setReturnReason}
          handleSubmitReturn={handleSubmitReturn}
        />
      )}
    </div>
  );
}
