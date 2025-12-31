import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Car, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  Search, 
  X, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// Brand data with logos from carlogos.org
const brands = [
  { id: 'maruti', name: 'Maruti Suzuki', logo: 'https://www.carlogos.org/car-logos/suzuki-logo.png', urlName: 'maruti-suzuki' },
  { id: 'hyundai', name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png', urlName: 'hyundai' },
  { id: 'honda', name: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png', urlName: 'honda' },
  { id: 'tata', name: 'Tata', logo: 'https://www.carlogos.org/car-logos/tata-logo.png', urlName: 'tata' },
  { id: 'toyota', name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png', urlName: 'toyota' },
  { id: 'mahindra', name: 'Mahindra', logo: 'https://www.carlogos.org/car-logos/mahindra-logo.png', urlName: 'mahindra' },
  { id: 'kia', name: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png', urlName: 'kia' },
  { id: 'mg', name: 'MG', logo: 'https://www.carlogos.org/car-logos/mg-logo.png', urlName: 'mg' },
  { id: 'volkswagen', name: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png', urlName: 'volkswagen' },
  { id: 'skoda', name: 'Skoda', logo: 'https://www.carlogos.org/car-logos/skoda-logo.png', urlName: 'skoda' },
  { id: 'renault', name: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png', urlName: 'renault' },
  { id: 'nissan', name: 'Nissan', logo: 'https://www.carlogos.org/car-logos/nissan-logo.png', urlName: 'nissan' },
  { id: 'ford', name: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo.png', urlName: 'ford' },
  { id: 'chevrolet', name: 'Chevrolet', logo: 'https://www.carlogos.org/car-logos/chevrolet-logo.png', urlName: 'chevrolet' },
  { id: 'bmw', name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png', urlName: 'bmw' },
  { id: 'audi', name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png', urlName: 'audi' },
  { id: 'mercedes', name: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png', urlName: 'mercedes-benz' },
  { id: 'jeep', name: 'Jeep', logo: 'https://www.carlogos.org/car-logos/jeep-logo.png', urlName: 'jeep' },
  { id: 'volvo', name: 'Volvo', logo: 'https://www.carlogos.org/car-logos/volvo-logo.png', urlName: 'volvo' },
  { id: 'lexus', name: 'Lexus', logo: 'https://www.carlogos.org/car-logos/lexus-logo.png', urlName: 'lexus' },
  { id: 'porsche', name: 'Porsche', logo: 'https://www.carlogos.org/car-logos/porsche-logo.png', urlName: 'porsche' },
  { id: 'jaguar', name: 'Jaguar', logo: 'https://www.carlogos.org/car-logos/jaguar-logo.png', urlName: 'jaguar' },
  { id: 'landrover', name: 'Land Rover', logo: 'https://www.carlogos.org/car-logos/land-rover-logo.png', urlName: 'land-rover' },
  { id: 'mitsubishi', name: 'Mitsubishi', logo: 'https://www.carlogos.org/car-logos/mitsubishi-logo.png', urlName: 'mitsubishi' },
];

// Car models by brand with images from carlogos.org
const carModels: Record<string, { name: string; type: string; image: string }[]> = {
  maruti: [
    { name: 'Swift', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/suzuki-swift.png' },
    { name: 'Baleno', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/suzuki-baleno.png' },
    { name: 'Alto K10', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/suzuki-alto.png' },
    { name: 'Wagon R', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/suzuki-wagon-r.png' },
    { name: 'Dzire', type: 'Sedan', image: 'https://www.carlogos.org/car-models/suzuki-dzire.png' },
    { name: 'Vitara Brezza', type: 'SUV', image: 'https://www.carlogos.org/car-models/suzuki-vitara-brezza.png' },
    { name: 'Ertiga', type: 'MPV', image: 'https://www.carlogos.org/car-models/suzuki-ertiga.png' },
    { name: 'Ciaz', type: 'Sedan', image: 'https://www.carlogos.org/car-models/suzuki-ciaz.png' },
    { name: 'S-Cross', type: 'SUV', image: 'https://www.carlogos.org/car-models/suzuki-s-cross.png' },
    { name: 'Ignis', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/suzuki-ignis.png' },
    { name: 'Celerio', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/suzuki-celerio.png' },
    { name: 'XL6', type: 'MPV', image: 'https://www.carlogos.org/car-models/suzuki-xl6.png' },
    { name: 'Grand Vitara', type: 'SUV', image: 'https://www.carlogos.org/car-models/suzuki-grand-vitara.png' },
    { name: 'Fronx', type: 'SUV', image: 'https://www.carlogos.org/car-models/suzuki-fronx.png' },
    { name: 'Jimny', type: 'SUV', image: 'https://www.carlogos.org/car-models/suzuki-jimny.png' },
    { name: 'Invicto', type: 'MPV', image: 'https://www.carlogos.org/car-models/suzuki-invicto.png' },
  ],
  hyundai: [
    { name: 'Creta', type: 'SUV', image: 'https://www.carlogos.org/car-models/hyundai-creta.png' },
    { name: 'i20', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/hyundai-i20.png' },
    { name: 'Venue', type: 'SUV', image: 'https://www.carlogos.org/car-models/hyundai-venue.png' },
    { name: 'Verna', type: 'Sedan', image: 'https://www.carlogos.org/car-models/hyundai-verna.png' },
    { name: 'Grand i10 Nios', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/hyundai-grand-i10.png' },
    { name: 'Aura', type: 'Sedan', image: 'https://www.carlogos.org/car-models/hyundai-aura.png' },
    { name: 'Tucson', type: 'SUV', image: 'https://www.carlogos.org/car-models/hyundai-tucson.png' },
    { name: 'Alcazar', type: 'SUV', image: 'https://www.carlogos.org/car-models/hyundai-alcazar.png' },
    { name: 'Exter', type: 'SUV', image: 'https://www.carlogos.org/car-models/hyundai-exter.png' },
    { name: 'Ioniq 5', type: 'Electric', image: 'https://www.carlogos.org/car-models/hyundai-ioniq-5.png' },
    { name: 'Kona Electric', type: 'Electric', image: 'https://www.carlogos.org/car-models/hyundai-kona.png' },
  ],
  honda: [
    { name: 'City', type: 'Sedan', image: 'https://www.carlogos.org/car-models/honda-city.png' },
    { name: 'Amaze', type: 'Sedan', image: 'https://www.carlogos.org/car-models/honda-amaze.png' },
    { name: 'Elevate', type: 'SUV', image: 'https://www.carlogos.org/car-models/honda-elevate.png' },
    { name: 'WR-V', type: 'SUV', image: 'https://www.carlogos.org/car-models/honda-wr-v.png' },
    { name: 'Jazz', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/honda-jazz.png' },
    { name: 'Civic', type: 'Sedan', image: 'https://www.carlogos.org/car-models/honda-civic.png' },
    { name: 'CR-V', type: 'SUV', image: 'https://www.carlogos.org/car-models/honda-cr-v.png' },
    { name: 'BR-V', type: 'SUV', image: 'https://www.carlogos.org/car-models/honda-br-v.png' },
  ],
  tata: [
    { name: 'Nexon', type: 'SUV', image: 'https://www.carlogos.org/car-models/tata-nexon.png' },
    { name: 'Punch', type: 'SUV', image: 'https://www.carlogos.org/car-models/tata-punch.png' },
    { name: 'Altroz', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/tata-altroz.png' },
    { name: 'Harrier', type: 'SUV', image: 'https://www.carlogos.org/car-models/tata-harrier.png' },
    { name: 'Safari', type: 'SUV', image: 'https://www.carlogos.org/car-models/tata-safari.png' },
    { name: 'Tiago', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/tata-tiago.png' },
    { name: 'Tigor', type: 'Sedan', image: 'https://www.carlogos.org/car-models/tata-tigor.png' },
    { name: 'Nexon EV', type: 'Electric', image: 'https://www.carlogos.org/car-models/tata-nexon-ev.png' },
    { name: 'Tiago EV', type: 'Electric', image: 'https://www.carlogos.org/car-models/tata-tiago-ev.png' },
    { name: 'Curvv', type: 'SUV', image: 'https://www.carlogos.org/car-models/tata-curvv.png' },
  ],
  toyota: [
    { name: 'Innova Crysta', type: 'MPV', image: 'https://www.carlogos.org/car-models/toyota-innova.png' },
    { name: 'Innova Hycross', type: 'MPV', image: 'https://www.carlogos.org/car-models/toyota-innova-hycross.png' },
    { name: 'Fortuner', type: 'SUV', image: 'https://www.carlogos.org/car-models/toyota-fortuner.png' },
    { name: 'Glanza', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/toyota-glanza.png' },
    { name: 'Urban Cruiser Hyryder', type: 'SUV', image: 'https://www.carlogos.org/car-models/toyota-urban-cruiser.png' },
    { name: 'Camry', type: 'Sedan', image: 'https://www.carlogos.org/car-models/toyota-camry.png' },
    { name: 'Vellfire', type: 'MPV', image: 'https://www.carlogos.org/car-models/toyota-vellfire.png' },
    { name: 'Land Cruiser', type: 'SUV', image: 'https://www.carlogos.org/car-models/toyota-land-cruiser.png' },
    { name: 'Hilux', type: 'Pickup', image: 'https://www.carlogos.org/car-models/toyota-hilux.png' },
  ],
  mahindra: [
    { name: 'XUV700', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-xuv700.png' },
    { name: 'Thar', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-thar.png' },
    { name: 'Scorpio N', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-scorpio.png' },
    { name: 'Scorpio Classic', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-scorpio-classic.png' },
    { name: 'XUV300', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-xuv300.png' },
    { name: 'XUV400 EV', type: 'Electric', image: 'https://www.carlogos.org/car-models/mahindra-xuv400.png' },
    { name: 'Bolero', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-bolero.png' },
    { name: 'Bolero Neo', type: 'SUV', image: 'https://www.carlogos.org/car-models/mahindra-bolero-neo.png' },
    { name: 'Marazzo', type: 'MPV', image: 'https://www.carlogos.org/car-models/mahindra-marazzo.png' },
    { name: 'BE 6', type: 'Electric', image: 'https://www.carlogos.org/car-models/mahindra-be-6.png' },
    { name: 'XEV 9e', type: 'Electric', image: 'https://www.carlogos.org/car-models/mahindra-xev-9e.png' },
  ],
  kia: [
    { name: 'Seltos', type: 'SUV', image: 'https://www.carlogos.org/car-models/kia-seltos.png' },
    { name: 'Sonet', type: 'SUV', image: 'https://www.carlogos.org/car-models/kia-sonet.png' },
    { name: 'Carens', type: 'MPV', image: 'https://www.carlogos.org/car-models/kia-carens.png' },
    { name: 'Carnival', type: 'MPV', image: 'https://www.carlogos.org/car-models/kia-carnival.png' },
    { name: 'EV6', type: 'Electric', image: 'https://www.carlogos.org/car-models/kia-ev6.png' },
    { name: 'EV9', type: 'Electric', image: 'https://www.carlogos.org/car-models/kia-ev9.png' },
  ],
  mg: [
    { name: 'Hector', type: 'SUV', image: 'https://www.carlogos.org/car-models/mg-hector.png' },
    { name: 'Hector Plus', type: 'SUV', image: 'https://www.carlogos.org/car-models/mg-hector-plus.png' },
    { name: 'Astor', type: 'SUV', image: 'https://www.carlogos.org/car-models/mg-astor.png' },
    { name: 'ZS EV', type: 'Electric', image: 'https://www.carlogos.org/car-models/mg-zs.png' },
    { name: 'Gloster', type: 'SUV', image: 'https://www.carlogos.org/car-models/mg-gloster.png' },
    { name: 'Comet EV', type: 'Electric', image: 'https://www.carlogos.org/car-models/mg-comet.png' },
  ],
  volkswagen: [
    { name: 'Polo', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/volkswagen-polo.png' },
    { name: 'Virtus', type: 'Sedan', image: 'https://www.carlogos.org/car-models/volkswagen-virtus.png' },
    { name: 'Taigun', type: 'SUV', image: 'https://www.carlogos.org/car-models/volkswagen-taigun.png' },
    { name: 'Tiguan', type: 'SUV', image: 'https://www.carlogos.org/car-models/volkswagen-tiguan.png' },
    { name: 'T-Roc', type: 'SUV', image: 'https://www.carlogos.org/car-models/volkswagen-t-roc.png' },
  ],
  skoda: [
    { name: 'Kushaq', type: 'SUV', image: 'https://www.carlogos.org/car-models/skoda-kushaq.png' },
    { name: 'Slavia', type: 'Sedan', image: 'https://www.carlogos.org/car-models/skoda-slavia.png' },
    { name: 'Kodiaq', type: 'SUV', image: 'https://www.carlogos.org/car-models/skoda-kodiaq.png' },
    { name: 'Superb', type: 'Sedan', image: 'https://www.carlogos.org/car-models/skoda-superb.png' },
    { name: 'Octavia', type: 'Sedan', image: 'https://www.carlogos.org/car-models/skoda-octavia.png' },
  ],
  renault: [
    { name: 'Kwid', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/renault-kwid.png' },
    { name: 'Triber', type: 'MPV', image: 'https://www.carlogos.org/car-models/renault-triber.png' },
    { name: 'Kiger', type: 'SUV', image: 'https://www.carlogos.org/car-models/renault-kiger.png' },
    { name: 'Duster', type: 'SUV', image: 'https://www.carlogos.org/car-models/renault-duster.png' },
  ],
  nissan: [
    { name: 'Magnite', type: 'SUV', image: 'https://www.carlogos.org/car-models/nissan-magnite.png' },
    { name: 'Kicks', type: 'SUV', image: 'https://www.carlogos.org/car-models/nissan-kicks.png' },
    { name: 'X-Trail', type: 'SUV', image: 'https://www.carlogos.org/car-models/nissan-x-trail.png' },
  ],
  ford: [
    { name: 'EcoSport', type: 'SUV', image: 'https://www.carlogos.org/car-models/ford-ecosport.png' },
    { name: 'Endeavour', type: 'SUV', image: 'https://www.carlogos.org/car-models/ford-endeavour.png' },
    { name: 'Figo', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/ford-figo.png' },
    { name: 'Aspire', type: 'Sedan', image: 'https://www.carlogos.org/car-models/ford-aspire.png' },
    { name: 'Freestyle', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/ford-freestyle.png' },
  ],
  chevrolet: [
    { name: 'Beat', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/chevrolet-beat.png' },
    { name: 'Cruze', type: 'Sedan', image: 'https://www.carlogos.org/car-models/chevrolet-cruze.png' },
    { name: 'Spark', type: 'Hatchback', image: 'https://www.carlogos.org/car-models/chevrolet-spark.png' },
    { name: 'Tavera', type: 'MPV', image: 'https://www.carlogos.org/car-models/chevrolet-tavera.png' },
    { name: 'Enjoy', type: 'MPV', image: 'https://www.carlogos.org/car-models/chevrolet-enjoy.png' },
  ],
  bmw: [
    { name: '2 Series Gran Coupe', type: 'Sedan', image: 'https://www.carlogos.org/car-models/bmw-2-series.png' },
    { name: '3 Series', type: 'Sedan', image: 'https://www.carlogos.org/car-models/bmw-3-series.png' },
    { name: '5 Series', type: 'Sedan', image: 'https://www.carlogos.org/car-models/bmw-5-series.png' },
    { name: '7 Series', type: 'Sedan', image: 'https://www.carlogos.org/car-models/bmw-7-series.png' },
    { name: 'X1', type: 'SUV', image: 'https://www.carlogos.org/car-models/bmw-x1.png' },
    { name: 'X3', type: 'SUV', image: 'https://www.carlogos.org/car-models/bmw-x3.png' },
    { name: 'X5', type: 'SUV', image: 'https://www.carlogos.org/car-models/bmw-x5.png' },
    { name: 'X7', type: 'SUV', image: 'https://www.carlogos.org/car-models/bmw-x7.png' },
    { name: 'iX', type: 'Electric', image: 'https://www.carlogos.org/car-models/bmw-ix.png' },
    { name: 'i4', type: 'Electric', image: 'https://www.carlogos.org/car-models/bmw-i4.png' },
    { name: 'i7', type: 'Electric', image: 'https://www.carlogos.org/car-models/bmw-i7.png' },
  ],
  audi: [
    { name: 'A4', type: 'Sedan', image: 'https://www.carlogos.org/car-models/audi-a4.png' },
    { name: 'A6', type: 'Sedan', image: 'https://www.carlogos.org/car-models/audi-a6.png' },
    { name: 'A8', type: 'Sedan', image: 'https://www.carlogos.org/car-models/audi-a8.png' },
    { name: 'Q3', type: 'SUV', image: 'https://www.carlogos.org/car-models/audi-q3.png' },
    { name: 'Q5', type: 'SUV', image: 'https://www.carlogos.org/car-models/audi-q5.png' },
    { name: 'Q7', type: 'SUV', image: 'https://www.carlogos.org/car-models/audi-q7.png' },
    { name: 'Q8', type: 'SUV', image: 'https://www.carlogos.org/car-models/audi-q8.png' },
    { name: 'e-tron', type: 'Electric', image: 'https://www.carlogos.org/car-models/audi-e-tron.png' },
    { name: 'e-tron GT', type: 'Electric', image: 'https://www.carlogos.org/car-models/audi-e-tron-gt.png' },
    { name: 'RS5', type: 'Sports', image: 'https://www.carlogos.org/car-models/audi-rs5.png' },
  ],
  mercedes: [
    { name: 'A-Class Limousine', type: 'Sedan', image: 'https://www.carlogos.org/car-models/mercedes-benz-a-class.png' },
    { name: 'C-Class', type: 'Sedan', image: 'https://www.carlogos.org/car-models/mercedes-benz-c-class.png' },
    { name: 'E-Class', type: 'Sedan', image: 'https://www.carlogos.org/car-models/mercedes-benz-e-class.png' },
    { name: 'S-Class', type: 'Sedan', image: 'https://www.carlogos.org/car-models/mercedes-benz-s-class.png' },
    { name: 'GLA', type: 'SUV', image: 'https://www.carlogos.org/car-models/mercedes-benz-gla-class.png' },
    { name: 'GLB', type: 'SUV', image: 'https://www.carlogos.org/car-models/mercedes-benz-glb-class.png' },
    { name: 'GLC', type: 'SUV', image: 'https://www.carlogos.org/car-models/mercedes-benz-glc-class.png' },
    { name: 'GLE', type: 'SUV', image: 'https://www.carlogos.org/car-models/mercedes-benz-gle-class.png' },
    { name: 'GLS', type: 'SUV', image: 'https://www.carlogos.org/car-models/mercedes-benz-gls-class.png' },
    { name: 'EQS', type: 'Electric', image: 'https://www.carlogos.org/car-models/mercedes-benz-eqs.png' },
    { name: 'EQE', type: 'Electric', image: 'https://www.carlogos.org/car-models/mercedes-benz-eqe.png' },
    { name: 'Maybach', type: 'Luxury', image: 'https://www.carlogos.org/car-models/mercedes-maybach-s-class.png' },
  ],
  jeep: [
    { name: 'Compass', type: 'SUV', image: 'https://www.carlogos.org/car-models/jeep-compass.png' },
    { name: 'Meridian', type: 'SUV', image: 'https://www.carlogos.org/car-models/jeep-meridian.png' },
    { name: 'Wrangler', type: 'SUV', image: 'https://www.carlogos.org/car-models/jeep-wrangler.png' },
    { name: 'Grand Cherokee', type: 'SUV', image: 'https://www.carlogos.org/car-models/jeep-grand-cherokee.png' },
  ],
  volvo: [
    { name: 'XC40', type: 'SUV', image: 'https://www.carlogos.org/car-models/volvo-xc40.png' },
    { name: 'XC60', type: 'SUV', image: 'https://www.carlogos.org/car-models/volvo-xc60.png' },
    { name: 'XC90', type: 'SUV', image: 'https://www.carlogos.org/car-models/volvo-xc90.png' },
    { name: 'S60', type: 'Sedan', image: 'https://www.carlogos.org/car-models/volvo-s60.png' },
    { name: 'S90', type: 'Sedan', image: 'https://www.carlogos.org/car-models/volvo-s90.png' },
    { name: 'XC40 Recharge', type: 'Electric', image: 'https://www.carlogos.org/car-models/volvo-xc40-recharge.png' },
    { name: 'C40 Recharge', type: 'Electric', image: 'https://www.carlogos.org/car-models/volvo-c40.png' },
  ],
  lexus: [
    { name: 'ES', type: 'Sedan', image: 'https://www.carlogos.org/car-models/lexus-es.png' },
    { name: 'LS', type: 'Sedan', image: 'https://www.carlogos.org/car-models/lexus-ls.png' },
    { name: 'NX', type: 'SUV', image: 'https://www.carlogos.org/car-models/lexus-nx.png' },
    { name: 'RX', type: 'SUV', image: 'https://www.carlogos.org/car-models/lexus-rx.png' },
    { name: 'LX', type: 'SUV', image: 'https://www.carlogos.org/car-models/lexus-lx.png' },
    { name: 'LC', type: 'Sports', image: 'https://www.carlogos.org/car-models/lexus-lc.png' },
  ],
  porsche: [
    { name: 'Cayenne', type: 'SUV', image: 'https://www.carlogos.org/car-models/porsche-cayenne.png' },
    { name: 'Macan', type: 'SUV', image: 'https://www.carlogos.org/car-models/porsche-macan.png' },
    { name: '911', type: 'Sports', image: 'https://www.carlogos.org/car-models/porsche-911.png' },
    { name: 'Panamera', type: 'Sedan', image: 'https://www.carlogos.org/car-models/porsche-panamera.png' },
    { name: 'Taycan', type: 'Electric', image: 'https://www.carlogos.org/car-models/porsche-taycan.png' },
  ],
  jaguar: [
    { name: 'F-Pace', type: 'SUV', image: 'https://www.carlogos.org/car-models/jaguar-f-pace.png' },
    { name: 'I-Pace', type: 'Electric', image: 'https://www.carlogos.org/car-models/jaguar-i-pace.png' },
    { name: 'XE', type: 'Sedan', image: 'https://www.carlogos.org/car-models/jaguar-xe.png' },
    { name: 'XF', type: 'Sedan', image: 'https://www.carlogos.org/car-models/jaguar-xf.png' },
    { name: 'F-Type', type: 'Sports', image: 'https://www.carlogos.org/car-models/jaguar-f-type.png' },
  ],
  landrover: [
    { name: 'Range Rover', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-range-rover.png' },
    { name: 'Range Rover Sport', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-range-rover-sport.png' },
    { name: 'Range Rover Velar', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-range-rover-velar.png' },
    { name: 'Range Rover Evoque', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-range-rover-evoque.png' },
    { name: 'Defender', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-defender.png' },
    { name: 'Discovery', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-discovery.png' },
    { name: 'Discovery Sport', type: 'SUV', image: 'https://www.carlogos.org/car-models/land-rover-discovery-sport.png' },
  ],
  mitsubishi: [
    { name: 'Outlander', type: 'SUV', image: 'https://www.carlogos.org/car-models/mitsubishi-outlander.png' },
    { name: 'Pajero', type: 'SUV', image: 'https://www.carlogos.org/car-models/mitsubishi-pajero.png' },
    { name: 'Pajero Sport', type: 'SUV', image: 'https://www.carlogos.org/car-models/mitsubishi-pajero-sport.png' },
  ],
};

const fuelTypes = [
  { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
  { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
  { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
  { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
];

const cities = [
  'Coimbatore', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 
  'Delhi', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Madurai',
  'Trichy', 'Salem', 'Erode', 'Tirupur'
];

type ViewState = 'main' | 'brands' | 'models' | 'fuel';

export const BookingWidget = () => {
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Coimbatore');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<typeof brands[0] | null>(null);
  const [selectedModel, setSelectedModel] = useState<{ name: string; type: string; image: string } | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<typeof fuelTypes[0] | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredModels = selectedBrand 
    ? (carModels[selectedBrand.id] || []).filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleBrandSelect = (brand: typeof brands[0]) => {
    setSelectedBrand(brand);
    setCurrentView('models');
    setSearchQuery('');
  };

  const handleModelSelect = (model: { name: string; type: string; image: string }) => {
    setSelectedModel(model);
    setCurrentView('fuel');
  };

  const handleFuelSelect = (fuel: typeof fuelTypes[0]) => {
    setSelectedFuel(fuel);
    setCurrentView('main');
  };

  const resetCarSelection = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedFuel(null);
  };

  const goBack = () => {
    if (currentView === 'brands') {
      setCurrentView('main');
    } else if (currentView === 'models') {
      setCurrentView('brands');
    } else if (currentView === 'fuel') {
      setCurrentView('models');
    }
    setSearchQuery('');
  };

  const isCarSelected = selectedBrand && selectedModel && selectedFuel;

  const getCarDisplayText = () => {
    if (isCarSelected) {
      return `${selectedBrand?.name} ${selectedModel?.name}`;
    }
    return 'Select your car';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md relative"
    >
      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Top Accent Bar - Themeable */}
        <motion.div 
          className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%]"
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {/* ==================== MAIN VIEW ==================== */}
            {currentView === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    Book Your Service
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get instant quotes & doorstep service
                  </p>
                </div>

                {/* City Selector */}
                <div className="relative">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Select City
                  </label>
                  <button
                    onClick={() => setIsCityOpen(!isCityOpen)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-secondary/50 border border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <MapPin className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-base font-semibold text-foreground">{selectedCity}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isCityOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isCityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-30 max-h-52 overflow-y-auto custom-scrollbar"
                      >
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => { setSelectedCity(city); setIsCityOpen(false); }}
                            className={`w-full px-4 py-3.5 text-left text-sm font-medium transition-all flex items-center justify-between ${
                              selectedCity === city 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:bg-secondary'
                            }`}
                          >
                            {city}
                            {selectedCity === city && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Car Selector */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Select Your Car
                  </label>
                  <button
                    onClick={() => setCurrentView('brands')}
                    className={`w-full flex items-center justify-between px-4 py-4 border rounded-2xl transition-all ${
                      isCarSelected 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-secondary/50 border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
                        isCarSelected 
                          ? 'bg-card shadow-md border border-primary/20' 
                          : 'bg-secondary'
                      }`}>
                        {isCarSelected && selectedBrand ? (
                          <img 
                            src={selectedBrand.logo} 
                            alt={selectedBrand.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => { 
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://ui-avatars.com/api/?name=${selectedBrand.name.charAt(0)}&background=FF5733&color=fff&size=56&bold=true`;
                            }}
                          />
                        ) : (
                          <Car className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className={`text-base font-semibold block ${isCarSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {getCarDisplayText()}
                        </span>
                        {isCarSelected && selectedFuel && (
                          <span className="text-xs text-primary font-medium">{selectedFuel.name} • {selectedModel?.type}</span>
                        )}
                      </div>
                    </div>
                    {isCarSelected ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); resetCarSelection(); }}
                        className="p-2 hover:bg-destructive/10 rounded-full transition-colors group"
                      >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Mobile Number
                  </label>
                  <div className="flex items-center gap-3 px-4 py-4 bg-secondary/50 border border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-base font-semibold text-muted-foreground">+91</span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your mobile number"
                      className="flex-1 bg-transparent outline-none text-base font-semibold text-foreground placeholder-muted-foreground"
                    />
                    {mobileNumber.length === 10 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isCarSelected || mobileNumber.length !== 10}
                  className="w-full py-4 bg-primary text-primary-foreground text-base font-bold rounded-2xl shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  Check Prices For Free
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* ==================== BRAND SELECTION VIEW ==================== */}
            {currentView === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header with Back */}
                <div className="flex items-center gap-3 mb-5">
                  <button 
                    onClick={goBack} 
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Select Brand</h3>
                    <p className="text-xs text-muted-foreground">Choose your car manufacturer</p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl mb-5">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search car brand..."
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground placeholder-muted-foreground"
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-border rounded-full">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-3 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredBrands.map((brand, idx) => (
                    <motion.button
                      key={brand.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBrandSelect(brand)}
                      className="flex flex-col items-center p-4 bg-secondary/30 hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all"
                    >
                      <div className="w-14 h-14 mb-2 flex items-center justify-center">
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://ui-avatars.com/api/?name=${brand.name.charAt(0)}&background=FF5733&color=fff&size=56&bold=true`;
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center leading-tight">
                        {brand.name}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {filteredBrands.length === 0 && (
                  <div className="text-center py-10">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No brands found</p>
                    <p className="text-sm text-muted-foreground/80">Try a different search term</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== MODEL SELECTION VIEW ==================== */}
            {currentView === 'models' && selectedBrand && (
              <motion.div
                key="models"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header with Back */}
                <div className="flex items-center gap-3 mb-5">
                  <button 
                    onClick={goBack} 
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedBrand.logo} 
                      alt={selectedBrand.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${selectedBrand.name.charAt(0)}&background=FF5733&color=fff&size=40&bold=true`;
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Select Model</h3>
                      <p className="text-xs text-muted-foreground">{selectedBrand.name} models</p>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl mb-5">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model..."
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground placeholder-muted-foreground"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-border rounded-full">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Model Grid with Car Images */}
                <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredModels.map((model, idx) => (
                    <motion.button
                      key={model.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModelSelect(model)}
                      className="flex flex-col items-center p-3 bg-secondary/30 hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all text-center"
                    >
                      <div className="w-full h-16 mb-2 flex items-center justify-center">
                        <img 
                          src={model.image} 
                          alt={model.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<span class="text-3xl">🚗</span>';
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground block truncate w-full">
                        {model.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{model.type}</span>
                    </motion.button>
                  ))}
                </div>

                {filteredModels.length === 0 && (
                  <div className="text-center py-10">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No models found</p>
                    <p className="text-sm text-muted-foreground/80">Try a different search term</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== FUEL TYPE SELECTION VIEW ==================== */}
            {currentView === 'fuel' && (
              <motion.div
                key="fuel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header with Back */}
                <div className="flex items-center gap-3 mb-5">
                  <button 
                    onClick={goBack} 
                    className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Select Fuel Type</h3>
                    <p className="text-xs text-muted-foreground">Choose your car's fuel type</p>
                  </div>
                </div>

                {/* Selected Car Summary */}
                <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-5">
                  <div className="w-16 h-12 flex items-center justify-center">
                    <img 
                      src={selectedModel?.image} 
                      alt={selectedModel?.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<span class="text-2xl">🚗</span>';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-foreground">
                      {selectedBrand?.name} {selectedModel?.name}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {selectedModel?.type} • Almost there!
                    </p>
                  </div>
                  <img 
                    src={selectedBrand?.logo} 
                    alt={selectedBrand?.name}
                    className="w-8 h-8 object-contain opacity-50"
                  />
                </div>

                {/* Fuel Type Options */}
                <div className="space-y-3">
                  {fuelTypes.map((fuel, idx) => (
                    <motion.button
                      key={fuel.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFuelSelect(fuel)}
                      className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${fuel.color}15` }}
                        >
                          {fuel.icon}
                        </div>
                        <span className="text-base font-semibold text-foreground">{fuel.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust Footer - Only on main view */}
        {currentView === 'main' && (
          <div className="px-6 sm:px-8 py-4 bg-secondary/20 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-semibold">4.8/5</span> Rating
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span><span className="font-semibold">50,000+</span> Services</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </motion.div>
  );
};