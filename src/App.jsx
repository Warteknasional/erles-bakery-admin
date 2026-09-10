import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '240px', padding: '32px' }}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
