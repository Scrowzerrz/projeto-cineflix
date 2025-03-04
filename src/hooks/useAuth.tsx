
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
  
  // Refs para controle de estado e ciclo de vida
  const isMounted = useRef(true);
  const authSubscribed = useRef(false);
  const inicializacaoConcluida = useRef(false);
  
  console.log("AuthProvider renderizado com estado:", { 
    temSessao: !!session, 
    temPerfil: !!perfil, 
    carregando: loading,
    inicializacaoConcluida: inicializacaoConcluida.current,
    authSubscribed: authSubscribed.current
  });

  const fetchPerfil = async (userId: string): Promise<PerfilUsuario | null> => {
    if (!userId) return null;
    
    try {
      console.log("Buscando perfil para usuário:", userId);
      
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

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

  // Inicialização única para verificar a sessão atual
  useEffect(() => {
    console.log("Verificando sessão inicial...");
    
    const checkSession = async () => {
      if (inicializacaoConcluida.current) {
        console.log("Verificação de sessão já realizada anteriormente");
        return;
      }

      try {
        setLoading(true);
        console.log("Buscando sessão atual...");
        
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          setLoading(false);
          inicializacaoConcluida.current = true;
          return;
        }
        
        console.log("Sessão obtida:", sessionData.session ? "Autenticado" : "Não autenticado");
        
        if (isMounted.current) {
          setSession(sessionData.session);
          
          if (sessionData.session?.user) {
            const userProfile = await fetchPerfil(sessionData.session.user.id);
            if (userProfile && isMounted.current) {
              setPerfil(userProfile);
            }
          }
          
          inicializacaoConcluida.current = true;
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        if (isMounted.current) {
          inicializacaoConcluida.current = true;
          setLoading(false);
        }
      }
    };
    
    checkSession();
    
    return () => {
      console.log("Limpando efeito de verificação de sessão");
      isMounted.current = false;
    };
  }, []);

  // Configurar listener de eventos de auth separadamente
  useEffect(() => {
    if (authSubscribed.current) {
      console.log("Listener de auth já configurado, ignorando");
      return;
    }
    
    console.log("Configurando listener de autenticação");
    authSubscribed.current = true;
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted.current) return;
      
      console.log('Estado de autenticação alterado:', event, newSession?.user?.email);
      
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
      console.log("Removendo listener de autenticação");
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
        authSubscribed.current = false;
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
