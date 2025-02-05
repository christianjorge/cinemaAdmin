import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Film,
  Users,
  Clapperboard,
  Store,
  Ticket,
  Box,
  Tag,
  Star,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { 
    icon: ShoppingCart, 
    label: 'Vendas', 
    submenu: [
      { icon: Ticket, label: 'Vender Ingressos', path: '/vendas/ingressos' },
      { icon: Store, label: 'Vender Produtos', path: '/vendas/produtos' },
    ]
  },
  { icon: Users, label: 'Usuários', path: '/usuarios' },
  { icon: Film, label: 'Filmes', path: '/filmes' },
  { icon: Clapperboard, label: 'Salas', path: '/salas' },
  { icon: Receipt, label: 'Sessões', path: '/sessoes' },
  { icon: Box, label: 'Produtos', path: '/produtos' },
  { icon: Tag, label: 'Ofertas', path: '/ofertas' },
  { icon: Store, label: 'Estoque', path: '/estoque' },
  { icon: Star, label: 'Fidelidade', path: '/fidelidade' },
];

export function Sidebar() {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <Film className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">CineMaster</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = 'submenu' in item;
            const isActive = hasSubmenu 
              ? item.submenu?.some(subitem => location.pathname === subitem.path)
              : location.pathname === item.path;
            
            if (hasSubmenu && item.submenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openSubmenu === item.label ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openSubmenu === item.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subitem) => {
                        const SubIcon = subitem.icon;
                        const isSubActive = location.pathname === subitem.path;
                        
                        return (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <SubIcon className="w-5 h-5" />
                            <span>{subitem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}