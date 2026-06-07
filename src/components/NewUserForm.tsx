import React, { useState } from 'react';
import { UserPlus, Star, ShieldAlert, Sparkles, Phone, Mail, Trash2 } from 'lucide-react';
import { Customer } from '../types';

interface NewUserFormProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export default function NewUserForm({ customers, setCustomers }: NewUserFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [initialBal, setInitialBal] = useState<number>(0);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Name & Phone coordinates are required.');
      return;
    }

    const checkExisting = customers.find(c => c.phone === phone.trim());
    if (checkExisting) {
      alert('A patient or buyer record with this phone number already exists!');
      return;
    }

    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'walkin@rxpharmacy.net',
      outstandingBalance: initialBal
    };

    setCustomers(prev => [...prev, newCust]);
    setSuccess(`Customer profile "${name}" successfully registered!`);
    setName('');
    setPhone('');
    setEmail('');
    setInitialBal(0);

    setTimeout(() => setSuccess(''), 4000);
  };

  const handleDeleteCust = (id: string) => {
    const checkOnBalance = customers.find(c => c.id === id);
    if (checkOnBalance && checkOnBalance.outstandingBalance > 0) {
      alert('Forbidden! Cannot delete accounts with non-zero outstanding balances.');
      return;
    }
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div id="new-user-tabs" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Registration Form (5 Colors) */}
      <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
          <UserPlus className="w-4 h-4 text-emerald-500" />
          Add Customer / Patient Profile
        </h3>
        <p className="text-xs text-slate-400 font-medium pb-2 border-b border-slate-105">
          Establish customer accounts to track prescription histories and credit outstanding ledger logs.
        </p>

        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 font-semibold text-xs flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            {success}
          </div>
        )}

        <div className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-slate-500">FullName Account Registered</label>
            <input 
              type="text" 
              placeholder="e.g. Pranay Salavadhi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white font-medium text-slate-800"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500">Active Mobile Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 text-xs outline-none focus:bg-white font-mono text-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500">Email Address (Invoicing)</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input 
                type="email" 
                placeholder="e.g. patient@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 text-xs outline-none focus:bg-white font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1 pb-2">
            <div className="flex justify-between items-center">
              <label className="text-slate-500">Opening Outstanding Ledger (₹)</label>
              <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">Unpaid Credit</span>
            </div>
            <input 
              type="number" 
              step="0.01"
              value={initialBal}
              onChange={(e) => setInitialBal(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-slate-800/10"
        >
          Register Customer Profile
        </button>
      </form>

      {/* Customer Directory List */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider mb-2">
          <Star className="w-4 h-4 text-emerald-500" />
          Active Account Ledger Directory
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-4">Patient profiling list. Profiles here are searchable directly within the Shop/Billing POS counter.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="pb-3 font-medium">Customer Profile</th>
                <th className="pb-3 font-medium">Phone Number</th>
                <th className="pb-3 font-medium">Email Coordinates</th>
                <th className="pb-3 font-medium">Outstanding Bal</th>
                <th className="pb-3 font-medium text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold text-slate-700">{c.name}</td>
                  <td className="py-3 font-mono text-xs text-slate-600">{c.phone}</td>
                  <td className="py-3 text-slate-500">{c.email}</td>
                  <td className="py-3">
                    <span className={`font-mono text-xs font-bold ${c.outstandingBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      ₹{c.outstandingBalance.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => handleDeleteCust(c.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
