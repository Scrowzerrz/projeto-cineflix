
import { MovieCardProps } from '@/components/MovieCard';

// API interfaces
export interface MovieResponse {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
  runtime?: number;
  vote_average: number;
  media_type: 'movie' | 'tv';
  first_air_date?: string;
  episode_run_time?: number[];
}

// Helper function to map API response to our MovieCardProps format
const mapToMovieCard = (movie: MovieResponse): MovieCardProps => {
  const isMovie = movie.media_type === 'movie';
  
  return {
    id: movie.id,
    title: movie.title,
    posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    year: isMovie 
      ? new Date(movie.release_date).getFullYear().toString() 
      : new Date(movie.first_air_date || '').getFullYear().toString(),
    duration: isMovie 
      ? `${movie.runtime}min` 
      : movie.episode_run_time ? `${movie.episode_run_time[0]}min` : undefined,
    type: isMovie ? 'movie' : 'series',
    quality: Math.random() > 0.5 ? 'HD' : 'DUB', // Simulating quality for now
    rating: (movie.vote_average / 2).toFixed(1)
  };
};

// Simulated fetch functions that would normally call a real API
export const fetchMovies = async (category: string): Promise<MovieCardProps[]> => {
  console.log(`Fetching ${category} movies...`);
  
  // This is a placeholder for actual API calls
  // In a real implementation, you would call your backend or a movie API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some sample data
      const movies: MovieCardProps[] = Array.from({ length: 8 }).map((_, index) => ({
        id: `movie-${category}-${index}`,
        title: `Filme ${index + 1}`,
        posterUrl: `https://picsum.photos/500/750?random=${index + 1}`,
        year: '2024',
        duration: '120min',
        quality: Math.random() > 0.5 ? 'HD' : 'DUB',
        rating: (Math.random() * 5).toFixed(1)
      }));
      
      resolve(movies);
    }, 500); // Simulate network delay
  });
};

export const fetchSeries = async (category: string): Promise<MovieCardProps[]> => {
  console.log(`Fetching ${category} series...`);
  
  // This is a placeholder for actual API calls
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some sample data
      const series: MovieCardProps[] = Array.from({ length: 8 }).map((_, index) => ({
        id: `series-${category}-${index}`,
        title: `Série ${index + 1}`,
        posterUrl: `https://picsum.photos/500/750?random=${index + 10 + 1}`,
        year: '2024',
        duration: '45min',
        type: 'series',
        quality: Math.random() > 0.5 ? 'HD' : 'LEG',
        rating: (Math.random() * 5).toFixed(1)
      }));
      
      resolve(series);
    }, 500); // Simulate network delay
  });
};

export const fetchHeroMovie = async (): Promise<{
  title: string;
  description: string;
  imageUrl: string;
  type: 'movie' | 'series';
  rating: string;
  year: string;
  duration: string;
}> => {
  // This is a placeholder for actual API calls
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "REACHER",
        description: "Quando o investigador militar Jack Reacher é preso por um crime que não cometeu, ele se vê no meio de uma conspiração mortal cheia de policiais corruptos, empresários obscuros e políticos conspiradores.",
        imageUrl: "https://picsum.photos/1920/1080?random=1",
        type: 'series',
        rating: "8.7",
        year: "2023",
        duration: "55min"
      });
    }, 300);
  });
};
