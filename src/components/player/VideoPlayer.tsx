
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoPlayerProps {
  playerUrl: string;
  posterUrl: string;
  title: string;
}

const VideoPlayer = ({ playerUrl, posterUrl, title }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerInicializado, setPlayerInicializado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Limpa o player quando o componente é desmontado
  useEffect(() => {
    console.log('VideoPlayer montado');
    return () => {
      if (playerRef.current) {
        console.log('Limpando player no unmount');
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Efeito para inicializar o player quando o modo de reprodução está ativo
  useEffect(() => {
    // Se está no modo de reprodução e o player ainda não foi inicializado
    if (isPlaying && !playerInicializado && containerRef.current) {
      console.log('isPlaying true, inicializando player');
      inicializarVideoJS();
    }
  }, [isPlaying, playerInicializado, playerUrl]);

  const iniciarPlayer = () => {
    console.log('Botão play clicado, ativando modo de reprodução');
    setIsLoading(true);
    setIsPlaying(true);
  };

  const inicializarVideoJS = () => {
    console.log('Inicializando Video.js com URL:', playerUrl);
    
    // Verificar se a referência ao container existe
    if (!containerRef.current) {
      console.error('Erro: Container ref não encontrado');
      toast.error('Erro ao inicializar o player. Tente novamente.');
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    try {
      // Limpar player existente se houver
      if (playerRef.current) {
        console.log('Limpando player existente');
        playerRef.current.dispose();
        playerRef.current = null;
      }

      // Limpar o container
      const container = containerRef.current;
      container.innerHTML = '';
      
      // Criar elemento de vídeo
      const videoElement = document.createElement('video');
      videoElement.className = 'video-js vjs-big-play-centered vjs-fluid';
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('controls', 'true');
      
      // Adicionar o elemento de vídeo ao container
      container.appendChild(videoElement);
      
      console.log('Elemento de vídeo criado e adicionado ao container');
      
      // Inicializar videojs
      const player = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        playsinline: true,
        sources: [{
          src: playerUrl,
          type: playerUrl.includes('.mp4') ? 'video/mp4' : 'application/x-mpegURL'
        }],
        poster: posterUrl,
        html5: {
          vhs: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            limitRenditionByPlayerDimensions: false,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      });
      
      // Definir referência do player
      playerRef.current = player;
      console.log('Player VideoJS inicializado com sucesso');
      setPlayerInicializado(true);
      setIsLoading(false);

      // Lidar com eventos do player
      player.on('ready', () => {
        console.log('Player pronto para reprodução');
        
        player.play()
          .then(() => console.log('Reprodução iniciada'))
          .catch(error => {
            console.error('Erro ao iniciar reprodução:', error);
            // Política de autoplay pode bloquear, então adicionamos um botão para iniciar manualmente
            toast.info('Clique no player para iniciar a reprodução');
          });
      });

      player.on('error', (e) => {
        const error = player.error();
        console.error('Erro no player:', error);
        toast.error('Erro ao carregar o vídeo. Tente novamente mais tarde.');
        setIsPlaying(false);
        setPlayerInicializado(false);
        setIsLoading(false);
      });

      player.on('playing', () => {
        console.log('Vídeo reproduzindo');
      });

      player.on('pause', () => {
        console.log('Vídeo pausado');
      });

      player.on('ended', () => {
        console.log('Reprodução finalizada');
        setIsPlaying(false);
        setPlayerInicializado(false);
      });

    } catch (error) {
      console.error('Erro ao inicializar o player:', error);
      toast.error('Falha ao iniciar o player de vídeo. Tente novamente.');
      setIsPlaying(false);
      setPlayerInicializado(false);
      setIsLoading(false);
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
        <div 
          ref={containerRef} 
          data-vjs-player="true"
          className="w-full h-full bg-black" 
        />
      )}
    </div>
  );
};

export default VideoPlayer;
