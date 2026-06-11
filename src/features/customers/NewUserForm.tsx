import React from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import { Customer } from '../../types';
import { useNewUserForm } from './hooks/useNewUserForm';
import { PersonalDetails } from './components/PersonalDetails';
import { LocationDetails } from './components/LocationDetails';
import { FormActions } from './components/FormActions';

interface NewUserFormProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export default function NewUserForm({ customers, setCustomers }: NewUserFormProps) {
  const { formData, setFormData, success, handleChange, handleSubmit } = useNewUserForm(customers, setCustomers);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-300">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-10">
            <PersonalDetails formData={formData} handleChange={handleChange} />
            <hr className="border-slate-100" />
            <LocationDetails formData={formData} handleChange={handleChange} />
          </div>
          <FormActions formData={formData} handleChange={handleChange} onClear={() => setFormData({ ...formData })} />
        </form>
      </div>
    </div>
  );
}
