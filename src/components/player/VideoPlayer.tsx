
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
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Clean up the player on component unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        console.log('Disposing player on unmount');
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const iniciarPlayer = () => {
    console.log('Iniciando player com URL:', playerUrl);
    
    // Check if the videoRef is available
    if (!videoRef.current) {
      console.error('Container ref não encontrado');
      toast.error('Erro ao inicializar o player. Tente novamente.');
      return;
    }

    try {
      // Reset state and clean up any existing player
      if (playerRef.current) {
        console.log('Limpando player existente');
        playerRef.current.dispose();
        playerRef.current = null;
      }

      // Clear the container
      const container = videoRef.current;
      container.innerHTML = '';
      
      // Create a new div with video-js class
      const videoElement = document.createElement('video');
      videoElement.className = 'video-js vjs-big-play-centered vjs-fluid';
      container.appendChild(videoElement);
      
      console.log('Elemento de vídeo criado e adicionado ao container');
      
      // Initialize videojs
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
      
      // Set player reference
      playerRef.current = player;
      console.log('Player VideoJS inicializado com sucesso');

      // Handle player events
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
      });

      player.on('ended', () => {
        console.log('Reprodução finalizada');
        setIsPlaying(false);
      });

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
        <div 
          ref={videoRef} 
          className="w-full h-full" 
          data-vjs-player
        />
      )}
    </div>
  );
};

export default VideoPlayer;
