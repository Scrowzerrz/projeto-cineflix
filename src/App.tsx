
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
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
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
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
  }
]);

export default App;
