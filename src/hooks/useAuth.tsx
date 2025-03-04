
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
  const isMounted = useRef(true);
  const initialized = useRef(false);
  const sessionChecked = useRef(false);

  console.log("AuthProvider renderizado. Estado atual:", { 
    sessionExists: !!session, 
    perfilExists: !!perfil, 
    loading,
    initialized: initialized.current,
    sessionChecked: sessionChecked.current
  });

  const fetchPerfil = async (userId: string) => {
    try {
      console.log("Buscando perfil para usuário:", userId);
      
      // Verificamos se já temos o perfil para evitar consultas desnecessárias
      if (perfil && perfil.id === userId) {
        console.log("Perfil já carregado, retornando da cache");
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

      console.log("Perfil obtido com sucesso:", data);
      return data as PerfilUsuario;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
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

  // Nova função para buscar e configurar a sessão inicial de forma mais confiável
  const setupInitialSession = async () => {
    if (sessionChecked.current) return;
    
    try {
      console.log("Configurando sessão inicial");
      setLoading(true);
      
      const { data } = await supabase.auth.getSession();
      
      if (!isMounted.current) return;
      
      sessionChecked.current = true;
      
      console.log("Sessão inicial obtida:", data.session ? "Autenticado" : "Não autenticado");
      setSession(data.session);
      
      if (data.session?.user) {
        console.log("Usuário autenticado, buscando perfil para", data.session.user.id);
        const userProfile = await fetchPerfil(data.session.user.id);
        if (isMounted.current) {
          setPerfil(userProfile);
        }
      }
    } catch (error) {
      console.error('Erro ao obter sessão inicial:', error);
    } finally {
      if (isMounted.current) {
        console.log("Finalizando carregamento inicial da autenticação");
        setLoading(false);
        initialized.current = true;
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    
    // Chama a função de configuração inicial
    setupInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted.current) return;
      
      console.log('Estado de autenticação alterado:', event, newSession?.user?.email);
      
      // Evitar recursão infinita definindo o sessionChecked como true
      sessionChecked.current = true;
      
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('Usuário acabou de logar, buscando perfil');
        const userProfile = await fetchPerfil(newSession.user.id);
        if (isMounted.current) {
          setPerfil(userProfile);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuário acabou de deslogar, limpando perfil');
        if (isMounted.current) {
          setPerfil(null);
          setLoading(false);
        }
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        console.log('Token atualizado, verificando perfil');
        // Revalidar perfil quando o token é atualizado
        if (newSession.user && (!perfil || perfil.id !== newSession.user.id)) {
          const userProfile = await fetchPerfil(newSession.user.id);
          if (isMounted.current) {
            setPerfil(userProfile);
          }
        }
        setLoading(false);
      }
      
      // Garantir que loading seja desativado após eventos de autenticação
      if (isMounted.current && loading) {
        console.log("Desativando loading após mudança de estado de autenticação");
        setLoading(false);
        initialized.current = true;
      }
    });

    return () => {
      console.log("Limpando efeito de autenticação");
      isMounted.current = false;
      if (authListener && authListener.subscription) {
        console.log("Cancelando inscrição de autenticação");
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
