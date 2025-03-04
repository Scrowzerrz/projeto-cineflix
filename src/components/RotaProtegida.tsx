
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
  const [timeoutAtingido, setTimeoutAtingido] = useState(false);

  // Adicionar logs para depuração
  useEffect(() => {
    console.log('RotaProtegida - Estado atual:', { 
      autenticado: !!session, 
      carregando: loading,
      tempoLimiteAtingido: timeoutAtingido,
      usuarioId: session?.user?.id 
    });
  }, [session, loading, timeoutAtingido]);

  // Timeout para evitar loading infinito
  useEffect(() => {
    let timeout: number | undefined;
    
    if (loading) {
      timeout = window.setTimeout(() => {
        console.log('RotaProtegida - Tempo limite atingido após 1.5 segundos');
        setTimeoutAtingido(true);
      }, 1500);
    } else {
      // Resetar timeout quando loading muda para false
      setTimeoutAtingido(false);
    }
    
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [loading]);

  // Se o tempo limite foi atingido, decidir o que fazer
  if (timeoutAtingido) {
    if (!session) {
      console.log('RotaProtegida - Sem sessão após timeout, redirecionando');
      return <Navigate to={redirectTo} replace />;
    } 
    console.log('RotaProtegida - Sessão presente após timeout, mostrando conteúdo');
    return <>{children}</>;
  }

  // Se ainda está carregando e não atingiu timeout
  if (loading && !timeoutAtingido) {
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
