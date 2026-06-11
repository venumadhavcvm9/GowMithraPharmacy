import React, { useState } from 'react';
import { Customer } from '../../../types';
import { api } from '../../../services/api';

export function useCustomerSearch(customers: Customer[], setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>) {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lookupFeedback, setLookupFeedback] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({ type: null, message: '' });

  const handleFetchCustomer = async () => {
    if (!phoneSearch.trim()) return setLookupFeedback({ type: 'info', message: 'Enter a customer Name or Phone first.' });

    const cleaned = phoneSearch.trim().toLowerCase();
    const isMobile = /^[0-9]{10}$/.test(cleaned);

    if (isMobile) {
      try {
        const response = await api.get(`/pharmacy/users/mobile/${cleaned}`);
        if (response.success && response.data) {
          const user = response.data;
          const customer: Customer = {
            id: user.id ? `u_${user.id}` : `c_${Date.now()}`,
            name: user.full_name || 'Unknown',
            phone: user.mobile || cleaned,
            email: 'walkin@rxpharmacy.net',
            outstandingBalance: 0.00
          };
          setSelectedCustomer(customer); setPhoneSearch(customer.phone);
          setLookupFeedback({ type: 'success', message: `Successfully loaded database file for: ${customer.name}` });
          setCustomers(prev => prev.find(c => c.phone === customer.phone) ? prev : [...prev, customer]);
          return;
        }
      } catch (err) { console.error(err); }
    }

    const found = customers.find(c => c.phone.includes(cleaned) || c.name.toLowerCase().includes(cleaned));
    if (found) {
      setSelectedCustomer(found); setPhoneSearch(found.phone);
      setLookupFeedback({ type: 'success', message: `Successfully loaded database file for: ${found.name}` });
    } else {
      setSelectedCustomer(null);
      setLookupFeedback({ type: 'error', message: 'No record found under that name/phone. You can register them below.' });
    }
  };

  return { phoneSearch, setPhoneSearch, selectedCustomer, setSelectedCustomer, lookupFeedback, setLookupFeedback, handleFetchCustomer };
}
