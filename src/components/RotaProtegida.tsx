
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
      }, 3000); // Reduzido para 3 segundos para melhor experiência do usuário
    }
    
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [loading]);

  // Se estiver carregando por muito tempo, mostre uma mensagem ou continue
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

  // Se não tiver sessão ou o timeout foi atingido sem sessão
  if (!session) {
    console.log('RotaProtegida - Redirecionando para:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('RotaProtegida - Renderizando conteúdo protegido');
  return <>{children}</>;
};

export default RotaProtegida;
