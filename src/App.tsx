import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Router } from './Router';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;