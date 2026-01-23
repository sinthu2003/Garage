import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './admin-portal';
import { AppRouter } from './router/AppRouter';
import './index.css';

// ✅ Helper to determine content mode based on route
const getContentMode = (): 'admin' | 'public' => {
  // If URL contains /admin, use admin mode
  if (window.location.pathname.startsWith('/admin')) {
    return 'admin';
  }
  // Otherwise, always use public mode (even if logged in)
  return 'public';
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider 
          mode={getContentMode()}  // ✅ Fixed - checks route, not auth state
          enableApi={true}
          enableFallback={true}
        >
          <AppRouter />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;