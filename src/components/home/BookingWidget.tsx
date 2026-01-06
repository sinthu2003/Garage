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

// ============== BRAND LOGO IMPORTS (.png) ==============
import audiLogo from '../../assets/brand/audi-logo.png';
import bmwLogo from '../../assets/brand/bmw-logo.png';
import chevroletLogo from '../../assets/brand/chevrolet-logo.png';
import fordLogo from '../../assets/brand/ford-logo.png';
import hondaLogo from '../../assets/brand/honda-logo.png';
import hyundaiLogo from '../../assets/brand/hyundai-logo.png';
import jaguarLogo from '../../assets/brand/jaguar-logo.png';
import jeepLogo from '../../assets/brand/jeep-logo.png';
import kiaLogo from '../../assets/brand/kia-logo.png';
import landRoverLogo from '../../assets/brand/land-rover-logo.png';
import lexusLogo from '../../assets/brand/lexus-logo.png';
import mahindraLogo from '../../assets/brand/mahindra-logo.png';
import mercedesLogo from '../../assets/brand/mercedes-benz-logo.png';
import mgLogo from '../../assets/brand/mg-logo.png';
import mitsubishiLogo from '../../assets/brand/mitsubishi-logo.png';
import nissanLogo from '../../assets/brand/nissan-logo.png';
import porscheLogo from '../../assets/brand/porsche-logo.png';
import renaultLogo from '../../assets/brand/renault-logo.png';
import skodaLogo from '../../assets/brand/skoda-logo.png';
import suzukiLogo from '../../assets/brand/suzuki-logo.png';
import tataLogo from '../../assets/brand/tata-logo.png';
import toyotaLogo from '../../assets/brand/toyota-logo.png';
import volkswagenLogo from '../../assets/brand/volkswagen-logo.png';
import volvoLogo from '../../assets/brand/volvo-logo.png';

// ============== MARUTI SUZUKI MODEL IMPORTS ==============
import swiftImage from '../../assets/model/maruti-suzuki/swift-exterior-right-front-three-quarter-31.avif';
import balenoImage from '../../assets/model/maruti-suzuki/baleno-exterior-right-front-three-quarter-69.avif';
import altoK10Image from '../../assets/model/maruti-suzuki/alto-k10-exterior-right-front-three-quarter-63.avif';
import wagonRImage from '../../assets/model/maruti-suzuki/wagon-r-exterior-right-front-three-quarter-6.avif';
import dzireImage from '../../assets/model/maruti-suzuki/dzire-exterior-right-front-three-quarter-27.avif';
import vitaraBrezzaImage from '../../assets/model/maruti-suzuki/marutisuzuki-vitara-brezza-right-front-three-quarter3.avif';
import ertigaImage from '../../assets/model/maruti-suzuki/ertiga-exterior-right-front-three-quarter-10.avif';
import ciazImage from '../../assets/model/maruti-suzuki/ciaz-exterior-right-front-three-quarter-2.avif';
import sCrossImage from '../../assets/model/maruti-suzuki/s-cross-petrol-exterior-right-front-three-quarter.avif';
import ignisImage from '../../assets/model/maruti-suzuki/ignis-exterior-right-front-three-quarter-16.avif';
import celerioImage from '../../assets/model/maruti-suzuki/celerio-exterior-right-front-three-quarter-8.avif';
import xl6Image from '../../assets/model/maruti-suzuki/xl6-exterior-right-front-three-quarter-13.avif';
import newGrandVitaraImage from '../../assets/model/maruti-suzuki/grand-vitara-exterior-right-front-three-quarter-5.avif';
import fronxImage from '../../assets/model/maruti-suzuki/fronx-exterior-right-front-three-quarter-109.avif';
import jimnyImage from '../../assets/model/maruti-suzuki/jimny-exterior-right-front-three-quarter-23.avif';
import invictoImage from '../../assets/model/maruti-suzuki/invicto-exterior-right-front-three-quarter-68.avif';
import victorisImage from '../../assets/model/maruti-suzuki/victoris-exterior-right-front-three-quarter-8.avif';
import brezzaImage from '../../assets/model/maruti-suzuki/brezza-exterior-right-front-three-quarter-9.avif';
import sPressoImage from '../../assets/model/maruti-suzuki/s-presso-exterior-right-front-three-quarter-5.avif';
import eecoImage from '../../assets/model/maruti-suzuki/eeco-exterior-right-front-three-quarter-3.avif';

// ============== HYUNDAI MODEL IMPORTS ==============
import cretaImage from '../../assets/model/hyundai/creta-exterior-right-front-three-quarter-6.avif';
import cretaNLineImage from '../../assets/model/hyundai/creta-n-line-exterior-right-front-three-quarter-26.avif';
import i20Image from '../../assets/model/hyundai/i20-exterior-right-front-three-quarter-13.avif';
import venueImage from '../../assets/model/hyundai/venue-exterior-right-front-three-quarter-38.avif';
import vernaImage from '../../assets/model/hyundai/verna-exterior-right-front-three-quarter-103.avif';
import grandI10NiosImage from '../../assets/model/hyundai/grand-i10-nios-exterior-right-front-three-quarter-17.avif';
import auraImage from '../../assets/model/hyundai/aura-exterior-right-front-three-quarter-9.avif';
import tucsonImage from '../../assets/model/hyundai/tucson-exterior-right-front-three-quarter-8.avif';
import alcazarImage from '../../assets/model/hyundai/alcazar-exterior-right-front-three-quarter-24.avif';
import exterImage from '../../assets/model/hyundai/exter-exterior-right-front-three-quarter-64.avif';
import ioniq5Image from '../../assets/model/hyundai/ioniq-5-exterior-right-front-three-quarter-96.avif';
import konaElectricImage from '../../assets/model/hyundai/kona-electric-exterior-right-front-three-quarter-162254.avif';
import venueNLineImage from '../../assets/model/hyundai/new-venue-n-line-exterior-right-front-three-quarter-11.avif';
import i20NLineImage from '../../assets/model/hyundai/i20-n-line-exterior-right-front-three-quarter-16.avif';

// ============== HONDA MODEL IMPORTS ==============
import cityImage from '../../assets/model/honda/city-exterior-right-front-three-quarter-2.avif';
import amazeImage from '../../assets/model/honda/amaze-exterior-right-front-three-quarter-5.avif';
import elevateImage from '../../assets/model/honda/elevate-exterior-right-front-three-quarter-29.avif';
import wrVImage from '../../assets/model/honda/wr-v-exterior-left-front-three-quarter-5.avif';
import jazzImage from '../../assets/model/honda/jazz-exterior-right-front-three-quarter.avif';
import civicImage from '../../assets/model/honda/civic-exterior-right-front-three-quarter-148156.avif';
import crVImage from '../../assets/model/honda/cr-v-exterior-right-front-three-quarter.avif';
import brVImage from '../../assets/model/honda/Honda-BRV-Exterior-119023.avif';

// ============== TATA MODEL IMPORTS ==============
import nexonImage from '../../assets/model/tata/nexon-exterior-right-front-three-quarter-79.avif';
import punchImage from '../../assets/model/tata/punch-exterior-right-front-three-quarter-58.avif';
import altrozImage from '../../assets/model/tata/altroz-exterior-right-front-three-quarter-13.avif';
import harrierImage from '../../assets/model/tata/harrier-exterior-right-front-three-quarter-7.avif';
import safariImage from '../../assets/model/tata/safari-exterior-right-front-three-quarter-40.avif';
import tiagoImage from '../../assets/model/tata/tiago-exterior-right-front-three-quarter-33.avif';
import tigorImage from '../../assets/model/tata/tigor-exterior-right-front-three-quarter-23.avif';
import nexonEvImage from '../../assets/model/tata/nexon-ev-exterior-right-front-three-quarter-80.avif';
import tiagoEvImage from '../../assets/model/tata/tiago-ev-exterior-right-front-three-quarter-15.avif';
import curvvImage from '../../assets/model/tata/curvv-exterior-right-front-three-quarter-16.avif';

// ============== TOYOTA MODEL IMPORTS ==============
import innovaCrystaImage from '../../assets/model/toyoto/innova-crysta-exterior-right-front-three-quarter-3.avif';
import innovaHycrossImage from '../../assets/model/toyoto/innova-hycross-exterior-right-front-three-quarter-74.avif';
import fortunerImage from '../../assets/model/toyoto/fortuner-exterior-right-front-three-quarter-28.avif';
import fortunerLegenderImage from '../../assets/model/toyoto/fortuner-legender-exterior-right-front-three-quarter-5.avif';
import glanzaImage from '../../assets/model/toyoto/glanza-exterior-right-front-three-quarter-6.avif';
import hyryderImage from '../../assets/model/toyoto/hyryder-exterior-right-front-three-quarter-74.avif';
import taisorImage from '../../assets/model/toyoto/taisor-exterior-right-front-three-quarter-41.avif';
import vellfireImage from '../../assets/model/toyoto/vellfire-exterior-right-front-three-quarter-4.avif';
import hiluxImage from '../../assets/model/toyoto/hilux-exterior-right-front-three-quarter-44.avif';
import yarisImage from '../../assets/model/toyoto/yaris-exterior-right-front-three-quarter-2.avif';
import rumionImage from '../../assets/model/toyoto/rumion-exterior-right-front-three-quarter-8.avif';
import camryImage from '../../assets/model/toyoto/camry-exterior-right-front-three-quarter-15.avif';
import corollaAltisImage from '../../assets/model/toyoto/Toyota-Corolla-Altis-Exterior-92974.avif';
import landCruiserImage from '../../assets/model/toyoto/land-cruiser-exterior-right-front-three-quarter-3.avif';

// ============== MAHINDRA MODEL IMPORTS ==============
import xuv700Image from '../../assets/model/mahindra/xuv700-exterior-right-front-three-quarter-2.avif';
import tharImage from '../../assets/model/mahindra/thar-2025-exterior-right-front-three-quarter-5.avif';
import scorpioNImage from '../../assets/model/mahindra/scorpio-n-exterior-right-front-three-quarter-4.avif';
import scorpioClassicImage from '../../assets/model/mahindra/scorpio-exterior-right-front-three-quarter-2.avif';
import xuv300Image from '../../assets/model/mahindra/xuv300-exterior-right-front-three-quarter-148709.avif';
import xuv400EvImage from '../../assets/model/mahindra/xuv400-exterior-right-front-three-quarter-8.avif';
import boleroImage from '../../assets/model/mahindra/bolero-exterior-right-front-three-quarter-3.avif';
import boleroNeoImage from '../../assets/model/mahindra/bolero-neo-exterior-right-front-three-quarter-3.avif';
import marazzoImage from '../../assets/model/mahindra/marazzo-exterior-right-front-three-quarter-2.avif';
import be6Image from '../../assets/model/mahindra/be-6-exterior-right-front-three-quarter-6.avif';
import xev9sImage from '../../assets/model/mahindra/xev9s-exterior-right-front-three-quarter-11.avif';
import xev9eImage from '../../assets/model/mahindra/xev-9e-exterior-right-front-three-quarter-2.avif';
import tharRoxxImage from '../../assets/model/mahindra/thar-roxx-exterior-right-front-three-quarter-2.avif';
import kuv100NxtImage from '../../assets/model/mahindra/kuv100-nxt-exterior-right-front-three-quarter-64047.avif';
import tuv300Image from '../../assets/model/mahindra/Mahindra-TUV300-Right-Front-Three-Quarter-155763.avif';
import xuv3xoImage from '../../assets/model/mahindra/xuv-3xo-exterior-right-front-three-quarter-33.avif';

// ============== KIA MODEL IMPORTS ==============
import seltosImage from '../../assets/model/kia/new-seltos-exterior-right-front-three-quarter-48.avif';
import sonetImage from '../../assets/model/kia/sonet-exterior-right-front-three-quarter-12.avif';
import carensImage from '../../assets/model/kia/carens-exterior-right-front-three-quarter-9.avif';
import carensClavisImage from '../../assets/model/kia/carens-clavis-exterior-right-front-three-quarter-3.avif';
import carnivalImage from '../../assets/model/kia/carnival-exterior-right-front-three-quarter-20.avif';
import ev6Image from '../../assets/model/kia/ev6-exterior-right-front-three-quarter-3.avif';
import ev9Image from '../../assets/model/kia/ev9-exterior-right-front-three-quarter-6.avif';

// ============== MG MODEL IMPORTS ==============
import hectorImage from '../../assets/model/mg/hector-facelift-exterior-right-front-three-quarter.avif';
import hectorPlusImage from '../../assets/model/mg/hector-plus-exterior-right-front-three-quarter.avif';
import astorImage from '../../assets/model/mg/astor-exterior-right-front-three-quarter-8.avif';
import zsEvImage from '../../assets/model/mg/zs-ev-exterior-right-front-three-quarter-70.avif';
import glosterImage from '../../assets/model/mg/gloster-exterior-right-front-three-quarter-5.avif';
import cometEvImage from '../../assets/model/mg/comet-ev-exterior-right-front-three-quarter-31.avif';

// ============== VOLKSWAGEN MODEL IMPORTS ==============
import poloImage from '../../assets/model/volkswagen/polo-exterior-right-front-three-quarter-2.avif';
import virtusImage from '../../assets/model/volkswagen/virtus-exterior-right-front-three-quarter-11.avif';
import taigunImage from '../../assets/model/volkswagen/taigun-exterior-right-front-three-quarter-8.avif';
import tiguanRLineImage from '../../assets/model/volkswagen/tiguan-r-line-exterior-right-front-three-quarter-10.avif';
import golfGtiImage from '../../assets/model/volkswagen/golf-gti-exterior-right-front-three-quarter-4.avif';

// ============== SKODA MODEL IMPORTS ==============
import kushaqImage from '../../assets/model/skoda/kushaq-exterior-right-front-three-quarter-2.avif';
import slaviaImage from '../../assets/model/skoda/slavia-exterior-right-front-three-quarter-10.avif';
import kodiaqImage from '../../assets/model/skoda/kodiaq-exterior-right-front-three-quarter-14.avif';
import superbImage from '../../assets/model/skoda/superb-exterior-right-front-three-quarter-6.avif';
import octaviaRsImage from '../../assets/model/skoda/octaviars-exterior-right-front-three-quarter-2.avif';
import kylaqImage from '../../assets/model/skoda/kylaq-exterior-right-front-three-quarter-10.avif';

// ============== RENAULT MODEL IMPORTS ==============
import kwidImage from '../../assets/model/renault/kwid-exterior-right-front-three-quarter-38.avif';
import triberImage from '../../assets/model/renault/triber-exterior-right-front-three-quarter-26.avif';
import kigerImage from '../../assets/model/renault/kiger-exterior-right-front-three-quarter-30.avif';
import dusterImage from '../../assets/model/renault/new-duster-exterior-right-front-three-quarter-5.avif';

// ============== NISSAN MODEL IMPORTS ==============
import magniteImage from '../../assets/model/nissan/magnite-exterior-right-front-three-quarter-27.avif';
import kicksImage from '../../assets/model/nissan/Nissan-Kicks-Right-Front-Three-Quarter-159680.avif';
import xTrailImage from '../../assets/model/nissan/x-trail-exterior-right-front-three-quarter-28.avif';

// ============== FORD MODEL IMPORTS ==============
import ecosportImage from '../../assets/model/ford/Ford-EcoSport-New-Right-Front-Three-Quarter-111783.avif';
import endeavourImage from '../../assets/model/ford/endeavour-exterior-right-front-three-quarter-149473.avif';
import figoImage from '../../assets/model/ford/figo-2010-2012.avif';
import aspireImage from '../../assets/model/ford/aspire-exterior-right-front-three-quarter-2.avif';
import freestyleImage from '../../assets/model/ford/freestyle-exterior-right-front-three-quarter-2.avif';

// ============== CHEVROLET MODEL IMPORTS ==============
import beatImage from '../../assets/model/chevrolet/Chevrolet-Beat-Right-Front-Three-Quarter-81148.avif';
import cruzeImage from '../../assets/model/chevrolet/Chevrolet-Cruze-Right-Front-Three-Quarter-73032.avif';
import sparkImage from '../../assets/model/chevrolet/spark.avif';
import taveraImage from '../../assets/model/chevrolet/Chevrolet-Tavera-Right-Front-Three-Quarter-49908_ol.avif';
import enjoyImage from '../../assets/model/chevrolet/Chevrolet-Enjoy-Right-Front-Three-Quarter-49907_ol.avif';

// ============== BMW MODEL IMPORTS ==============
import bmw2SeriesImage from '../../assets/model/bmw/2-series-gran-coupe-exterior-right-front-three-quarter-4.avif';
import bmw3SeriesImage from '../../assets/model/bmw/3-series-exterior-right-front-three-quarter-10.avif';
import bmw5SeriesImage from '../../assets/model/bmw/5-series-exterior-right-front-three-quarter-95.avif';
import bmw7SeriesImage from '../../assets/model/bmw/7-series-exterior-right-front-three-quarter-4.avif';
import bmwX1Image from '../../assets/model/bmw/x1-exterior-right-front-three-quarter-8.avif';
import bmwX3Image from '../../assets/model/bmw/x3-exterior-right-front-three-quarter-8.avif';
import bmwX5Image from '../../assets/model/bmw/x5-exterior-right-front-three-quarter-7.avif';
import bmwX7Image from '../../assets/model/bmw/x7-exterior-right-front-three-quarter-10.avif';
import bmwIxLwbImage from '../../assets/model/bmw/ix1-lwb-exterior-right-front-three-quarter-2.avif';
import bmwI4Image from '../../assets/model/bmw/i4-exterior-right-front-three-quarter-2.avif';
import bmwI7Image from '../../assets/model/bmw/i7-exterior-right-front-three-quarter-9.avif';

// ============== AUDI MODEL IMPORTS ==============
import audiA4Image from '../../assets/model/audi/a4-exterior-right-front-three-quarter-2.avif';
import audiA6Image from '../../assets/model/audi/a6-exterior-right-front-three-quarter-2.avif';
import audiA8LImage from '../../assets/model/audi/a8-l-exterior-right-front-three-quarter-4.avif';
import audiQ3Image from '../../assets/model/audi/q3-exterior-right-front-three-quarter-93481.avif';
import audiQ5Image from '../../assets/model/audi/q5-exterior-right-front-three-quarter-36.avif';
import audiQ7Image from '../../assets/model/audi/q7-exterior-right-front-three-quarter.avif';
import audiQ8Image from '../../assets/model/audi/q8-facelift-exterior-right-front-three-quarter-4.avif';
import audiEtronImage from '../../assets/model/audi/e-tron-exterior-right-front-three-quarter-3.avif';
import audiEtronGtImage from '../../assets/model/audi/e-tron-gt-exterior-right-front-three-quarter-2.avif';
import audiRs5Image from '../../assets/model/audi/rs5-exterior-right-front-three-quarter-4.avif';

// ============== MERCEDES MODEL IMPORTS ==============
import mercedesAClassImage from '../../assets/model/mercedes/a-class-limousine-exterior-right-front-three-quarter-8.avif';
import mercedesCClassImage from '../../assets/model/mercedes/c-class-exterior-right-front-three-quarter-4.avif';
import mercedesEClassImage from '../../assets/model/mercedes/e-class-exterior-right-front-three-quarter-35.avif';
import mercedesSClassImage from '../../assets/model/mercedes/s-class-exterior-right-front-three-quarter-10.avif';
import mercedesGClassImage from '../../assets/model/mercedes/g-class-exterior-right-front-three-quarter-7.avif';
import mercedesGlaImage from '../../assets/model/mercedes/gla-exterior-right-front-three-quarter-4.avif';
import mercedesGlbImage from '../../assets/model/mercedes/glb-exterior-right-front-three-quarter-2.avif';
import mercedesGlcImage from '../../assets/model/mercedes/glc-exterior-right-front-three-quarter-4.avif';
import mercedesGleImage from '../../assets/model/mercedes/gle-exterior-right-front-three-quarter-4.avif';
import mercedesGlsImage from '../../assets/model/mercedes/gls-exterior-right-front-three-quarter-22.avif';
import mercedesEqsImage from '../../assets/model/mercedes/eqs-exterior-right-front-three-quarter-31.avif';
import mercedesEqeImage from '../../assets/model/mercedes/eqe-suv-exterior-right-front-three-quarter-4.avif';
import mercedesMaybachSClassImage from '../../assets/model/mercedes/maybach-s-class-exterior-right-front-three-quarter-6.avif';
import mercedesAmgCleImage from '../../assets/model/mercedes/amg-cle-exterior-right-front-three-quarter-33.avif';
import mercedesMaybachGlsImage from '../../assets/model/mercedes/maybach-gls-exterior-right-front-three-quarter-5.avif';

// ============== JEEP MODEL IMPORTS ==============
import jeepCompassImage from '../../assets/model/jeep/compass-exterior-right-front-three-quarter-84.avif';
import jeepMeridianImage from '../../assets/model/jeep/meridian-exterior-right-front-three-quarter-18.avif';
import jeepWranglerImage from '../../assets/model/jeep/wrangler-exterior-right-front-three-quarter-34.avif';
import jeepGrandCherokeeImage from '../../assets/model/jeep/grand-cherokee-exterior-right-front-three-quarter-28.avif';

// ============== VOLVO MODEL IMPORTS ==============
import volvoXc40Image from '../../assets/model/volvo/Volvo-XC40-Exterior-130763.avif';
import volvoXc60Image from '../../assets/model/volvo/xc60-exterior-right-front-three-quarter-8.avif';
import volvoXc90Image from '../../assets/model/volvo/xc90-exterior-right-front-three-quarter-4.avif';
import volvoEc40Image from '../../assets/model/volvo/c40-recharge-exterior-right-front-three-quarter-3.avif';
import volvoS60Image from '../../assets/model/volvo/s60-exterior-right-front-three-quarter-3.avif';
import volvoS90Image from '../../assets/model/volvo/s90-exterior-right-front-three-quarter-4.avif';
import volvoEx30Image from '../../assets/model/volvo/ex30-exterior-right-front-three-quarter-6.avif';
import volvoC40RechargeImage from '../../assets/model/volvo/c40-recharge-exterior-right-front-three-quarter-3.avif';

// ============== LEXUS MODEL IMPORTS ==============
import lexusEsImage from '../../assets/model/lexus/es-exterior-right-front-three-quarter-3.avif';
import lexusLsImage from '../../assets/model/lexus/ls-exterior-right-front-three-quarter-3.avif';
import lexusNxImage from '../../assets/model/lexus/nx-exterior-right-front-three-quarter-4.avif';
import lexusRxImage from '../../assets/model/lexus/rx-exterior-right-front-three-quarter-15.avif';
import lexusLxImage from '../../assets/model/lexus/lx-exterior-right-front-three-quarter-40.avif';
import lexusLcImage from '../../assets/model/lexus/lexus-lc-500h-right-front-three-quarter10.avif';
import lexusLmImage from '../../assets/model/lexus/lm-exterior-right-front-three-quarter-5.avif';

// ============== PORSCHE MODEL IMPORTS ==============
import porscheCayenneImage from '../../assets/model/porsche/cayenne-exterior-right-front-three-quarter-2.avif';
import porscheMacanImage from '../../assets/model/porsche/macan-exterior-right-front-three-quarter-9.avif';
import porsche911Image from '../../assets/model/porsche/911-exterior-right-front-three-quarter-154382.avif';
import porschePanameraImage from '../../assets/model/porsche/panamera-exterior-right-front-three-quarter.avif';
import porscheTaycanImage from '../../assets/model/porsche/taycan-exterior-right-front-three-quarter-5.avif';

// ============== JAGUAR MODEL IMPORTS ==============
import jaguarFPaceImage from '../../assets/model/jaguar/f-pace-exterior-right-front-three-quarter-5.avif';
import jaguarIPaceImage from '../../assets/model/jaguar/i-pace-exterior-right-front-three-quarter-2.avif';
import jaguarXeImage from '../../assets/model/jaguar/jaguar-xe-front-right-three-quarter-7.avif';
import jaguarXfImage from '../../assets/model/jaguar/xf-exterior-right-front-three-quarter-2.avif';
import jaguarFTypeImage from '../../assets/model/jaguar/f-type-exterior-right-front-three-quarter-3.avif';

// ============== LAND ROVER MODEL IMPORTS ==============
import rangeRoverImage from '../../assets/model/landrover/range-rover-exterior-right-front-three-quarter-47.avif';
import rangeRoverSportImage from '../../assets/model/landrover/range-rover-sport-exterior-right-front-three-quarter-44.avif';
import rangeRoverVelarImage from '../../assets/model/landrover/range-rover-velar-exterior-right-front-three-quarter-5.avif';
import rangeRoverEvoqueImage from '../../assets/model/landrover/range-rover-evoque-exterior-right-front-three-quarter-2.avif';
import defenderImage from '../../assets/model/landrover/defender-exterior-right-front-three-quarter-23.avif';
import discoveryImage from '../../assets/model/landrover/discovery-exterior-right-front-three-quarter-3.avif';
import discoverySportImage from '../../assets/model/landrover/discovery-sport-exterior-right-front-three-quarter-42.avif';

// ============== MITSUBISHI MODEL IMPORTS ==============
import outlanderImage from '../../assets/model/mitshubitsi/Mitsubishi-Outlander-Exterior-130062.webp';
import monteroImage from '../../assets/model/mitshubitsi/Mitsubishi-Montero-Right-Front-Three-Quarter-74529.avif';
import pajeroSportImage from '../../assets/model/mitshubitsi/Mitsubishi-Pajero-Sport-Right-Front-Three-Quarter-52939_ol.avif';

// Brand data with imported logos
const brands = [
  { id: 'maruti', name: 'Maruti Suzuki', logo: suzukiLogo, urlName: 'maruti-suzuki' },
  { id: 'hyundai', name: 'Hyundai', logo: hyundaiLogo, urlName: 'hyundai' },
  { id: 'honda', name: 'Honda', logo: hondaLogo, urlName: 'honda' },
  { id: 'tata', name: 'Tata', logo: tataLogo, urlName: 'tata' },
  { id: 'toyota', name: 'Toyota', logo: toyotaLogo, urlName: 'toyota' },
  { id: 'mahindra', name: 'Mahindra', logo: mahindraLogo, urlName: 'mahindra' },
  { id: 'kia', name: 'Kia', logo: kiaLogo, urlName: 'kia' },
  { id: 'mg', name: 'MG', logo: mgLogo, urlName: 'mg' },
  { id: 'volkswagen', name: 'Volkswagen', logo: volkswagenLogo, urlName: 'volkswagen' },
  { id: 'skoda', name: 'Skoda', logo: skodaLogo, urlName: 'skoda' },
  { id: 'renault', name: 'Renault', logo: renaultLogo, urlName: 'renault' },
  { id: 'nissan', name: 'Nissan', logo: nissanLogo, urlName: 'nissan' },
  { id: 'ford', name: 'Ford', logo: fordLogo, urlName: 'ford' },
  { id: 'chevrolet', name: 'Chevrolet', logo: chevroletLogo, urlName: 'chevrolet' },
  { id: 'bmw', name: 'BMW', logo: bmwLogo, urlName: 'bmw' },
  { id: 'audi', name: 'Audi', logo: audiLogo, urlName: 'audi' },
  { id: 'mercedes', name: 'Mercedes-Benz', logo: mercedesLogo, urlName: 'mercedes-benz' },
  { id: 'jeep', name: 'Jeep', logo: jeepLogo, urlName: 'jeep' },
  { id: 'volvo', name: 'Volvo', logo: volvoLogo, urlName: 'volvo' },
  { id: 'lexus', name: 'Lexus', logo: lexusLogo, urlName: 'lexus' },
  { id: 'porsche', name: 'Porsche', logo: porscheLogo, urlName: 'porsche' },
  { id: 'jaguar', name: 'Jaguar', logo: jaguarLogo, urlName: 'jaguar' },
  { id: 'landrover', name: 'Land Rover', logo: landRoverLogo, urlName: 'land-rover' },
  { id: 'mitsubishi', name: 'Mitsubishi', logo: mitsubishiLogo, urlName: 'mitsubishi' },
];

// Car models by brand with imported images
const carModels: Record<string, { name: string; type: string; image: string }[]> = {
  maruti: [
    { name: 'Swift', type: 'Hatchback', image: swiftImage },
    { name: 'Baleno', type: 'Hatchback', image: balenoImage },
    { name: 'Alto K10', type: 'Hatchback', image: altoK10Image },
    { name: 'Wagon R', type: 'Hatchback', image: wagonRImage },
    { name: 'Dzire', type: 'Sedan', image: dzireImage },
    { name: 'Vitara Brezza', type: 'SUV', image: vitaraBrezzaImage },
    { name: 'Ertiga', type: 'MPV', image: ertigaImage },
    { name: 'Ciaz', type: 'Sedan', image: ciazImage },
    { name: 'S-Cross', type: 'SUV', image: sCrossImage },
    { name: 'Ignis', type: 'Hatchback', image: ignisImage },
    { name: 'Celerio', type: 'Hatchback', image: celerioImage },
    { name: 'XL6', type: 'MPV', image: xl6Image },
    { name: 'New Grand Vitara', type: 'SUV', image: newGrandVitaraImage },
    { name: 'Fronx', type: 'SUV', image: fronxImage },
    { name: 'Jimny', type: 'SUV', image: jimnyImage },
    { name: 'Invicto', type: 'MPV', image: invictoImage },
    { name: 'Victoris', type: 'SUV', image: victorisImage },
    { name: 'Brezza', type: 'SUV', image: brezzaImage },
    { name: 'S-Presso', type: 'Mini SUV', image: sPressoImage },
    { name: 'Eeco', type: 'Van', image: eecoImage }
  ],
  hyundai: [
    { name: 'Creta', type: 'SUV', image: cretaImage },
    { name: 'Creta N Line', type: 'SUV', image: cretaNLineImage },
    { name: 'i20', type: 'Hatchback', image: i20Image },
    { name: 'Venue', type: 'SUV', image: venueImage },
    { name: 'Verna', type: 'Sedan', image: vernaImage },
    { name: 'Grand i10 Nios', type: 'Hatchback', image: grandI10NiosImage },
    { name: 'Aura', type: 'Sedan', image: auraImage },
    { name: 'Tucson', type: 'SUV', image: tucsonImage },
    { name: 'Alcazar', type: 'SUV', image: alcazarImage },
    { name: 'Exter', type: 'SUV', image: exterImage },
    { name: 'Ioniq 5', type: 'Electric', image: ioniq5Image },
    { name: 'Kona Electric', type: 'Electric', image: konaElectricImage },
    { name: 'Venue N Line', type: 'SUV', image: venueNLineImage },
    { name: 'i20 N Line', type: 'Hatchback', image: i20NLineImage },
  ],
  honda: [
    { name: 'City', type: 'Sedan', image: cityImage },
    { name: 'Amaze', type: 'Sedan', image: amazeImage },
    { name: 'Elevate', type: 'SUV', image: elevateImage },
    { name: 'WR-V', type: 'SUV', image: wrVImage },
    { name: 'Jazz', type: 'Hatchback', image: jazzImage },
    { name: 'Civic', type: 'Sedan', image: civicImage },
    { name: 'CR-V', type: 'SUV', image: crVImage },
    { name: 'BR-V', type: 'SUV', image: brVImage },
  ],
  tata: [
    { name: 'Nexon', type: 'SUV', image: nexonImage },
    { name: 'Punch', type: 'SUV', image: punchImage },
    { name: 'Altroz', type: 'Hatchback', image: altrozImage },
    { name: 'Harrier', type: 'SUV', image: harrierImage },
    { name: 'Safari', type: 'SUV', image: safariImage },
    { name: 'Tiago', type: 'Hatchback', image: tiagoImage },
    { name: 'Tigor', type: 'Sedan', image: tigorImage },
    { name: 'Nexon EV', type: 'Electric', image: nexonEvImage },
    { name: 'Tiago EV', type: 'Electric', image: tiagoEvImage },
    { name: 'Curvv', type: 'SUV', image: curvvImage },
  ],
  toyota: [
    { name: 'Innova Crysta', type: 'MPV', image: innovaCrystaImage },
    { name: 'Innova Hycross', type: 'MPV', image: innovaHycrossImage },
    { name: 'Fortuner', type: 'SUV', image: fortunerImage },
    { name: 'Fortuner Legender', type: 'SUV', image: fortunerLegenderImage },
    { name: 'Glanza', type: 'Hatchback', image: glanzaImage },
    { name: 'Urban Cruiser Hyryder', type: 'SUV', image: hyryderImage },
    { name: 'Urban Cruiser Taisor', type: 'SUV', image: taisorImage },
    { name: 'Vellfire', type: 'MPV', image: vellfireImage },
    { name: 'Hilux', type: 'Pickup', image: hiluxImage },
    { name: 'Yaris', type: 'Sedan', image: yarisImage },
    { name: 'Rumion', type: 'MPV', image: rumionImage },
    { name: 'Camry', type: 'Sedan', image: camryImage },
    { name: 'Corolla Altis', type: 'Sedan', image: corollaAltisImage },
    { name: 'Land Cruiser', type: 'SUV', image: landCruiserImage }
  ],
  mahindra: [
    { name: 'XUV700', type: 'SUV', image: xuv700Image },
    { name: 'Thar', type: 'SUV', image: tharImage },
    { name: 'Scorpio N', type: 'SUV', image: scorpioNImage },
    { name: 'Scorpio Classic', type: 'SUV', image: scorpioClassicImage },
    { name: 'XUV300', type: 'SUV', image: xuv300Image },
    { name: 'XUV400 EV', type: 'Electric', image: xuv400EvImage },
    { name: 'Bolero', type: 'SUV', image: boleroImage },
    { name: 'Bolero Neo', type: 'SUV', image: boleroNeoImage },
    { name: 'Marazzo', type: 'MPV', image: marazzoImage },
    { name: 'BE 6', type: 'Electric', image: be6Image },
    { name: 'XEV 9S', type: 'Electric', image: xev9sImage },
    { name: 'XEV 9e', type: 'Electric', image: xev9eImage },
    { name: 'Thar Roxx', type: 'SUV', image: tharRoxxImage },
    { name: 'KUV100 NXT', type: 'SUV', image: kuv100NxtImage },
    { name: 'TUV300', type: 'SUV', image: tuv300Image },
    { name: 'XUV 3XO', type: 'SUV', image: xuv3xoImage },
  ],
  kia: [
    { name: 'Seltos', type: 'SUV', image: seltosImage },
    { name: 'Sonet', type: 'SUV', image: sonetImage },
    { name: 'Carens', type: 'MPV', image: carensImage },
    { name: 'Carens Clavis', type: 'MPV', image: carensClavisImage },
    { name: 'Carnival', type: 'MPV', image: carnivalImage },
    { name: 'EV6', type: 'Electric', image: ev6Image },
    { name: 'EV9', type: 'Electric', image: ev9Image },
  ],
  mg: [
    { name: 'Hector', type: 'SUV', image: hectorImage },
    { name: 'Hector Plus', type: 'SUV', image: hectorPlusImage },
    { name: 'Astor', type: 'SUV', image: astorImage },
    { name: 'ZS EV', type: 'Electric', image: zsEvImage },
    { name: 'Gloster', type: 'SUV', image: glosterImage },
    { name: 'Comet EV', type: 'Electric', image: cometEvImage },
  ],
  volkswagen: [
    { name: 'Polo', type: 'Hatchback', image: poloImage },
    { name: 'Virtus', type: 'Sedan', image: virtusImage },
    { name: 'Taigun', type: 'SUV', image: taigunImage },
    { name: 'Tiguan R-Line', type: 'SUV', image: tiguanRLineImage },
    { name: 'Golf GTI', type: 'SUV', image: golfGtiImage },
  ],
  skoda: [
    { name: 'Kushaq', type: 'SUV', image: kushaqImage },
    { name: 'Slavia', type: 'Sedan', image: slaviaImage },
    { name: 'Kodiaq', type: 'SUV', image: kodiaqImage },
    { name: 'Superb', type: 'Sedan', image: superbImage },
    { name: 'Octavia RS', type: 'Sedan', image: octaviaRsImage },
    { name: 'Kylaq', type: 'SUV', image: kylaqImage },
  ],
  renault: [
    { name: 'Kwid', type: 'Hatchback', image: kwidImage },
    { name: 'Triber', type: 'MPV', image: triberImage },
    { name: 'Kiger', type: 'SUV', image: kigerImage },
    { name: 'Duster', type: 'SUV', image: dusterImage },
  ],
  nissan: [
    { name: 'Magnite', type: 'SUV', image: magniteImage },
    { name: 'Kicks', type: 'SUV', image: kicksImage },
    { name: 'X-Trail', type: 'SUV', image: xTrailImage },
  ],
  ford: [
    { name: 'EcoSport', type: 'SUV', image: ecosportImage },
    { name: 'Endeavour', type: 'SUV', image: endeavourImage },
    { name: 'Figo', type: 'Hatchback', image: figoImage },
    { name: 'Aspire', type: 'Sedan', image: aspireImage },
    { name: 'Freestyle', type: 'Hatchback', image: freestyleImage },
  ],
  chevrolet: [
    { name: 'Beat', type: 'Hatchback', image: beatImage },
    { name: 'Cruze', type: 'Sedan', image: cruzeImage },
    { name: 'Spark', type: 'Hatchback', image: sparkImage },
    { name: 'Tavera', type: 'MPV', image: taveraImage },
    { name: 'Enjoy', type: 'MPV', image: enjoyImage },
  ],
  bmw: [
    { name: '2 Series Gran Coupe', type: 'Sedan', image: bmw2SeriesImage },
    { name: '3 Series LWB', type: 'Sedan', image: bmw3SeriesImage },
    { name: '5 Series', type: 'Sedan', image: bmw5SeriesImage },
    { name: '7 Series', type: 'Sedan', image: bmw7SeriesImage },
    { name: 'X1', type: 'SUV', image: bmwX1Image },
    { name: 'X3', type: 'SUV', image: bmwX3Image },
    { name: 'X5', type: 'SUV', image: bmwX5Image },
    { name: 'X7', type: 'SUV', image: bmwX7Image },
    { name: 'iX LWB', type: 'Electric', image: bmwIxLwbImage },
    { name: 'i4', type: 'Electric', image: bmwI4Image },
    { name: 'i7', type: 'Electric', image: bmwI7Image },
  ],
  audi: [
    { name: 'A4', type: 'Sedan', image: audiA4Image },
    { name: 'A6', type: 'Sedan', image: audiA6Image },
    { name: 'A8 L', type: 'Sedan', image: audiA8LImage },
    { name: 'Q3', type: 'SUV', image: audiQ3Image },
    { name: 'Q5', type: 'SUV', image: audiQ5Image },
    { name: 'Q7', type: 'SUV', image: audiQ7Image },
    { name: 'Q8', type: 'SUV', image: audiQ8Image },
    { name: 'e-tron', type: 'Electric', image: audiEtronImage },
    { name: 'e-tron GT', type: 'Electric', image: audiEtronGtImage },
    { name: 'RS5', type: 'Sports', image: audiRs5Image },
  ],
  mercedes: [
    { name: 'A-Class Limousine', type: 'Sedan', image: mercedesAClassImage },
    { name: 'C-Class', type: 'Sedan', image: mercedesCClassImage },
    { name: 'E-Class', type: 'Sedan', image: mercedesEClassImage },
    { name: 'S-Class', type: 'Sedan', image: mercedesSClassImage },
    { name: 'G-Class', type: 'SUV', image: mercedesGClassImage },
    { name: 'GLA', type: 'SUV', image: mercedesGlaImage },
    { name: 'GLB', type: 'SUV', image: mercedesGlbImage },
    { name: 'GLC', type: 'SUV', image: mercedesGlcImage },
    { name: 'GLE', type: 'SUV', image: mercedesGleImage },
    { name: 'GLS', type: 'SUV', image: mercedesGlsImage },
    { name: 'EQS', type: 'Electric', image: mercedesEqsImage },
    { name: 'EQE', type: 'Electric', image: mercedesEqeImage },
    { name: 'Maybach S-Class', type: 'Luxury', image: mercedesMaybachSClassImage },
    { name: 'AMG CLE', type: 'Luxury', image: mercedesAmgCleImage },
    { name: 'Maybach GLS', type: 'Luxury', image: mercedesMaybachGlsImage },
  ],
  jeep: [
    { name: 'Compass', type: 'SUV', image: jeepCompassImage },
    { name: 'Meridian', type: 'SUV', image: jeepMeridianImage },
    { name: 'Wrangler', type: 'SUV', image: jeepWranglerImage },
    { name: 'Grand Cherokee', type: 'SUV', image: jeepGrandCherokeeImage },
  ],
  volvo: [
    { name: 'XC40', type: 'SUV', image: volvoXc40Image },
    { name: 'XC60', type: 'SUV', image: volvoXc60Image },
    { name: 'XC90', type: 'SUV', image: volvoXc90Image },
    { name: 'EC40', type: 'SUV', image: volvoEc40Image },
    { name: 'S60', type: 'Sedan', image: volvoS60Image },
    { name: 'S90', type: 'Sedan', image: volvoS90Image },
    { name: 'EX30', type: 'SUV', image: volvoEx30Image },
    { name: 'C40 Recharge', type: 'Electric', image: volvoC40RechargeImage },
  ],
  lexus: [
    { name: 'ES', type: 'Sedan', image: lexusEsImage },
    { name: 'LS', type: 'Sedan', image: lexusLsImage },
    { name: 'NX', type: 'SUV', image: lexusNxImage },
    { name: 'RX', type: 'SUV', image: lexusRxImage },
    { name: 'LX', type: 'SUV', image: lexusLxImage },
    { name: 'LC', type: 'Sports', image: lexusLcImage },
    { name: 'LM', type: 'MPV', image: lexusLmImage }
  ],
  porsche: [
    { name: 'Cayenne', type: 'SUV', image: porscheCayenneImage },
    { name: 'Macan', type: 'SUV', image: porscheMacanImage },
    { name: '911', type: 'Sports', image: porsche911Image },
    { name: 'Panamera', type: 'Sedan', image: porschePanameraImage },
    { name: 'Taycan', type: 'Electric', image: porscheTaycanImage },
  ],
  jaguar: [
    { name: 'F-Pace', type: 'SUV', image: jaguarFPaceImage },
    { name: 'I-Pace', type: 'Electric', image: jaguarIPaceImage },
    { name: 'XE', type: 'Sedan', image: jaguarXeImage },
    { name: 'XF', type: 'Sedan', image: jaguarXfImage },
    { name: 'F-Type', type: 'Sports', image: jaguarFTypeImage },
  ],
  landrover: [
    { name: 'Range Rover', type: 'SUV', image: rangeRoverImage },
    { name: 'Range Rover Sport', type: 'Sport', image: rangeRoverSportImage },
    { name: 'Range Rover Velar', type: 'SUV', image: rangeRoverVelarImage },
    { name: 'Range Rover Evoque', type: 'SUV', image: rangeRoverEvoqueImage },
    { name: 'Defender', type: 'SUV', image: defenderImage },
    { name: 'Discovery', type: 'SUV', image: discoveryImage },
    { name: 'Discovery Sport', type: 'SUV', image: discoverySportImage },
  ],
  mitsubishi: [
    { name: 'Outlander', type: 'SUV', image: outlanderImage },
    { name: 'Montero', type: 'SUV', image: monteroImage },
    { name: 'Pajero Sport', type: 'SUV', image: pajeroSportImage },
  ],
};

const fuelTypes = [
  { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#22C55E' },
  { id: 'diesel', name: 'Diesel', icon: '🛢️', color: '#EAB308' },
  { id: 'cng', name: 'CNG', icon: '💨', color: '#3B82F6' },
  { id: 'electric', name: 'Electric', icon: '⚡', color: '#8B5CF6' },
];

const cities = ['Chennai'];

type ViewState = 'main' | 'brands' | 'models' | 'fuel';

export const BookingWidget = () => {
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai');
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
        <motion.div 
          className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%]"
          animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {currentView === 'main' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    Book Your Service
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get instant quotes & doorstep service
                  </p>
                </div>

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

            {currentView === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
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

            {currentView === 'models' && selectedBrand && (
              <motion.div
                key="models"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
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
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Select Model</h3>
                      <p className="text-xs text-muted-foreground">{selectedBrand.name} models</p>
                    </div>
                  </div>
                </div>

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

            {currentView === 'fuel' && (
              <motion.div
                key="fuel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
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

                <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-5">
                  <div className="w-16 h-12 flex items-center justify-center">
                    <img 
                      src={selectedModel?.image} 
                      alt={selectedModel?.name}
                      className="w-full h-full object-contain"
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