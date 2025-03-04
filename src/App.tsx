
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
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

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const AppRoutes = () => (
  <AuthProvider>
    {/* Rotas públicas */}
    <Route path="/" element={<Index />} />
    <Route path="/movies" element={<Movies />} />
    <Route path="/series" element={<Series />} />
    <Route path="/movie/:id" element={<DetalhesFilme />} />
    <Route path="/serie/:id" element={<DetalhesSerie />} />
    <Route path="/search" element={<Search />} />
    <Route path="/auth" element={<Autenticacao />} />

    {/* Rotas protegidas */}
    <Route element={<RotaProtegida />}>
      <Route path="/perfil" element={<Index />} />
      <Route path="/configuracoes" element={<Index />} />
    </Route>
  </AuthProvider>
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(<AppRoutes />)
  );

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
