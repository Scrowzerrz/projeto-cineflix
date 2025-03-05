
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSerieDetails, incrementarVisualizacaoSerie } from '@/services/movieService';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SerieHeader from '@/components/series/SerieHeader';
import SerieVideoPlayer from '@/components/series/SerieVideoPlayer';
import SerieEpisodesList from '@/components/series/SerieEpisodesList';
import SerieDetails from '@/components/series/SerieDetails';
import SerieComments from '@/components/series/SerieComments';
import SerieLoading from '@/components/series/SerieLoading';
import SerieError from '@/components/series/SerieError';
import VejaTambemSeries from '@/components/series/VejaTambemSeries';

const DetalhesSerie = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('temporadas');
  const [temporadaAtiva, setTemporadaAtiva] = useState(1);
  const [episodioAtivo, setEpisodioAtivo] = useState<string | null>(null);
  const [isTrailer, setIsTrailer] = useState(false);
  
  const { 
    data: serie, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['serie-detalhes', id],
    queryFn: () => fetchSerieDetails(id || ''),
    enabled: !!id
  });

  useEffect(() => {
    if (id) {
      incrementarVisualizacaoSerie(id).catch(erro => 
        console.error("Erro ao registrar visualização da série:", erro)
      );
    }
  }, [id]);

  useEffect(() => {
    if (serie && serie.temporadas.length > 0 && serie.temporadas[0].episodios?.length) {
      setEpisodioAtivo(serie.temporadas[0].episodios[0].id);
    }
  }, [serie]);

  const getTemporadaAtiva = () => {
    if (!serie || !serie.temporadas.length) return null;
    return serie.temporadas.find(t => t.numero === temporadaAtiva) || serie.temporadas[0];
  };

  const getEpisodioAtivo = () => {
    const temporada = getTemporadaAtiva();
    if (!temporada || !temporada.episodios?.length) return null;
    return temporada.episodios.find(e => e.id === episodioAtivo) || temporada.episodios[0];
  };

  const trocarTemporada = (numero: number) => {
    setTemporadaAtiva(numero);
    const temporada = serie?.temporadas.find(t => t.numero === numero);
    if (temporada && temporada.episodios?.length) {
      setEpisodioAtivo(temporada.episodios[0].id);
    }
  };

  const trocarEpisodio = (id: string) => {
    setEpisodioAtivo(id);
    setActiveTab('assistir');
    setIsTrailer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return <SerieLoading />;
  }

  if (error || !serie) {
    return <SerieError />;
  }

  const episodioAtual = getEpisodioAtivo();
  const temporadaAtual = getTemporadaAtiva();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Área de header com o background da série */}
      <div className="relative">
        {/* Background com poster desfocado apenas no header */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: `url(${serie.poster_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-movieDarkBlue/95 to-black/100 backdrop-blur-md"></div>
        </div>
        
        <div className="relative z-10">
          <SerieHeader 
            serie={serie} 
            temporadaAtiva={temporadaAtiva} 
            trocarTemporada={trocarTemporada} 
            setActiveTab={setActiveTab} 
            setIsTrailer={setIsTrailer} 
          />
        </div>
      </div>
      
      {/* Conteúdo da página */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-movieDark/70 backdrop-blur-md mb-6 p-1 rounded-full border border-white/10">
            <TabsTrigger 
              value="assistir" 
              className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
            >
              Assistir
            </TabsTrigger>
            <TabsTrigger 
              value="temporadas" 
              className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
            >
              Episódios
            </TabsTrigger>
            <TabsTrigger 
              value="sobre" 
              className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
            >
              Sobre
            </TabsTrigger>
            <TabsTrigger 
              value="comentarios" 
              className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
            >
              Comentários
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistir" className="animate-fade-in">
            <SerieVideoPlayer 
              serie={serie}
              isTrailer={isTrailer}
              episodioAtual={episodioAtual}
              temporadaAtual={temporadaAtual}
              setIsTrailer={setIsTrailer}
              trocarEpisodio={trocarEpisodio}
            />
            
            <VejaTambemSeries 
              isLoading={false}
              serieAtualId={serie.id}
            />
          </TabsContent>
          
          <TabsContent value="temporadas" className="animate-fade-in">
            <SerieEpisodesList 
              temporadaAtual={temporadaAtual}
              temporadaAtiva={temporadaAtiva}
              episodioAtivo={episodioAtivo}
              trocarTemporada={trocarTemporada}
              trocarEpisodio={trocarEpisodio}
              totalTemporadas={serie.temporadas.length}
            />
            
            <VejaTambemSeries 
              isLoading={false}
              serieAtualId={serie.id}
            />
          </TabsContent>
          
          <TabsContent value="sobre" className="animate-fade-in">
            <SerieDetails 
              serie={serie} 
              trocarTemporada={trocarTemporada} 
              setActiveTab={setActiveTab} 
            />
            
            <VejaTambemSeries 
              isLoading={false}
              serieAtualId={serie.id}
            />
          </TabsContent>
          
          <TabsContent value="comentarios" className="animate-fade-in">
            <SerieComments />
            
            <VejaTambemSeries 
              isLoading={false}
              serieAtualId={serie.id}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default DetalhesSerie;
