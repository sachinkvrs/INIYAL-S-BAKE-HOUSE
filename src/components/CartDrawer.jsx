import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, MessageCircle, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBrand } from '../context/BrandContext';

export default function CartDrawer() {
  const {
    items,
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
  } = useCart();

  const { branding } = useBrand();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden font-sans">
      {/* Dark Blurred Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-chocolate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gold-500/30 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-chocolate-900 text-cream-100 border-b border-chocolate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-caramel-500/30 text-gold-400 flex items-center justify-center border border-gold-500/40">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-100 uppercase tracking-wider">
                  Your Brownie Cart
                </h3>
                <span className="text-xs text-gold-400">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-cream-300 hover:text-white hover:bg-chocolate-800 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-cream-50/60">
            {items.length === 0 ? (
              <div className="py-16 text-center text-chocolate-700">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-200 text-caramel-600 flex items-center justify-center border border-gold-500/40">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-xl font-bold text-chocolate-900 mb-2">
                  Your cart is empty
                </h4>
                <p className="text-xs sm:text-sm text-chocolate-600 max-w-xs mx-auto mb-6 leading-relaxed">
                  Looks like you haven't added any delicious chocolate brownies yet!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    const menuEl = document.getElementById('menu');
                    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-xs sm:text-sm tracking-wider rounded-full shadow-warm transition-all"
                >
                  EXPLORE OUR BROWNIES
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 bg-white rounded-2xl border border-gold-500/30 shadow-xs flex items-center gap-3.5 group hover:border-gold-500/60 transition-colors"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-chocolate-950 border border-gold-500/30 shrink-0"
                      />

                      {/* Info & Pricing */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif font-bold text-chocolate-900 text-sm truncate">
                          {item.name}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-chocolate-600 mt-0.5">
                          <span className="bg-cream-200 text-chocolate-800 font-semibold px-2 py-0.5 rounded-md border border-gold-500/30">
                            {item.weightLabel}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-chocolate-900">₹{item.price} each</span>
                        </div>

                        {/* Quantity controls & item total */}
                        <div className="flex items-center justify-between mt-2.5">
                          {/* Stepper */}
                          <div className="flex items-center border border-gold-500/40 rounded-lg overflow-hidden bg-cream-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="px-2 py-1 text-chocolate-700 hover:bg-cream-200 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-chocolate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="px-2 py-1 text-chocolate-700 hover:bg-cream-200 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line item subtotal */}
                          <span className="font-serif text-sm font-extrabold text-chocolate-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-chocolate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Optional Customer Name & Special Notes */}
                <div className="pt-3 space-y-2.5 border-t border-gold-500/20">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-chocolate-700 mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sachin"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gold-500/30 rounded-xl text-xs text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-chocolate-700 mb-1">
                      Special Note / Delivery Request (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Extra chocolate drizzle, Gift box"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gold-500/30 rounded-xl text-xs text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-gold-500/30 space-y-4 shadow-lg">
              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs text-chocolate-700">
                <div className="flex items-center justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold text-chocolate-900">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-chocolate-900 pt-1 border-t border-gold-500/20">
                  <span>Grand Total:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-chocolate-600 font-semibold">₹</span>
                    <span className="font-serif text-2xl font-extrabold text-chocolate-900">
                      {totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order via WhatsApp Button */}
              <a
                href={getCheckoutWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-sm tracking-wider rounded-2xl shadow-warm hover:shadow-warm-glow transition-all duration-300 flex items-center justify-center gap-2.5 transform active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>ORDER ON WHATSAPP (₹{totalPrice})</span>
              </a>

              {/* Action links */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-chocolate-500 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
                <span className="text-chocolate-500 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-caramel-500" />
                  <span>Freshly baked upon confirmation</span>
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
