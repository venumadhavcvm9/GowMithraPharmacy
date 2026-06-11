import { Customer } from '../types';

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Pranay Salavadhi',
    phone: '9876543210',
    email: 'pranaysalavadhi@gmail.com',
    outstandingBalance: 12.50
  },
  {
    id: 'c2',
    name: 'Alice Johnson',
    phone: '8765432109',
    email: 'alice.j@example.com',
    outstandingBalance: 0.00
  },
  {
    id: 'c3',
    name: 'Bob Smith',
    phone: '7654321098',
    email: 'bob.smith@example.com',
    outstandingBalance: 45.00
  },
  {
    id: 'c4',
    name: 'Diana Prince',
    phone: '9988776655',
    email: 'diana.prince@example.com',
    outstandingBalance: 0.00
  }
];
