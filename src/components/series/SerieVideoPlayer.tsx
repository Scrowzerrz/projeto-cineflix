import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { SerieDetalhes, TemporadaDB, EpisodioDB } from '@/services/types/movieTypes';
import VideoPlayer from '@/components/player/VideoPlayer';

interface SerieVideoPlayerProps {
  serie: SerieDetalhes;
  isTrailer: boolean;
  episodioAtual: EpisodioDB | null;
  temporadaAtual: TemporadaDB | null;
  setIsTrailer: (isTrailer: boolean) => void;
  trocarEpisodio: (id: string) => void;
}

const SerieVideoPlayer = ({ 
  serie, 
  isTrailer,
  episodioAtual,
  temporadaAtual,
  setIsTrailer,
  trocarEpisodio
}: SerieVideoPlayerProps) => {
  return (
    <div className="mt-6">
      <div className="w-full mb-6">
        {isTrailer ? (
          <div className="aspect-video bg-black/40 rounded-md overflow-hidden">
            <iframe
              src={serie.trailer_url}
              title={`Trailer: ${serie.titulo}`}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        ) : episodioAtual ? (
          <VideoPlayer 
            playerUrl={episodioAtual.player_url} 
            posterUrl={episodioAtual.thumbnail_url || serie.poster_url} 
            title={`${serie.titulo} - ${episodioAtual.titulo}`} 
          />
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-movieDark rounded-lg">
            <p className="text-white">Selecione um episódio para assistir</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-xl font-semibold">
            {isTrailer ? 'Trailer Oficial' : (episodioAtual ? episodioAtual.titulo : 'Selecione um episódio')}
          </h2>
          {!isTrailer && episodioAtual && (
            <p className="text-movieGray">{temporadaAtual?.titulo} • {episodioAtual.duracao}</p>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant={isTrailer ? "outline" : "default"} 
            size="sm" 
            className={isTrailer ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "bg-movieRed hover:bg-movieRed/90"}
            onClick={() => setIsTrailer(false)}
          >
            <Play className={`h-4 w-4 ${!isTrailer ? "fill-white" : ""}`} /> Episódio
          </Button>
          
          <Button 
            variant={!isTrailer ? "outline" : "default"} 
            size="sm" 
            className={!isTrailer ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "bg-movieRed hover:bg-movieRed/90"}
            onClick={() => setIsTrailer(true)}
          >
            <Play className={`h-4 w-4 ${isTrailer ? "fill-white" : ""}`} /> Trailer
          </Button>
        </div>
      </div>

      {episodioAtual && !isTrailer && (
        <div className="bg-movieDark/30 p-4 rounded-md mb-6">
          <p className="text-white/80">{episodioAtual.descricao || 'Nenhuma descrição disponível para este episódio.'}</p>
        </div>
      )}

      {/* Navegação entre episódios */}
      {temporadaAtual?.episodios && temporadaAtual.episodios.length > 0 && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-4">Mais episódios</h3>
          <div className="flex gap-4 mb-4 overflow-x-auto pb-4">
            {temporadaAtual.episodios.map((ep) => (
              <div 
                key={ep.id}
                className={`flex-shrink-0 w-48 cursor-pointer transition-all ${ep.id === episodioAtual?.id ? 'ring-2 ring-movieRed' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => trocarEpisodio(ep.id)}
              >
                <div className="aspect-video bg-movieDark rounded-md overflow-hidden relative">
                  <img 
                    src={ep.thumbnail_url} 
                    alt={ep.titulo} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                    <span className="text-white text-sm font-medium">{ep.numero}. {ep.titulo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SerieVideoPlayer;
