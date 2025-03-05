
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";
import { Play } from "lucide-react";
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
    if (isPlaying && !playerInicializado) {
      console.log('isPlaying true, inicializando player');
      inicializarVideoJS();
    }
  }, [isPlaying, playerInicializado, playerUrl]);

  const iniciarPlayer = () => {
    console.log('Botão play clicado, ativando modo de reprodução');
    setIsPlaying(true);
  };

  const inicializarVideoJS = () => {
    console.log('Inicializando Video.js com URL:', playerUrl);
    
    // Verificar se a referência ao container existe
    if (!containerRef.current) {
      console.error('Erro: Container ref não encontrado');
      toast.error('Erro ao inicializar o player. Tente novamente.');
      setIsPlaying(false);
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
      videoElement.setAttribute('data-setup', '{}');
      
      // Adicionar o elemento de vídeo ao container
      container.appendChild(videoElement);
      
      console.log('Elemento de vídeo criado e adicionado ao container');
      
      // Inicializar videojs
      const player = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: playerUrl,
          type: 'application/x-mpegURL'
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

      // Lidar com eventos do player
      player.on('ready', () => {
        console.log('Player pronto para reprodução');
        
        player.play()
          .then(() => console.log('Reprodução iniciada'))
          .catch(error => {
            console.error('Erro ao iniciar reprodução:', error);
            toast.error('Erro ao iniciar reprodução. Tente novamente.');
          });
      });

      player.on('error', (e) => {
        const error = player.error();
        console.error('Erro no player:', error);
        toast.error('Erro ao carregar o vídeo. Tente novamente mais tarde.');
        setIsPlaying(false);
        setPlayerInicializado(false);
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
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      {!isPlaying ? (
        <div 
          className="absolute inset-0 bg-cover bg-center z-10" 
          style={{ backgroundImage: `url(${posterUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
            <Button 
              onClick={iniciarPlayer}
              className="bg-movieRed hover:bg-movieRed/90 text-white flex items-center gap-2 rounded-full px-6 py-6"
            >
              <Play className="h-8 w-8 fill-white" />
            </Button>
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
