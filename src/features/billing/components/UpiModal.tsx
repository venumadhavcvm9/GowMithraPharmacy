import React from 'react';
import { Check } from 'lucide-react';
import QRCode from 'react-qr-code';

interface UpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export function UpiModal({ isOpen, onClose, onSuccess, amount }: UpiModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
        <div className="bg-slate-900 text-white p-5 text-center relative">
          <h4 className="font-bold text-lg tracking-tight">Scan to Pay</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">UPI P2P Gateway</p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        <div className="p-6 flex flex-col items-center space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</span>
            <div className="font-mono text-3xl font-bold text-emerald-600 mt-1">
              ₹{amount.toFixed(2)}
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-emerald-100">
            <QRCode
              value={`upi://pay?pa=test@upi&pn=GowMithra_Pharmacy&am=${amount.toFixed(2)}&cu=INR`}
              size={200}
              level="H"
            />
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-slate-600">Waiting for customer payment...</p>
            <p className="text-[10px] text-slate-400 mt-1">Ask the customer to scan this QR with GPay, PhonePe, or Paytm.</p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={() => {
              onClose();
              onSuccess();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <Check className="w-4 h-4" />
            Verify Payment & Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
