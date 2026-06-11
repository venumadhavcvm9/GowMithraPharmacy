import React from 'react';
import { Map, Building2 } from 'lucide-react';

interface LocationDetailsProps {
  formData: any;
  handleChange: (e: any) => void;
}

export function LocationDetails({ formData, handleChange }: LocationDetailsProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Map className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800">Geographic Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">State</label>
          <select name="state_id" value={formData.state_id} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
            <option value="">Select State</option>
            <option value="1">Andhra Pradesh</option>
            <option value="2">Telangana</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">District</label>
          <select name="district_id" value={formData.district_id} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
            <option value="">Select District</option>
            <option value="1">Guntur</option>
            <option value="2">Krishna</option>
            <option value="3">Hyderabad</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Constituency</label>
          <select name="constituency_id" value={formData.constituency_id} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
            <option value="">Select</option>
            <option value="1">Constituency A</option>
            <option value="2">Constituency B</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Mandal</label>
          <select name="mandal_id" value={formData.mandal_id} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
            <option value="">Select Mandal</option>
            <option value="1">Mandal X</option>
            <option value="2">Mandal Y</option>
          </select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Village</label>
          <select name="village_id" value={formData.village_id} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none">
            <option value="">Select Village</option>
            <option value="1">Village 1</option>
            <option value="2">Village 2</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Complete Address</label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-slate-400"><Building2 className="w-4 h-4" /></div>
          <textarea name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Enter door number, street, and landmarks..." required className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"></textarea>
        </div>
      </div>
    </section>
  );
}
