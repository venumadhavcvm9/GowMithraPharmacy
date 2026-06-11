import { useState } from 'react';
import { Customer } from '../../../types';
import { api } from '../../../services/api';

export function useNewUserForm(customers: Customer[], setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>) {
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
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile) return alert('Name & Mobile are required.');

    const checkExisting = customers.find(c => c.phone === formData.mobile.trim());
    if (checkExisting) return alert('A user with this mobile number already exists locally!');

    try {
      await api.post('/users/register', formData).catch(() => console.warn('Backend not running'));

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
        full_name: '', mobile: '', password: '', state_id: '', district_id: '',
        mandal_id: '', constituency_id: '', village_id: '', address: '',
        is_mobile_verified: false, status: 'ACTIVE'
      });

      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {
      alert('Failed to register user.');
    }
  };

  return { formData, setFormData, success, handleChange, handleSubmit };
}
