
import { Button } from '@/components/ui/button';
import { Play, Plus, Share2 } from 'lucide-react';
import { SerieDetalhes } from '@/services/types/movieTypes';
import { toast } from 'sonner';
import FavoritoButton from '@/components/FavoritoButton';
import { useFavoritos } from '@/hooks/useFavoritos';

interface SerieHeaderProps {
  serie: SerieDetalhes;
  setIsTrailer: (isTrailer: boolean) => void;
}

const SerieHeader = ({ 
  serie, 
  setIsTrailer 
}: SerieHeaderProps) => {
  const { isFavorito, toggleFavorito } = useFavoritos();
  const ehFavorito = isFavorito(serie.id);

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

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {/* Poster */}
      <div className="w-full md:w-64 lg:w-72 shrink-0">
        <img 
          src={serie.poster_url} 
          alt={serie.titulo} 
          className="w-full h-auto rounded-md shadow-lg border border-gray-800"
        />
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            className="bg-[#0197f6] hover:bg-[#0186d9] text-white w-full"
            onClick={() => setIsTrailer(false)}
          >
            <Play className="h-4 w-4 mr-2 fill-white" /> Assistir Agora
          </Button>
          
          <Button 
            variant="outline" 
            className="border-gray-700 bg-[#17212b] hover:bg-[#1c2836] text-white w-full"
            onClick={() => setIsTrailer(true)}
          >
            <Play className="h-4 w-4 mr-2" /> Trailer
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="border-gray-700 bg-[#17212b] hover:bg-[#1c2836] text-white"
              onClick={() => toggleFavorito(serie.id, 'serie')}
            >
              <Plus className="h-4 w-4 mr-2" /> 
              {ehFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-700 bg-[#17212b] hover:bg-[#1c2836] text-white"
              onClick={compartilharSerie}
            >
              <Share2 className="h-4 w-4 mr-2" /> Compartilhar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Informações da série */}
      <div className="flex-1">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">{serie.titulo}</h1>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mt-2 mb-4">
          <span className="bg-[#0197f6] text-white px-2 py-0.5 rounded text-xs">
            {serie.idioma || 'DUB'}
          </span>
          
          <span className="bg-[#17212b] text-white px-2 py-0.5 rounded text-xs">
            {serie.ano}
          </span>
          
          <span className="bg-[#17212b] text-white px-2 py-0.5 rounded text-xs">
            {serie.duracao}
          </span>
          
          <span className="bg-[#17212b] text-white px-2 py-0.5 rounded text-xs">
            {serie.avaliacao} / 10
          </span>
          
          <span className="bg-[#17212b] text-white px-2 py-0.5 rounded text-xs">
            {serie.qualidade || 'HD'}
          </span>
        </div>
        
        {/* Gêneros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {serie.generos?.map((genero, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-[#17212b] text-white/90 rounded-full text-sm"
            >
              {genero}
            </span>
          ))}
        </div>
        
        {/* Sinopse */}
        <div className="mb-6">
          <p className="text-white/80 leading-relaxed">
            {serie.descricao || 'Nenhuma sinopse disponível.'}
          </p>
        </div>
        
        {/* Detalhes técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0a1117] p-4 rounded">
            <p className="text-white/60 mb-1">Diretor:</p>
            <p className="text-white">{serie.diretor || 'Não informado'}</p>
          </div>
          
          <div className="bg-[#0a1117] p-4 rounded">
            <p className="text-white/60 mb-1">Elenco:</p>
            <p className="text-white">{serie.elenco || 'Não informado'}</p>
          </div>
          
          <div className="bg-[#0a1117] p-4 rounded">
            <p className="text-white/60 mb-1">Produtor:</p>
            <p className="text-white">{serie.produtor || 'Não informado'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerieHeader;
