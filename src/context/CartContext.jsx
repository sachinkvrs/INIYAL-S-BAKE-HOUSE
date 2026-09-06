import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBrand } from './BrandContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { branding } = useBrand();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ibh_bakery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Persist cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ibh_bakery_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [items]);

  const addToCart = (product, chosenWeightKey = '500g', quantity = 1) => {
    const pricing = product.pricing?.[chosenWeightKey] || {
      label: chosenWeightKey === '250g' ? '250 g' : chosenWeightKey === '1kg' ? '1 kg' : '500 g',
      price: product[`price_${chosenWeightKey}`] || 350
    };

    const cartItemId = `${product.id}-${chosenWeightKey}`;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            weight: chosenWeightKey,
            weightLabel: pricing.label,
            price: pricing.price,
            image: product.image,
            quantity: quantity
          }
        ];
      }
    });

    // Open cart drawer so customer sees the added item
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Generate formatted WhatsApp message for complete cart checkout
  const getCheckoutWhatsAppUrl = () => {
    const whatsappNum = branding.whatsapp || '8681078776';
    const brandName = branding.brand_name || "Iniyal’s Bake House";

    let message = `Hi ${brandName}!\nI would like to place an order:\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (${item.weightLabel})\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}\n`;
    });

    message += `\n*Total Amount: ₹${totalPrice}*`;

    if (customerName.trim()) {
      message += `\nName: ${customerName.trim()}`;
    }

    if (orderNotes.trim()) {
      message += `\nSpecial Notes: ${orderNotes.trim()}`;
    }

    message += `\n\nPlease confirm my order! Thank you.`;

    return `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        orderNotes,
        setOrderNotes,
        customerName,
        setCustomerName,
        getCheckoutWhatsAppUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
