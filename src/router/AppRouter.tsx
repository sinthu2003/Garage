import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';


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
          <Route path="/" element={<HomePage />} />
         
        </Routes>
      </AppLayout>
    </>
  );
};