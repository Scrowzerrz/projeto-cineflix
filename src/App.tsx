
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/movies",
      element: <Movies />,
    },
    {
      path: "/series",
      element: <Series />,
    },
    {
      path: "/movie/:id",
      element: <DetalhesFilme />,
    },
    {
      path: "/serie/:id",
      element: <DetalhesSerie />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/auth",
      element: <Autenticacao />,
    },
    {
      path: "/perfil",
      element: <RotaProtegida><Index /></RotaProtegida>,
    },
    {
      path: "/configuracoes",
      element: <RotaProtegida><Index /></RotaProtegida>,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <React.StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
