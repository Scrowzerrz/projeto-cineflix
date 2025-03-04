
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface RotaProtegidaProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RotaProtegida = ({ children, redirectTo = '/auth' }: RotaProtegidaProps) => {
  const { session, perfil, loading } = useAuth();
  const [timeoutAtingido, setTimeoutAtingido] = useState(false);

  // Timeout para evitar loading infinito
  useEffect(() => {
    let timeout: number | undefined;
    
    if (loading) {
      console.log('RotaProtegida - Iniciando timer de timeout para loading');
      timeout = window.setTimeout(() => {
        console.log('RotaProtegida - Tempo limite atingido após 3 segundos');
        setTimeoutAtingido(true);
      }, 3000); // Aumentando para 3 segundos para dar mais tempo
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

  // Adicionar logs para depuração
  useEffect(() => {
    console.log('RotaProtegida - Estado atualizado:', { 
      autenticado: !!session, 
      temPerfil: !!perfil,
      carregando: loading,
      tempoLimiteAtingido: timeoutAtingido 
    });
  }, [session, perfil, loading, timeoutAtingido]);

  // Se o tempo limite foi atingido ou loading completo, tomar decisão
  if (timeoutAtingido || !loading) {
    if (!session) {
      console.log('RotaProtegida - Sem sessão, redirecionando para', redirectTo);
      return <Navigate to={redirectTo} replace />;
    }
    
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
