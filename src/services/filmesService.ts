
import { supabase } from "@/integrations/supabase/client";
import { MovieCardProps } from '@/components/MovieCard';
import { mapToMovieCard } from './utils/movieUtils';
import { FilmeDB, MovieResponse } from './types/movieTypes';

// Função para buscar filmes do Supabase por categoria
export const fetchMovies = async (categoria: string): Promise<MovieCardProps[]> => {
  console.log(`Buscando filmes da categoria: ${categoria}`);
  
  try {
    const { data, error } = await supabase
      .from('filmes')
      .select('*')
      .eq('categoria', categoria);
    
    if (error) {
      console.error('Erro ao buscar filmes:', error);
      throw error;
    }
    
    return (data || []).map(filme => mapToMovieCard(filme as FilmeDB));
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
};

// Função para buscar todos os filmes (para a página de filmes)
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
    
    return (data || []).map(filme => mapToMovieCard(filme as FilmeDB));
  } catch (error) {
    console.error('Erro ao buscar todos os filmes:', error);
    return [];
  }
};

// Nova função para buscar detalhes de um filme específico
export const fetchMovieDetails = async (movieId: string): Promise<MovieResponse | null> => {
  try {
    const { data, error } = await supabase
      .from('filmes')
      .select('*')
      .eq('id', movieId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }

    const filme = data as FilmeDB;
    
    return {
      id: filme.id,
      titulo: filme.titulo,
      poster_url: filme.poster_url,
      ano: filme.ano,
      duracao: filme.duracao,
      avaliacao: filme.avaliacao || '0.0',
      tipo: filme.tipo === 'series' ? 'series' : 'movie',
      qualidade: filme.qualidade,
      descricao: filme.descricao,
      categoria: filme.categoria,
      destaque: filme.destaque,
      diretor: filme.diretor,
      elenco: filme.elenco,
      produtor: filme.produtor,
      generos: filme.generos,
      trailer_url: filme.trailer_url,
      player_url: filme.player_url,
      idioma: filme.idioma
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return null;
  }
};
