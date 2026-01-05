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
    { name: 'Swift', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/159099/swift-exterior-right-front-three-quarter-31.png?isig=0&q=80' },
    { name: 'Baleno', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-69.png?isig=0&q=80' },
    { name: 'Alto K10', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/127563/alto-k10-exterior-right-front-three-quarter-63.png?isig=0&q=80' },
    { name: 'Wagon R', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/112947/wagon-r-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
    { name: 'Dzire', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/170173/dzire-exterior-right-front-three-quarter-27.png?isig=0&q=80' },
    { name: 'Vitara Brezza', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39028/marutisuzuki-vitara-brezza-right-front-three-quarter3.jpeg?q=80' },
    { name: 'Ertiga', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/115777/ertiga-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
    { name: 'Ciaz', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/48542/ciaz-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'S-Cross', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/46482/s-cross-petrol-exterior-right-front-three-quarter.jpeg?q=80' },
    { name: 'Ignis', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/142921/ignis-exterior-right-front-three-quarter-16.png?isig=0&q=80' },
    { name: 'Celerio', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/53695/celerio-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'XL6', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/115601/xl6-exterior-right-front-three-quarter-13.png?isig=0&q=80' },
    { name: 'Grand Vitara', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/grand-vitara-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Fronx', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/130591/fronx-exterior-right-front-three-quarter-109.png?isig=0&q=80' },
    { name: 'Jimny', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/45299/jimny-exterior-right-front-three-quarter-23.png?isig=0&q=80' },
    { name: 'Invicto', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/147201/invicto-exterior-right-front-three-quarter-68.png?isig=0&q=80' },
    { name: 'Victoris', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/194921/victoris-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'Brezza', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/107543/brezza-exterior-right-front-three-quarter-9.png?isig=0&q=80' },
    { name: 'S-Presso', type: 'Mini SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/126463/s-presso-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Eeco', type: 'Van', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/135523/eeco-exterior-right-front-three-quarter-3.png?isig=0&q=80' }
    
  ],
  hyundai: [
    { name: 'Creta', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/106815/creta-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
    { name: 'Creta N Line', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/168697/creta-n-line-exterior-right-front-three-quarter-26.png?isig=0&q=80' },
    { name: 'i20', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/150603/i20-exterior-right-front-three-quarter-13.png?isig=0&q=80' },
    { name: 'Venue', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/197163/venue-exterior-right-front-three-quarter-38.png?isig=0&q=80' },
    { name: 'Verna', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/121943/verna-exterior-right-front-three-quarter-103.png?isig=0&q=80' },
    { name: 'Grand i10 Nios', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/136183/grand-i10-nios-exterior-right-front-three-quarter-17.png?isig=0&q=80' },
    { name: 'Aura', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/139133/aura-exterior-right-front-three-quarter-9.png?isig=0&q=80' },
    { name: 'Tucson', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/106821/tucson-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'Alcazar', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/157825/alcazar-exterior-right-front-three-quarter-24.png?isig=0&q=80' },
    { name: 'Exter', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/144851/exter-exterior-right-front-three-quarter-64.png?isig=0&q=80' },
    { name: 'Ioniq 5', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/110289/ioniq-5-exterior-right-front-three-quarter-96.png?isig=0&q=80' },
    { name: 'Kona Electric', type: 'Electric', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/29580/kona-electric-exterior-right-front-three-quarter-162254.jpeg?isig=0&wm=1&q=80' },
    { name: 'Venue N Line', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/210466/new-venue-n-line-exterior-right-front-three-quarter-11.png?isig=0&q=80' },
    { name: 'i20 N Line', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/158139/i20-n-line-exterior-right-front-three-quarter-16.png?isig=0&q=80' },
  ],
  honda: [
    { name: 'City', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'Amaze', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/184377/amaze-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Elevate', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/142515/elevate-exterior-right-front-three-quarter-29.png?isig=0&q=80' },
    { name: 'WR-V', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/134113/wr-v-exterior-left-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Jazz', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/46891/jazz-exterior-right-front-three-quarter.jpeg?q=80' },
    { name: 'Civic', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/27074/civic-exterior-right-front-three-quarter-148156.jpeg?q=80' },
    { name: 'CR-V', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/34457/cr-v-exterior-right-front-three-quarter.jpeg?q=80' },
    { name: 'BR-V', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/cw/ec/19810/Honda-BRV-Exterior-119023.jpg?wm=0&q=80' },
  ],
  tata: [
    { name: 'Nexon', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-79.png?isig=0&q=80' },
    { name: 'Punch', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/39015/punch-exterior-right-front-three-quarter-58.png?isig=0&q=80' },
    { name: 'Altroz', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/199863/altroz-exterior-right-front-three-quarter-13.png?isig=0&q=80' },
    { name: 'Harrier', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/139139/harrier-exterior-right-front-three-quarter-7.png?isig=0&q=80' },
    { name: 'Safari', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/138895/safari-exterior-right-front-three-quarter-40.png?isig=0&q=80' },
    { name: 'Tiago', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/39345/tiago-exterior-right-front-three-quarter-33.png?isig=0&q=80' },
    { name: 'Tigor', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/41160/tigor-exterior-right-front-three-quarter-23.png?isig=0&q=80' },
    { name: 'Nexon EV', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/149123/nexon-ev-exterior-right-front-three-quarter-80.png?isig=0&q=80' },
    { name: 'Tiago EV', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/40453/tiago-ev-exterior-right-front-three-quarter-15.png?isig=0&q=80' },
    { name: 'Curvv', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/139651/curvv-exterior-right-front-three-quarter-16.png?isig=0&q=80' },
  ],
  toyota: [
    { name: 'Innova Crysta', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'Innova Hycross', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/115025/innova-hycross-exterior-right-front-three-quarter-74.png?isig=0&q=80' },
    { name: 'Fortuner', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-28.png?isig=0&q=80' },
    { name: 'Fortuner Legender', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/137767/fortuner-legender-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Glanza', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/112839/glanza-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
    { name: 'Urban Cruiser Hyryder', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/124027/hyryder-exterior-right-front-three-quarter-74.png?isig=0&q=80' },
    { name: 'Urban Cruiser Taisor', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/132427/taisor-exterior-right-front-three-quarter-41.png?isig=0&q=80' },
    { name: 'Vellfire', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/154483/vellfire-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'Hilux', type: 'Pickup', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/109265/hilux-exterior-right-front-three-quarter-44.png?isig=0&q=80' },
    { name: 'Yaris', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/32943/yaris-exterior-right-front-three-quarter-2.jpeg?q=80' },
    { name: 'Rumion', type: 'MPV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/105799/rumion-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'Camry', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/192443/camry-exterior-right-front-three-quarter-15.png?isig=0&q=80' },
    { name: 'Corolla Altis', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/cw/ec/26588/Toyota-Corolla-Altis-Exterior-92974.jpg?wm=0&q=80' },
    { name: 'Land Cruiser', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/139739/land-cruiser-exterior-right-front-three-quarter-3.png?isig=0&q=80' }
  ],
  mahindra: [
    { name: 'XUV700', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'Thar', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/204996/thar-2025-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Scorpio N', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/40432/scorpio-n-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'Scorpio Classic', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'XUV300', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/26918/xuv300-exterior-right-front-three-quarter-148709.jpeg?isig=0&q=80' },
    { name: 'XUV400 EV', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/45278/xuv400-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'Bolero', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/210987/bolero-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'Bolero Neo', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/210989/bolero-neo-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'Marazzo', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/49114/marazzo-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'BE 6', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/131825/be-6-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
    { name: 'XEV 9S', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/212003/xev9s-exterior-right-front-three-quarter-11.png?isig=0&q=80' },
    { name: 'XEV 9e', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/130595/xev-9e-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'Thar Roxx', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/124839/thar-roxx-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'KUV100 NXT', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/21497/kuv100-nxt-exterior-right-front-three-quarter-64047.jpeg?q=80' },
    { name: 'TUV300', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/cw/ec/39470/Mahindra-TUV300-Right-Front-Three-Quarter-155763.jpg?wm=0&q=80' },
    { name: 'XUV 3XO', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/156405/xuv-3xo-exterior-right-front-three-quarter-33.png?isig=0&q=80' },
  ],
  kia: [
    { name: 'Seltos', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/192817/new-seltos-exterior-right-front-three-quarter-48.jpeg?isig=0&q=80' },
    { name: 'Sonet', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/174423/sonet-exterior-right-front-three-quarter-12.png?isig=0&q=80' },
    { name: 'Carens', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/174325/carens-exterior-right-front-three-quarter-9.png?isig=0&q=80' },
    { name: 'Carens Clavis', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/195199/carens-clavis-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'Carnival', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/138947/carnival-exterior-right-front-three-quarter-20.png?isig=0&q=80' },
    { name: 'EV6', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/186465/ev6-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'EV9', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/144485/ev9-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
  ],
  mg: [
    { name: 'Hector', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/212881/hector-facelift-exterior-right-front-three-quarter.png?isig=0&q=80' },
    { name: 'Hector Plus', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/214253/hector-plus-exterior-right-front-three-quarter.png?isig=0&q=80' },
    { name: 'Astor', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/51940/astor-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'ZS EV', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/110437/zs-ev-exterior-right-front-three-quarter-70.png?isig=0&q=80' },
    { name: 'Gloster', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/129689/gloster-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Comet EV', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/125193/comet-ev-exterior-right-front-three-quarter-31.png?isig=0&q=80' },
  ],
  volkswagen: [
    { name: 'Polo', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/29628/polo-exterior-right-front-three-quarter-2.jpeg?q=80' },
    { name: 'Virtus', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/144681/virtus-exterior-right-front-three-quarter-11.png?isig=0&q=80' },
    { name: 'Taigun', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/144689/taigun-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'Tiguan R-Line', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/198751/tiguan-r-line-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
    { name: 'Golf GTI', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/198749/golf-gti-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
  ],
  skoda: [
    { name: 'Kushaq', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/175993/kushaq-exterior-right-front-three-quarter-2.avif?isig=0&q=80' },
    { name: 'Slavia', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/175951/slavia-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
    { name: 'Kodiaq', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/158729/kodiaq-exterior-right-front-three-quarter-14.png?isig=0&q=80' },
    { name: 'Superb', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/158937/superb-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80' },
    { name: 'Octavia RS', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/204968/octaviars-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' },
    { name: 'kylaq', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/171777/kylaq-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
  ],
  renault: [
    { name: 'Kwid', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/141125/kwid-exterior-right-front-three-quarter-38.png?isig=0&q=80' },
    { name: 'Triber', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/199767/triber-exterior-right-front-three-quarter-26.png?isig=0&q=80' },
    { name: 'Kiger', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/208550/kiger-exterior-right-front-three-quarter-30.png?isig=0&q=80' },
    { name: 'Duster', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/163801/new-duster-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
  ],
  nissan: [
    { name: 'Magnite', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/173325/magnite-exterior-right-front-three-quarter-27.png?isig=0&q=80' },
    { name: 'Kicks', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/cw/ec/32596/Nissan-Kicks-Right-Front-Three-Quarter-159680.jpg?wm=0&q=80' },
    { name: 'X-Trail', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/133165/x-trail-exterior-right-front-three-quarter-28.png?isig=0&q=80' },
  ],
  ford: [
    { name: 'EcoSport', type: 'SUV', image: 'https://imgd.aeplcdn.com/370x208/cw/ec/31676/Ford-EcoSport-New-Right-Front-Three-Quarter-111783.jpg?wm=0' },
    { name: 'Endeavour', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/37640/endeavour-exterior-right-front-three-quarter-149473.jpeg?q=80' },
    { name: 'Figo', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/370x208/cw/cars/discontinued/ford/figo-2010-2012.jpg' },
    { name: 'Aspire', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/35583/aspire-exterior-right-front-three-quarter-2.jpeg?q=80' },
    { name: 'Freestyle', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/32698/freestyle-exterior-right-front-three-quarter-2.jpeg?q=80' },
  ],
  chevrolet: [
    { name: 'Beat', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/cw/ec/21745/Chevrolet-Beat-Right-Front-Three-Quarter-81148.jpg?wm=0&q=80' },
    { name: 'Cruze', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/cw/ec/22891/Chevrolet-Cruze-Right-Front-Three-Quarter-73032.jpg?wm=0&q=80' },
    { name: 'Spark', type: 'Hatchback', image: 'https://imgd.aeplcdn.com/227x128/cw/cars/chevrolet/spark.jpg?q=80' },
    { name: 'Tavera', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/ec/89/7A/9793/img/m/Chevrolet-Tavera-Right-Front-Three-Quarter-49908_ol.jpg?t=123011560&t=123011560&q=80' },
    { name: 'Enjoy', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/ec/65/A5/10311/img/m/Chevrolet-Enjoy-Right-Front-Three-Quarter-49907_ol.jpg?t=122622283&t=122622283&q=80' },
  ],
  bmw: [
    { name: '2 Series Gran Coupe', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/205930/2-series-gran-coupe-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: '3 Series LWB', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/198567/3-series-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
    { name: '5 Series', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/175183/5-series-exterior-right-front-three-quarter-95.png?isig=0&q=80' },
    { name: '7 Series', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/132513/7-series-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'X1', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/140591/x1-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'X3', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/179903/x3-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'X5', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/152681/x5-exterior-right-front-three-quarter-7.png?isig=0&q=80' },
    { name: 'X7', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/136217/x7-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
    { name: 'iX LWB', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/196035/ix1-lwb-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'i4', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/109123/i4-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'i7', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/137875/i7-exterior-right-front-three-quarter-9.png?isig=0&q=80' },
  ],
  audi: [
    { name: 'A4', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/51909/a4-exterior-right-front-three-quarter-2.jpeg?q=80' },
    { name: 'A6', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/39472/a6-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' },
    { name: 'A8 L', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/124141/a8-l-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' },
    { name: 'Q3', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/28379/q3-exterior-right-front-three-quarter-93481.jpeg?isig=0&q=80' },
    { name: 'Q5', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/53591/q5-exterior-right-front-three-quarter-36.jpeg?isig=0&q=80' },
    { name: 'Q7', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/192279/q7-exterior-right-front-three-quarter.jpeg?isig=0&q=80' },
    { name: 'Q8', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/184519/q8-facelift-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' },
    { name: 'e-tron', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/39048/e-tron-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' },
    { name: 'e-tron GT', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/47073/e-tron-gt-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' },
    { name: 'RS5', type: 'Sports', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/100073/rs5-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' },
  ],
  mercedes: [
    { name: 'A-Class Limousine', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/149525/a-class-limousine-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'C-Class', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/178535/c-class-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'E-Class', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/162929/e-class-exterior-right-front-three-quarter-35.png?isig=0&q=80' },
    { name: 'S-Class', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/48067/s-class-exterior-right-front-three-quarter-10.png?isig=0&q=80' },
    { name: 'G-Class', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/150621/g-class-exterior-right-front-three-quarter-7.jpeg?isig=0&q=80' },
    { name: 'GLA', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/169159/gla-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'GLB', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134297/glb-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' },
    { name: 'GLC', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/178525/glc-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'GLE', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/163317/gle-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'GLS', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/167373/gls-exterior-right-front-three-quarter-22.png?isig=0&q=80' },
    { name: 'EQS', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/131249/eqs-exterior-right-front-three-quarter-31.png?isig=0&q=80' },
    { name: 'EQE', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/108113/eqe-suv-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'Maybach S-Class', type: 'Luxury', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/115149/maybach-s-class-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
    { name: 'AMG CLE', type: 'Luxury', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/207030/amg-cle-exterior-right-front-three-quarter-33.png?isig=0&q=80' },
    { name: 'Maybach GLS', type: 'Luxury', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/177511/maybach-gls-exterior-right-front-three-quarter-5.png?isig=0&q=80' },

  ],
  jeep: [
    { name: 'Compass', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/47051/compass-exterior-right-front-three-quarter-84.png?isig=0&q=80' },
    { name: 'Meridian', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/47139/meridian-exterior-right-front-three-quarter-18.png?isig=0&q=80' },
    { name: 'Wrangler', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/174975/wrangler-exterior-right-front-three-quarter-34.png?isig=0&q=80' },
    { name: 'Grand Cherokee', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/132711/grand-cherokee-exterior-right-front-three-quarter-28.png?isig=0&q=80' },
  ],
  volvo: [
    { name: 'XC40', type: 'SUV', image: 'https://imgd.aeplcdn.com/664x374/cw/ec/32889/Volvo-XC40-Exterior-130763.jpg?wm=0&q=80' },
    { name: 'XC60', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/206978/xc60-exterior-right-front-three-quarter-8.png?isig=0&q=80' },
    { name: 'XC90', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/198257/xc90-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'EC40', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/150611/c40-recharge-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' },
    { name: 'S60', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/27032/s60-exterior-right-front-three-quarter-3.jpeg?q=80' },
    { name: 'S90', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/131145/s90-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80' },
    { name: 'EX30', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/173187/ex30-exterior-right-front-three-quarter-6.png?isig=0&q=80' },
    { name: 'C40 Recharge', type: 'Electric', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/150611/c40-recharge-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' },
  ],
  lexus: [
    { name: 'ES', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/35351/es-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'LS', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/28191/ls-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' },
    { name: 'NX', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/113023/nx-exterior-right-front-three-quarter-4.png?isig=0&q=80' },
    { name: 'RX', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/139465/rx-exterior-right-front-three-quarter-15.png?isig=0&q=80' },
    { name: 'LX', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/137979/lx-exterior-right-front-three-quarter-40.png?isig=0&q=80' },
    { name: 'LC', type: 'Sports', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44615/lexus-lc-500h-right-front-three-quarter10.jpeg?q=80' },
    { name: 'LM', type: 'MPV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/155855/lm-exterior-right-front-three-quarter-5.png?isig=0&q=80' }
  ],
  porsche: [
    { name: 'Cayenne', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/32951/cayenne-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' },
    { name: 'Macan', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/99421/macan-exterior-right-front-three-quarter-9.jpeg?isig=0&q=80' },
    { name: '911', type: 'Sports', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/39232/911-exterior-right-front-three-quarter-154382.jpeg?isig=0&q=80' },
    { name: 'Panamera', type: 'Sedan', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/165641/panamera-exterior-right-front-three-quarter.jpeg?isig=0&q=80' },
    { name: 'Taycan', type: 'Electric', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/45063/taycan-exterior-right-front-three-quarter-5.jpeg?isig=0&q=80' },
  ],
  jaguar: [
    { name: 'F-Pace', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/56265/f-pace-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'I-Pace', type: 'Electric', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/39480/i-pace-exterior-right-front-three-quarter-2.jpeg?isig=0&q=80' },
    { name: 'XE', type: 'Sedan', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43356/jaguar-xe-front-right-three-quarter-7.jpeg?q=80' },
    { name: 'XF', type: 'Sedan', image: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/19826/xf-exterior-right-front-three-quarter-2.jpeg?isig=0' },
    { name: 'F-Type', type: 'Sports', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/46994/f-type-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80' },
  ],
  landrover: [
    { name: 'Range Rover', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/107719/range-rover-exterior-right-front-three-quarter-47.png?isig=0&q=80' },
    { name: 'Range Rover Sport', type: 'Sport', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/122451/range-rover-sport-exterior-right-front-three-quarter-44.png?isig=0&q=80' },
    { name: 'Range Rover Velar', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/153319/range-rover-velar-exterior-right-front-three-quarter-5.png?isig=0&q=80' },
    { name: 'Range Rover Evoque', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/37721/range-rover-evoque-exterior-right-front-three-quarter-2.png?isig=0&q=80' },
    { name: 'Defender', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/55215/defender-exterior-right-front-three-quarter-23.png?isig=0&q=80' },
    { name: 'Discovery', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/24806/discovery-exterior-right-front-three-quarter-3.png?isig=0&q=80' },
    { name: 'Discovery Sport', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/n/cw/ec/127321/discovery-sport-exterior-right-front-three-quarter-42.png?isig=0&q=80' },
  ],
  mitsubishi: [
    { name: 'Outlander', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/cw/ec/34253/Mitsubishi-Outlander-Exterior-130062.jpg?wm=0&q=80' },
    { name: 'Montero', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/cw/ec/23799/Mitsubishi-Montero-Right-Front-Three-Quarter-74529.jpg?wm=0&q=80' },
    { name: 'Pajero Sport', type: 'SUV', image: 'https://imgd.aeplcdn.com/227x128/ec/b8/0e/9739/img/m/Mitsubishi-Pajero-Sport-Right-Front-Three-Quarter-52939_ol.jpg?t=170422253&t=170422253&q=80' },
  ],
};

const fuelTypes = [
  { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
  { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
  { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
  { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
];

const cities = [
   'Chennai'
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
      id="booking-widget"
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
