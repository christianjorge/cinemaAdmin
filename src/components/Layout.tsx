import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../store/authStore';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export function Layout({ children, title }: LayoutProps) {
  const { usuario, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Olá, {usuario?.nomeCompleto}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}