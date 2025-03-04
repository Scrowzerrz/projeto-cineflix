
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
    <div className="mb-6 bg-movieDark/30 p-6 rounded-lg">
      {/* Cabeçalho da Temporada */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-white text-xl font-semibold">
            {temporadaAtual?.titulo || `Temporada ${temporadaAtiva}`}
          </h2>
          <p className="text-movieGray text-sm mt-1">
            {temporadaAtual?.episodios?.length || 0} episódios
          </p>
        </div>
        
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
          <span className="flex items-center px-3 text-white bg-white/5 rounded-md">
            {temporadaAtiva} / {totalTemporadas}
          </span>
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
            className={`p-4 rounded-lg transition-all cursor-pointer ${
              episodio.id === episodioAtivo 
                ? 'bg-movieRed/20 border border-movieRed/30' 
                : 'bg-movieDark/50 hover:bg-movieDark/80 border border-transparent hover:border-white/10'
            }`}
            onClick={() => trocarEpisodio(episodio.id)}
          >
            <div className="flex gap-4">
              <div className="w-32 sm:w-48 flex-shrink-0">
                <div className="aspect-video bg-movieDark rounded-md overflow-hidden relative group/thumbnail">
                  <img 
                    src={episodio.thumbnail_url} 
                    alt={episodio.titulo} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumbnail:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-movieRed/90 rounded-full p-3 transform scale-90 group-hover/thumbnail:scale-100 transition-transform">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">
                      {episodio.numero}. {episodio.titulo}
                    </h3>
                    <span className="text-movieGray text-sm mt-1 inline-block">{episodio.duracao}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/10 bg-movieRed/10 hover:bg-movieRed text-white text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      trocarEpisodio(episodio.id);
                    }}
                  >
                    <Play className="h-3 w-3 mr-1" /> Assistir
                  </Button>
                </div>
                <p className="text-movieGray text-sm line-clamp-2 mt-2">
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
      
      {/* Navegação entre temporadas */}
      <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
        <Button
          variant="outline"
          className="border-white/30 text-white bg-white/10 hover:bg-white/20"
          disabled={temporadaAtiva <= 1}
          onClick={() => trocarTemporada(temporadaAtiva - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Temporada anterior
        </Button>
        <Button
          variant="outline"
          className="border-white/30 text-white bg-white/10 hover:bg-white/20"
          disabled={temporadaAtiva >= totalTemporadas}
          onClick={() => trocarTemporada(temporadaAtiva + 1)}
        >
          Próxima temporada <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SerieEpisodesList;
