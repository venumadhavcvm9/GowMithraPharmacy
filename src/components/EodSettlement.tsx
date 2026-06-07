import React, { useState } from 'react';
import { 
  Receipt, 
  Upload, 
  Send, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XSquare, 
  Eye, 
  Printer, 
  FileCheck,
  Plus,
  X
} from 'lucide-react';
import { PendingApproval, Sale } from '../types';

interface EodSettlementProps {
  sales: Sale[];
  pendingApprovals: PendingApproval[];
  setPendingApprovals: React.Dispatch<React.SetStateAction<PendingApproval[]>>;
}

export default function EodSettlement({ sales, pendingApprovals, setPendingApprovals }: EodSettlementProps) {
  // Deposit Cash Form Variables
  const [depositAmount, setDepositAmount] = useState('');
  const [depositReason, setDepositReason] = useState('EOD physical cash courier transfer to HQ');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Lightbox view state
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // EOD calculations
  const cashSales = sales.filter(s => s.paymentMode === 'Cash');
  const upiSales = sales.filter(s => s.paymentMode === 'UPI');

  const cashTotal = cashSales.reduce((acc, s) => acc + s.total, 0);
  const upiTotal = upiSales.reduce((acc, s) => acc + s.total, 0);
  const combinedTotal = cashTotal + upiTotal;

  // Handles simulated receipt image upload via base64 or standard asset selector
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop receipt uploader handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Predefined image presets for easy mock walkthrough testing
  const handleSelectPresetReceipt = (imgUrl: string) => {
    setReceiptImage(imgUrl);
  };

  // Dispatch Cash Deposit to Pending Manager Approvals table
  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Key in a positive decimal amount to deposit.');
      return;
    }

    const defaultSlip = 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600';
    
    const depositLog: PendingApproval = {
      id: `APP-${Math.floor(200 + Math.random() * 800)}`,
      saleTitle: `EOD Settlement - Cash Transfer Summary`,
      amount: amt,
      receiptUrl: receiptImage || defaultSlip,
      reason: depositReason,
      status: 'Pending',
      timestamp: new Date().toLocaleString()
    };

    setPendingApprovals(prev => [depositLog, ...prev]);
    setSuccessMsg(`Deposited Cash of ₹${amt.toFixed(2)} filed successfully! Awaiting manager approval.`);
    setDepositAmount('');
    setReceiptImage(null);

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Update Status callbacks for owner management
  const handleUpdateStatus = (id: string, nextStatus: 'Approved' | 'Rejected') => {
    setPendingApprovals(prev => prev.map(p => 
      p.id === id ? { ...p, status: nextStatus } : p
    ));
  };

  return (
    <div id="eod-settlement-tabs" className="space-y-6">
      
      {/* Top Ledger stats matching "Day Sale" (Online & Cash) sketch wireframes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Day Sale ledger */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider mb-1">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              Day Sale Reconciliation
            </h3>
            <p className="text-xs text-slate-400 font-medium">Daily balances aggregated by payment mode formats.</p>
          </div>

          <div className="space-y-3.5 my-5 pb-4">
            <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/10 flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-slate-800">Cash Receipts Drawer</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{cashSales.length} cash transactions</p>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-base">₹{cashTotal.toFixed(2)}</span>
            </div>

            <div className="bg-purple-650/5 p-4 rounded-xl border border-purple-500/10 flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-slate-800">Online Gateway Total</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{upiSales.length} UPI transactions</p>
              </div>
              <span className="font-mono font-bold text-purple-700 text-base">₹{upiTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Combined totals summaries */}
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-500">Gross Vault Turnover</span>
            <span className="font-mono font-bold text-slate-800 text-lg">₹{combinedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Deposit Cash Module */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmitDeposit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Numeric ledger forms */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Deposit Cash Box</h4>
                <p className="text-xs text-slate-400 font-medium">Courier daily offline cash drawer directly to bank vault.</p>
              </div>

              {successMsg && (
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 font-semibold text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5 text-xs font-semibold">
                <label className="text-slate-500">Physical Cash Transfer Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="e.g. 1500.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1.5 text-xs font-semibold">
                <label className="text-slate-500">Reason / Reference Notes</label>
                <input 
                  type="text" 
                  value={depositReason}
                  onChange={(e) => setDepositReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-700 font-medium"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch & Send for Approval
              </button>
            </div>

            {/* Receipt Upload area - matching "Upload Receipt" arrow in sketch */}
            <div className="space-y-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Upload Bank Cash Deposit slip</span>
              
              <div 
                className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition relative min-h-[160px] ${
                  dragActive ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 bg-slate-50'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {receiptImage ? (
                  <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden p-2 bg-white">
                    <img 
                      src={receiptImage} 
                      alt="uploaded receipt slip" 
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      type="button" 
                      onClick={() => setReceiptImage(null)}
                      className="absolute top-4 right-4 bg-red-500 text-white font-extrabold w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-sm"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-300 mx-auto" />
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Drag Receipt Image Here</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Or browse on machine files</p>
                    </div>
                    <label className="cursor-pointer inline-block bg-slate-200 hover:bg-slate-350 px-3.5 py-1.5 rounded-lg text-[10px] font-semibold text-slate-700 transition">
                      Browse Files
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleReceiptUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Demo Presets for rapid simulation testing */}
              {!receiptImage && (
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-[10px] font-bold text-slate-400">Simulation slips:</span>
                  <button 
                    type="button"
                    onClick={() => handleSelectPresetReceipt('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600')}
                    className="bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded text-[9px] font-semibold text-slate-500"
                  >
                    Slip Preset #1
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSelectPresetReceipt('https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600')}
                    className="bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded text-[9px] font-semibold text-slate-500"
                  >
                    Slip Preset #2
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>

      </div>

      {/* Pending Approvals Table Panel - matching bottom half of page sketch */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Pending Cash Approvals Ledger</h3>
            <p className="text-xs text-slate-400 font-medium">Daily Vault physical reconciliations filed awaiting audit clearances.</p>
          </div>

          <button 
            type="button"
            onClick={() => {
              window.print();
            }}
            className="border border-slate-200 hover:bg-slate-50 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Reconciliation Report
          </button>
        </div>

        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="pb-3 font-medium">Cash Sale Category</th>
                <th className="pb-3 font-medium">Reconciled Amount</th>
                <th className="pb-3 font-medium">Receipt Ticket</th>
                <th className="pb-3 font-medium">Reason Statement</th>
                <th className="pb-3 font-medium">Approved Status</th>
                <th className="pb-3 font-medium text-right">System Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5">
                    <p className="font-semibold text-slate-700 leading-tight">{p.saleTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id} &bull; {p.timestamp}</p>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">₹{p.amount.toFixed(2)}</td>
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptUrl(p.receiptUrl)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg p-2 flex items-center gap-1.5 font-semibold text-[11px] text-slate-600 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Slip
                    </button>
                  </td>
                  <td className="py-3.5 text-slate-500 text-xs truncate max-w-[200px]">{p.reason}</td>
                  <td className="py-3.5 font-semibold">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.status === 'Approved' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : p.status === 'Rejected' 
                        ? 'bg-red-50 text-red-700 font-bold' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-semibold">
                    {p.status === 'Pending' ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(p.id, 'Approved')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition active:scale-95"
                        >
                          Approve Check
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(p.id, 'Rejected')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold text-xs px-3 py-1.5 rounded-lg transition active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 tracking-wider">Locked State</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip image Modal Lightbox */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full relative overflow-hidden flex flex-col p-6 shadow-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedReceiptUrl(null)}
              className="absolute top-4 right-4 bg-slate-800 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-slate-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-slate-800 text-base mb-1 mb-4">Secured Vault Deposit Image Reference</h4>
            <div className="bg-slate-100 border border-slate-200 text-center rounded-2xl overflow-hidden shadow-inner flex items-center justify-center h-[350px]">
              <img 
                src={selectedReceiptUrl} 
                alt="Vault receipt deposit slip slip" 
                className="max-h-[350px] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
