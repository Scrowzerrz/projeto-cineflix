
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

type PerfilUsuario = {
  id: string;
  nome: string | null;
  email: string;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  perfil: PerfilUsuario | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshPerfil: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPerfil = async (userId: string) => {
    try {
      // Verificamos se já temos o perfil para evitar consultas desnecessárias
      if (perfil && perfil.id === userId) {
        return perfil;
      }

      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as PerfilUsuario;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  const refreshPerfil = async () => {
    if (!session?.user?.id) return;
    
    const userProfile = await fetchPerfil(session.user.id);
    if (userProfile) {
      setPerfil(userProfile);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(data.session);
          
          if (data.session?.user) {
            const userProfile = await fetchPerfil(data.session.user.id);
            if (isMounted) {
              setPerfil(userProfile);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao obter sessão:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (isMounted) {
        console.log('Estado de autenticação alterado:', event);
        setSession(newSession);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          const userProfile = await fetchPerfil(newSession.user.id);
          if (isMounted) {
            setPerfil(userProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setPerfil(null);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, perfil, loading, signOut, refreshPerfil }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
