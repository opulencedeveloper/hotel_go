'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: { quarterly: number; yearly: number } | null;
  rooms: string;
  multiProperty: boolean;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
}

interface PricingSectionProps {
  pricingPlans: PricingPlan[];
  userCurrency: string;
  exchangeRate: number;
  isLoadingRate: boolean;
  formatPrice: (amount: number, currency?: string) => string;
  convertPrice: (usdAmount: number) => number;
}

export default function PricingSection({
  pricingPlans,
  userCurrency,
  exchangeRate,
  isLoadingRate,
  formatPrice,
  convertPrice
}: PricingSectionProps) {
  const router = useRouter();

  return (
    <section id="pricing" className="py-32 bg-white overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-600 block mb-3 tracking-tight">
              Simple, Transparent
            </span>
            <span className="text-2xl md:text-3xl text-gray-700 font-light tracking-wide block">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Choose the plan that fits your hotel's needs. All plans include core features and updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-8 pb-6">
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className="relative pt-4">
              {plan.popular && (
                <motion.div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, type: "spring" }}
                >
                  Most Popular
                </motion.div>
              )}
              <motion.div
                className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border overflow-hidden min-w-0 ${
                  plan.popular 
                    ? 'border-yellow-400/60 shadow-xl' 
                    : 'border-gray-200/60 shadow-md'
                } hover:border-gray-300/80`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: plan.popular ? 1.03 : 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
              
              <motion.div 
                className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${plan.color} text-white mb-6 shadow-md`}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl font-semibold">{plan.name}</span>
              </motion.div>

              {plan.price ? (
                <div className="mb-6 min-w-0">
                  <div className="flex items-baseline flex-wrap gap-x-2">
                    {isLoadingRate ? (
                      <span className="text-xl sm:text-2xl font-light text-gray-900 tracking-tight">...</span>
                    ) : (
                      <span className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tracking-tight break-words min-w-0">
                        {formatPrice(convertPrice(plan.price.yearly))}
                      </span>
                    )}
                    <span className="text-gray-500 text-sm sm:text-base font-light whitespace-nowrap">/year</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-light break-words">
                    {isLoadingRate ? (
                      'Loading...'
                    ) : (
                      `or ${formatPrice(convertPrice(plan.price.quarterly))}/quarter`
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-6 min-w-0">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight break-words">Custom</div>
                  <div className="text-xs text-gray-500 mt-1 font-light">Contact us for pricing</div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">{plan.rooms}</div>
                {plan.multiProperty && (
                  <div className="text-xs text-primary-600 font-medium">✓ Multi-property support</div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <motion.li 
                    key={fIdx} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: fIdx * 0.05 }}
                  >
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={() => {
                  if (plan.name === 'Enterprise') {
                    alert('Contact us at sales@hotelgo.com for Enterprise pricing');
                  } else {
                    router.push('/register');
                  }
                }}
                className={`w-full py-3.5 rounded-2xl font-medium backdrop-blur-sm ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-md'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {plan.price ? 'Get Started' : 'Contact Sales'}
              </motion.button>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

