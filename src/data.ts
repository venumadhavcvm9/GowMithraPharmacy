import { Product, Customer, Doctor, Sale, PendingApproval, ReturnItem } from './types';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Paracetamol',
    price: 15.00,
    stock: 240,
    category: 'Tablets',
    color: 'Blue',
    code: 'PCM-500',
    dosage: '500mg'
  },
  {
    id: 'p2',
    name: 'Amoxicillin',
    price: 45.50,
    stock: 85,
    category: 'Capsule',
    color: 'Yellow',
    code: 'AMX-250',
    dosage: '250mg'
  },
  {
    id: 'p3',
    name: 'Ibuprofen',
    price: 24.00,
    stock: 120,
    category: 'Tablets',
    color: 'Red',
    code: 'IBU-400',
    dosage: '400mg'
  },
  {
    id: 'p4',
    name: 'Cough Syrup (Guaifenesin)',
    price: 85.00,
    stock: 50,
    category: 'Syrup',
    color: 'Orange',
    code: 'COF-100',
    dosage: '100ml'
  },
  {
    id: 'p5',
    name: 'Atorvastatin',
    price: 110.00,
    stock: 150,
    category: 'Tablets',
    color: 'White',
    code: 'ATV-20',
    dosage: '20mg'
  },
  {
    id: 'p6',
    name: 'Metformin Hydrochloride',
    price: 35.00,
    stock: 300,
    category: 'Tablets',
    color: 'Green',
    code: 'MET-850',
    dosage: '850mg'
  },
  {
    id: 'p7',
    name: 'Loratadine',
    price: 18.20,
    stock: 180,
    category: 'Tablets',
    color: 'Blue',
    code: 'LOR-10',
    dosage: '10mg'
  },
  {
    id: 'p8',
    name: 'Omeprazole',
    price: 52.00,
    stock: 95,
    category: 'Capsule',
    color: 'Purple',
    code: 'OMP-20',
    dosage: '20mg'
  }
];

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

export const initialDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Carter',
    specialty: 'General Physician',
    phone: '9440121314',
    availability: '9:00 AM - 1:00 PM',
    clinic: 'Metro Health Care'
  },
  {
    id: 'd2',
    name: 'Dr. James Anderson',
    specialty: 'Pediatrician',
    phone: '9440556677',
    availability: '4:00 PM - 8:00 PM',
    clinic: 'Apollo Childrens Ward'
  },
  {
    id: 'd3',
    name: 'Dr. Rebecca Foster',
    specialty: 'Cardiologist',
    phone: '9880112233',
    availability: '11:00 AM - 3:00 PM',
    clinic: 'Heart Care Center'
  }
];

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

export const initialPendingApprovals: PendingApproval[] = [
  {
    id: 'APP-101',
    saleTitle: 'EOD Settlement - Cash Deposit Batch #42',
    amount: 1500.00,
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600', // Sample image representing cash receipt slip
    reason: 'Daily offline cash drawer transfer',
    status: 'Pending',
    timestamp: '2026-06-05 09:30 PM'
  },
  {
    id: 'APP-102',
    saleTitle: 'Counter Float Excess Reconciliation',
    amount: 250.00,
    receiptUrl: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600',
    reason: 'Adjustment for high-volume float cash',
    status: 'Pending',
    timestamp: '2026-06-06 08:00 AM'
  },
  {
    id: 'APP-103',
    saleTitle: 'Pre-Approved Supplier Refund Note',
    amount: 85.00,
    receiptUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=600',
    reason: 'Damaged pills batch refund from distributor',
    status: 'Approved',
    timestamp: '2026-06-04 11:15 AM'
  }
];

export const initialReturns: ReturnItem[] = [
  {
    id: 'RET-01',
    saleId: 'TXN-4020',
    customerName: 'Diana Prince',
    productName: 'Ibuprofen 400mg',
    quantity: 2,
    refundAmount: 48.00,
    reason: 'Doctor changed prescription to alternative medicine',
    status: 'Completed',
    timestamp: '2026-06-05 02:22 PM'
  }
];
