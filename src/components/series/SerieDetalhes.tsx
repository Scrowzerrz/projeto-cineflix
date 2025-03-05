
import { SerieDetalhes as SerieDetalhesType } from '@/services/types/movieTypes';

interface SerieDetalhesProps {
  serie: SerieDetalhesType;
  trocarTemporada: (numero: number) => void;
}

const SerieDetalhes = ({ serie }: SerieDetalhesProps) => {
  return (
    <div className="mb-8">
      {/* As informações detalhadas foram movidas para o cabeçalho */}
    </div>
  );
};

export default SerieDetalhes;
