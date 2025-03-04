
import { useState } from 'react';
import { Play, Plus, Info, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  year: string;
  duration?: string;
  type?: 'movie' | 'series';
  quality?: 'HD' | 'CAM' | 'DUB' | 'LEG';
  rating?: string;
}

const MovieCard = ({ 
  title, 
  posterUrl, 
  year, 
  duration, 
  type = 'movie', 
  quality,
  rating = "7.5"
}: MovieCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="group relative w-full aspect-[2/3] rounded-md overflow-hidden transition-transform duration-300 hover:scale-[1.05] hover:z-10 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Image */}
      <div className="absolute inset-0 bg-movieDark/60 animate-pulse rounded-md">
        <img 
          src={posterUrl} 
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      
      {/* Quality Badge */}
      {quality && (
        <div className="absolute top-2 left-2 z-20">
          <span className="bg-movieRed text-white text-xs font-bold px-2 py-0.5 rounded-sm">{quality}</span>
        </div>
      )}

      {/* Favorite Icon no canto superior direito */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-20 bg-black/40 rounded-full p-1.5 transition-all duration-300 hover:bg-black/60"
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-movieRed stroke-movieRed' : 'text-white'}`} />
      </button>
      
      {/* Rating Badge */}
      <div className="absolute top-2 right-10 z-20 flex items-center bg-black/40 rounded-sm px-1.5 py-0.5">
        <Star className="h-3 w-3 fill-movieRed stroke-movieRed mr-1" />
        <span className="text-white text-xs font-medium">{rating}</span>
      </div>
      
      {/* Title with gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-10 opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold line-clamp-1">{title}</h3>
        <div className="flex items-center text-xs text-white/70 mt-1 space-x-1">
          <span>{year}</span>
          {duration && (
            <>
              <span className="mx-1">•</span>
              <span>{duration}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-black/75 flex flex-col justify-center items-center p-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full mb-2 bg-movieRed hover:bg-movieRed/90 text-white flex items-center justify-center gap-1 rounded-sm transition-transform duration-200 hover:scale-105"
        >
          <Play className="h-3 w-3 fill-white" /> Assistir
        </Button>
        
        <div className="flex justify-between w-full mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-transform duration-200 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              // Lógica para adicionar à lista
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 rounded-sm bg-white/10 hover:bg-white/20 text-white ml-2 transition-transform duration-200 hover:scale-105"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-auto">
          <h3 className="text-white font-semibold text-center mt-2">{title}</h3>
          <div className="flex items-center justify-center text-xs text-white/70 mt-1 mb-1">
            <span>{year}</span>
            {duration && (
              <>
                <span className="mx-1">•</span>
                <span>{duration}</span>
              </>
            )}
          </div>
          <div className="flex items-center justify-center mt-1">
            <Star className="h-3 w-3 fill-movieRed stroke-movieRed mr-1" />
            <span className="text-white text-xs">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
