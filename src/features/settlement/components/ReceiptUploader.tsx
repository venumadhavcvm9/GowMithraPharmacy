import React from 'react';
import { Upload } from 'lucide-react';

interface ReceiptUploaderProps {
  receiptImage: string | null;
  setReceiptImage: (val: string | null) => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleReceiptUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectPresetReceipt: (url: string) => void;
}

export function ReceiptUploader({ receiptImage, setReceiptImage, dragActive, handleDrag, handleDrop, handleReceiptUpload, handleSelectPresetReceipt }: ReceiptUploaderProps) {
  return (
    <div className="space-y-3.5 flex flex-col justify-between">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Upload Bank Cash Deposit slip</span>
      <div
        className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition relative min-h-[160px] ${dragActive ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 bg-slate-50'}`}
        onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
      >
        {receiptImage ? (
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden p-2 bg-white">
            <img src={receiptImage} alt="uploaded receipt slip" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
            <button type="button" onClick={() => setReceiptImage(null)} className="absolute top-4 right-4 bg-red-500 text-white font-extrabold w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-sm">&times;</button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-slate-300 mx-auto" />
            <div>
              <p className="text-xs font-semibold text-slate-600">Drag Receipt Image Here</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Or browse on machine files</p>
            </div>
            <label className="cursor-pointer inline-block bg-slate-200 hover:bg-slate-350 px-3.5 py-1.5 rounded-lg text-[10px] font-semibold text-slate-700 transition">
              Browse Files<input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>
      {!receiptImage && (
        <div className="flex gap-2 justify-center items-center">
          <span className="text-[10px] font-bold text-slate-400">Simulation slips:</span>
          <button type="button" onClick={() => handleSelectPresetReceipt('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600')} className="bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded text-[9px] font-semibold text-slate-500">Slip Preset #1</button>
          <button type="button" onClick={() => handleSelectPresetReceipt('https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600')} className="bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded text-[9px] font-semibold text-slate-500">Slip Preset #2</button>
        </div>
      )}
    </div>
  );
}
