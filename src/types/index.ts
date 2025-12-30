export interface Service {
  image: string | undefined;
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  originalPrice: number;
  features: string[];
  category: string;
}

export interface Testimonial {
  id: string;
  user: string;
  role: string;
  content: string;
  rating: number;
  carDetails: string;
  avatar?: string;
}

export interface PricingItem {
  service: string;
  market: number;
  ours: number;
  saving: string;
}

// Added Workshop interface
export interface Workshop {
  id: string;
  name: string;
  address: string;
  rating: number;
  amenities: string[];
}