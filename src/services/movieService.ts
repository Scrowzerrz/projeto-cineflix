
import { MovieCardProps } from '@/components/MovieCard';
import { supabase } from "@/integrations/supabase/client";

// Interface para os dados brutos do banco de dados
interface FilmeDB {
  id: string;
  titulo: string;
  poster_url: string;
  ano: string;
  duracao?: string;
  tipo?: string;
  qualidade?: string;
  avaliacao?: string;
  destaque?: boolean;
  descricao?: string;
  categoria?: string;
  created_at?: string;
  updated_at?: string;
}

// API interfaces
export interface MovieResponse {
  id: string;
  titulo: string;
  poster_url: string;
  ano: string;
  duracao?: string;
  avaliacao: string;
  tipo: 'movie' | 'series';
  qualidade?: string;
  descricao?: string;
  categoria?: string;
  destaque?: boolean;
}

// Helper function to map API response to our MovieCardProps format
const mapToMovieCard = (movie: FilmeDB): MovieCardProps => {
  return {
    id: movie.id,
    title: movie.titulo,
    posterUrl: movie.poster_url,
    year: movie.ano,
    duration: movie.duracao,
    // Garante que 'tipo' seja 'movie' ou 'series'
    type: movie.tipo === 'series' ? 'series' : 'movie',
    // Tipo seguro para qualidade
    quality: (movie.qualidade || 'HD') as 'HD' | 'CAM' | 'DUB' | 'LEG',
    rating: movie.avaliacao || '0.0'
  };
};

// Função para buscar filmes do Supabase
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
    
    return (data || []).map(filme => mapToMovieCard(filme));
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
};

// Função para buscar séries do Supabase
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
    
    return (data || []).map(serie => mapToMovieCard(serie));
  } catch (error) {
    console.error('Erro ao buscar séries:', error);
    return [];
  }
};

// Função para buscar filme em destaque do Supabase
export const fetchHeroMovie = async (): Promise<{
  title: string;
  description: string;
  imageUrl: string;
  type: 'movie' | 'series';
  rating: string;
  year: string;
  duration: string;
}> => {
  try {
    // Primeiro tentamos buscar um filme em destaque
    let { data, error } = await supabase
      .from('filmes')
      .select('*')
      .eq('destaque', true)
      .single();
    
    // Se não encontrarmos um filme em destaque, tentamos uma série em destaque
    if (error || !data) {
      const seriesResult = await supabase
        .from('series')
        .select('*')
        .eq('destaque', true)
        .single();
      
      if (seriesResult.error) {
        console.error('Erro ao buscar filme/série em destaque:', seriesResult.error);
        throw seriesResult.error;
      }
      
      data = seriesResult.data;
    }
    
    if (!data) {
      throw new Error('Nenhum filme ou série em destaque encontrado');
    }
    
    return {
      title: data.titulo,
      description: data.descricao || 'Sem descrição disponível',
      imageUrl: data.poster_url,
      // Garante que 'tipo' seja 'movie' ou 'series'
      type: data.tipo === 'series' ? 'series' : 'movie',
      rating: data.avaliacao || '0.0',
      year: data.ano,
      duration: data.duracao || '0min'
    };
  } catch (error) {
    console.error('Erro ao buscar filme/série em destaque:', error);
    // Retornamos dados padrão em caso de erro
    return {
      title: "Filme em Destaque",
      description: "Descrição do filme em destaque não disponível.",
      imageUrl: "https://picsum.photos/1920/1080?random=1",
      type: 'movie',
      rating: "0.0",
      year: "2023",
      duration: "0min"
    };
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
    
    return (data || []).map(filme => mapToMovieCard(filme));
  } catch (error) {
    console.error('Erro ao buscar todos os filmes:', error);
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
    
    return (data || []).map(serie => mapToMovieCard(serie));
  } catch (error) {
    console.error('Erro ao buscar todas as séries:', error);
    return [];
  }
};

// Função para buscar por termo (para a página de pesquisa)
export const searchContent = async (searchTerm: string): Promise<MovieCardProps[]> => {
  try {
    // Buscar filmes que correspondem ao termo de pesquisa
    const { data: filmes, error: filmesError } = await supabase
      .from('filmes')
      .select('*')
      .ilike('titulo', `%${searchTerm}%`);
    
    if (filmesError) {
      console.error('Erro ao pesquisar filmes:', filmesError);
      throw filmesError;
    }
    
    // Buscar séries que correspondem ao termo de pesquisa
    const { data: series, error: seriesError } = await supabase
      .from('series')
      .select('*')
      .ilike('titulo', `%${searchTerm}%`);
    
    if (seriesError) {
      console.error('Erro ao pesquisar séries:', seriesError);
      throw seriesError;
    }
    
    // Combinar resultados de filmes e séries
    const combinedResults = [...(filmes || []), ...(series || [])];
    
    return combinedResults.map(item => mapToMovieCard(item));
  } catch (error) {
    console.error('Erro ao realizar pesquisa:', error);
    return [];
  }
};
