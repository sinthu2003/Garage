import { useState } from 'react';
import { workshops } from '../utils/data';
import { WorkshopCard } from '../components/locator/WorkshopCard';
import { MapPin } from 'lucide-react';

export const LocatorPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="pt-20 h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      
      {/* Sidebar List */}
      <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col h-full bg-white border-r border-gray-200 z-10 shadow-xl">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-bold text-gray-900">Workshops Nearby</h1>
          <p className="text-sm text-gray-500">Found {workshops.length} garages in Coimbatore</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {workshops.map((shop) => (
            <div key={shop.id} onClick={() => setSelectedId(shop.id)}>
              <WorkshopCard 
                workshop={shop} 
                isSelected={selectedId === shop.id} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100 flex items-center justify-center overflow-hidden group">
        
        {/* Mock Map Background Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-10 pointer-events-none">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="bg-gray-400" />
          ))}
        </div>
        
        {/* Mock Map Text */}
        <div className="text-center z-10 pointer-events-none">
           <h3 className="text-2xl font-bold text-gray-400 mb-2">Google Maps Integration</h3>
           <p className="text-gray-400">Interactive Map View</p>
        </div>

        {/* Animated Pins Mockup */}
        {workshops.map((shop, i) => (
          <div 
            key={shop.id}
            className={`absolute cursor-pointer transition-all duration-500 ${selectedId === shop.id ? 'z-50 scale-125' : 'z-20 scale-100 hover:scale-110'}`}
            style={{ 
              top: `${40 + (i * 15)}%`, 
              left: `${30 + (i * 20)}%` 
            }}
            onClick={() => setSelectedId(shop.id)}
          >
             <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <MapPin size={20} fill="currentColor" />
                </div>
                {selectedId === shop.id && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 border-b-2 border-r-2 border-white"></div>
                )}
                {/* Pulse Effect */}
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"/>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};