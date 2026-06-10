import React, { useState } from 'react';
import { Undo2, Search, CornerUpLeft, Plus, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { ReturnItem, Sale, Product } from '../types';
import { api } from '../services/api';

interface ReturnsLogProps {
  returns: ReturnItem[];
  setReturns: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
  sales: Sale[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ReturnsLog({ returns, setReturns, sales, setProducts }: ReturnsLogProps) {
  // Input triggers
  const [saleSearch, setSaleSearch] = useState('');
  const [matchedSale, setMatchedSale] = useState<Sale | null>(null);
  const [searchError, setSearchError] = useState('');

  // Return item selection targets
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(-1);
  const [returnQty, setReturnQty] = useState<number>(1);
  const [returnReason, setReturnReason] = useState('Prescription altered by doctor');
  const [successInfo, setSuccessInfo] = useState('');

  // Execute sale locator
  const handleLocateSale = () => {
    setSearchError('');
    setSuccessInfo('');
    setMatchedSale(null);

    const match_id = saleSearch.trim().toUpperCase();
    if (!match_id) {
      setSearchError('Kindly input a Sale Invoice Transaction ID.');
      return;
    }

    const found = sales.find(s => s.id === match_id);
    if (found) {
      setMatchedSale(found);
      setSelectedProductIdx(found.items.length > 0 ? 0 : -1);
      setReturnQty(1);
    } else {
      setSearchError('No matching invoice registered in local database.');
    }
  };

  // Add Return
  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedSale || selectedProductIdx < 0) return;

    const itemToReturn = matchedSale.items[selectedProductIdx];
    if (returnQty > itemToReturn.quantity) {
      alert(`Invalid item quantity! Maximim bought: ${itemToReturn.quantity}`);
      return;
    }

    // Refund valuation
    const itemPrice = itemToReturn.price;
    const computedRefund = parseFloat((itemPrice * returnQty * 1.12).toFixed(2)); // include 12% GST

    try {
      const response = await api.post('/pharmacy/returns', {
        saleId: matchedSale.id,
        customerName: matchedSale.customerName,
        productName: `${itemToReturn.productName} (${itemToReturn.dosage})`,
        quantity: returnQty,
        refundAmount: computedRefund,
        reason: returnReason
      });

      if (response.success && response.data) {
        const retData = response.data;
        const newReturn: ReturnItem = {
          id: retData.return_id,
          saleId: retData.sale_id,
          customerName: retData.customer_name,
          productName: retData.product_name,
          quantity: retData.quantity,
          refundAmount: parseFloat(retData.refund_amount),
          reason: retData.reason,
          status: retData.status,
          timestamp: new Date(retData.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' Today'
        };

        // Increment original pharmaceutical stocks to reflect returned batch
        setProducts(prev => {
          const updatedProducts = prev.map(p => {
            // Clean target name match
            if (p.name === itemToReturn.productName && p.dosage === itemToReturn.dosage) {
              const newStock = p.stock + returnQty;
              // Hit PUT /inventory/:id to persist the returned stock
              api.put(`/pharmacy/inventory/${p.id}`, { stock: newStock }).catch(err => {
                console.error("Failed to update inventory stock on backend", err);
              });
              return { ...p, stock: newStock };
            }
            return p;
          });
          return updatedProducts;
        });

        // Save Return
        setReturns(prev => [newReturn, ...prev]);
        setSuccessInfo(`Processed Refund of ₹${computedRefund.toFixed(2)} for ${newReturn.productName}`);
        setMatchedSale(null);
        setSaleSearch('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log return to the backend.');
    }
  };

  return (
    <div id="returns-log-tabs" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Search and Action Container */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-5">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
          <Undo2 className="w-4 h-4 text-emerald-500" />
          Log Customer Product Return
        </h3>
        <p className="text-xs text-slate-400 font-medium">Re-shelf pharmaceuticals and process cash/UPI credits immediately on approved returns.</p>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Find Invoice ID</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. TXN-4029, TXN-4028..." 
              value={saleSearch}
              onChange={(e) => setSaleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLocateSale()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-semibold"
            />
            <button 
              onClick={handleLocateSale}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1 transition"
            >
              <Search className="w-3.5 h-3.5" />
              Locate
            </button>
          </div>
          {searchError && (
            <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {searchError}
            </p>
          )}
          {successInfo && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 font-semibold text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {successInfo}
            </div>
          )}
        </div>

        {matchedSale && (
          <form onSubmit={handleSubmitReturn} className="border-t border-slate-100 pt-4 space-y-4">
            <div className="bg-slate-50/70 p-3.5 rounded-xl text-xs space-y-1.5 border border-slate-200/50">
              <p className="font-bold text-slate-850">Invoice Metadata Loaded</p>
              <div className="flex justify-between text-slate-500">
                <span>Buyer Account:</span>
                <span className="font-semibold text-slate-700">{matchedSale.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Original Total Paid:</span>
                <span className="font-mono font-bold text-slate-800">₹{matchedSale.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Select Item */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Item to Return</label>
              <select
                value={selectedProductIdx}
                onChange={(e) => {
                  setSelectedProductIdx(parseInt(e.target.value));
                  setReturnQty(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white font-semibold text-slate-700"
              >
                {matchedSale.items.map((it, idx) => (
                  <option key={idx} value={idx}>
                    {it.productName} ({it.dosage}) &mdash; ₹{it.price.toFixed(2)} [Max {it.quantity}]
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Reason */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={selectedProductIdx >= 0 ? matchedSale.items[selectedProductIdx].quantity : 1}
                  value={returnQty}
                  onChange={(e) => setReturnQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-center font-mono font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Return Reason / Notes</label>
                <input 
                  type="text" 
                  placeholder="Reason for refund..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white font-semibold text-slate-700"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10"
            >
              <CornerUpLeft className="w-4 h-4" />
              Approve Return & Log Refund
            </button>
          </form>
        )}
      </div>

      {/* Returns History List */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Returns & Re-Shelving Journal
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-4">Chronological log of batch refund overrides and pharmaceutical reconciliations.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="pb-3 font-medium">Refund ID</th>
                <th className="pb-3 font-medium">Invoice ID</th>
                <th className="pb-3 font-medium">Customer Details</th>
                <th className="pb-3 font-medium">Product / Qty</th>
                <th className="pb-3 font-medium text-right">Repaid Val</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-semibold">
                    No historic product returns log listed yet.
                  </td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-700">{ret.id}</td>
                    <td className="py-3.5 font-mono text-xs text-slate-500">{ret.saleId}</td>
                    <td className="py-3.5">
                      <p className="font-semibold text-slate-700">{ret.customerName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[140px] truncate">{ret.reason}</p>
                    </td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-600">{ret.productName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ret.quantity} unit{ret.quantity > 1 ? 's' : ''} re-stocked</p>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-slate-800">
                      ₹{ret.refundAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
