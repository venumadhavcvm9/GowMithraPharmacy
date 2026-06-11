import React from 'react';
import { Stethoscope, Search, Phone, Clock, Building, Plus } from 'lucide-react';
import { Doctor } from '../../../types';

interface DirectoryListProps {
  search: string;
  setSearch: (val: string) => void;
  showAddForm: boolean;
  setShowAddForm: (val: boolean) => void;
  filteredDoctors: Doctor[];
}

export function DirectoryList({ search, setSearch, showAddForm, setShowAddForm, filteredDoctors }: DirectoryListProps) {
  return (
    <div className="lg:col-span-8 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-emerald-500" />
            Area Doctors & Prescriber Directory
          </h3>
          <p className="text-xs text-slate-400 font-medium">Verify credentials, cross-reference prescriptions, or consult regional medical staff.</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search specialty, name, or clinic..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs w-64 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Add Dr.
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-semibold">No medical doctors match current search terms.</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div key={doc.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow relative bg-white space-y-3.5">
              <div className="flex gap-3.5 items-start">
                <div className="p-3.5 bg-emerald-500/10 text-emerald-600 rounded-xl"><Stethoscope className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">{doc.specialty}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /><span className="font-mono font-medium">{doc.phone}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" /><span>Availability: {doc.availability}</span></div>
                <div className="flex items-center gap-2"><Building className="w-3.5 h-3.5 text-slate-400" /><span className="truncate">Clinic: {doc.clinic}</span></div>
              </div>
              <div className="pt-2 text-right">
                <a href={`tel:${doc.phone}`} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1">Click to Dial</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
