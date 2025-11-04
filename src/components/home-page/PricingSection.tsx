'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import PaymentModal from './PaymentModal';

interface PricingPlan {
  _id?: string;
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
  initialPricingPlans?: any[];
  userCurrency: string;
  exchangeRate: number;
  isLoadingRate: boolean;
  formatPrice: (amount: number, currency?: string) => string;
  convertPrice: (usdAmount: number) => number;
}

type PricingCard = {
  plan: PricingPlan;
  billingPeriod: 'yearly' | 'quarterly' | null;
  price: number | null;
  cardIdx: number;
};

export default function PricingSection({
  initialPricingPlans = [],
  userCurrency,
  exchangeRate,
  isLoadingRate,
  formatPrice,
  convertPrice
}: PricingSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'yearly' | 'quarterly'>('yearly');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(!initialPricingPlans.length);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; billingPeriod: 'yearly' | 'quarterly' } | null>(null);

  // Debug: Log currency changes
  useEffect(() => {
    console.log('🔄 PricingSection currency updated:', {
      userCurrency,
      exchangeRate,
      isLoadingRate
    });
  }, [userCurrency, exchangeRate, isLoadingRate]);

  const {
    isLoading: isFetchingPlans,
    sendHttpRequest: fetchPlansRequest,
    error: plansError,
  } = useHttp();

  // Default color mapping for plans
  const getPlanColor = (planName: string, apiColor?: string): string => {
    if (apiColor) return apiColor;
    const colorMap: Record<string, string> = {
      'Basic': 'from-gray-500 to-gray-600',
      'Gold': 'from-yellow-500 to-yellow-600',
      'Platinum': 'from-slate-500 to-slate-700',
      'Enterprise': 'from-primary-600 to-primary-800',
    };
    return colorMap[planName] || 'from-gray-500 to-gray-600';
  };

  // Map API plan to PricingPlan interface
  const mapPlanData = (plan: any): PricingPlan => ({
    _id: plan._id || plan.id,
    name: plan.name,
    price: plan.price ? {
      quarterly: plan.price.quarterly,
      yearly: plan.price.yearly,
    } : null,
    rooms: plan.rooms,
    multiProperty: plan.multiProperty,
    description: plan.description,
    features: plan.features,
    popular: plan.popular,
    color: getPlanColor(plan.name, plan.color),
  });

  // Initialize with server-side data if available
  useEffect(() => {
    if (initialPricingPlans.length > 0) {
      const mappedPlans = initialPricingPlans.map(mapPlanData);
      setPricingPlans(mappedPlans);
      setIsLoadingPlans(false);
      return; // Exit early if we have server data
    }

    // Fallback: Fetch pricing plans from API if not provided server-side
    fetchPlansRequest({
      successRes: (res: any) => {
        const apiPlans = res?.data?.data || [];
        const mappedPlans = apiPlans.map(mapPlanData);
        setPricingPlans(mappedPlans);
        setIsLoadingPlans(false);
      },
      requestConfig: {
        url: '/plans',
        method: 'GET',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create cards for the active billing period
  const pricingCards: PricingCard[] = pricingPlans.map((plan, planIdx) => {
    if (plan.price) {
      return {
        plan,
        billingPeriod: activeTab,
        price: activeTab === 'yearly' ? plan.price.yearly : plan.price.quarterly,
        cardIdx: planIdx,
      };
    } else {
      // Enterprise card (no pricing)
      return {
        plan,
        billingPeriod: null,
        price: null,
        cardIdx: planIdx,
      };
    }
  });

  // Show loading state while fetching plans
  if (isLoadingPlans || isFetchingPlans) {
    return (
      <section id="pricing" className="py-32 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading pricing plans...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if fetch fails
  if (plansError && pricingPlans.length === 0) {
    return (
      <section id="pricing" className="py-32 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load pricing plans. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Billing Period Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1">
            <motion.button
              onClick={() => setActiveTab('yearly')}
              className={`relative px-8 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'yearly'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === 'yearly' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Yearly</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('quarterly')}
              className={`relative px-8 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'quarterly'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === 'quarterly' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Quarterly</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-8 pb-6"
          >
            {pricingCards.map(({ plan, billingPeriod, price, cardIdx }) => (
            <div key={`${plan.name}-${billingPeriod || 'enterprise'}-${activeTab}`} className="relative pt-4">
              {plan.popular && billingPeriod === 'yearly' && activeTab === 'yearly' && (
                <motion.div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + cardIdx * 0.1, type: "spring" }}
                >
                  Most Popular
                </motion.div>
              )}
              <motion.div
                className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border overflow-hidden min-w-0 cursor-pointer ${
                  plan.popular && billingPeriod === 'yearly' && activeTab === 'yearly'
                    ? 'border-yellow-400/60 shadow-xl' 
                    : 'border-gray-200/60 shadow-md'
                } hover:border-gray-300/80`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: cardIdx * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: (plan.popular && billingPeriod === 'yearly' && activeTab === 'yearly') ? 1.03 : 1.02,
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

              {price !== null ? (
                <div className="mb-6 min-w-0">
                  <div className="flex items-baseline flex-wrap gap-x-2">
                    <span className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tracking-tight break-words min-w-0">
                      {formatPrice(price, userCurrency)}
                    </span>
                    <span className="text-gray-500 text-sm sm:text-base font-light whitespace-nowrap">
                      /{billingPeriod === 'yearly' ? 'year' : 'quarter'}
                    </span>
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
                {plan.features.map((feature: string, fIdx: number) => (
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
                  } else if (plan._id && billingPeriod) {
                    setSelectedPlan({ id: plan._id, name: plan.name, billingPeriod });
                    setShowPaymentModal(true);
                  } else {
                    router.push('/register');
                  }
                }}
                className={`w-full py-3.5 rounded-2xl font-medium backdrop-blur-sm ${
                  plan.popular && billingPeriod === 'yearly' && activeTab === 'yearly'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-md'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {price !== null ? 'Get Started' : 'Contact Sales'}
              </motion.button>
              </motion.div>
            </div>
          ))}
          </motion.div>
        </AnimatePresence>

        {/* Payment Modal */}
        {selectedPlan && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPlan(null);
            }}
            planId={selectedPlan.id}
            planName={selectedPlan.name}
            currency={userCurrency}
            billingPeriod={selectedPlan.billingPeriod}
          />
        )}
      </div>
    </section>
  );
}

