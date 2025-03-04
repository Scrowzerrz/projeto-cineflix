
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-movieDarkBlue">
        <Loader2 className="h-10 w-10 text-movieRed animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
