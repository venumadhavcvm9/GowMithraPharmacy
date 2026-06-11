import { PendingApproval } from '../types';

export const initialPendingApprovals: PendingApproval[] = [
  {
    id: 'APP-101',
    saleTitle: 'EOD Settlement - Cash Deposit Batch #42',
    amount: 1500.00,
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600',
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
