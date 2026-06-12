import React from 'react';
import { Sale, PendingApproval } from '../../types';
import { useSettlement } from './hooks/useSettlement';
import { ReconciliationStats } from './components/ReconciliationStats';
import { DepositCashBox } from './components/DepositCashBox';
import { PendingApprovalsLedger } from './components/PendingApprovalsLedger';

interface EodSettlementProps {
  sales: Sale[];
  pendingApprovals: PendingApproval[];
  setPendingApprovals: React.Dispatch<React.SetStateAction<PendingApproval[]>>;
}

export default function EodSettlement({ sales, pendingApprovals, setPendingApprovals }: EodSettlementProps) {
  const settlement = useSettlement(sales, pendingApprovals, setPendingApprovals);

  return (
    <div id="eod-settlement-tabs" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ReconciliationStats
          cashSales={settlement.cashSales}
          upiSales={settlement.upiSales}
          netCashDrawer={settlement.netCashDrawer}
          upiTotal={settlement.upiTotal}
          combinedTotal={settlement.combinedTotal}
        />
        <DepositCashBox
          depositAmount={settlement.depositAmount}
          setDepositAmount={settlement.setDepositAmount}
          depositReason={settlement.depositReason}
          setDepositReason={settlement.setDepositReason}
          receiptImage={settlement.receiptImage}
          setReceiptImage={settlement.setReceiptImage}
          dragActive={settlement.dragActive}
          successMsg={settlement.successMsg}
          errorMsg={settlement.errorMsg}
          handleSubmitDeposit={settlement.handleSubmitDeposit}
          handleReceiptUpload={settlement.handleReceiptUpload}
          handleDrag={settlement.handleDrag}
          handleDrop={settlement.handleDrop}
          handleSelectPresetReceipt={settlement.handleSelectPresetReceipt}
        />
      </div>

      <PendingApprovalsLedger pendingApprovals={pendingApprovals} />
    </div>
  );
}
