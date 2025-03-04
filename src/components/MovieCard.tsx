
import { useState } from 'react';
import { Play, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  year: string;
  duration?: string;
  type?: 'movie' | 'series';
  quality?: 'HD' | 'CAM' | 'DUB' | 'LEG';
}

const MovieCard = ({ title, posterUrl, year, duration, type = 'movie', quality }: MovieCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative w-full aspect-[2/3] rounded-md overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:z-10">
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
          <span className="movie-badge">{quality}</span>
        </div>
      )}
      
      {/* Hover Overlay */}
      <div className="movie-card-overlay flex flex-col justify-end p-3">
        <div className="flex space-x-2 mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 rounded-full bg-white text-black hover:bg-white/90 backdrop-blur-sm"
          >
            <Play className="h-3 w-3 fill-black" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
          >
            <Info className="h-3 w-3" />
          </Button>
        </div>
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
    </div>
  );
};

export default MovieCard;
