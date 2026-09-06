import React from 'react';
import { Flame, Sparkles, Award, HeartHandshake } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export default function WhyUs() {
  const { content } = useBrand();
  const whyUs = content.why_us || {};

  const defaultFeatures = [
    {
      icon: Flame,
      title: 'Freshly Baked',
      description: 'Made fresh for every order.',
    },
    {
      icon: Sparkles,
      title: 'Rich & Fudgy',
      description: 'Deep chocolate flavour with a soft fudgy center.',
    },
    {
      icon: Award,
      title: 'Quality Ingredients',
      description: 'Made with carefully selected ingredients.',
    },
    {
      icon: HeartHandshake,
      title: 'Made With Love',
      description: 'Homemade goodness in every bite.',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-cream-200 text-chocolate-900 border-b border-gold-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-script text-2xl text-caramel-600 block mb-1">
            {whyUs.subtext || "Pure Indulgence"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-chocolate-900 uppercase">
            {whyUs.heading || "WHY YOU’LL LOVE OUR BROWNIES"}
          </h2>
          <div className="w-16 h-1 bg-caramel-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {defaultFeatures.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="bg-cream-50 rounded-2xl p-7 border border-gold-500/30 shadow-warm hover:shadow-warm-lg transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-chocolate-900 text-gold-400 flex items-center justify-center mb-5 shadow-md group-hover:bg-caramel-500 group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-chocolate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-chocolate-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
