export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string; // E.g., Tablets, Capsule, Syrup, Ointment
  color: string;    // Matches the "Color/Category" filter in the wireframe notes
  code: string;     // SKU
  dosage: string;   // E.g., 500mg, 10ml, etc.
  shop_id?: string;
}

export interface Customer {
  id: string;
  name: string; // Mapped from full_name
  phone: string; // Mapped from mobile
  email: string;
  outstandingBalance: number;

  // Backend Mapping Fields
  full_name?: string;
  mobile?: string;
  password?: string;
  state_id?: string;
  district_id?: string;
  mandal_id?: string;
  constituency_id?: string;
  village_id?: string;
  address?: string;
  is_mobile_verified?: boolean;
  status?: string;
  shop_id?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  customerName: string;
  customerPhone: string;
  items: {
    productName: string;
    dosage: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMode: 'Cash' | 'UPI';
  timestamp: string;
  shop_id?: string;
}

export interface PendingApproval {
  id: string;
  saleTitle: string; // Displayed as "Sale" in table
  amount: number;
  receiptUrl: string; // Simulates the uploaded cash slip
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  shop_id?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  availability: string;
  clinic: string;
}

export interface ReturnItem {
  id: string;
  saleId: string;
  customerName: string;
  productName: string;
  quantity: number;
  refundAmount: number;
  reason: string;
  status: 'Completed' | 'Pending';
  timestamp: string;
  shop_id?: string;
}
