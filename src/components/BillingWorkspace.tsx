import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  FileCheck2, 
  Check, 
  UserPlus, 
  Eye, 
  Sparkles,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Product, Customer, CartItem, Sale } from '../types';
import { api } from '../services/api';
import QRCode from 'react-qr-code';

interface BillingWorkspaceProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

export default function BillingWorkspace({ 
  products, 
  setProducts, 
  customers, 
  setCustomers, 
  sales, 
  setSales 
}: BillingWorkspaceProps) {
  
  // Billing customer lookup states
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lookupFeedback, setLookupFeedback] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({ type: null, message: '' });
  
  // For new customer instant register inside billing panel
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [showQuickRegister, setShowQuickRegister] = useState(false);

  // Catalog filtering states
  const [productQuery, setProductQuery] = useState('');
  const [colorFilter, setColorFilter] = useState('All'); // Under "produces" next to search in sketch

  // Cart/Order building states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI'>('Cash');

  // Checkout modal receipt structures
  const [checkedOutSale, setCheckedOutSale] = useState<Sale | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);

  // Collect distinct colors/labels for wireframe "Color" dropdown filter
  const colorsList = ['All', ...Array.from(new Set(products.map(p => p.color)))];

  // 1. Fetch data handler matching the hand-drawn "Fetch data" arrow on Name/Phone
  const handleFetchCustomer = () => {
    if (!phoneSearch.trim()) {
      setLookupFeedback({ type: 'info', message: 'Enter a customer Name or Phone first.' });
      return;
    }

    const cleaned = phoneSearch.trim().toLowerCase();
    const found = customers.find(c => 
      c.phone.includes(cleaned) || c.name.toLowerCase().includes(cleaned)
    );

    if (found) {
      setSelectedCustomer(found);
      setPhoneSearch(found.phone); // auto-complete input with canonical phone
      setLookupFeedback({ 
        type: 'success', 
        message: `Successfully loaded database file for: ${found.name}` 
      });
    } else {
      setSelectedCustomer(null);
      setLookupFeedback({ 
        type: 'error', 
        message: 'No record found under that name/phone. You can register them below.' 
      });
    }
  };

  // Quick Customer Registration inside billing screen
  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) {
      alert('Kindly supply Name and Phone Number.');
      return;
    }
    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail || 'walkin@rxpharmacy.net',
      outstandingBalance: 0.00
    };
    setCustomers(prev => [...prev, newCust]);
    setSelectedCustomer(newCust);
    setPhoneSearch(newCust.phone);
    setShowQuickRegister(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setLookupFeedback({ type: 'success', message: `Registered & loaded customer: ${newCust.name}` });
  };

  // Add Item to active Order list
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(`Cannot add ${product.name}! Batch is fully depleted (Stock: 0).`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Insufficient physical stock of ${product.name} (Max: ${product.stock}).`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update quantity
  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null; // markers for removal
        if (newQty > item.product.stock) {
          alert(`Limits reached! Only ${item.product.stock} items exist in stock.`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Remove completely
  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Clear entire workspace
  const handleResetWorkspace = () => {
    setCart([]);
    setSelectedCustomer(null);
    setPhoneSearch('');
    setLookupFeedback({ type: null, message: '' });
  };

  // Financial calculations
  const calculateSubtotal = () => cart.reduce((val, i) => val + (i.product.price * i.quantity), 0);
  const subtotal = calculateSubtotal();
  const grandTotal = subtotal;

  // Finalize DB saving and UI clearing
  const finalizeCheckout = async () => {

    const currentCustomerName = selectedCustomer ? selectedCustomer.name : 'Walk-in Customer';
    const currentCustomerPhone = selectedCustomer ? selectedCustomer.phone : 'N/A';

    try {
      const payload = {
        customerName: currentCustomerName,
        customerPhone: currentCustomerPhone,
        items: cart.map(item => ({
          productName: item.product.name,
          dosage: item.product.dosage,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: parseFloat(grandTotal.toFixed(2)),
        paymentMode: paymentMode
      };

      // Register sale payload to backend
      const response = await api.post('/pharmacy/checkout', payload);

      const dbSale = response.data; // Gets the saved sale from backend

      // Map backend model back to frontend interface
      const newSale: Sale = {
        id: dbSale.transaction_id || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        items: payload.items,
        total: payload.total,
        paymentMode: payload.paymentMode as 'Cash' | 'UPI',
        timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' Today'
      };

      // Deduct stock from state products locally for immediate UI update
      setProducts(prev => prev.map(p => {
        const orderedItem = cart.find(item => item.product.id === p.id);
        if (orderedItem) {
          return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
        }
        return p;
      }));

      // Update outstanding customer balance if any
      if (selectedCustomer && selectedCustomer.outstandingBalance > 0) {
        setCustomers(prev => prev.map(c => 
          c.id === selectedCustomer.id 
            ? { ...c, outstandingBalance: 0.00 }
            : c
        ));
        setSelectedCustomer(prev => prev ? { ...prev, outstandingBalance: 0.00 } : null);
      }

      // Unify state
      setSales(prev => [newSale, ...prev]);
      setCheckedOutSale(newSale);
      setIsInvoiceOpen(true);
      setCart([]); // Flush cart
    } catch (err) {
      console.error(err);
      alert('Checkout failed! Could not reach the backend.');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your billing counter is empty! Please add products before checking out.');
      return;
    }

    if (paymentMode === 'UPI') {
      setIsUpiModalOpen(true);
    } else {
      finalizeCheckout();
    }
  };

  // Filtered list of products
  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes((productQuery || '').toLowerCase()) || 
                          (p.code || '').toLowerCase().includes((productQuery || '').toLowerCase());
    const matchesColor = colorFilter === 'All' || p.color === colorFilter;
    return matchesSearch && matchesColor;
  });

  return (
    <div id="billing-workspace-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT: Customer & Products Selection Workspace (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Customer Fetch Data Box */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
              <User className="w-4 h-4 text-emerald-500" />
              1. Customer Ledger Lookup
            </h3>
            <button 
              onClick={() => setShowQuickRegister(!showQuickRegister)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Quick Register
            </button>
          </div>

          {showQuickRegister ? (
            <form onSubmit={handleQuickRegister} className="bg-slate-50/70 rounded-xl p-4 border border-dashed border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-600">Register New Customer Profile</p>
              <div className="grid grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Primary Phone" 
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email ID (optional)" 
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowQuickRegister(false)}
                  className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-[11px] font-semibold rounded-lg transition"
                >
                  Register Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search customer records (e.g. Pranay, Bob, or Phone Number)..." 
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchCustomer()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <button 
                onClick={handleFetchCustomer}
                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-5 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap active:scale-[0.98]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Fetch Data
              </button>
            </div>
          )}

          {/* Feedback & active state indicator */}
          {lookupFeedback.message && (
            <div className={`text-xs p-3 rounded-xl border flex items-center gap-2 justify-between ${
              lookupFeedback.type === 'success' 
                ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800' 
                : lookupFeedback.type === 'error' 
                ? 'bg-red-50/60 border-red-100 text-red-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <p className="font-semibold">{lookupFeedback.message}</p>
              {selectedCustomer && (
                <button 
                  onClick={() => {
                    setSelectedCustomer(null);
                    setPhoneSearch('');
                    setLookupFeedback({ type: null, message: '' });
                  }}
                  className="text-[10px] font-bold underline cursor-pointer hover:text-slate-900"
                >
                  Unlink
                </button>
              )}
            </div>
          )}

          {selectedCustomer && (
            <div className="bg-emerald-600/5 p-4 rounded-xl border border-emerald-500/10 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Linked Patient</p>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCustomer.name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Contact Phone</p>
                <p className="font-mono font-semibold text-slate-700 mt-0.5">{selectedCustomer.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Email Coordinates</p>
                <p className="font-semibold text-slate-600 truncate mt-0.5">{selectedCustomer.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Outstanding Balance</p>
                <p className={`font-mono font-bold mt-0.5 ${selectedCustomer.outstandingBalance > 0 ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`}>
                  ₹{selectedCustomer.outstandingBalance.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Produces / Products Catalog Finder */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              2. Pharmacy Medicine Catalog
            </h3>
            
            {/* Direct match of search & "Color" filters in layout drawing */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search medicine name / SKU..."
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
                />
              </div>
              <select 
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:bg-white outline-none font-semibold text-slate-600"
              >
                {colorsList.map(c => (
                  <option key={c} value={c}>Badge: {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Produces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-semibold">No medical product matches current query parameters.</p>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const cartQty = cart.find(i => i.product.id === p.id)?.quantity || 0;
                const isOutOfStock = p.stock <= 0;
                
                return (
                  <div 
                    key={p.id} 
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500/20 hover:bg-emerald-500/[0.01] transition-all bg-white relative flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span 
                          className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${(p.color || 'White').toLowerCase() === 'white' ? '#f1f5f9' : (p.color || 'White').toLowerCase()}15`,
                            color: (p.color || 'White').toLowerCase() === 'white' ? '#475569' : (p.color || 'White'),
                            border: `1px solid ${(p.color || 'White').toLowerCase() === 'white' ? '#cbd5e1' : (p.color || 'White')}25`
                          }}
                        >
                          {p.color || 'White'} ({p.dosage || 'Std'})
                        </span>
                        <span className="text-[10px] font-mono font-medium text-slate-400">{p.code}</span>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-sm mt-2">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.category}</p>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">M.R.P</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">₹{p.price.toFixed(2)}</span>
                      </div>

                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 py-1 px-2.5 rounded-lg">
                          Depleted State
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(p)}
                          className="bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                          {cartQty > 0 && (
                            <span className="bg-white text-emerald-700 w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[9px] ml-1.5">
                              {cartQty}
                            </span>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Stock Alert Bubble */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        p.stock < 100 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500'
                      }`}>
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Selected Order Billing Basket (5 Cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col h-[670px] justify-between overflow-hidden">
        
        {/* Cart Title & Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              Active Order Receipt
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Counter Terminal #019</p>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={handleResetWorkspace}
              className="text-[10px] text-red-500 hover:text-red-700 font-bold transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear POS
            </button>
          )}
        </div>

        {/* Selected Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
              <ShoppingBag className="w-12 h-12 text-slate-400 stroke-[1.5] mb-2" />
              <p className="text-xs font-bold text-slate-500">POS Billing Basket is Empty.</p>
              <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Select items with target labels from the medicine catalog to start constructing an invoice receipt.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.product.id} 
                className="flex justify-between items-center gap-4 border-b border-dashed border-slate-100 pb-3.5 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 text-sm truncate">{item.product.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {item.product.dosage} &bull; ₹{item.product.price.toFixed(2)}/unit
                  </p>
                </div>

                {/* Counter Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={() => handleUpdateQuantity(item.product.id, -1)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition active:scale-95 border border-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono font-bold text-xs w-6 text-center text-slate-800">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.product.id, 1)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition active:scale-95 border border-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Pricing summary */}
                <div className="text-right w-20 flex-shrink-0">
                  <p className="font-mono font-bold text-slate-800 text-xs">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-[10px] text-slate-400 hover:text-red-500 transition mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & EOD Payment Details Section */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal price</span>
              <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>

            
            {selectedCustomer && selectedCustomer.outstandingBalance > 0 && (
              <div className="flex justify-between text-amber-600 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/10">
                <span>Add past due balance</span>
                <span className="font-mono font-bold">₹{selectedCustomer.outstandingBalance.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-slate-800 border-t border-dashed border-slate-200 pt-3">
              <span>Total Billable</span>
              <span className="font-mono text-base text-emerald-600">
                ₹{(grandTotal + (selectedCustomer && selectedCustomer.outstandingBalance > 0 ? selectedCustomer.outstandingBalance : 0)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment mode select element - specified on checkout sketch note */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Payment Receipt Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('Cash')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                  paymentMode === 'Cash'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Cash Drawer
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                  paymentMode === 'UPI'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                UPI QR Gateway
              </button>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
              cart.length === 0
                ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99] shadow-emerald-600/15'
            }`}
          >
            <Printer className="w-4 h-4" />
            Complete Checkout & Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Receipt Lightbox / Modal */}
      {isInvoiceOpen && checkedOutSale && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 text-center space-y-1 relative">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-2">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg tracking-tight">RxPharmacy Invoice</h4>
              <p className="text-[11px] text-slate-400">Reconciliation Receipt: #{checkedOutSale.id}</p>
              
              <button 
                onClick={() => setIsInvoiceOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* Receipt Body content */}
            <div className="p-6 space-y-5">
              <div className="text-xs text-slate-500 space-y-1.5 border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <span>Audit Timestamp:</span>
                  <span className="font-mono font-medium text-slate-700">{checkedOutSale.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient / Buyer:</span>
                  <span className="font-semibold text-slate-800">{checkedOutSale.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone Account:</span>
                  <span className="font-mono font-medium text-slate-755">{checkedOutSale.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Settled Mode:</span>
                  <span className="font-bold text-emerald-600 uppercase font-mono">{checkedOutSale.paymentMode}</span>
                </div>
              </div>

              {/* Items */}
              <div className="text-xs space-y-2.5 max-h-32 overflow-y-auto pr-1">
                {checkedOutSale.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-slate-700">{it.productName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{it.dosage} x {it.quantity}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Invoice totalizer */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-800 pt-2 mt-1">
                  <span>Final Net Paid</span>
                  <span className="font-mono text-emerald-600 text-base">₹{checkedOutSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 py-1.5 px-3 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Inventory batches adjusted
                </span>
              </div>
            </div>

            {/* Quick footer action matching "Print Invoice" in wireframe */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Physical Copy
              </button>
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition focus:ring-2 focus:ring-emerald-500"
              >
                Done / Close POS
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* UPI Payment Modal (P2P Simulation Mode) */}
      {isUpiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 text-center relative">
              <h4 className="font-bold text-lg tracking-tight">Scan to Pay</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">UPI P2P Gateway</p>
              
              <button 
                onClick={() => setIsUpiModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* QR Body */}
            <div className="p-6 flex flex-col items-center space-y-5">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</span>
                <div className="font-mono text-3xl font-bold text-emerald-600 mt-1">
                  ₹{(grandTotal + (selectedCustomer && selectedCustomer.outstandingBalance > 0 ? selectedCustomer.outstandingBalance : 0)).toFixed(2)}
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-emerald-100">
                <QRCode 
                  value={`upi://pay?pa=test@upi&pn=GowMithra_Pharmacy&am=${(grandTotal + (selectedCustomer && selectedCustomer.outstandingBalance > 0 ? selectedCustomer.outstandingBalance : 0)).toFixed(2)}&cu=INR`} 
                  size={200}
                  level="H"
                />
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-slate-600">Waiting for customer payment...</p>
                <p className="text-[10px] text-slate-400 mt-1">Ask the customer to scan this QR with GPay, PhonePe, or Paytm.</p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                onClick={() => {
                  setIsUpiModalOpen(false);
                  finalizeCheckout();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                Verify Payment & Print Receipt
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
