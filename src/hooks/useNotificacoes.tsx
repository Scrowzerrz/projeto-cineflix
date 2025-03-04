
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Notificacao {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  created_at: string;
  item_id: string;
  item_tipo: 'filme' | 'serie' | 'episodio' | 'temporada';
}

export const useNotificacoes = () => {
  const { perfil } = useAuth();
  const queryClient = useQueryClient();

  // Buscar notificações do usuário
  const { data: notificacoes = [], isLoading } = useQuery({
    queryKey: ['notificacoes', perfil?.id],
    queryFn: async () => {
      if (!perfil?.id) return [];
      
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .eq('user_id', perfil.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        toast.error('Erro ao carregar notificações');
        return [];
      }

      return data as Notificacao[];
    },
    enabled: !!perfil?.id,
  });

  // Marcar notificação como lida
  const marcarComoLida = useMutation({
    mutationFn: async (notificacaoId: string) => {
      if (!perfil?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', notificacaoId)
        .eq('user_id', perfil.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar notificação');
    },
  });

  // Contar notificações não lidas
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return {
    notificacoes,
    isLoading,
    marcarComoLida,
    naoLidas,
  };
};
