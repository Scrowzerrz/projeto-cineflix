
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
    if (!videoRef.current) return;

    try {
      if (playerRef.current) {
        playerRef.current.dispose();
      }

      videoRef.current.innerHTML = '';
      const videoElement = document.createElement("video-js");
      videoElement.className = "vjs-big-play-centered vjs-fluid";
      videoRef.current.appendChild(videoElement);

      const player = videojs(
        videoElement,
        {
          controlBar: {
            pictureInPictureToggle: false
          },
          controls: true,
          responsive: true,
          fluid: true,
          sources: [{
            src: playerUrl,
            type: 'application/x-mpegURL'
          }],
          poster: posterUrl,
          preload: 'auto',
          html5: {
            vhs: {
              overrideNative: true,
              limitRenditionByPlayerDimensions: false,
              smoothQualityChange: true,
              enableLowInitialPlaylist: true
            },
            nativeVideoTracks: false,
            nativeAudioTracks: false,
            nativeTextTracks: false
          }
        },
        function onPlayerReady() {
          console.log('Player pronto, configurando eventos...');
          
          player.on('loadedmetadata', () => {
            console.log('Metadados carregados, iniciando reprodução...');
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
        }
      );

      player.on('error', (error) => {
        console.error('Erro no player:', player.error());
        toast.error('Erro ao carregar o vídeo. Verifique a URL ou tente novamente mais tarde.');
        setIsPlaying(false);
      });

      player.on('waiting', () => {
        console.log('Buffering...');
      });

      player.on('playing', () => {
        console.log('Vídeo em reprodução');
        setIsPlaying(true);
      });

      player.on('pause', () => {
        console.log('Vídeo pausado');
        setIsPlaying(false);
      });

      playerRef.current = player;
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
