
import { Button } from '@/components/ui/button';
import { Play, Plus, Share2, ThumbsUp } from 'lucide-react';
import { Star, Award, Calendar, Clock, Tv } from 'lucide-react';
import { SerieDetalhes } from '@/services/types/movieTypes';
import { toast } from 'sonner';

interface SerieHeaderProps {
  serie: SerieDetalhes;
  temporadaAtiva: number;
  trocarTemporada: (numero: number) => void;
  setActiveTab: (tab: string) => void;
  setIsTrailer: (isTrailer: boolean) => void;
}

const SerieHeader = ({ 
  serie, 
  temporadaAtiva, 
  trocarTemporada, 
  setActiveTab, 
  setIsTrailer 
}: SerieHeaderProps) => {
  // Compartilhar série
  const compartilharSerie = () => {
    if (navigator.share) {
      navigator.share({
        title: serie?.titulo || 'Série',
        text: `Assista ${serie?.titulo} em nossa plataforma de streaming`,
        url: window.location.href
      })
      .catch((err) => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  // Adicionar à lista
  const adicionarLista = () => {
    toast.success('Série adicionada à sua lista!');
  };

  // Curtir série
  const curtirSerie = () => {
    toast.success('Você curtiu esta série!');
  };

  return (
    <div className="relative pt-16">
      {/* Background Image com Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center h-[70vh] z-0"
        style={{ 
          backgroundImage: `url(${serie.poster_url})`,
          backgroundPosition: '50% 25%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-movieDarkBlue via-movieDarkBlue/95 to-black/30"></div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 pt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-md overflow-hidden shadow-xl border-2 border-movieGray/10">
              <img 
                src={serie.poster_url} 
                alt={serie.titulo} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Informações da série */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Título e meta */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{serie.titulo}</h1>
              {serie.titulo_original && (
                <p className="text-movieGray text-lg mb-2">Título original: {serie.titulo_original}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mt-2">
                <span className="bg-movieRed/90 text-white px-2 py-0.5 rounded-sm text-xs">
                  {serie.idioma || 'DUB'}
                </span>
                <span>{serie.ano}</span>
                <span>•</span>
                <span>{serie.duracao}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500 mr-1" />
                  {serie.avaliacao}
                </span>
                <span>•</span>
                <span className="bg-movieLightBlue/20 text-white px-2 py-0.5 rounded-sm text-xs">
                  {serie.qualidade || 'HD'}
                </span>
              </div>
            </div>
            
            {/* Gêneros */}
            <div className="flex flex-wrap gap-2 mb-6">
              {serie.generos?.map((genero, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm"
                >
                  {genero}
                </span>
              ))}
            </div>
            
            {/* Sinopse */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-xl mb-2">Sinopse</h3>
              <p className="text-white/80 leading-relaxed">
                {serie.descricao || 'Nenhuma sinopse disponível.'}
              </p>
            </div>
            
            {/* Detalhes técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-start gap-2 mb-3">
                  <Tv className="h-5 w-5 text-movieGray mt-0.5" />
                  <div>
                    <h4 className="text-white/80 font-medium">Diretor</h4>
                    <p className="text-white">{serie.diretor || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 mb-3">
                  <Award className="h-5 w-5 text-movieGray mt-0.5" />
                  <div>
                    <h4 className="text-white/80 font-medium">Elenco</h4>
                    <p className="text-white">{serie.elenco || 'Não informado'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-movieGray mt-0.5" />
                  <div>
                    <h4 className="text-white/80 font-medium">Produtor</h4>
                    <p className="text-white">{serie.produtor || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 mb-3">
                  <Clock className="h-5 w-5 text-movieGray mt-0.5" />
                  <div>
                    <h4 className="text-white/80 font-medium">Ano de Lançamento</h4>
                    <p className="text-white">{serie.ano}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Temporadas disponíveis */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-xl mb-3">Temporadas</h3>
              <div className="flex flex-wrap gap-2">
                {serie.temporadas.map((temporada) => (
                  <Button 
                    key={temporada.id}
                    variant={temporada.numero === temporadaAtiva ? "default" : "outline"}
                    size="sm"
                    className={temporada.numero === temporadaAtiva 
                      ? "bg-movieRed hover:bg-movieRed/90" 
                      : "border-white/30 text-white bg-white/10 hover:bg-white/20"}
                    onClick={() => trocarTemporada(temporada.numero)}
                  >
                    Temporada {temporada.numero}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Ações */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Button 
                className="bg-movieRed hover:bg-movieRed/90 text-white flex items-center gap-2 rounded-md px-6"
                onClick={() => {
                  setActiveTab('assistir');
                  setIsTrailer(false);
                }}
              >
                <Play className="h-5 w-5 fill-white" /> Assistir Agora
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white/30 text-white bg-white/10 hover:bg-white/20 flex items-center gap-2"
                onClick={() => {
                  setActiveTab('assistir');
                  setIsTrailer(true);
                }}
              >
                <Play className="h-5 w-5" /> Trailer
              </Button>
              
              <Button 
                variant="outline"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                onClick={adicionarLista}
              >
                <Plus className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                onClick={compartilharSerie}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                onClick={curtirSerie}
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerieHeader;
