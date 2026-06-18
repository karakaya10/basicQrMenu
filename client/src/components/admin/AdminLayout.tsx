import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/categories', label: 'Kategoriler' },
  { to: '/admin/products', label: 'Ürünler' },
  { to: '/admin/qr', label: 'QR Kod' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF3E0' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shadow-lg" style={{ backgroundColor: '#6B3A2A' }}>
        <div className="p-6 border-b border-white/20">
          <h1 className="text-white text-xl font-bold tracking-wide">☕ Kafe Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: '#D2622A' } : {}
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
