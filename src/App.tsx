import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { ContentProvider } from './admin-portal/context/ContentContext';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        {/* Main Router handles everything now */}
        <AppRouter />
      </ContentProvider>
    </BrowserRouter>
  );
}

export default App;