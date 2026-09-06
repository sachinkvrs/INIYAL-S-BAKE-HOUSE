import React, { useState } from 'react';
import { ShoppingBag, Check, Sparkles, MessageCircle } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const { products, branding, categories } = useBrand();
  const { addToCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  // Fallback products if API not yet populated
  const defaultProducts = [
    {
      id: 1,
      name: 'Fudgy Brownie',
      badge: 'Bestseller',
      description: 'Rich chocolate. Gooey center. Pure indulgence.',
      image: '/images/fudgy-brownie.jpg',
      pricing: {
        '250g': { label: '250 g', price: 200 },
        '500g': { label: '500 g', price: 350 },
        '1kg': { label: '1 kg', price: 680 },
      },
    },
    {
      id: 2,
      name: 'Eggless Brownie',
      badge: '100% Vegetarian',
      description: 'Light, soft and chocolaty. A perfect balance of taste and texture.',
      image: '/images/eggless-brownie.jpg',
      pricing: {
        '250g': { label: '250 g', price: 225 },
        '500g': { label: '500 g', price: 400 },
        '1kg': { label: '1 kg', price: 750 },
      },
    },
    {
      id: 3,
      name: 'Ragi Brownie',
      badge: 'Healthy Indulgence',
      description: 'Wholesome. Nutritious. Delicious.',
      image: '/images/ragi-brownie.jpg',
      pricing: {
        '250g': { label: '250 g', price: 230 },
        '500g': { label: '500 g', price: 450 },
        '1kg': { label: '1 kg', price: 800 },
      },
    },
  ];

  const displayProducts = products && products.length > 0 ? products : defaultProducts;

  const handleWeightChange = (productId, weightKey) => {
    setSelectedWeights(prev => ({
      ...prev,
      [productId]: weightKey
    }));
  };

  const whatsappNum = branding.whatsapp || '8681078776';

  const getWhatsAppOrderUrl = (product) => {
    const chosenWeightKey = selectedWeights[product.id] || '500g';
    const chosenOption = product.pricing?.[chosenWeightKey] || {
      label: chosenWeightKey === '250g' ? '250 g' : chosenWeightKey === '1kg' ? '1 kg' : '500 g',
      price: product[`price_${chosenWeightKey}`] || 350
    };

    const message = `Hi ${branding.brand_name || "Iniyal’s Bake House"}!\nI would like to order:\n${product.name}\n${chosenOption.label}\n₹${chosenOption.price}`;
    return `https://wa.me/91${whatsappNum}?text=${encodeURIComponent(message)}`;
  };

  // Filter by category
  const filteredProducts = displayProducts.filter(p => {
    if (activeCategory === 'all') return true;
    return String(p.category_id) === String(activeCategory);
  });

  return (
    <section id="menu" className="py-24 bg-cream-100 text-chocolate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-script text-2xl sm:text-3xl text-caramel-600 block mb-1">
            Handcrafted Perfection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-chocolate-900 uppercase">
            OUR BROWNIES
          </h2>
          <p className="mt-3 text-base sm:text-lg text-chocolate-700 font-medium">
            Choose your favourite. Every bite is pure chocolate happiness.
          </p>
          <div className="w-16 h-1 bg-caramel-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Bar if more than 1 category */}
        {categories && categories.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                activeCategory === 'all'
                  ? 'bg-chocolate-900 text-cream-100 shadow-md'
                  : 'bg-white text-chocolate-800 hover:bg-cream-200 border border-gold-500/30'
              }`}
            >
              All Brownies
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-chocolate-900 text-cream-100 shadow-md'
                    : 'bg-white text-chocolate-800 hover:bg-cream-200 border border-gold-500/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || '500g';
            const pricing = product.pricing || {
              '250g': { label: '250 g', price: product.price_250g || 200 },
              '500g': { label: '500 g', price: product.price_500g || 350 },
              '1kg': { label: '1 kg', price: product.price_1kg || 680 },
            };
            const currentPricing = pricing[currentWeight] || pricing['500g'];

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-gold-500/30 shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col group"
              >
                {/* 1:1 Aspect Ratio Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-chocolate-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/60 via-transparent to-transparent opacity-50" />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-chocolate-900/90 text-gold-400 border border-gold-500/40 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between bg-cream-50/50">
                  
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-chocolate-900 group-hover:text-caramel-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-chocolate-700 leading-relaxed min-h-[40px]">
                      {product.description}
                    </p>

                    {/* Weight Selection Pills */}
                    <div className="mt-6">
                      <label className="text-xs font-semibold uppercase tracking-wider text-chocolate-600 block mb-2">
                        Select Weight / Portion:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(pricing).map(([key, item]) => {
                          const isSelected = currentWeight === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleWeightChange(product.id, key)}
                              className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all duration-200 border ${
                                isSelected
                                  ? 'bg-chocolate-900 text-cream-100 border-chocolate-900 shadow-sm'
                                  : 'bg-white text-chocolate-800 border-gold-500/40 hover:border-caramel-500 hover:bg-cream-100'
                              }`}
                            >
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* All Prices Table / Breakdown */}
                    <div className="mt-4 pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs text-chocolate-600">
                      <span>250g: ₹{pricing['250g']?.price}</span>
                      <span>•</span>
                      <span>500g: ₹{pricing['500g']?.price}</span>
                      <span>•</span>
                      <span>1kg: ₹{pricing['1kg']?.price}</span>
                    </div>
                  </div>

                  {/* Active Price & Order Button */}
                  <div className="mt-6 pt-4 border-t border-gold-500/30">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xs text-chocolate-600 font-medium">Selected Price:</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-chocolate-700 font-semibold">₹</span>
                        <span className="font-serif text-3xl font-extrabold text-chocolate-900">
                          {currentPricing?.price}
                        </span>
                        <span className="text-xs text-chocolate-600">/ {currentPricing?.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => addToCart({ ...product, pricing }, currentWeight)}
                        className="w-full py-3.5 px-3 bg-chocolate-900 hover:bg-chocolate-850 text-cream-100 font-bold text-xs sm:text-sm tracking-wider rounded-2xl border border-gold-500/40 shadow-sm hover:shadow-warm transition-all duration-200 flex items-center justify-center gap-1.5 transform active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4 text-gold-400" />
                        <span>ADD TO CART</span>
                      </button>

                      <a
                        href={getWhatsAppOrderUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-3 bg-caramel-500 hover:bg-caramel-600 text-white font-bold text-xs sm:text-sm tracking-wider rounded-2xl shadow-md hover:shadow-warm transition-all duration-200 flex items-center justify-center gap-1.5 transform active:scale-98"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>ORDER NOW</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
