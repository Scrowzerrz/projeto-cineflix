
// Interfaces para os dados de filmes e séries

// Interface para os dados brutos do banco de dados
export interface FilmeDB {
  id: string;
  titulo: string;
  poster_url: string;
  ano: string;
  duracao: string;
  tipo: string;
  qualidade: string;
  avaliacao: string;
  destaque: boolean;
  descricao: string;
  categoria: string;
  diretor: string;
  elenco: string;
  produtor: string;
  generos: string[];
  trailer_url: string;
  player_url: string;
  idioma: string;
  created_at: string;
  updated_at: string;
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

// Interface para o filme em destaque
export interface HeroMovie {
  title: string;
  description: string;
  imageUrl: string;
  type: 'movie' | 'series';
  rating: string;
  year: string;
  duration: string;
}
