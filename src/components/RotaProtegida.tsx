
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface RotaProtegidaProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RotaProtegida = ({ children, redirectTo = '/auth' }: RotaProtegidaProps) => {
  const { session, loading } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

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
      // Definir um estado local para indicar que passou tempo demais no loading
      timeout = window.setTimeout(() => {
        console.warn('RotaProtegida - Tempo limite de carregamento atingido');
        setLoadingTimeout(true);
      }, 2000); // Reduzido para 2 segundos para melhor experiência do usuário
    }
    
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [loading]);

  // Se o timeout foi atingido, tentamos seguir em frente
  if (loadingTimeout) {
    // Se não temos uma sessão mesmo após o timeout, redirecionamos
    if (!session) {
      console.log('RotaProtegida - Timeout atingido sem sessão, redirecionando para:', redirectTo);
      return <Navigate to={redirectTo} replace />;
    } 
    // Se temos uma sessão, mostramos o conteúdo protegido
    console.log('RotaProtegida - Timeout atingido com sessão, mostrando conteúdo');
    return <>{children}</>;
  }

  // Se estiver carregando e ainda não atingiu o timeout
  if (loading && !loadingTimeout) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-movieDarkBlue z-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-movieRed animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não tiver sessão
  if (!session) {
    console.log('RotaProtegida - Redirecionando para:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('RotaProtegida - Renderizando conteúdo protegido');
  return <>{children}</>;
};

export default RotaProtegida;
