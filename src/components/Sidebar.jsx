import { NavLink } from 'react-router-dom';
import { Package, Wallet, LayoutDashboard } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pesanan', label: 'Pesanan', icon: Package },
  { to: '/keuangan', label: 'Keuangan', icon: Wallet },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '240px', minHeight: '100vh', background: 'linear-gradient(180deg, #1E1B4B, #312E81)',
      padding: '24px 16px', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0,
    }}>
      <div style={{ marginBottom: '40px', padding: '0 8px' }}>
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>🍞 Erles Bakery</h2>
        <span style={{ color: '#A5B4FC', fontSize: '12px' }}>Admin Dashboard</span>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
              borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              color: isActive ? 'white' : '#C7D2FE',
              background: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
