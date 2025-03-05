import { supabase } from "@/integrations/supabase/client";
import { MovieCardProps } from '@/components/MovieCard';
import { mapToMovieCard } from './utils/movieUtils';

// Função para buscar filmes do Supabase por categoria
export const fetchMovies = async (categoria: string): Promise<MovieCardProps[]> => {
  console.log(`Buscando filmes da categoria: ${categoria}`);

  try {
    let query = supabase
      .from('filmes')
      .select('*');

    // Lógica para filtrar com base na categoria
    switch (categoria) {
      case 'lancamentos':
        // Filmes recém lançados - ordenados por data de lançamento decrescente
        query = query.order('ano', { ascending: false }).limit(20);
        break;

      case 'em-alta':
        // Filmes populares - ordenados por número de visualizações decrescente
        query = query.order('visualizacoes', { ascending: false }).limit(20);
        break;

      case 'acao':
      case 'comedia':
      case 'terror':
        // Filmes por gênero
        query = query.eq('categoria', categoria).limit(20);
        break;

      default:
        // Categoria padrão ou desconhecida
        query = query.limit(20);
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar filmes:', error);
      throw error;
    }

    // Mapeamos cada filme para o formato MovieCardProps
    return (data || []).map(filme => mapToMovieCard(filme));
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
};

// Função para buscar todos os filmes para a página de filmes
export const fetchAllMovies = async (filtroCategoria?: string): Promise<MovieCardProps[]> => {
  try {
    let query = supabase
      .from('filmes')
      .select('*');

    if (filtroCategoria && filtroCategoria !== 'Todos') {
      query = query.eq('categoria', filtroCategoria);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar todos os filmes:', error);
      throw error;
    }

    return (data || []).map(filme => mapToMovieCard(filme));
  } catch (error) {
    console.error('Erro ao buscar todos os filmes:', error);
    return [];
  }
};

// Função para buscar detalhes de um filme específico
export const fetchMovieDetails = async (movieId: string): Promise<MovieCardProps | null> => {
  try {
    const { data, error } = await supabase
      .from('filmes')
      .select('*')
      .eq('id', movieId)
      .single();

    if (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      return null;
    }

    return data ? mapToMovieCard(data) : null;
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return null;
  }
};

// Função para incrementar visualizações de um filme
export const incrementarVisualizacaoFilme = async (filmeId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('incrementar_visualizacao', {
      tabela: 'filmes',
      item_id: filmeId
    });

    if (error) {
      console.error('Erro ao incrementar visualização do filme:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao incrementar visualização do filme:', error);
  }
};

// Função para buscar alguns filmes aleatórios
export const fetchSomeMovies = async (quantidade = 4): Promise<MovieCardProps[]> => {
  try {
    const { data, error } = await supabase
      .from('filmes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(quantidade);
    
    if (error) {
      console.error('Erro ao buscar filmes aleatórios:', error);
      throw error;
    }
    
    return (data || []).map(filme => mapToMovieCard(filme));
  } catch (error) {
    console.error('Erro ao buscar filmes aleatórios:', error);
    return [];
  }
};
