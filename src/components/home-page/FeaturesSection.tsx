'use client';

import { Bed, Calendar, BarChart3, CreditCard, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: <Bed className="w-8 h-8" />,
    title: 'Room Management',
    description: 'Seamlessly manage room inventory, availability, and status in real-time.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: 'Reservations',
    description: 'Handle bookings, check-ins, and check-outs with an intuitive interface.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Analytics Dashboard',
    description: 'Make data-driven decisions with comprehensive reporting and insights.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Payment Processing',
    description: 'Secure payment handling with multiple payment methods and invoicing.',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Guest Management',
    description: 'Complete CRM for guest profiles, preferences, and communication history.',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and role-based access control for your team.',
    color: 'from-indigo-500 to-indigo-600'
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-600 block mb-3 tracking-tight">
              Everything You Need
            </span>
            <span className="text-2xl md:text-3xl text-gray-700 font-light tracking-wide block">
              to Run Your Hotel
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Powerful features designed to streamline operations and enhance guest experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/60 animate-fade-in-up hover:border-gray-200/80 hover:bg-white/90"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`inline-flex p-5 rounded-3xl bg-gradient-to-r ${feature.color} text-white mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

