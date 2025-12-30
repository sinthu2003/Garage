import { motion } from 'framer-motion';
import { MapPin, Star, Navigation, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Workshop } from '../../types'; // Added 'type'

interface WorkshopCardProps {
  workshop: Workshop;
  isSelected?: boolean;
}

export const WorkshopCard = ({ workshop, isSelected }: WorkshopCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'bg-orange-50 border-primary shadow-md ring-1 ring-primary' 
          : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900">{workshop.name}</h3>
        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
          {workshop.rating} <Star size={10} fill="currentColor" />
        </div>
      </div>

      <p className="text-gray-500 text-xs mb-3 flex items-start gap-1.5">
        <MapPin size={14} className="shrink-0 mt-0.5" /> 
        {workshop.address}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {workshop.amenities.map(amenity => (
          <span key={amenity} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {amenity}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Button size="sm" fullWidth variant="primary">
          Book Now
        </Button>
        <Button size="sm" variant="outline" className="px-3">
          <Navigation size={14} />
        </Button>
        <Button size="sm" variant="outline" className="px-3">
          <Phone size={14} />
        </Button>
      </div>
    </motion.div>
  );
};