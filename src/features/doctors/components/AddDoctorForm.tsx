import React from 'react';
import { ShieldPlus, Building } from 'lucide-react';

interface AddDoctorFormProps {
  showAddForm: boolean;
  name: string; setName: (val: string) => void;
  specialty: string; setSpecialty: (val: string) => void;
  phone: string; setPhone: (val: string) => void;
  availability: string; setAvailability: (val: string) => void;
  clinic: string; setClinic: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function AddDoctorForm({
  showAddForm,
  name, setName, specialty, setSpecialty,
  phone, setPhone, availability, setAvailability,
  clinic, setClinic, handleSubmit
}: AddDoctorFormProps) {
  return (
    <div className="lg:col-span-4">
      {showAddForm ? (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
            <ShieldPlus className="w-4 h-4 text-emerald-500" /> Register Practitioner
          </h3>
          <p className="text-xs text-slate-400 font-medium">Add practitioners to the local business directories.</p>
          
          <div className="space-y-3.5 text-xs font-semibold">
            <div className="space-y-1"><label className="text-slate-500">Doctor Name (Sur-name)</label><input type="text" placeholder="e.g. Sarah Carter" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium" required /></div>
            <div className="space-y-1"><label className="text-slate-500">Medical Specialty</label><input type="text" placeholder="e.g. Pediatrician / Cardiologist" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium" required /></div>
            <div className="space-y-1"><label className="text-slate-500">Phone</label><input type="text" placeholder="e.g. 9440121314" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-mono" required /></div>
            <div className="space-y-1"><label className="text-slate-500">Consultation Timings</label><input type="text" placeholder="e.g. 9:00 AM - 1:00 PM" value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium" /></div>
            <div className="space-y-1"><label className="text-slate-500">Affiliated Clinic / Hospital</label><input type="text" placeholder="e.g. Heart Care Center" value={clinic} onChange={(e) => setClinic(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium" /></div>
          </div>
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition">Register Practitioner</button>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-center text-center py-14 h-60 text-slate-400">
          <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold">New Practitioner Entry</p>
          <p className="text-[10px] text-slate-400 mt-1">Want to expand your prescriber contacts database? Click the add button above to file a new record instantly.</p>
        </div>
      )}
    </div>
  );
}
