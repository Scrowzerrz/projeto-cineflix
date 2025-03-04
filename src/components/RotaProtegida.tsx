
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

interface RotaProtegidaProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RotaProtegida = ({ children, redirectTo = '/auth' }: RotaProtegidaProps) => {
  const { session, loading } = useAuth();

  // Adicionando logs para depuração
  useEffect(() => {
    console.log('RotaProtegida - Estado atual:', { 
      autenticado: !!session, 
      carregando: loading,
      usuarioId: session?.user?.id 
    });
  }, [session, loading]);

  // Timeout para evitar loading infinito
  useEffect(() => {
    let timeout: number | undefined;
    
    if (loading) {
      timeout = window.setTimeout(() => {
        console.warn('RotaProtegida - Tempo limite de carregamento atingido');
      }, 5000);
    }
    
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-movieDarkBlue z-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-movieRed animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando autenticação...</p>
        </div>
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
