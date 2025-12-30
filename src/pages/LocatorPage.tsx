import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Filter,
  ChevronDown,
  Car,
  Wrench,
  CheckCircle
} from 'lucide-react';

// Sample service centers data
const serviceCenters = [
  {
    id: 1,
    name: 'GoMechanic - Coimbatore Central',
    address: '123, RS Puram, Coimbatore - 641002',
    phone: '+91 98765 43210',
    rating: 4.8,
    reviews: 1250,
    distance: '2.5 km',
    timing: '8:00 AM - 8:00 PM',
    services: ['General Service', 'AC Repair', 'Denting'],
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'GoMechanic - Gandhipuram',
    address: '456, Cross Cut Road, Gandhipuram - 641012',
    phone: '+91 98765 43211',
    rating: 4.7,
    reviews: 980,
    distance: '4.2 km',
    timing: '8:00 AM - 9:00 PM',
    services: ['General Service', 'Battery', 'Wheel Care'],
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'GoMechanic - Saibaba Colony',
    address: '789, Mettupalayam Road - 641043',
    phone: '+91 98765 43212',
    rating: 4.9,
    reviews: 2100,
    distance: '5.8 km',
    timing: '7:00 AM - 8:00 PM',
    services: ['Full Service', 'Insurance Claims', 'Painting'],
    isOpen: false,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'GoMechanic - Peelamedu',
    address: '321, Avinashi Road, Peelamedu - 641004',
    phone: '+91 98765 43213',
    rating: 4.6,
    reviews: 750,
    distance: '7.1 km',
    timing: '8:00 AM - 8:00 PM',
    services: ['General Service', 'AC Repair', 'Clutch'],
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop'
  },
];

const ServiceCenterCard = ({ center, index }: { center: typeof serviceCenters[0]; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 50, x: index % 2 === 0 ? -30 : 30 }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 h-40 sm:h-auto relative overflow-hidden">
          <motion.img 
            src={center.image} 
            alt={center.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              center.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {center.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{center.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{center.address}</span>
              </div>
            </div>
            <motion.span 
              className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {center.distance}
            </motion.span>
          </div>

          {/* Rating & Timing */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-900">{center.rating}</span>
              <span className="text-gray-400 text-sm">({center.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{center.timing}</span>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-2 mb-4">
            {center.services.map((service, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </motion.button>
            <motion.button 
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="w-4 h-4" />
              Call
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const LocatorPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Coimbatore');
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: false, margin: "-50px" });

  const cities = ['Coimbatore', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,87,51,0.5) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/5"
              style={{ left: `${10 + i * 20}%`, top: `${20 + i * 15}%` }}
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
            >
              <Car size={40 + i * 10} />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <motion.div 
            ref={headerRef}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            >
              <MapPin className="w-4 h-4" />
              Service Locator
            </motion.span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              {"Find a service center ".split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: i * 0.02 }}
                >
                  {char}
                </motion.span>
              ))}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                {"near you".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.5 + i * 0.03 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p 
              className="text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.7 }}
            >
              500+ service centers across India. Expert mechanics. Genuine parts.
            </motion.p>

            {/* Search Box */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8 }}
            >
              {/* City Dropdown */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full sm:w-auto px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white appearance-none cursor-pointer pr-12 focus:outline-none focus:border-orange-500"
                >
                  {cities.map(city => (
                    <option key={city} value={city} className="text-gray-900">{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by area or pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Search
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {serviceCenters.length} Service Centers in {selectedCity}
              </h2>
              <p className="text-gray-500 text-sm">Sorted by distance</p>
            </div>
            <motion.button 
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            {serviceCenters.map((center, index) => (
              <ServiceCenterCard key={center.id} center={center} index={index} />
            ))}
          </div>

          {/* Features */}
          <motion.div 
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Wrench, text: 'Expert Mechanics' },
              { icon: CheckCircle, text: 'Genuine Parts' },
              { icon: Clock, text: 'Quick Service' },
              { icon: Star, text: '4.8★ Rating' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-orange-500" />
                </div>
                <span className="font-medium text-gray-700 text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};