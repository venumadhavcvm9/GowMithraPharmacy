import { Sale } from '../types';

export const initialSales: Sale[] = [
  {
    id: 'TXN-4029',
    customerName: 'Pranay Salavadhi',
    customerPhone: '9876543210',
    items: [
      { productName: 'Paracetamol', dosage: '500mg', price: 15.00, quantity: 2 },
      { productName: 'Cough Syrup (Guaifenesin)', dosage: '100ml', price: 85.00, quantity: 1 }
    ],
    total: 115.00,
    paymentMode: 'UPI',
    timestamp: '2026-06-06 10:30 AM'
  },
  {
    id: 'TXN-4028',
    customerName: 'Bob Smith',
    customerPhone: '7654321098',
    items: [
      { productName: 'Ibuprofen', dosage: '400mg', price: 24.00, quantity: 5 }
    ],
    total: 120.00,
    paymentMode: 'Cash',
    timestamp: '2026-06-06 09:15 AM'
  },
  {
    id: 'TXN-4027',
    customerName: 'Anonymous Walk-in',
    customerPhone: 'N/A',
    items: [
      { productName: 'Omeprazole', dosage: '20mg', price: 52.00, quantity: 1 }
    ],
    total: 52.00,
    paymentMode: 'Cash',
    timestamp: '2026-06-05 07:45 PM'
  }
];
