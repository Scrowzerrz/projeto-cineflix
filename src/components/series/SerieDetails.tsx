
import { SerieDetalhes } from '@/services/types/movieTypes';

interface SerieDetailsProps {
  serie: SerieDetalhes;
  trocarTemporada: (numero: number) => void;
  setActiveTab: (tab: string) => void;
}

const SerieDetails = ({ serie }: SerieDetailsProps) => {
  return (
    <div className="bg-movieDark/30 p-6 rounded-lg">
      <h2 className="text-white text-2xl font-semibold mb-4">{serie.titulo}</h2>
      
      <div>
        <h3 className="text-white text-lg font-medium mb-2">Sinopse</h3>
        <p className="text-white/80 leading-relaxed">
          {serie.descricao || 'Nenhuma sinopse disponível.'}
        </p>
      </div>
    </div>
  );
};

export default SerieDetails;
