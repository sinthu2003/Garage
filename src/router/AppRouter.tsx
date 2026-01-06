import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ServicesPage } from '../pages/Servicespage';
import { ServiceDetailPage } from '../pages/Servicedetailpage';
import { AdminPage } from '../admin-portal/components/AdminPage';
import { LoginPage } from '../admin-portal/components/LoginPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const AppRouter = () => {
  // Check local storage for existing session on load
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Page - Protected by Login Check */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (
              <AdminPage />
            ) : (
              <LoginPage onLogin={handleLoginSuccess} />
            )
          } 
        />
        
        {/* Main Site Routes - With AppLayout */}
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/services" element={<AppLayout><ServicesPage /></AppLayout>} />
        <Route path="/services/:serviceSlug" element={<AppLayout><ServiceDetailPage /></AppLayout>} />
      </Routes>
    </>
  );
};