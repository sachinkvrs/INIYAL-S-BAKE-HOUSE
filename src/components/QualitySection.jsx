import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function QualitySection() {
  const qualityPoints = [
    {
      title: 'No Artificial Colours',
      desc: '100% natural rich dark chocolate hue directly from high-grade cocoa.',
    },
    {
      title: 'No Preservatives',
      desc: 'Zero artificial shelf-life extenders. Pure, honest baking.',
    },
    {
      title: 'Made with Premium Ingredients',
      desc: 'Hand-picked cocoa, pure butter, farm-fresh ingredients.',
    },
    {
      title: 'Eggless Options',
      desc: 'Specially crafted eggless brownies that retain that signature fudgy texture.',
    },
    {
      title: 'Freshly Baked',
      desc: 'Never stored or frozen. Baked specifically when your order is placed.',
    },
    {
      title: 'Perfect for Every Occasion',
      desc: 'From cozy evening treats to grand celebrations and thoughtful gifts.',
    },
  ];

  return (
    <section className="py-20 bg-chocolate-900 text-cream-100 border-b border-chocolate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chocolate-800 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-caramel-400" />
            <span>Our Quality Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-cream-200 uppercase">
            GOOD INGREDIENTS. PURE LOVE.
          </h2>
          <div className="w-16 h-1 bg-caramel-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Quality Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qualityPoints.map((point, index) => (
            <div
              key={index}
              className="bg-chocolate-950/60 rounded-2xl p-6 border border-gold-500/25 hover:border-gold-500/50 transition-all duration-300 flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-caramel-500/20 text-gold-400 flex items-center justify-center shrink-0 group-hover:bg-caramel-500 group-hover:text-white transition-colors duration-200">
                <CheckCircle className="w-5 h-5 text-gold-400 group-hover:text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-200 mb-1 group-hover:text-gold-400 transition-colors">
                  {point.title}
                </h3>
                <p className="text-cream-400 text-xs sm:text-sm leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
