
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        console.log('Limpando player existente no unmount');
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const iniciarPlayer = () => {
    console.log('Iniciando player com URL:', playerUrl);
    
    if (!containerRef.current) {
      console.error('Container não encontrado');
      return;
    }

    try {
      // Limpa o container
      containerRef.current.innerHTML = '';
      
      // Cria os elementos necessários
      const videoEl = document.createElement('video');
      videoEl.className = 'video-js vjs-big-play-centered vjs-fluid';
      containerRef.current.appendChild(videoEl);
      
      // Guarda a referência do elemento de vídeo
      videoRef.current = videoEl;

      console.log('Inicializando player com configurações');
      const player = videojs(videoEl, {
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

      // Guarda a referência do player
      playerRef.current = player;

      // Configura os eventos
      player.on('ready', () => {
        console.log('Player pronto');
        setIsPlaying(true);
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
      });

      player.on('playing', () => {
        console.log('Vídeo reproduzindo');
        setIsPlaying(true);
      });

      player.on('pause', () => {
        console.log('Vídeo pausado');
        setIsPlaying(false);
      });

      player.on('ended', () => {
        console.log('Reprodução finalizada');
        setIsPlaying(false);
      });

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
        <div ref={containerRef} className="w-full h-full" data-vjs-player />
      )}
    </div>
  );
};

export default VideoPlayer;
