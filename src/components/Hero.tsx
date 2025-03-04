
import { Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  title: string;
  description?: string;
  imageUrl: string;
  type?: 'movie' | 'series';
}

const Hero = ({ title, description, imageUrl, type = 'series' }: HeroProps) => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: '50% 20%'
        }}
      >
        <div className="absolute inset-0 bg-hero-gradient"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
        <div className="max-w-2xl animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-wider">
            {title}
          </h1>
          
          {/* Description */}
          {description && (
            <p className="text-white/80 text-lg mb-8 line-clamp-3">
              {description}
            </p>
          )}
          
          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="hero-button bg-white text-black hover:bg-white/90 flex gap-2 items-center"
            >
              <Play className="h-5 w-5 fill-black" /> Assistir {type === 'series' ? 'Série' : 'Filme'}
            </Button>
            <Button 
              variant="outline" 
              className="hero-button border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 flex gap-2 items-center"
            >
              <Plus className="h-5 w-5" /> Adicionar à Lista
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
