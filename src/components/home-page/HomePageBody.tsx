'use client';

import { useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import Footer from './Footer';
import { testimonials } from './pricingData';

interface HomePageBodyProps {
  initialPricingPlans?: any[];
}

export default function HomePageBody({ 
  initialPricingPlans = [],
}: HomePageBodyProps) {
  // Handle scrolling to section when navigating from other pages
  useEffect(() => {
    // Check sessionStorage for section to scroll to
    const sectionId = sessionStorage.getItem('scrollToSection');
    const hadSectionId = !!sectionId;
    
    if (sectionId) {
      // Clear sessionStorage
      sessionStorage.removeItem('scrollToSection');
      
      // Wait for page to fully render, then scroll
      const scrollToSection = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Small delay to ensure page is rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          return true;
        }
        return false;
      };

      // Try scrolling immediately
      if (!scrollToSection()) {
        // If element not found, try again after a short delay
        const checkInterval = setInterval(() => {
          if (scrollToSection()) {
            clearInterval(checkInterval);
          }
        }, 100);

        // Clear interval after 2 seconds
        setTimeout(() => clearInterval(checkInterval), 2000);
      }
    }

    // Also check URL hash if no sectionId was in sessionStorage
    const hash = window.location.hash.replace('#', '');
    if (hash && !hadSectionId) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <PricingSection
          initialPricingPlans={initialPricingPlans}
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
