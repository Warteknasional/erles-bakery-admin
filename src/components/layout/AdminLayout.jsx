import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF7F2' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ padding: '32px', flex: 1 }}>
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
