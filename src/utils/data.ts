import type { Service, Testimonial, Workshop } from '../types';

export const services: Service[] = [
  {
    id: '1',
    title: 'Periodic Service',
    description: 'Complete car service including oil change, filter replacement, and 40+ checkpoints.',
    icon: 'Settings',
    price: 2999,
    originalPrice: 4500,
    features: [
      'Engine oil replacement',
      'Oil filter replacement',
      'Air filter cleaning',
      'AC filter cleaning',
      'Brake inspection',
      '40+ checkpoints'
    ],
    category: 'maintenance',
    image: undefined
  },
  {
    id: '2',
    title: 'AC Service & Repair',
    description: 'Complete AC diagnostics, gas top-up, and cooling system check.',
    icon: 'Snowflake',
    price: 1499,
    originalPrice: 2200,
    features: [
      'AC gas top-up',
      'Cooling coil cleaning',
      'Blower motor check',
      'Condenser cleaning',
      'Thermostat check'
    ],
    category: 'ac',
    image: undefined
  },
  {
    id: '3',
    title: 'Denting & Painting',
    description: 'Professional body repair with color matching technology.',
    icon: 'Paintbrush',
    price: 3999,
    originalPrice: 6000,
    features: [
      'Dent removal',
      'Color matching',
      'Anti-rust treatment',
      'Paint protection',
      '1 year warranty'
    ],
    category: 'body',
    image: undefined
  },
  {
    id: '4',
    title: 'Car Inspection',
    description: 'Comprehensive 150+ point inspection for complete peace of mind.',
    icon: 'Search',
    price: 499,
    originalPrice: 800,
    features: [
      '150+ point check',
      'Engine diagnostics',
      'Detailed report',
      'Expert consultation',
      'Free re-inspection'
    ],
    category: 'inspection',
    image: undefined
  },
  {
    id: '5',
    title: 'Wheel Care',
    description: 'Complete wheel alignment, balancing, and tire care.',
    icon: 'Circle',
    price: 699,
    originalPrice: 1200,
    features: [
      'Wheel alignment',
      'Wheel balancing',
      'Tire rotation',
      'Pressure check',
      'Valve replacement'
    ],
    category: 'wheels',
    image: undefined
  },
  {
    id: '6',
    title: 'Battery Service',
    description: 'Battery testing, replacement, and electrical system check.',
    icon: 'Battery',
    price: 399,
    originalPrice: 600,
    features: [
      'Battery testing',
      'Terminal cleaning',
      'Charging system check',
      'Free installation',
      '2 year warranty'
    ],
    category: 'electrical',
    image: undefined
  },
  {
    id: '7',
    title: 'Clutch & Body',
    description: 'Complete clutch assembly replacement and repair.',
    icon: 'Cog',
    price: 5999,
    originalPrice: 9000,
    features: [
      'Clutch plate replacement',
      'Pressure plate',
      'Release bearing',
      'Flywheel machining',
      '6 month warranty'
    ],
    category: 'transmission',
    image: undefined
  },
  {
    id: '8',
    title: 'Insurance Claims',
    description: 'Hassle-free insurance claim processing and repairs.',
    icon: 'Shield',
    price: 0,
    originalPrice: 0,
    features: [
      'Claim assistance',
      'Surveyor coordination',
      'Paperwork handling',
      'Direct settlement',
      'Pickup & drop'
    ],
    category: 'insurance',
    image: undefined
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    user: 'Rajesh Kumar',
    role: 'IT Professional',
    content: 'Exceptional service quality! Saved almost ₹5000 on my car\'s periodic service. The real-time updates via WhatsApp were super convenient.',
    rating: 5,
    carDetails: 'Hyundai Creta 2022'
  },
  {
    id: '2',
    user: 'Priya Sharma',
    role: 'Business Owner',
    content: 'First time using GoMechanic and I\'m impressed. The mechanic explained everything clearly and there were no hidden charges. Highly recommend!',
    rating: 5,
    carDetails: 'Maruti Swift 2021'
  },
  {
    id: '3',
    user: 'Arun Balaji',
    role: 'Doctor',
    content: 'The AC repair was done perfectly. My car\'s cooling is now better than when it was new. Fair pricing and excellent workmanship.',
    rating: 4,
    carDetails: 'Honda City 2020'
  },
  {
    id: '4',
    user: 'Deepa Venkatesh',
    role: 'Professor',
    content: 'Doorstep pickup saved me so much time. The inspection report was detailed and they even shared photos of all the issues found.',
    rating: 5,
    carDetails: 'Toyota Fortuner 2019'
  },
  {
    id: '5',
    user: 'Mohammed Irfan',
    role: 'Engineer',
    content: 'Been using GoMechanic for 2 years now. Consistent quality, transparent pricing, and the 6-month warranty gives peace of mind.',
    rating: 5,
    carDetails: 'Tata Nexon 2022'
  }
];

// Added workshops data
export const workshops: Workshop[] = [
  {
    id: '1',
    name: 'AutoFix Premium Garage',
    address: '123, Avinashi Road, Peelamedu, Coimbatore',
    rating: 4.8,
    amenities: ['AC Waiting Room', 'Free Wi-Fi', 'Coffee']
  },
  {
    id: '2',
    name: 'CarCare Experts',
    address: '45, Trichy Road, Ramanathapuram, Coimbatore',
    rating: 4.5,
    amenities: ['Pick & Drop', 'Genuine Parts']
  },
  {
    id: '3',
    name: 'Mechanic Pro Hub',
    address: '88, Mettupalayam Road, RS Puram, Coimbatore',
    rating: 4.9,
    amenities: ['Certified Mechanics', 'Card Payment', 'Washroom']
  }
];