
import { supabase } from "@/integrations/supabase/client";
import { MovieCardProps } from '@/components/MovieCard';
import { mapToMovieCard, serieToFilmeDB } from './utils/movieUtils';

// Função para buscar séries do Supabase por categoria
export const fetchSeries = async (categoria: string): Promise<MovieCardProps[]> => {
  console.log(`Buscando séries da categoria: ${categoria}`);
  
  try {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('categoria', categoria);
    
    if (error) {
      console.error('Erro ao buscar séries:', error);
      throw error;
    }
    
    return (data || []).map(serie => mapToMovieCard(serieToFilmeDB(serie)));
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    return [];
  }
};

// Função para buscar todas as séries (para a página de séries)
export const fetchAllSeries = async (filtroCategoria?: string): Promise<MovieCardProps[]> => {
  try {
    let query = supabase
      .from('series')
      .select('*');
    
    if (filtroCategoria && filtroCategoria !== 'Todos') {
      query = query.eq('categoria', filtroCategoria);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar todas as séries:', error);
      throw error;
    }
    
    return (data || []).map(serie => mapToMovieCard(serieToFilmeDB(serie)));
  } catch (error) {
    console.error('Erro ao buscar todas as séries:', error);
    return [];
  }
};
