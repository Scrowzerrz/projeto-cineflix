
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSerieDetails, incrementarVisualizacaoSerie, fetchSomeMovies } from '@/services/movieService';
import { ChevronDown, MessageSquare, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SerieHeader from '@/components/series/SerieHeader';
import SerieDetalhes from '@/components/series/SerieDetalhes';
import SerieEpisodeLista from '@/components/series/SerieEpisodeLista';
import SerieComentarios from '@/components/series/SerieComentarios';
import SerieLoading from '@/components/series/SerieLoading';
import SerieError from '@/components/series/SerieError';
import { MovieCard } from '@/components/MovieCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DetalhesSerie = () => {
  const { id } = useParams<{ id: string }>();
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

  const { data: sugestoes = [] } = useQuery({
    queryKey: ['sugestoes-series'],
    queryFn: () => fetchSomeMovies(6),
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

  const handleTemporadaChange = (value: string) => {
    trocarTemporada(parseInt(value));
  };

  const trocarEpisodio = (id: string) => {
    setEpisodioAtivo(id);
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

  const temporadaAtual = getTemporadaAtiva();
  const episodioAtual = getEpisodioAtivo();

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Cabeçalho da Série */}
        <SerieHeader 
          serie={serie} 
          setIsTrailer={setIsTrailer}
        />
        
        {/* Detalhes e informações da série */}
        <SerieDetalhes 
          serie={serie}
          trocarTemporada={trocarTemporada} 
        />
        
        {/* Seleção de Temporada */}
        <div className="bg-[#0a1117] my-6 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">SELECIONE A TEMPORADA</h2>
            <div className="w-44">
              <Select 
                defaultValue={temporadaAtiva.toString()}
                onValueChange={handleTemporadaChange}
              >
                <SelectTrigger className="bg-[#17212b] border-none text-white">
                  <SelectValue placeholder="Temporada 1" />
                </SelectTrigger>
                <SelectContent className="bg-[#17212b] border-[#2a3543] text-white">
                  {serie.temporadas.map((temporada) => (
                    <SelectItem key={temporada.id} value={temporada.numero.toString()}>
                      Temporada {temporada.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Lista de Episódios */}
        <SerieEpisodeLista 
          temporada={temporadaAtual} 
          episodioAtivo={episodioAtivo} 
          trocarEpisodio={trocarEpisodio} 
        />
        
        {/* Veja Também */}
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold flex items-center">
              <span className="border-l-4 border-[#0197f6] h-6 mr-2"></span>
              VEJA TAMBÉM
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-[#17212b] hover:bg-[#1c2836] border-none text-white"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-[#17212b] hover:bg-[#1c2836] border-none text-white"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sugestoes.map((filme) => (
              <MovieCard 
                key={filme.id}
                id={filme.id}
                tipo={filme.tipo}
                titulo={filme.titulo}
                poster_url={filme.poster_url}
                ano={filme.ano}
                avaliacao={filme.avaliacao}
                duracao={filme.duracao}
                qualidade={filme.qualidade}
                idioma={filme.idioma}
              />
            ))}
          </div>
        </div>
        
        {/* Comentários */}
        <SerieComentarios />
      </div>
      
      <Footer />
    </div>
  );
};

export default DetalhesSerie;
