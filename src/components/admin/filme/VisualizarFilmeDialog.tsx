
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilmeDB } from "@/services/types/movieTypes";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VisualizarFilmeDialogProps {
  filme: FilmeDB;
}

export function VisualizarFilmeDialog({ filme }: VisualizarFilmeDialogProps) {
  const [open, setOpen] = useState(false);

  // Função para processar URL do player ou trailer
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Verificar se a URL é um iframe
    if (url.includes('iframe') && url.includes('src=')) {
      const matches = url.match(/src=["'](.*?)["']/);
      if (matches && matches[1]) {
        return matches[1];
      }
    }
    
    // Verificar se é uma URL de vídeo direto (MP4)
    if (url.endsWith('.mp4') || url.includes('download') || url.includes('pixeldrain.com')) {
      return (
        <video src={url} controls className="w-full h-full" />
      );
    }
    
    // Caso contrário, retornar a URL como está
    return url;
  };

  const playerUrl = filme.player_url;
  const trailerUrl = filme.trailer_url;
  
  // Verifica se a URL é de vídeo direto
  const isDirectVideo = (url: string) => {
    return url && (url.endsWith('.mp4') || url.includes('download') || url.includes('pixeldrain.com'));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 bg-green-600/20 hover:bg-green-600/40 text-green-400"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Visualizar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl pb-4">{filme.titulo} <span className="text-gray-400">({filme.ano})</span></DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <AspectRatio ratio={2/3} className="rounded-md overflow-hidden">
              <img 
                src={filme.poster_url} 
                alt={filme.titulo} 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {filme.generos?.map((genero, index) => (
                <Badge key={index} variant="secondary">{genero}</Badge>
              ))}
              
              {filme.qualidade && (
                <Badge variant="outline" className="bg-movieRed text-white border-none">
                  {filme.qualidade}
                </Badge>
              )}
              
              {filme.destaque && (
                <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                  Destaque
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Duração</h3>
              <p className="text-gray-300">{filme.duracao}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Sinopse</h3>
              <p className="text-gray-300">{filme.descricao}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Diretor</h3>
                <p className="text-gray-300">{filme.diretor}</p>
              </div>
              
              {filme.produtor && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Produtor</h3>
                  <p className="text-gray-300">{filme.produtor}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-semibold">Elenco</h3>
                <p className="text-gray-300">{filme.elenco}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Categoria</h3>
                <p className="text-gray-300">{filme.categoria}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Idioma</h3>
                <p className="text-gray-300">{filme.idioma}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Avaliação</h3>
                <p className="text-gray-300">{filme.avaliacao}</p>
              </div>
            </div>
          </div>
        </div>
        
        {trailerUrl && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Trailer</h3>
            <AspectRatio ratio={16/9} className="bg-black rounded-md overflow-hidden">
              {isDirectVideo(trailerUrl) ? (
                <video src={trailerUrl} controls className="w-full h-full" />
              ) : (
                <iframe
                  src={getEmbedUrl(trailerUrl)}
                  allowFullScreen
                  className="w-full h-full"
                  title={`Trailer de ${filme.titulo}`}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              )}
            </AspectRatio>
          </div>
        )}
        
        {playerUrl && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Player</h3>
            <AspectRatio ratio={16/9} className="bg-black rounded-md overflow-hidden">
              {isDirectVideo(playerUrl) ? (
                <video src={playerUrl} controls className="w-full h-full" />
              ) : (
                <iframe
                  src={getEmbedUrl(playerUrl)}
                  allowFullScreen
                  className="w-full h-full"
                  title={`Player de ${filme.titulo}`}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              )}
            </AspectRatio>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
