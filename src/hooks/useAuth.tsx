
import { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  
  // Simplificando o controle de estado com menos refs
  const isMounted = useRef(true);
  const inicializado = useRef(false);
  
  console.log("AuthProvider renderizado:", { 
    temSessao: !!session, 
    temPerfil: !!perfil, 
    carregando: loading,
    inicializado: inicializado.current
  });

  const fetchPerfil = async (userId: string): Promise<PerfilUsuario | null> => {
    if (!userId) return null;
    
    try {
      console.log("Buscando perfil para usuário:", userId);
      
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      console.log("Perfil obtido:", data);
      return data as PerfilUsuario;
    } catch (error) {
      console.error('Exceção ao buscar perfil:', error);
      return null;
    }
  };

  const refreshPerfil = async () => {
    if (!session?.user?.id) {
      console.log("Não é possível atualizar perfil - nenhuma sessão ativa");
      return;
    }
    
    console.log("Atualizando perfil para usuário:", session.user.id);
    const userProfile = await fetchPerfil(session.user.id);
    
    if (userProfile && isMounted.current) {
      console.log("Perfil atualizado com sucesso");
      setPerfil(userProfile);
    }
  };

  // Componente para verificar a sessão inicial e configurar o listener
  useEffect(() => {
    console.log("Inicializando AuthProvider");
    
    // Apenas verificar a sessão se não foi inicializado ainda
    if (!inicializado.current) {
      const checkSession = async () => {
        try {
          console.log("Buscando sessão atual...");
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Erro ao obter sessão:", error);
            if (isMounted.current) {
              setLoading(false);
              inicializado.current = true;
            }
            return;
          }
          
          console.log("Sessão obtida:", currentSession ? "Autenticado" : "Não autenticado");
          
          if (isMounted.current) {
            setSession(currentSession);
            
            if (currentSession?.user) {
              const userProfile = await fetchPerfil(currentSession.user.id);
              if (isMounted.current && userProfile) {
                setPerfil(userProfile);
              }
            }
            
            // Finaliza o carregamento independentemente do resultado
            setLoading(false);
            inicializado.current = true;
          }
        } catch (error) {
          console.error("Erro ao verificar sessão:", error);
          if (isMounted.current) {
            setLoading(false);
            inicializado.current = true;
          }
        }
      };
      
      checkSession();
    }
    
    // Configura listener de autenticação (uma única vez)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Estado de autenticação alterado:', event, newSession?.user?.email);
      
      if (!isMounted.current) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('Usuário logado ou token atualizado');
        setSession(newSession);
        
        if (newSession?.user) {
          const userProfile = await fetchPerfil(newSession.user.id);
          if (isMounted.current && userProfile) {
            setPerfil(userProfile);
          }
        }
        
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuário deslogado, limpando dados');
        setSession(null);
        setPerfil(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("Limpando efeito principal");
      isMounted.current = false;
      if (authListener && authListener.subscription) {
        console.log("Removendo listener de autenticação");
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Iniciando processo de logout");
      setLoading(true);
      await supabase.auth.signOut();
      console.log("Logout realizado com sucesso");
      setSession(null);
      setPerfil(null);
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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
