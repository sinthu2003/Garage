import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ServicesPage } from '../pages/Servicespage';
import { ServiceDetailPage } from '../pages/Servicedetailpage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { WarrantyPolicyPage } from '../pages/WarrantyPolicyPage';
import { AdminPage } from '../admin-portal/components/AdminPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// NEW: Import auth components
import { useAuth, ProtectedRoute } from '../context/AuthContext';
import AdminLogin from '../admin-portal/components/AdminLogin';

// ============================================
// SCROLL TO TOP COMPONENT (UNCHANGED)
// ============================================
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// ============================================
// MAIN ROUTER
// ============================================
export const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ================================================
            ADMIN ROUTES
            ================================================ */}

        {/* Admin Login Page - Separate route */}
        <Route
          path="/admin/login"
          element={
            // If already authenticated, redirect to admin
            isAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin />
            )
          }
        />

        {/* Admin Panel - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="editor">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Admin sub-routes (catch-all for admin paths) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="editor">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* ================================================
            MAIN SITE ROUTES - With AppLayout
            ================================================ */}
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/services" element={<AppLayout><ServicesPage /></AppLayout>} />
        <Route path="/services/:serviceSlug" element={<AppLayout><ServiceDetailPage /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><ContactUsPage /></AppLayout>} />
        <Route path="/terms-of-service" element={<AppLayout><TermsPage /></AppLayout>} />
        <Route path="/privacy-policy" element={<AppLayout><PrivacyPolicyPage /></AppLayout>} />
        <Route path="/warranty-policy" element={<AppLayout><WarrantyPolicyPage /></AppLayout>} />

        {/* ================================================
            404 ROUTE - Catch all (must be last)
            ================================================ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRouter;
