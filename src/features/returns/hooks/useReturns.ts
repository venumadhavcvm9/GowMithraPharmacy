import { useState } from 'react';
import { ReturnItem, Sale, Product } from '../../../types';
import { api } from '../../../services/api';

export function useReturns(
  returns: ReturnItem[],
  setReturns: React.Dispatch<React.SetStateAction<ReturnItem[]>>,
  sales: Sale[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) {
  const [saleSearch, setSaleSearch] = useState('');
  const [matchedSale, setMatchedSale] = useState<Sale | null>(null);
  const [searchError, setSearchError] = useState('');
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(-1);
  const [returnQty, setReturnQty] = useState<number>(1);
  const [returnReason, setReturnReason] = useState('Prescription altered by doctor');
  const [successInfo, setSuccessInfo] = useState('');

  const handleLocateSale = () => {
    setSearchError(''); setSuccessInfo(''); setMatchedSale(null);
    const match_id = saleSearch.trim().toUpperCase();
    if (!match_id) return setSearchError('Kindly input a Sale Invoice Transaction ID.');

    const found = sales.find(s => s.id === match_id);
    if (found) {
      setMatchedSale(found);
      setSelectedProductIdx(found.items.length > 0 ? 0 : -1);
      setReturnQty(1);
    } else setSearchError('No matching invoice registered in local database.');
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedSale || selectedProductIdx < 0) return;

    const itemToReturn = matchedSale.items[selectedProductIdx];
    if (returnQty > itemToReturn.quantity) return alert(`Invalid item quantity! Max: ${itemToReturn.quantity}`);

    const computedRefund = parseFloat((itemToReturn.price * returnQty * 1.12).toFixed(2));

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
          timestamp: new Date(retData.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
        };

        setProducts(prev => prev.map(p => {
          if (p.name === itemToReturn.productName && p.dosage === itemToReturn.dosage) {
            const newStock = p.stock + returnQty;
            api.put(`/pharmacy/inventory/${p.id}`, { stock: newStock }).catch(err => console.error(err));
            return { ...p, stock: newStock };
          }
          return p;
        }));

        setReturns(prev => [newReturn, ...prev]);
        setSuccessInfo(`Processed Refund of ₹${computedRefund.toFixed(2)} for ${newReturn.productName}`);
        setMatchedSale(null);
        setSaleSearch('');
      }
    } catch (err) {
      alert('Failed to log return to the backend.');
    }
  };

  return {
    saleSearch, setSaleSearch, matchedSale, searchError,
    selectedProductIdx, setSelectedProductIdx,
    returnQty, setReturnQty, returnReason, setReturnReason,
    successInfo, handleLocateSale, handleSubmitReturn
  };
}
