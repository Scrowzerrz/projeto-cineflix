
import { SerieDetalhes } from '@/services/types/movieTypes';
import { Star, Calendar, Clock } from 'lucide-react';

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
              <li className="flex items-start py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Título Original:</span> 
                <span>{serie.titulo_original || serie.titulo}</span>
              </li>
              <li className="flex items-center py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Ano de Lançamento:</span> 
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-movieGray" />
                  {serie.ano}
                </span>
              </li>
              <li className="flex items-start py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Gêneros:</span> 
                <div className="flex flex-wrap gap-1">
                  {serie.generos?.map((genero, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white/10 text-white/90 rounded-full text-xs">
                      {genero}
                    </span>
                  )) || 'Não informado'}
                </div>
              </li>
              <li className="flex items-center py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Duração:</span> 
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-movieGray" />
                  {serie.duracao}
                </span>
              </li>
              <li className="flex items-center py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Avaliação:</span> 
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                  {serie.avaliacao}
                </span>
              </li>
              <li className="flex items-center py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Idioma:</span> 
                <span className="bg-movieRed/90 px-2 py-0.5 text-white rounded-sm text-xs">
                  {serie.idioma || 'DUB'}
                </span>
              </li>
              <li className="flex items-center py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Qualidade:</span> 
                <span className="bg-movieLightBlue/20 px-2 py-0.5 text-white rounded-sm text-xs">
                  {serie.qualidade || 'HD'}
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-medium mb-2">Elenco e Equipe</h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Diretor:</span> 
                <span>{serie.diretor || 'Não informado'}</span>
              </li>
              <li className="flex items-start py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Elenco:</span> 
                <span>{serie.elenco || 'Não informado'}</span>
              </li>
              <li className="flex items-start py-1 border-b border-white/5">
                <span className="text-movieGray w-40">Produtor:</span> 
                <span>{serie.produtor || 'Não informado'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-white text-lg font-medium mb-3">Temporadas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {serie.temporadas.map((temporada) => (
              <div 
                key={temporada.id} 
                className="cursor-pointer bg-movieDark/50 hover:bg-movieDark/80 transition-colors p-2 rounded-lg group"
                onClick={() => {
                  trocarTemporada(temporada.numero);
                  setActiveTab('temporadas');
                }}
              >
                <div className="rounded-md overflow-hidden mb-2 relative">
                  <img 
                    src={temporada.poster_url} 
                    alt={temporada.titulo || `Temporada ${temporada.numero}`} 
                    className="w-full h-auto aspect-[2/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-movieRed rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium truncate">{temporada.titulo || `Temporada ${temporada.numero}`}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-movieGray" />
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
