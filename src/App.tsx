
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import NotFound from "./pages/NotFound";
import DetalhesFilme from "./pages/DetalhesFilme";
import DetalhesSerie from "./pages/DetalhesSerie";
import Search from "./pages/Search";
import Autenticacao from "./pages/Autenticacao";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import RotaProtegida from "./components/RotaProtegida";
import { AuthProvider } from "./hooks/useAuth";

// Criar uma instância do QueryClient com retry reduzido
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  console.log("App componente renderizado");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/movie/:id" element={<DetalhesFilme />} />
            <Route path="/serie/:id" element={<DetalhesSerie />} />
            <Route path="/search" element={<Search />} />
            <Route path="/auth" element={<Autenticacao />} />
            <Route path="/perfil" element={
              <RotaProtegida>
                <Perfil />
              </RotaProtegida>
            } />
            <Route path="/configuracoes" element={
              <RotaProtegida>
                <Configuracoes />
              </RotaProtegida>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster 
            position="top-right" 
            richColors 
            theme="dark"
            toastOptions={{
              style: {
                background: '#0A0A0A',
                color: '#fff',
                border: '1px solid rgba(138, 143, 152, 0.2)',
              },
              success: {
                style: {
                  background: '#0A0A0A',
                  border: '1px solid rgba(138, 143, 152, 0.2)',
                },
                icon: '🎬',
              },
              error: {
                style: {
                  background: '#0A0A0A',
                  border: '1px solid rgba(138, 143, 152, 0.2)',
                },
                icon: '❌',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
