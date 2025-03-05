
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
    <div className="bg-movieDarkBlue min-h-screen">
      <Navbar />
      
      <SerieHeader 
        serie={serie} 
        temporadaAtiva={temporadaAtiva} 
        trocarTemporada={trocarTemporada} 
        setActiveTab={setActiveTab} 
        setIsTrailer={setIsTrailer} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-movieDark/60 backdrop-blur-sm mb-6">
            <TabsTrigger value="assistir" className="text-white data-[state=active]:bg-movieRed">Assistir</TabsTrigger>
            <TabsTrigger value="temporadas" className="text-white data-[state=active]:bg-movieRed">Episódios</TabsTrigger>
            <TabsTrigger value="sobre" className="text-white data-[state=active]:bg-movieRed">Sobre</TabsTrigger>
            <TabsTrigger value="comentarios" className="text-white data-[state=active]:bg-movieRed">Comentários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistir">
            <SerieVideoPlayer 
              serie={serie}
              isTrailer={isTrailer}
              episodioAtual={episodioAtual}
              temporadaAtual={temporadaAtual}
              setIsTrailer={setIsTrailer}
              trocarEpisodio={trocarEpisodio}
            />
          </TabsContent>
          
          <TabsContent value="temporadas">
            <SerieEpisodesList 
              temporadaAtual={temporadaAtual}
              temporadaAtiva={temporadaAtiva}
              episodioAtivo={episodioAtivo}
              trocarTemporada={trocarTemporada}
              trocarEpisodio={trocarEpisodio}
              totalTemporadas={serie.temporadas.length}
            />
          </TabsContent>
          
          <TabsContent value="sobre">
            <SerieDetails 
              serie={serie} 
              trocarTemporada={trocarTemporada} 
              setActiveTab={setActiveTab} 
            />
          </TabsContent>
          
          <TabsContent value="comentarios">
            <SerieComments />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default DetalhesSerie;
