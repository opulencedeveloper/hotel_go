export interface PricingPlan {
  name: string;
  price: { quarterly: number; yearly: number } | null;
  rooms: string;
  multiProperty: boolean;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Basic',
    price: { quarterly: 300, yearly: 1000 },
    rooms: 'Up to 20 rooms',
    multiProperty: false,
    description: 'For small hotels and facilities',
    features: [
      'Room management',
      'Reservation system',
      'Basic analytics',
      'Payment processing',
      'Email support',
    ],
    popular: false,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Gold',
    price: { quarterly: 450, yearly: 1500 },
    rooms: '21-50 rooms',
    multiProperty: false,
    description: 'For medium sized hotels',
    features: [
      'Everything in Basic',
      'Advanced analytics',
      'Guest CRM',
      'Priority support',
      'Custom reporting',
    ],
    popular: true,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: 'Platinum',
    price: { quarterly: 750, yearly: 2500 },
    rooms: '51+ rooms',
    multiProperty: true,
    description: 'For larger hotels',
    features: [
      'Everything in Gold',
      'Multi-property management',
      'Dedicated account manager',
      '24/7 phone support',
      'API access',
      'Custom integrations',
    ],
    popular: false,
    color: 'from-slate-500 to-slate-700'
  },
  {
    name: 'Enterprise',
    price: null,
    rooms: 'Unlimited',
    multiProperty: true,
    description: 'For hotels that need customization',
    features: [
      'Everything in Platinum',
      'Fully customized solution',
      'On-site training',
      'White-label options',
      'Dedicated support team',
      'Custom development',
    ],
    popular: false,
    color: 'from-primary-600 to-primary-800'
  },
];

export interface Testimonial {
  name: string;
  role: string;
  hotel: string;
  image: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'General Manager',
    hotel: 'The Grand Plaza Hotel',
    image: 'SJ',
    rating: 5,
    text: 'HotelGO transformed our operations. We\'ve seen a 40% increase in efficiency and guest satisfaction has never been higher.'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    hotel: 'Oceanview Resorts',
    image: 'MC',
    rating: 5,
    text: 'The analytics alone are worth the investment. We can now predict demand and optimize pricing in real-time.'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Hotel Owner',
    hotel: 'Boutique Collection',
    image: 'ER',
    rating: 5,
    text: 'Managing multiple properties was a nightmare until HotelGO. Everything is now centralized and streamlined.'
  },
];

