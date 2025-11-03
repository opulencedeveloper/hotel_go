'use client';

import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import Footer from './Footer';
import { useCurrency } from './useCurrency';
import { pricingPlans, testimonials } from './pricingData';

export default function HomePageBody() {
  const {
    userCurrency,
    exchangeRate,
    isLoadingRate,
    formatPrice,
    convertPrice,
  } = useCurrency();

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <PricingSection
          pricingPlans={pricingPlans}
          userCurrency={userCurrency}
          exchangeRate={exchangeRate}
          isLoadingRate={isLoadingRate}
          formatPrice={formatPrice}
          convertPrice={convertPrice}
        />
        <TestimonialsSection testimonials={testimonials} />
        <CTASection />
        <Footer />
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
