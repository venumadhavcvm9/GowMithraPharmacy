import React from 'react';
import { Product, Customer, Sale } from '../../types';
import { useBillingCart } from './hooks/useBillingCart';
import { CustomerLookup } from './components/CustomerLookup';
import { MedicineCatalog } from './components/MedicineCatalog';
import { CartSidebar } from './components/CartSidebar';
import { InvoiceModal } from './components/InvoiceModal';
import { UpiModal } from './components/UpiModal';
import { LowStockAlert } from './components/LowStockAlert';
import { CashConfirmModal } from './components/CashConfirmModal';

interface BillingWorkspaceProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  onNavigateToRegister?: () => void;
}

export default function BillingWorkspace({
  products, setProducts, customers, setCustomers, sales, setSales, onNavigateToRegister
}: BillingWorkspaceProps) {

  const billing = useBillingCart(products, setProducts, customers, setCustomers, sales, setSales);

  return (
    <div id="billing-workspace-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-6">
        <LowStockAlert products={products} />
        <CustomerLookup
          phoneSearch={billing.phoneSearch}
          setPhoneSearch={billing.setPhoneSearch}
          selectedCustomer={billing.selectedCustomer}
          setSelectedCustomer={billing.setSelectedCustomer}
          lookupFeedback={billing.lookupFeedback}
          setLookupFeedback={billing.setLookupFeedback}
          handleFetchCustomer={billing.handleFetchCustomer}
          onNavigateToRegister={onNavigateToRegister}
        />
        <MedicineCatalog
          productQuery={billing.productQuery}
          setProductQuery={billing.setProductQuery}
          colorFilter={billing.colorFilter}
          setColorFilter={billing.setColorFilter}
          colorsList={billing.colorsList}
          filteredProducts={billing.filteredProducts}
          cart={billing.cart}
          handleAddToCart={billing.handleAddToCart}
        />
      </div>

      <CartSidebar
        cart={billing.cart}
        handleResetWorkspace={billing.handleResetWorkspace}
        handleUpdateQuantity={billing.handleUpdateQuantity}
        handleRemoveItem={billing.handleRemoveItem}
        subtotal={billing.subtotal}
        grandTotal={billing.grandTotal}
        selectedCustomer={billing.selectedCustomer}
        paymentMode={billing.paymentMode}
        setPaymentMode={billing.setPaymentMode}
        handleCheckout={billing.handleCheckout}
      />

      <InvoiceModal
        isOpen={billing.isInvoiceOpen}
        onClose={() => billing.setIsInvoiceOpen(false)}
        sale={billing.checkedOutSale}
      />

      <UpiModal
        isOpen={billing.isUpiModalOpen}
        onClose={() => billing.setIsUpiModalOpen(false)}
        onSuccess={billing.finalizeCheckout}
        amount={billing.grandTotal + (billing.selectedCustomer && billing.selectedCustomer.outstandingBalance > 0 ? billing.selectedCustomer.outstandingBalance : 0)}
      />

      <CashConfirmModal
        isOpen={billing.isCashModalOpen}
        onClose={() => {
          billing.setIsCashModalOpen(false);
          billing.handleResetWorkspace();
        }}
        onConfirm={billing.finalizeCheckout}
        amount={billing.grandTotal + (billing.selectedCustomer && billing.selectedCustomer.outstandingBalance > 0 ? billing.selectedCustomer.outstandingBalance : 0)}
      />
    </div>
  );
}
