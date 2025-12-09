import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Cloud} from 'lucide-react';
import type { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/parcels', label: 'Parcels', icon: MapPin },
    { path: '/weather', label: 'Weather', icon: Cloud },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-md shadow-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16 gap-12">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Smart Agriculture
              </span>
            </div>
            <div className="flex gap-4 flex-grow justify-center">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-8 py-2 rounded-lg transition-all ${
                    location.pathname === path
                      ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;