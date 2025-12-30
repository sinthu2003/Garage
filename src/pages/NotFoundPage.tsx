import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 bg-gray-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100"
      >
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <AlertTriangle size={48} />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Breakdown!</h2>
        <p className="text-gray-500 mb-8">
          Looks like this page is out of service. Our mechanics are working on it (not really, the page just doesn't exist).
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" leftIcon={<Wrench size={18} />}>
              Back to Garage
            </Button>
          </Link>
          <Link to="/locator">
             <Button variant="outline" size="lg">Find Workshop</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};