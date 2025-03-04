
import { Play, Info, Plus, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  title: string;
  description?: string;
  imageUrl: string;
  type?: 'movie' | 'series';
  rating?: string;
  year?: string;
  duration?: string;
}

const Hero = ({ 
  title, 
  description, 
  imageUrl, 
  type = 'series', 
  rating = '8.5', 
  year = '2023',
  duration = '45min'
}: HeroProps) => {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: '50% 20%'
        }}
      >
        {/* Enhanced gradient overlay com mais profundidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {/* Enhanced Tag */}
          <div className="mb-4 flex items-center">
            <span className="bg-movieRed px-3 py-1 text-sm font-semibold text-white rounded-sm mr-3">
              {type === 'series' ? 'SÉRIE' : 'FILME'}
            </span>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-movieRed stroke-movieRed mr-1" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-white/70" />
                <span className="text-sm">{year}</span>
              </div>
              {duration && (
                <div className="text-sm text-white/70">
                  {duration}
                </div>
              )}
            </div>
          </div>
          
          {/* Title with text shadow */}
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-none" 
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {title}
          </h1>
          
          {/* Description */}
          {description && (
            <p className="text-white/90 text-lg mb-8 line-clamp-3 max-w-xl">
              {description}
            </p>
          )}
          
          {/* Buttons with enhanced styling */}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-white text-black hover:bg-white/90 flex gap-2 items-center rounded-sm px-8 py-6 text-base font-semibold transition-transform duration-300 hover:scale-105"
            >
              <Play className="h-5 w-5 fill-black" /> Assistir
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 flex gap-2 items-center rounded-sm px-8 py-6 text-base font-semibold transition-transform duration-300 hover:scale-105"
            >
              <Info className="h-5 w-5" /> Mais Informações
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 flex gap-2 items-center rounded-sm px-4 py-6 text-base font-semibold transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
