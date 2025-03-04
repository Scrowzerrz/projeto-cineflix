
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
  const inicializacaoConcluida = useRef(false);
  const perfilBuscado = useRef(false);

  console.log("AuthProvider renderizado com estado:", { 
    temSessao: !!session, 
    temPerfil: !!perfil, 
    carregando: loading,
    inicializacaoConcluida: inicializacaoConcluida.current,
    perfilJaBuscado: perfilBuscado.current
  });

  const fetchPerfil = async (userId: string): Promise<PerfilUsuario | null> => {
    if (!userId || perfilBuscado.current) return null;
    
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

      if (!data) {
        console.log("Nenhum perfil encontrado para:", userId);
        return null;
      }

      console.log("Perfil obtido:", data);
      perfilBuscado.current = true;
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
    perfilBuscado.current = false; // Resetar para permitir nova busca
    const userProfile = await fetchPerfil(session.user.id);
    
    if (userProfile && isMounted.current) {
      console.log("Perfil atualizado com sucesso");
      setPerfil(userProfile);
    }
  };

  const inicializarAutenticacao = async () => {
    if (inicializacaoConcluida.current) {
      console.log("Inicialização já concluída, ignorando...");
      return;
    }

    try {
      console.log("Iniciando verificação de autenticação...");
      setLoading(true);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao obter sessão:", error);
        setLoading(false);
        inicializacaoConcluida.current = true;
        return;
      }
      
      if (!isMounted.current) return;
      
      console.log("Sessão obtida:", data.session ? "Autenticado" : "Não autenticado");
      setSession(data.session);
      
      if (data.session?.user) {
        console.log("Buscando perfil inicial para:", data.session.user.id);
        const userProfile = await fetchPerfil(data.session.user.id);
        
        if (isMounted.current && userProfile) {
          console.log("Definindo perfil inicial");
          setPerfil(userProfile);
        }
      }
    } catch (error) {
      console.error('Erro durante inicialização:', error);
    } finally {
      if (isMounted.current) {
        console.log("Concluindo inicialização de autenticação");
        setLoading(false);
        inicializacaoConcluida.current = true;
      }
    }
  };

  // Efeito para inicialização única
  useEffect(() => {
    console.log("Configurando ambiente de autenticação");
    isMounted.current = true;
    
    // Inicializa autenticação apenas uma vez
    inicializarAutenticacao();

    return () => {
      console.log("Limpando efeito principal");
      isMounted.current = false;
    };
  }, []);

  // Efeito separado para listener de eventos de autenticação
  useEffect(() => {
    console.log("Configurando listener de autenticação");
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted.current) return;
      
      console.log('Estado de autenticação alterado:', event, newSession?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('Evento de login ou atualização de token');
        setSession(newSession);
        
        if (newSession?.user) {
          perfilBuscado.current = false; // Resetar para permitir busca após sign-in
          console.log('Buscando perfil após evento de autenticação');
          const userProfile = await fetchPerfil(newSession.user.id);
          
          if (isMounted.current && userProfile) {
            console.log('Atualizando perfil após autenticação');
            setPerfil(userProfile);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuário deslogado, limpando dados');
        setSession(null);
        setPerfil(null);
        perfilBuscado.current = false;
      }
      
      if (isMounted.current) {
        console.log("Finalizando carregamento após evento auth");
        setLoading(false);
        inicializacaoConcluida.current = true;
      }
    });

    return () => {
      console.log("Removendo listener de autenticação");
      if (authListener && authListener.subscription) {
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
      perfilBuscado.current = false;
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
