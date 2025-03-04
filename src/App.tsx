
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
                <div className="pt-20 min-h-screen bg-movieDarkBlue text-white p-8">
                  <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
                  <p>Página em construção</p>
                </div>
              </RotaProtegida>
            } />
            <Route path="/configuracoes" element={
              <RotaProtegida>
                <div className="pt-20 min-h-screen bg-movieDarkBlue text-white p-8">
                  <h1 className="text-2xl font-bold mb-4">Configurações</h1>
                  <p>Página em construção</p>
                </div>
              </RotaProtegida>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
