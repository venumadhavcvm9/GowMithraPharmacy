import React from 'react';
import { User, Phone, Lock, ShieldCheck } from 'lucide-react';

interface PersonalDetailsProps {
  formData: any;
  handleChange: (e: any) => void;
}

export function PersonalDetails({ formData, handleChange }: PersonalDetailsProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="e.g. John Doe" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-slate-400"><Phone className="w-4 h-4" /></div>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="e.g. 9876543210" required pattern="[0-9]{10}" maxLength={10} minLength={10} title="Mobile number must be exactly 10 digits" className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-slate-400"><Lock className="w-4 h-4" /></div>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Account Status</label>
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none"><ShieldCheck className="w-4 h-4" /></div>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
