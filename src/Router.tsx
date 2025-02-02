import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Usuarios } from './pages/usuarios';
import { Filmes } from './pages/filmes';
import { Salas } from './pages/salas';
import { Sessoes } from './pages/sessoes';
import { Produtos } from './pages/produtos';
import { Ofertas } from './pages/ofertas';
import { Estoques } from './pages/estoque';
import { Fidelidades } from './pages/fidelidade';
import { VendaProdutos } from './pages/vendas/VendaProdutos';
import { VendaIngressos } from './pages/vendas/VendaIngressos';
import { CompraIngresso } from './pages/online/CompraIngresso';
import { PrivateRoute } from './components/PrivateRoute';

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/online" element={<CompraIngresso />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/sessoes" element={<Sessoes />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/estoque" element={<Estoques />} />
        <Route path="/fidelidade" element={<Fidelidades />} />
        <Route path="/vendas/produtos" element={<VendaProdutos />} />
        <Route path="/vendas/ingressos" element={<VendaIngressos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}