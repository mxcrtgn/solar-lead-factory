import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, BarChart3, Settings, LogOut, User, Plug, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Pipeline', href: '/pipeline', icon: LayoutGrid },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Intégrations', href: '/integrations', icon: Plug },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r-2 border-gray-100 shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center p-6 border-b-2 border-gray-100">
          <img
            src="/ferme-solaire-logo.svg"
            alt="La Ferme Solaire"
            className="h-12 w-auto mb-3"
          />
          <h1 className="font-bold text-xl text-[#211F1B] text-center">
            Solar Lead Factory
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-bold ${
                  active
                    ? 'bg-[#FFDE00] text-[#211F1B] shadow-lg shadow-[#FFDE00]/30 transform scale-105'
                    : 'text-[#211F1B] hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#211F1B]' : 'text-gray-600'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-100 bg-white">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFDE00] to-[#FFA500] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#211F1B]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#211F1B] truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold border-2 border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-72">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
