import React from 'react';
import { Layout } from '../components/Layout';
import { ExternalLink } from 'lucide-react';

export function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards de resumo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Filmes em Cartaz</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sessões Hoje</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingressos Vendidos</h3>
          <p className="text-3xl font-bold text-blue-600">156</p>
        </div>

        {/* Link para o módulo externo */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">Compra Online</h3>
              <p className="text-sm opacity-90 mb-4">
                Acesse o sistema de compra online de ingressos
              </p>
              <a
                href="/online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span>Acessar</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}