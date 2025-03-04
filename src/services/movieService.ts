
// Arquivo de barril (barrel file) que re-exporta todas as funções de serviços

// Exportações de filmesService
export { 
  fetchMovies, 
  fetchAllMovies, 
  fetchMovieDetails 
} from './filmesService';

// Exportações de seriesService
export { 
  fetchSeries, 
  fetchAllSeries 
} from './seriesService';

// Exportações de searchService
export { 
  searchContent 
} from './searchService';

// Exportações de heroService
export { 
  fetchHeroMovie 
} from './heroService';

// Exportação de tipos
export type { 
  MovieResponse 
} from './types/movieTypes';
