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
  diretor?: string;
  elenco?: string;
  produtor?: string;
  generos?: string[];
  trailer_url?: string;
  player_url?: string;
  idioma?: string;
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
  diretor?: string;
  elenco?: string;
  produtor?: string;
  generos?: string[];
  trailer_url?: string;
  player_url?: string;
  idioma?: string;
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
    
    return (data || []).map(filme => mapToMovieCard(filme as FilmeDB));
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
    
    return (data || []).map(serie => {
      // A tabela series pode não ter todos os campos que FilmeDB tem,
      // então criamos um objeto que atenda os requisitos mínimos
      const serieAsFilme: FilmeDB = {
        id: serie.id,
        titulo: serie.titulo,
        poster_url: serie.poster_url,
        ano: serie.ano,
        duracao: serie.duracao,
        tipo: 'series',
        qualidade: serie.qualidade,
        avaliacao: serie.avaliacao,
        destaque: serie.destaque,
        descricao: serie.descricao,
        categoria: serie.categoria,
        // Fornecendo valores padrão para os campos que podem estar faltando
        diretor: '',
        elenco: '',
        produtor: '',
        generos: [],
        trailer_url: '',
        player_url: '',
        idioma: '',
        created_at: serie.created_at,
        updated_at: serie.updated_at
      };
      return mapToMovieCard(serieAsFilme);
    });
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
        // Se não houver destaque em séries, buscamos qualquer filme
        const fallbackFilmes = await supabase
          .from('filmes')
          .select('*')
          .limit(1)
          .single();
          
        if (fallbackFilmes.error || !fallbackFilmes.data) {
          // Se não houver nenhum filme, buscamos qualquer série
          const fallbackSeries = await supabase
            .from('series')
            .select('*')
            .limit(1)
            .single();
            
          if (fallbackSeries.error || !fallbackSeries.data) {
            // Se não houver NADA no banco, aí sim mostramos um erro
            throw new Error('Nenhum filme ou série encontrado no banco de dados');
          }
          
          // Usamos uma série qualquer como destaque
          data = {
            ...fallbackSeries.data,
            diretor: '',
            elenco: '',
            produtor: '',
            generos: [],
            trailer_url: '',
            player_url: '',
            idioma: ''
          };
        } else {
          // Usamos um filme qualquer como destaque
          data = fallbackFilmes.data;
        }
      } else {
        // Usamos a série em destaque
        data = {
          ...seriesResult.data,
          diretor: '',
          elenco: '',
          produtor: '',
          generos: [],
          trailer_url: '',
          player_url: '',
          idioma: ''
        };
      }
    }
    
    if (!data) {
      throw new Error('Nenhum filme ou série encontrado');
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
    // Lançar o erro para tratamento na interface
    throw new Error('Não foi possível carregar conteúdo em destaque');
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
    
    return (data || []).map(serie => {
      // A tabela series pode não ter todos os campos que FilmeDB tem
      const serieAsFilme: FilmeDB = {
        id: serie.id,
        titulo: serie.titulo,
        poster_url: serie.poster_url,
        ano: serie.ano,
        duracao: serie.duracao,
        tipo: 'series',
        qualidade: serie.qualidade,
        avaliacao: serie.avaliacao,
        destaque: serie.destaque,
        descricao: serie.descricao,
        categoria: serie.categoria,
        // Fornecendo valores padrão para os campos que podem estar faltando
        diretor: '',
        elenco: '',
        produtor: '',
        generos: [],
        trailer_url: '',
        player_url: '',
        idioma: '',
        created_at: serie.created_at,
        updated_at: serie.updated_at
      };
      return mapToMovieCard(serieAsFilme);
    });
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
    
    return combinedResults.map(item => {
      if ('player_url' in item) {
        // É um filme
        return mapToMovieCard(item as FilmeDB);
      } else {
        // É uma série, precisa adicionar campos faltantes
        const serieAsFilme: FilmeDB = {
          id: item.id,
          titulo: item.titulo,
          poster_url: item.poster_url,
          ano: item.ano,
          duracao: item.duracao,
          tipo: 'series',
          qualidade: item.qualidade,
          avaliacao: item.avaliacao,
          destaque: item.destaque,
          descricao: item.descricao,
          categoria: item.categoria,
          // Fornecendo valores padrão para os campos que podem estar faltando
          diretor: '',
          elenco: '',
          produtor: '',
          generos: [],
          trailer_url: '',
          player_url: '',
          idioma: '',
          created_at: item.created_at,
          updated_at: item.updated_at
        };
        return mapToMovieCard(serieAsFilme);
      }
    });
  } catch (error) {
    console.error('Erro ao realizar pesquisa:', error);
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
