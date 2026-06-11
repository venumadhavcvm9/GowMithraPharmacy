import React from 'react';
import { DepositForm } from './DepositForm';
import { ReceiptUploader } from './ReceiptUploader';

interface DepositCashBoxProps {
  depositAmount: string;
  setDepositAmount: (val: string) => void;
  depositReason: string;
  setDepositReason: (val: string) => void;
  receiptImage: string | null;
  setReceiptImage: (val: string | null) => void;
  dragActive: boolean;
  successMsg: string;
  handleSubmitDeposit: (e: React.FormEvent) => void;
  handleReceiptUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleSelectPresetReceipt: (url: string) => void;
}

export function DepositCashBox({
  depositAmount, setDepositAmount, depositReason, setDepositReason,
  receiptImage, setReceiptImage, dragActive, successMsg,
  handleSubmitDeposit, handleReceiptUpload, handleDrag, handleDrop, handleSelectPresetReceipt
}: DepositCashBoxProps) {
  return (
    <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmitDeposit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepositForm 
          depositAmount={depositAmount} setDepositAmount={setDepositAmount}
          depositReason={depositReason} setDepositReason={setDepositReason}
          successMsg={successMsg}
        />
        <ReceiptUploader 
          receiptImage={receiptImage} setReceiptImage={setReceiptImage}
          dragActive={dragActive} handleDrag={handleDrag} handleDrop={handleDrop}
          handleReceiptUpload={handleReceiptUpload} handleSelectPresetReceipt={handleSelectPresetReceipt}
        />
      </form>
    </div>
  );
}
