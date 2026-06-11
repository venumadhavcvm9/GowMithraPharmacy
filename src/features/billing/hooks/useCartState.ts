import { useState } from 'react';
import { Product, CartItem } from '../../../types';

export function useCartState() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return alert(`Cannot add ${product.name}! Batch is fully depleted (Stock: 0).`);

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Insufficient physical stock of ${product.name} (Max: ${product.stock}).`);
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > item.product.stock) {
          alert(`Limits reached! Only ${item.product.stock} items exist in stock.`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  return { cart, setCart, handleAddToCart, handleUpdateQuantity, handleRemoveItem };
}
