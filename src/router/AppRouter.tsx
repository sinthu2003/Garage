import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ServicesPage } from '../pages/Servicespage';
import { ServiceDetailPage } from '../pages/Servicedetailpage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* All Services Page */}
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Individual Service Detail Page */}
          <Route path="/services/:serviceSlug" element={<ServiceDetailPage />} />
        </Routes>
      </AppLayout>
    </>
  );
};