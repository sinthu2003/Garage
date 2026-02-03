import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider, useContent } from './admin-portal';
import { AppRouter } from './router/AppRouter';
import './index.css';

// ✅ Helper to determine content mode based on route
const getContentMode = (): 'admin' | 'public' => {
  if (window.location.pathname.startsWith('/admin')) {
    return 'admin';
  }
  return 'public';
};

// ✅ Loading Guard Component 
// This prevents the UI from rendering with "undefined" data while the API is fetching
function AppContent() {
  const { isLoading, content } = useContent();

  if (isLoading || !content) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Initializing Addax Automotive...
        </p>
      </div>
    );
  }

  return <AppRouter />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider 
          mode={getContentMode()} 
          enableApi={true}
          enableFallback={true}
        >
          <AppContent />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;