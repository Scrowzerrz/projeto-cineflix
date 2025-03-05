
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSerieDetails } from '@/services/seriesService';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, Plus, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFavoritos } from '@/hooks/useFavoritos';
import { useAuth } from '@/hooks/useAuth';
import FavoritoButton from '@/components/FavoritoButton';

// Importação dos componentes de série
import SerieDetails from '@/components/series/SerieDetails';
import SerieEpisodesList from '@/components/series/SerieEpisodesList';
import SerieVideoPlayer from '@/components/series/SerieVideoPlayer';
import SerieComments from '@/components/series/SerieComments';
import VejaTambemSeries from '@/components/series/VejaTambemSeries';
import SerieLoading from '@/components/series/SerieLoading';
import SerieError from '@/components/series/SerieError';

const DetalhesSerie = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'assistir');
  const [temporadaAtiva, setTemporadaAtiva] = useState(1);
  const [isTrailer, setIsTrailer] = useState(false);
  const navigate = useNavigate();
  const { perfil } = useAuth();
  const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();
  
  const isFavorito = favoritos.some(f => f.item_id === id);

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
    window.scrollTo(0, 0);
  }, []);

  const trocarTemporada = (numero: number) => {
    setTemporadaAtiva(numero);
  };

  const handleFavoritoClick = async () => {
    if (!perfil) {
      navigate('/auth');
      return;
    }

    if (isFavorito) {
      await removerFavorito.mutateAsync(id || '');
    } else {
      await adicionarFavorito.mutateAsync({ itemId: id || '', tipo: 'serie' });
    }
  };

  const compartilharSerie = () => {
    if (navigator.share) {
      navigator.share({
        title: serie?.titulo || 'Série',
        text: `Assista ${serie?.titulo} em nossa plataforma de streaming`,
        url: window.location.href
      })
      .catch((err) => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  if (isLoading) {
    return <SerieLoading />;
  }

  if (error || !serie) {
    return <SerieError />;
  }

  // Encontrar a temporada ativa
  const temporadaAtual = serie.temporadas.find(t => t.numero === temporadaAtiva) || serie.temporadas[0];

  return (
    <div className="bg-black min-h-screen relative">
      {/* Background com Poster Desfocado */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${serie.poster_url})`,
            backgroundSize: 'cover',
            filter: 'blur(8px)',
            transform: 'scale(1.1)', // Evita bordas brancas devido ao blur
          }}
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="pt-16">
          {/* Cabeçalho da Série */}
          <div 
            className="relative w-full bg-transparent pt-8 pb-8"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                  <div className="rounded-md overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-800">
                    <img 
                      src={serie.poster_url} 
                      alt={serie.titulo} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 md:hidden">
                    <Button 
                      className="w-full bg-movieRed hover:bg-movieRed/90 text-white rounded-md"
                      onClick={() => {
                        setActiveTab('assistir');
                        setIsTrailer(false);
                      }}
                    >
                      <Play className="mr-2 h-4 w-4 fill-white" /> Assistir
                    </Button>
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                        onClick={() => {
                          setActiveTab('assistir');
                          setIsTrailer(true);
                        }}
                      >
                        <Play className="h-4 w-4" /> Trailer
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                        onClick={handleFavoritoClick}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                        onClick={() => toast.info('Iniciando download...')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Informações da Série */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                  <div className="mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{serie.titulo}</h1>
                    <p className="text-gray-400 text-sm">{serie.titulo_original || serie.titulo}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{serie.ano}</span>
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{serie.duracao}</span>
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{serie.qualidade || 'HD'}</span>
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm">{serie.idioma || 'DUB'}</span>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star} 
                            className={`h-4 w-4 ${Number(serie.avaliacao) >= star * 2 ? 'fill-yellow-500 text-yellow-500' : 
                                              Number(serie.avaliacao) >= star * 2 - 1 ? 'fill-yellow-500/50 text-yellow-500' : 
                                              'text-gray-600'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-yellow-500">{Number(serie.avaliacao).toFixed(1)}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {serie.generos?.map((genero, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 border border-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {genero}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-white font-semibold text-lg mb-2">Sinopse</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {serie.descricao || 'Nenhuma sinopse disponível.'}
                    </p>
                  </div>
                  
                  {/* Temporadas disponíveis */}
                  <div className="mb-6">
                    <h3 className="text-white font-semibold text-lg mb-3">Temporadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {serie.temporadas.map((temporada) => (
                        <Button 
                          key={temporada.id}
                          variant={temporada.numero === temporadaAtiva ? "default" : "outline"}
                          size="sm"
                          className={temporada.numero === temporadaAtiva 
                            ? "bg-movieRed hover:bg-movieRed/90" 
                            : "border-white/30 text-white bg-white/10 hover:bg-white/20"}
                          onClick={() => trocarTemporada(temporada.numero)}
                        >
                          Temporada {temporada.numero}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="hidden md:flex flex-wrap gap-3 mt-8">
                    <Button 
                      className="bg-movieRed hover:bg-movieRed/90 text-white rounded-md px-6"
                      onClick={() => {
                        setActiveTab('assistir');
                        setIsTrailer(false);
                      }}
                    >
                      <Play className="mr-2 h-5 w-5 fill-white" /> Assistir Agora
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                      onClick={() => {
                        setActiveTab('assistir');
                        setIsTrailer(true);
                      }}
                    >
                      <Play className="mr-2 h-5 w-5" /> Trailer
                    </Button>
                    
                    <FavoritoButton
                      itemId={serie.id}
                      tipo="serie"
                      className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                      showText
                    />
                    
                    <Button 
                      variant="outline"
                      className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                      onClick={() => toast.info('Iniciando download...')}
                    >
                      <Download className="mr-2 h-5 w-5" /> Download
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                      onClick={compartilharSerie}
                    >
                      <Share2 className="mr-2 h-5 w-5" /> Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conteúdo da Série */}
          <div className="bg-black/40 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-gray-900/70 border border-gray-800 mb-6 p-1 overflow-x-auto flex w-full scrollbar-none">
                  <TabsTrigger 
                    value="assistir" 
                    className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md text-sm py-2"
                  >
                    Assistir
                  </TabsTrigger>
                  <TabsTrigger 
                    value="episodios" 
                    className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md text-sm py-2"
                  >
                    Episódios
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sobre" 
                    className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md text-sm py-2"
                  >
                    Sobre
                  </TabsTrigger>
                  <TabsTrigger 
                    value="comentarios" 
                    className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md text-sm py-2"
                  >
                    Comentários
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="assistir" className="mt-6 focus-visible:outline-none">
                  <SerieVideoPlayer 
                    serie={serie} 
                    temporada={temporadaAtual}
                    isTrailer={isTrailer}
                    setIsTrailer={setIsTrailer}
                  />
                  
                  <VejaTambemSeries serieAtualId={serie.id} />
                </TabsContent>
                
                <TabsContent value="episodios" className="mt-6 focus-visible:outline-none">
                  <SerieEpisodesList 
                    temporada={temporadaAtual} 
                  />
                  
                  <VejaTambemSeries serieAtualId={serie.id} />
                </TabsContent>
                
                <TabsContent value="sobre" className="mt-6 focus-visible:outline-none">
                  <SerieDetails 
                    serie={serie} 
                    trocarTemporada={trocarTemporada} 
                    setActiveTab={setActiveTab} 
                  />
                  
                  <VejaTambemSeries serieAtualId={serie.id} />
                </TabsContent>
                
                <TabsContent value="comentarios" className="mt-6 focus-visible:outline-none">
                  <SerieComments 
                    serieId={serie.id} 
                  />
                  
                  <VejaTambemSeries serieAtualId={serie.id} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DetalhesSerie;
