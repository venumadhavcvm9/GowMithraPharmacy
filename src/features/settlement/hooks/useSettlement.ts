import React, { useState } from 'react';
import { Sale, PendingApproval } from '../../../types';
import { api } from '../../../services/api';
import { useDragAndDrop } from './useDragAndDrop';

export function useSettlement(
  sales: Sale[],
  pendingApprovals: PendingApproval[],
  setPendingApprovals: React.Dispatch<React.SetStateAction<PendingApproval[]>>
) {
  const [depositAmount, setDepositAmount] = useState('');
  const [depositReason, setDepositReason] = useState('EOD physical cash courier transfer to HQ');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { dragActive, handleDrag, handleDrop } = useDragAndDrop(setReceiptImage);

  const cashSales = sales.filter(s => s.paymentMode === 'Cash');
  const upiSales = sales.filter(s => s.paymentMode === 'UPI');

  const cashTotal = cashSales.reduce((acc, s) => acc + s.total, 0);
  const upiTotal = upiSales.reduce((acc, s) => acc + s.total, 0);
  
  const approvedDepositsTotal = pendingApprovals
    .filter(p => p.status === 'Approved' && p.saleTitle.includes('Cash Transfer'))
    .reduce((acc, p) => acc + p.amount, 0);
    
  const netCashDrawer = Math.max(0, cashTotal - approvedDepositsTotal);
  const combinedTotal = cashTotal + upiTotal;

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetReceipt = (imgUrl: string) => setReceiptImage(imgUrl);

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return alert('Key in a positive decimal amount to deposit.');
    if (amt > netCashDrawer) return alert(`You cannot dispatch more than your current drawer balance (₹${netCashDrawer.toFixed(2)}).`);

    const finalReceiptUrl = receiptImage || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600';
    
    try {
      const response = await api.post('/pharmacy/settlements', {
        saleTitle: 'EOD Settlement - Cash Transfer Summary',
        amount: amt, receiptUrl: finalReceiptUrl, reason: depositReason
      });

      if (response.success) {
        const sr = response.data;
        const newLog: PendingApproval = {
          id: sr.settlement_id, saleTitle: sr.sale_title, amount: parseFloat(sr.amount),
          receiptUrl: sr.receipt_url, reason: sr.reason, status: sr.status,
          timestamp: new Date(sr.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setPendingApprovals(prev => [newLog, ...prev]);
        setSuccessMsg(`Deposited Cash of ₹${amt.toFixed(2)} filed successfully! Awaiting manager approval.`);
        setDepositAmount(''); setReceiptImage(null);
      }
    } catch (err: any) { alert(`Failed to dispatch settlement to the server: ${err.message}`); }

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return {
    depositAmount, setDepositAmount, depositReason, setDepositReason, receiptImage, setReceiptImage,
    dragActive, successMsg, cashSales, upiSales, netCashDrawer, upiTotal, combinedTotal,
    handleReceiptUpload, handleDrag, handleDrop, handleSelectPresetReceipt, handleSubmitDeposit
  };
}
