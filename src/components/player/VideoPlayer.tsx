
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
  const videoRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
        setPlayer(null);
      }
    };
  }, [player]);

  const iniciarPlayer = () => {
    console.log('Iniciando player com URL:', playerUrl);
    
    if (!videoRef.current) {
      console.error('Elemento de referência não encontrado');
      return;
    }

    try {
      // Primeiro, limpa qualquer player existente
      if (player) {
        console.log('Destruindo player existente');
        player.dispose();
        setPlayer(null);
      }

      // Limpa o conteúdo e cria o elemento de vídeo
      console.log('Preparando elemento de vídeo');
      videoRef.current.innerHTML = '';
      
      // Cria um elemento div para o player
      const playerContainer = document.createElement("div");
      playerContainer.setAttribute("data-vjs-player", "");
      
      // Cria o elemento de vídeo dentro do container
      const videoElement = document.createElement("video");
      videoElement.className = "video-js vjs-big-play-centered vjs-fluid";
      playerContainer.appendChild(videoElement);
      videoRef.current.appendChild(playerContainer);

      console.log('Inicializando player com configurações');
      const vjsPlayer = videojs(
        videoElement,
        {
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
        },
        function onPlayerReady() {
          console.log('Player inicializado com sucesso');
          setIsPlaying(true);
          vjsPlayer.play()
            .then(() => console.log('Reprodução iniciada'))
            .catch(error => {
              console.error('Erro ao iniciar reprodução:', error);
              toast.error('Erro ao iniciar reprodução. Tente novamente.');
            });
        }
      );

      // Configura eventos do player
      vjsPlayer.on('error', (e) => {
        const error = vjsPlayer.error();
        console.error('Erro no player:', error);
        toast.error('Erro ao carregar o vídeo. Tente novamente mais tarde.');
        setIsPlaying(false);
      });

      vjsPlayer.on('playing', () => {
        console.log('Vídeo reproduzindo');
        setIsPlaying(true);
      });

      vjsPlayer.on('pause', () => {
        console.log('Vídeo pausado');
        setIsPlaying(false);
      });

      vjsPlayer.on('ended', () => {
        console.log('Reprodução finalizada');
        setIsPlaying(false);
      });

      setPlayer(vjsPlayer);
      console.log('Player configurado e pronto');

    } catch (error) {
      console.error('Erro ao inicializar o player:', error);
      toast.error('Falha ao iniciar o player de vídeo. Tente novamente.');
      setIsPlaying(false);
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
        <div ref={videoRef} className="w-full h-full" />
      )}
    </div>
  );
};

export default VideoPlayer;
