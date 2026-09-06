import React from 'react';
import { Cake, Gift, Heart, PartyPopper, Film, Coffee } from 'lucide-react';

export default function Occasions() {
  const occasionsList = [
    {
      title: 'Birthdays',
      desc: 'Sweeten the special day with warm fudgy brownies that everyone fights over.',
      icon: Cake,
    },
    {
      title: 'Anniversaries',
      desc: 'A rich, decadent dessert crafted to celebrate your sweet milestones.',
      icon: Heart,
    },
    {
      title: 'Gifts',
      desc: 'Elegantly packed homemade treats that say “you are cherished” like nothing else.',
      icon: Gift,
    },
    {
      title: 'Celebrations',
      desc: 'From promotions to family gatherings, brownies make every party unforgettable.',
      icon: PartyPopper,
    },
    {
      title: 'Movie Nights',
      desc: 'Warm brownies, a scoop of vanilla ice cream, and your favourite films.',
      icon: Film,
    },
    {
      title: 'Just Because',
      desc: 'Because you never need an excuse to treat yourself to pure chocolate bliss.',
      icon: Coffee,
    },
  ];

  return (
    <section id="occasions" className="py-24 bg-cream-100 text-chocolate-900 border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-script text-2xl sm:text-3xl text-caramel-600 block mb-1">
            Moments of Joy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-chocolate-900 uppercase">
            MADE FOR EVERY SWEET MOMENT
          </h2>
          <div className="w-16 h-1 bg-caramel-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Occasion Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {occasionsList.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-gold-500/30 shadow-warm hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cream-200 text-caramel-600 group-hover:bg-chocolate-900 group-hover:text-gold-400 transition-colors duration-300 flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate-900 group-hover:text-caramel-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-chocolate-700 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
