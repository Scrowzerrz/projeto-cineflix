
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { TemporadaDB, EpisodioDB } from '@/services/types/movieTypes';

interface SerieEpisodesListProps {
  temporadaAtual: TemporadaDB | null;
  temporadaAtiva: number;
  episodioAtivo: string | null;
  trocarTemporada: (numero: number) => void;
  trocarEpisodio: (id: string) => void;
  totalTemporadas: number;
}

const SerieEpisodesList = ({ 
  temporadaAtual, 
  temporadaAtiva, 
  episodioAtivo,
  trocarTemporada, 
  trocarEpisodio,
  totalTemporadas
}: SerieEpisodesListProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">
          {temporadaAtual?.titulo || `Temporada ${temporadaAtiva}`}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20"
            disabled={temporadaAtiva <= 1}
            onClick={() => trocarTemporada(temporadaAtiva - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20"
            disabled={temporadaAtiva >= totalTemporadas}
            onClick={() => trocarTemporada(temporadaAtiva + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Lista de episódios */}
      <div className="space-y-4">
        {temporadaAtual?.episodios?.map((episodio) => (
          <div 
            key={episodio.id}
            className={`p-3 rounded-lg transition-all cursor-pointer ${
              episodio.id === episodioAtivo 
                ? 'bg-movieRed/20 border border-movieRed/30' 
                : 'bg-movieDark/50 hover:bg-movieDark/80 border border-transparent'
            }`}
            onClick={() => trocarEpisodio(episodio.id)}
          >
            <div className="flex gap-4">
              <div className="w-24 sm:w-40 flex-shrink-0">
                <div className="aspect-video bg-movieDark rounded-md overflow-hidden relative">
                  <img 
                    src={episodio.thumbnail_url} 
                    alt={episodio.titulo} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium">
                    {episodio.numero}. {episodio.titulo}
                  </h3>
                  <span className="text-movieGray text-sm">{episodio.duracao}</span>
                </div>
                <p className="text-movieGray text-sm line-clamp-2 mt-1">
                  {episodio.descricao || 'Nenhuma descrição disponível.'}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {(!temporadaAtual?.episodios || temporadaAtual.episodios.length === 0) && (
          <div className="text-center py-12 bg-movieDark/30 rounded-lg">
            <p className="text-white text-xl mb-2">Nenhum episódio disponível</p>
            <p className="text-movieGray">Esta temporada ainda não possui episódios cadastrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SerieEpisodesList;
