
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

  // Timeout para evitar loading infinito - reduzido para 800ms
  useEffect(() => {
    let timeout: number | undefined;
    
    if (loading) {
      console.log('RotaProtegida - Iniciando timer de timeout para loading (800ms)');
      timeout = window.setTimeout(() => {
        console.log('RotaProtegida - Tempo limite atingido');
        setTimeoutAtingido(true);
      }, 800);
    } else {
      console.log('RotaProtegida - Loading completado, resetando timeout');
      setTimeoutAtingido(false);
    }
    
    return () => {
      if (timeout) {
        console.log('RotaProtegida - Limpando timeout anterior');
        window.clearTimeout(timeout);
      }
    };
  }, [loading]);

  // Logs para depuração
  useEffect(() => {
    console.log('RotaProtegida - Estado atualizado:', { 
      autenticado: !!session, 
      carregando: loading,
      tempoLimiteAtingido: timeoutAtingido 
    });
  }, [session, loading, timeoutAtingido]);

  // Lógica simplificada - se timeout ou loading completo
  if (timeoutAtingido || !loading) {
    // Se não tem sessão, redireciona
    if (!session) {
      console.log('RotaProtegida - Sem sessão, redirecionando para', redirectTo);
      return <Navigate to={redirectTo} replace />;
    }
    
    // Se tem sessão, mostra conteúdo
    console.log('RotaProtegida - Sessão presente, mostrando conteúdo protegido');
    return <>{children}</>;
  }

  // Se ainda está carregando e não atingiu timeout
  console.log('RotaProtegida - Mostrando indicador de carregamento');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-movieDarkBlue z-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-movieRed animate-spin mx-auto mb-4" />
        <p className="text-white">Verificando autenticação...</p>
      </div>
    </div>
  );
};

export default RotaProtegida;
