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
  const playerRef = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const iniciarPlayer = () => {
    console.log('Iniciando player com URL:', playerUrl);
    if (!videoRef.current) {
      console.error('Elemento de referência não encontrado');
      return;
    }

    try {
      if (playerRef.current) {
        console.log('Destruindo player existente');
        playerRef.current.dispose();
      }

      console.log('Limpando conteúdo e criando novo elemento de vídeo');
      videoRef.current.innerHTML = '';
      const videoElement = document.createElement("video-js");
      videoElement.className = "vjs-big-play-centered vjs-fluid";
      videoRef.current.appendChild(videoElement);

      console.log('Inicializando player com configurações');
      const player = videojs(
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
          console.log('Player inicializado, configurando eventos');
          
          // Configura eventos assim que o player estiver pronto
          player.on('loadedmetadata', () => {
            console.log('Metadados carregados, tentando reproduzir');
            player.play()
              .then(() => {
                console.log('Reprodução iniciada com sucesso');
                setIsPlaying(true);
              })
              .catch(error => {
                console.error('Erro ao iniciar reprodução:', error);
                toast.error('Erro ao iniciar reprodução. Tente novamente.');
              });
          });

          // Log de todos os eventos importantes
          player.on('error', (e) => {
            const error = player.error();
            console.error('Erro no player:', error);
            console.error('Detalhes do erro:', error?.code, error?.message, error?.status);
            toast.error('Erro ao carregar o vídeo. Verifique a URL ou tente novamente mais tarde.');
            setIsPlaying(false);
          });

          player.on('loadstart', () => console.log('Iniciando carregamento'));
          player.on('progress', () => console.log('Progresso no carregamento'));
          player.on('waiting', () => console.log('Aguardando - buffering'));
          player.on('canplay', () => console.log('Pronto para reproduzir'));
          player.on('canplaythrough', () => console.log('Pode reproduzir até o fim'));
          player.on('playing', () => {
            console.log('Reproduzindo');
            setIsPlaying(true);
          });
          player.on('pause', () => {
            console.log('Vídeo pausado');
            setIsPlaying(false);
          });
          player.on('seeking', () => console.log('Buscando nova posição'));
          player.on('seeked', () => console.log('Busca completada'));
          player.on('ended', () => {
            console.log('Reprodução finalizada');
            setIsPlaying(false);
          });
        }
      );

      playerRef.current = player;
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
