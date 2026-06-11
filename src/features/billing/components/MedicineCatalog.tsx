import React from 'react';
import { Product, CartItem } from '../../../types';
import { CatalogHeader } from './CatalogHeader';
import { ProductGrid } from './ProductGrid';

interface MedicineCatalogProps {
  productQuery: string;
  setProductQuery: (val: string) => void;
  colorFilter: string;
  setColorFilter: (val: string) => void;
  colorsList: string[];
  filteredProducts: Product[];
  cart: CartItem[];
  handleAddToCart: (p: Product) => void;
}

export function MedicineCatalog({
  productQuery, setProductQuery, colorFilter, setColorFilter,
  colorsList, filteredProducts, cart, handleAddToCart
}: MedicineCatalogProps) {
  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
      <CatalogHeader 
        productQuery={productQuery} setProductQuery={setProductQuery}
        colorFilter={colorFilter} setColorFilter={setColorFilter}
        colorsList={colorsList}
      />
      <ProductGrid 
        filteredProducts={filteredProducts} cart={cart} handleAddToCart={handleAddToCart}
      />
    </div>
  );
}
