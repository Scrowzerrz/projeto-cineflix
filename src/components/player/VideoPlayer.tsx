
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    // Certifique-se de destruir o player ao desmontar
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const iniciarPlayer = () => {
    if (!videoRef.current) return;

    // Se já tiver um player, destrua-o primeiro
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // Cria o elemento de vídeo
    const videoElement = document.createElement("video");
    videoElement.className = "video-js vjs-big-play-centered vjs-fluid";
    videoRef.current.appendChild(videoElement);

    // Inicializa o player
    const player = videojs(videoElement, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: playerUrl,
        type: 'application/x-mpegURL' // HLS
      }],
      poster: posterUrl,
      playbackRates: [0.5, 1, 1.5, 2],
    });

    player.on('play', () => {
      setIsPlaying(true);
    });

    player.on('pause', () => {
      setIsPlaying(false);
    });

    player.on('ended', () => {
      setIsPlaying(false);
    });

    playerRef.current = player;
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
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
