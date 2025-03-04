
import { SerieDetalhes } from '@/services/types/movieTypes';

interface SerieDetailsProps {
  serie: SerieDetalhes;
  trocarTemporada: (numero: number) => void;
  setActiveTab: (tab: string) => void;
}

const SerieDetails = ({ serie, trocarTemporada, setActiveTab }: SerieDetailsProps) => {
  return (
    <div className="bg-movieDark/30 p-6 rounded-lg">
      <h2 className="text-white text-2xl font-semibold mb-4">{serie.titulo}</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-white text-lg font-medium mb-2">Sinopse</h3>
          <p className="text-white/80 leading-relaxed">
            {serie.descricao || 'Nenhuma sinopse disponível.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white text-lg font-medium mb-2">Detalhes</h3>
            <ul className="space-y-2 text-white/80">
              <li><span className="text-movieGray">Título Original:</span> {serie.titulo_original || serie.titulo}</li>
              <li><span className="text-movieGray">Ano de Lançamento:</span> {serie.ano}</li>
              <li><span className="text-movieGray">Gêneros:</span> {serie.generos?.join(', ') || 'Não informado'}</li>
              <li><span className="text-movieGray">Duração:</span> {serie.duracao}</li>
              <li><span className="text-movieGray">Idioma:</span> {serie.idioma || 'DUB'}</li>
              <li><span className="text-movieGray">Qualidade:</span> {serie.qualidade || 'HD'}</li>
              <li><span className="text-movieGray">Categoria:</span> {serie.categoria || 'Não informada'}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-2">Elenco e Equipe</h3>
            <ul className="space-y-2 text-white/80">
              <li><span className="text-movieGray">Diretor:</span> {serie.diretor || 'Não informado'}</li>
              <li><span className="text-movieGray">Elenco:</span> {serie.elenco || 'Não informado'}</li>
              <li><span className="text-movieGray">Produtor:</span> {serie.produtor || 'Não informado'}</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-white text-lg font-medium mb-2">Temporadas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {serie.temporadas.map((temporada) => (
              <div 
                key={temporada.id} 
                className="cursor-pointer"
                onClick={() => {
                  trocarTemporada(temporada.numero);
                  setActiveTab('temporadas');
                }}
              >
                <div className="bg-movieDark rounded-md overflow-hidden">
                  <img 
                    src={temporada.poster_url} 
                    alt={temporada.titulo || `Temporada ${temporada.numero}`} 
                    className="w-full h-auto aspect-[2/3] object-cover"
                  />
                  <div className="p-2 text-center">
                    <p className="text-white font-medium">{temporada.titulo || `Temporada ${temporada.numero}`}</p>
                    <p className="text-movieGray text-sm">{temporada.ano}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerieDetails;
