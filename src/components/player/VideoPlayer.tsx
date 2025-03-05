
import { useEffect, useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoPlayerProps {
  playerUrl: string;
  posterUrl: string;
  title: string;
}

const VideoPlayer = ({ playerUrl, posterUrl, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const iniciarPlayer = () => {
    setIsLoading(true);
    setIsPlaying(true);
    setTimeout(() => setIsLoading(false), 500); // Simular carregamento breve
  };

  // Formatar URL para garantir que seja segura e funcione corretamente em um iframe
  const getPlayerUrl = (url: string) => {
    try {
      // Se a URL já tem https:// ou http://, não adicione
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Validar URL
      new URL(url);
      
      return url;
    } catch (error) {
      console.error("URL inválida:", error);
      toast.error("URL do player inválida");
      return "";
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black group">
      {!isPlaying ? (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {/* Poster com efeito de desfoque */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 scale-105 group-hover:scale-110" 
            style={{ 
              backgroundImage: `url(${posterUrl})`,
              filter: 'blur(2px)'
            }}
          />
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          
          {/* Conteúdo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <h3 className="text-white text-2xl font-bold mb-6 text-center px-6 drop-shadow-lg">{title}</h3>
            
            <Button 
              onClick={iniciarPlayer}
              className="bg-movieRed hover:bg-movieRed/90 text-white flex items-center gap-2 rounded-full p-8 shadow-lg transform transition-transform duration-300 hover:scale-110"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Play className="h-10 w-10 fill-white" />
              )}
            </Button>
            
            <p className="text-white/80 mt-6 text-sm">Clique para assistir</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-black">
          <iframe
            src={getPlayerUrl(playerUrl)}
            title={title}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-forms"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
