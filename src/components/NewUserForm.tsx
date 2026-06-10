import React, { useState } from 'react';
import { User, Phone, Lock, MapPin, CheckCircle, UserPlus, ShieldCheck, Map, Building2 } from 'lucide-react';
import { Customer } from '../types';
import { api } from '../services/api';

interface NewUserFormProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export default function NewUserForm({ customers, setCustomers }: NewUserFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    password: '',
    state_id: '',
    district_id: '',
    mandal_id: '',
    constituency_id: '',
    village_id: '',
    address: '',
    is_mobile_verified: false,
    status: 'ACTIVE'
  });

  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile) {
      alert('Name & Mobile are required.');
      return;
    }

    const checkExisting = customers.find(c => c.phone === formData.mobile.trim());
    if (checkExisting) {
      alert('A user with this mobile number already exists locally!');
      return;
    }

    try {
      await api.post('/users/register', formData).catch(() => console.warn('Backend not running, saving locally only'));

      const newCust: Customer = {
        id: `c_${Date.now()}`,
        name: formData.full_name.trim(),
        phone: formData.mobile.trim(),
        email: 'walkin@gowmithra.com',
        outstandingBalance: 0,
        ...formData
      };

      setCustomers(prev => [...prev, newCust]);
      setSuccess(`Customer profile for "${formData.full_name}" created successfully.`);
      
      setFormData({
        full_name: '',
        mobile: '',
        password: '',
        state_id: '',
        district_id: '',
        mandal_id: '',
        constituency_id: '',
        village_id: '',
        address: '',
        is_mobile_verified: false,
        status: 'ACTIVE'
      });

      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {
      alert('Failed to register user.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-200 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
            <UserPlus className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Register Customer</h1>
            <p className="text-sm text-slate-500 mt-1">Create a new customer profile in the system securely.</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          
          <div className="p-8 space-y-10">
            
            {/* Section 1: Personal Details */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800">Personal Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleChange} 
                      placeholder="e.g. John Doe"
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input 
                      type="tel" 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange} 
                      placeholder="e.g. 9876543210"
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder="••••••••"
                      required 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Account Status</label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none appearance-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Section 2: Location Data */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Map className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800">Geographic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">State</label>
                  <select 
                    name="state_id" 
                    value={formData.state_id} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  >
                    <option value="">Select State</option>
                    <option value="1">Andhra Pradesh</option>
                    <option value="2">Telangana</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">District</label>
                  <select 
                    name="district_id" 
                    value={formData.district_id} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  >
                    <option value="">Select District</option>
                    <option value="1">Guntur</option>
                    <option value="2">Krishna</option>
                    <option value="3">Hyderabad</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Constituency</label>
                  <select 
                    name="constituency_id" 
                    value={formData.constituency_id} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  >
                    <option value="">Select Constituency</option>
                    <option value="1">Constituency A</option>
                    <option value="2">Constituency B</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mandal</label>
                  <select 
                    name="mandal_id" 
                    value={formData.mandal_id} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  >
                    <option value="">Select Mandal</option>
                    <option value="1">Mandal X</option>
                    <option value="2">Mandal Y</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Village</label>
                  <select 
                    name="village_id" 
                    value={formData.village_id} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none"
                  >
                    <option value="">Select Village</option>
                    <option value="1">Village 1</option>
                    <option value="2">Village 2</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Complete Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Enter door number, street, and landmarks..." 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-colors outline-none resize-none"
                  ></textarea>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="is_mobile_verified" 
                  checked={formData.is_mobile_verified} 
                  onChange={handleChange} 
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700">Mobile Verified</span>
                <span className="text-[11px] text-slate-500">Ensure the number was verified via OTP</span>
              </div>
            </label>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => setFormData({...formData})} 
                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear Form
              </button>
              <button 
                type="submit" 
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Register Customer
              </button>
            </div>

          </div>

        </form>
      </div>

    </div>
  );
}
