import React, { useState } from 'react';
import { Stethoscope, Search, Phone, ShieldPlus, Clock, Building, Plus } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
}

export default function DoctorDirectory({ doctors, setDoctors }: DoctorDirectoryProps) {
  const [search, setSearch] = useState('');
  
  // Custom Registration Form variables
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [availability, setAvailability] = useState('');
  const [clinic, setClinic] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
    doc.clinic.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty || !phone) {
      alert('Fill in the Name, Specialty, and Phone of the medical practitioner.');
      return;
    }

    const doc: Doctor = {
      id: `doc_${Date.now()}`,
      name: `Dr. ${name.replace(/^Dr\.\s+/i, '')}`,
      specialty,
      phone,
      availability: availability || 'By Appointment Only',
      clinic: clinic || 'Private Practice'
    };

    setDoctors(prev => [...prev, doc]);
    setShowAddForm(false);
    setName('');
    setSpecialty('');
    setPhone('');
    setAvailability('');
    setClinic('');
  };

  return (
    <div id="doctors-directory-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Search & Main Directory List (8-cols) */}
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
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search specialty, name, or clinic..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs w-64 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Dr.
            </button>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-2 text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">No medical doctors match current search terms.</p>
            </div>
          ) : (
            filteredDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow relative bg-white space-y-3.5"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="p-3.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                      {doc.specialty}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-medium">{doc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Availability: {doc.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Clinic: {doc.clinic}</span>
                  </div>
                </div>

                {/* Direct Dial Action */}
                <div className="pt-2 text-right">
                  <a 
                    href={`tel:${doc.phone}`}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    Click to Dial
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Register Practitioner overlay form (4-cols) */}
      <div className="lg:col-span-4">
        {showAddForm ? (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
              <ShieldPlus className="w-4 h-4 text-emerald-500" />
              Register Practitioner
            </h3>
            <p className="text-xs text-slate-400 font-medium">Add practitioners to the local business directories.</p>
            
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500">Doctor Name (Sur-name)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sarah Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Medical Specialty</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pediatrician / Cardiologist"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Phone</label>
                <input 
                  type="text" 
                  placeholder="e.g. 9440121314"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Consultation Timings</label>
                <input 
                  type="text" 
                  placeholder="e.g. 9:00 AM - 1:00 PM"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500">Affiliated Clinic / Hospital</label>
                <input 
                  type="text" 
                  placeholder="e.g. Heart Care Center"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-slate-800 font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition"
            >
              Register Practitioner
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-center text-center py-14 h-60 text-slate-400">
            <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold">New Practitioner Entry</p>
            <p className="text-[10px] text-slate-400 mt-1">Want to expand your prescriber contacts database? Click the add button above to file a new record instantly.</p>
          </div>
        )}
      </div>

    </div>
  );
}
