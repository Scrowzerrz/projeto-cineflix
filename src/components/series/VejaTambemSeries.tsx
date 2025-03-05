
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CartaoFilme from '@/components/MovieCard';
import { MovieResponse } from '@/services/types/movieTypes';
import { Loader2 } from 'lucide-react';

interface VejaTambemSeriesProps {
  filmes: MovieResponse[];
  isLoading: boolean;
}

const VejaTambemSeries = ({ filmes, isLoading }: VejaTambemSeriesProps) => {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl flex items-center">
          <span>VEJA TAMBÉM</span>
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-700 bg-black/50 hover:bg-gray-800">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-700 bg-black/50 hover:bg-gray-800">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="group relative rounded-md overflow-hidden">
              <div className="aspect-[2/3] bg-gray-800 animate-pulse"></div>
            </div>
          ))
        ) : (
          filmes.map((filmeItem: MovieResponse) => (
            <CartaoFilme
              key={filmeItem.id}
              id={filmeItem.id}
              title={filmeItem.titulo}
              posterUrl={filmeItem.poster_url}
              year={filmeItem.ano}
              duration={filmeItem.duracao}
              type={filmeItem.tipo}
              quality={filmeItem.qualidade as 'HD' | 'CAM' | 'DUB' | 'LEG'}
              rating={filmeItem.avaliacao}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VejaTambemSeries;
