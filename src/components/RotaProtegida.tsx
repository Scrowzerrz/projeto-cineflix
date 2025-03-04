
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface RotaProtegidaProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RotaProtegida = ({ children, redirectTo = '/auth' }: RotaProtegidaProps) => {
  const { session, loading } = useAuth();

  // Adicionando logs para depuração
  console.log('RotaProtegida - Estado de carregamento:', loading);
  console.log('RotaProtegida - Sessão:', session ? 'Autenticado' : 'Não autenticado');

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-movieDarkBlue">
        <Loader2 className="h-10 w-10 text-movieRed animate-spin" />
      </div>
    );
  }

  if (!session) {
    console.log('RotaProtegida - Redirecionando para:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('RotaProtegida - Renderizando conteúdo protegido');
  return <>{children}</>;
};

export default RotaProtegida;
