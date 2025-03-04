
import { supabase } from "@/integrations/supabase/client";
import { MovieCardProps } from '@/components/MovieCard';
import { mapToMovieCard, serieToFilmeDB } from './utils/movieUtils';
import { SerieDB, SerieDetalhes, TemporadaDB, EpisodioDB } from './types/movieTypes';

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

// Função para buscar detalhes completos de uma série específica
export const fetchSerieDetails = async (id: string): Promise<SerieDetalhes | null> => {
  try {
    // Buscar informações básicas da série
    const { data: serieData, error: serieError } = await supabase
      .from('series')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (serieError || !serieData) {
      console.error('Erro ao buscar série:', serieError);
      return null;
    }

    // Buscar temporadas da série
    const { data: temporadasData, error: temporadasError } = await supabase
      .from('temporadas')
      .select('*')
      .eq('serie_id', id)
      .order('numero', { ascending: true });
    
    if (temporadasError) {
      console.error('Erro ao buscar temporadas:', temporadasError);
      return null;
    }

    // Para cada temporada, buscar seus episódios
    const temporadasComEpisodios: TemporadaDB[] = [];
    
    for (const temporada of temporadasData || []) {
      const { data: episodiosData, error: episodiosError } = await supabase
        .from('episodios')
        .select('*')
        .eq('temporada_id', temporada.id)
        .order('numero', { ascending: true });
      
      if (episodiosError) {
        console.error(`Erro ao buscar episódios da temporada ${temporada.numero}:`, episodiosError);
        continue;
      }
      
      temporadasComEpisodios.push({
        ...temporada,
        episodios: episodiosData || []
      });
    }

    // Preparar e retornar o objeto completo da série
    const serieDetalhes: SerieDetalhes = {
      ...serieData,
      temporadas: temporadasComEpisodios,
      tipo: serieData.tipo || 'series',
      generos: serieData.generos || [],
      avaliacao: serieData.avaliacao || '0.0',
      destaque: serieData.destaque || false,
      diretor: serieData.diretor || '',
      elenco: serieData.elenco || '',
      produtor: serieData.produtor || '',
      titulo_original: serieData.titulo_original || '',
      trailer_url: serieData.trailer_url || '',
      idioma: serieData.idioma || 'DUB'
    };

    return serieDetalhes;
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error);
    return null;
  }
};
