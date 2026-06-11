import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FormActionsProps {
  formData: any;
  handleChange: (e: any) => void;
  onClear: () => void;
}

export function FormActions({ formData, handleChange, onClear }: FormActionsProps) {
  return (
    <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input type="checkbox" name="is_mobile_verified" checked={formData.is_mobile_verified} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">Mobile Verified</span>
          <span className="text-[11px] text-slate-500">Ensure the number was verified via OTP</span>
        </div>
      </label>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button type="button" onClick={onClear} className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Clear Form
        </button>
        <button type="submit" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm">
          <CheckCircle className="w-4 h-4" />
          Register Customer
        </button>
      </div>
    </div>
  );
}
