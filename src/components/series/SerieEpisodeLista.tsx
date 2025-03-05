
import { Button } from '@/components/ui/button';
import { Download, Play } from 'lucide-react';
import { TemporadaDB } from '@/services/types/movieTypes';

interface SerieEpisodeListaProps {
  temporada: TemporadaDB | null;
  episodioAtivo: string | null;
  trocarEpisodio: (id: string) => void;
}

const SerieEpisodeLista = ({ 
  temporada, 
  episodioAtivo,
  trocarEpisodio
}: SerieEpisodeListaProps) => {
  if (!temporada || !temporada.episodios || temporada.episodios.length === 0) {
    return (
      <div className="text-center py-12 bg-[#0a1117] rounded-md">
        <p className="text-white text-xl mb-2">Nenhum episódio disponível</p>
        <p className="text-gray-400">Esta temporada ainda não possui episódios cadastrados.</p>
      </div>
    );
  }

  return (
    <div>
      {temporada.episodios.map((episodio) => (
        <div 
          key={episodio.id}
          className={`mb-2 rounded-md overflow-hidden bg-[#0a1117] ${
            episodio.id === episodioAtivo ? 'border-l-4 border-[#0197f6]' : ''
          }`}
        >
          <div className="flex items-center p-1 pl-3">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full aspect-square h-10 w-10 p-0 mr-3"
              onClick={() => trocarEpisodio(episodio.id)}
            >
              <Play className="h-4 w-4 fill-white text-white" />
            </Button>
            
            <div className="flex-1 flex items-center py-2">
              <div className="flex flex-col md:flex-row md:items-center flex-1">
                <span className="text-white font-medium md:w-16">
                  Episódio {episodio.numero.toString().padStart(2, '0')}
                </span>
                <span className="text-white flex-1 md:ml-4">
                  {episodio.titulo}
                </span>
                <span className="text-gray-400 text-sm md:ml-4">
                  {episodio.duracao}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white aspect-square h-10 w-10 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SerieEpisodeLista;
