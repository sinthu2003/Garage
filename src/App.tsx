import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './admin-portal';
import { AppRouter } from './router/AppRouter';
import './index.css';

/**
 * Main App Component
 * 
 * Provider hierarchy:
 * 1. BrowserRouter - Enables routing
 * 2. AuthProvider - Manages auth state (must be inside Router for navigation)
 * 3. ContentProvider - Manages CMS content (can access auth state)
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider 
          mode="auto"      // Auto-detect: 'admin' if logged in, 'public' otherwise
          enableApi={true} // Load content from API
          enableFallback={true} // Fall back to localStorage if API fails
        >
          {/* Main Router handles all routes */}
          <AppRouter />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;