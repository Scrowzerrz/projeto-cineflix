
import { FilmeDB } from '../types/movieTypes';
import { MovieCardProps } from '@/components/MovieCard';

// Helper function para mapear dados da API para o formato MovieCardProps
export const mapToMovieCard = (movie: FilmeDB): MovieCardProps => {
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

// Função para converter dados de série para o formato FilmeDB
export const serieToFilmeDB = (serie: any): FilmeDB => {
  return {
    id: serie.id,
    titulo: serie.titulo,
    poster_url: serie.poster_url,
    ano: serie.ano,
    duracao: serie.duracao || '',
    tipo: 'series',
    qualidade: serie.qualidade || '',
    avaliacao: serie.avaliacao || '0.0',
    destaque: serie.destaque || false,
    descricao: serie.descricao || '',
    categoria: serie.categoria || '',
    diretor: '',
    elenco: '',
    produtor: '',
    generos: [],
    trailer_url: '',
    player_url: '',
    idioma: '',
    created_at: serie.created_at || new Date().toISOString(),
    updated_at: serie.updated_at || new Date().toISOString()
  };
};
