import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ServicesPage } from '../pages/Servicespage';
import { ServiceDetailPage } from '../pages/Servicedetailpage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { AdminPage } from '../admin-portal/components/AdminPage';
import { LoginPage } from '../admin-portal/components/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsPage } from '../pages/TermsPage';
import { WarrantyPolicyPage } from '../pages/WarrantyPolicyPage';
import { BlogPage } from '../pages/BlogPage';

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
        <Route path="/contact" element={<AppLayout><ContactUsPage /></AppLayout>} />
        <Route path="/privacy-policy" element={<AppLayout><PrivacyPolicyPage /></AppLayout>} />
        <Route path="/terms-of-service" element={<AppLayout><TermsPage /></AppLayout>} />
        <Route path="/warranty-policy" element={<AppLayout><WarrantyPolicyPage /></AppLayout>} />
        <Route path="/blog" element={<AppLayout><BlogPage /></AppLayout>} />

        {/* 404 Route - Catch all */}
        {/* This must be the last route to catch undefined paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};