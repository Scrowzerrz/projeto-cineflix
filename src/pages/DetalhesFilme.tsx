
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchMovieDetails, incrementarVisualizacaoFilme } from '@/services/filmesService';
import { fetchSomeMovies } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Play, Plus, Download, Share2, Star, Clock, Calendar, Film, Users, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import FavoritoButton from '@/components/FavoritoButton';
import VideoPlayer from '@/components/player/VideoPlayer';
import { Badge } from '@/components/ui/badge';
import { useFavoritos } from '@/hooks/useFavoritos';
import { useAuth } from '@/hooks/useAuth';
import { MovieResponse } from '@/services/types/movieTypes';
import CartaoFilme from '@/components/MovieCard';
import { mapToMovieCard } from '@/services/utils/movieUtils';

const DetalhesFilme = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('assistir');
  const [isTrailer, setIsTrailer] = useState(false);
  const navigate = useNavigate();
  const { perfil } = useAuth();
  const { favoritos, adicionarFavorito, removerFavorito } = useFavoritos();
  
  const isFavorito = favoritos.some(f => f.item_id === id);
  
  const { 
    data: filme, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['filme-detalhes', id],
    queryFn: () => fetchMovieDetails(id || ''),
    enabled: !!id
  });

  const { 
    data: filmesSugestoes = [],
    isLoading: isLoadingSugestoes
  } = useQuery({
    queryKey: ['filmes-sugestoes'],
    queryFn: () => fetchSomeMovies(5),
  });

  useEffect(() => {
    if (id) {
      incrementarVisualizacaoFilme(id).catch(erro => 
        console.error("Erro ao registrar visualização do filme:", erro)
      );
    }
  }, [id]);

  const compartilharFilme = () => {
    if (navigator.share) {
      navigator.share({
        title: filme?.titulo || 'Filme',
        text: `Assista ${filme?.titulo} em nossa plataforma de streaming`,
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

  const handleFavoritoClick = async () => {
    if (!perfil) {
      navigate('/auth');
      return;
    }

    if (isFavorito) {
      await removerFavorito.mutateAsync(id || '');
    } else {
      await adicionarFavorito.mutateAsync({ itemId: id || '', tipo: 'filme' });
    }
  };

  const baixarFilme = () => {
    toast.info('Iniciando download...');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const VejaTambemSection = () => (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-xl flex items-center">
          <span>VEJA TAMBÉM</span>
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-700 bg-black/50 hover:bg-gray-800">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-700 bg-black/50 hover:bg-gray-800">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoadingSugestoes ? (
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="group relative rounded-md overflow-hidden">
              <div className="aspect-[2/3] bg-gray-800 animate-pulse"></div>
            </div>
          ))
        ) : (
          filmesSugestoes.map((filmeItem: MovieResponse) => (
            <CartaoFilme
              key={filmeItem.id}
              id={filmeItem.id}
              title={filmeItem.titulo}
              posterUrl={filmeItem.poster_url}
              year={filmeItem.ano}
              duration={filmeItem.duracao}
              type={filmeItem.tipo as 'movie' | 'series'}
              quality={filmeItem.qualidade as 'HD' | 'CAM' | 'DUB' | 'LEG'}
              rating={filmeItem.avaliacao}
            />
          ))
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-12 w-12 text-movieRed animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !filme) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-white text-2xl mb-2">Filme não encontrado</h2>
            <p className="text-movieGray mb-6">Não foi possível encontrar o filme solicitado</p>
            <Link to="/movies">
              <Button className="bg-movieRed hover:bg-movieRed/90">
                Voltar para filmes
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedRating = filme.avaliacao ? `${filme.avaliacao}/10` : '0/10';

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div 
        className="relative w-full bg-black pt-16"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%), url(${filme.poster_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="rounded-md overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-800">
                <img 
                  src={filme.poster_url} 
                  alt={filme.titulo} 
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
                    onClick={baixarFilme}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{filme.titulo}</h1>
                <p className="text-gray-400 text-sm">{filme.titulo_original || filme.titulo}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-gray-800 text-white hover:bg-gray-700">{filme.ano}</Badge>
                <Badge className="bg-gray-800 text-white hover:bg-gray-700">{filme.duracao}</Badge>
                <Badge className="bg-gray-800 text-white hover:bg-gray-700">{filme.qualidade || 'HD'}</Badge>
                <Badge className="bg-gray-800 text-white hover:bg-gray-700">{filme.idioma || 'DUB'}</Badge>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${Number(filme.avaliacao) >= star * 2 ? 'fill-yellow-500 text-yellow-500' : 
                                               Number(filme.avaliacao) >= star * 2 - 1 ? 'fill-yellow-500/50 text-yellow-500' : 
                                               'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-yellow-500">{formattedRating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {filme.generos?.map((genero, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {genero}
                  </Badge>
                ))}
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2">Sinopse</h3>
                <p className="text-gray-400 leading-relaxed">
                  {filme.descricao || 'Nenhuma sinopse disponível.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-2">
                  <Film className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="text-gray-400 font-medium">Diretor</h4>
                    <p className="text-white">{filme.diretor || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="text-gray-400 font-medium">Elenco</h4>
                    <p className="text-white">{filme.elenco || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="text-gray-400 font-medium">Produtor</h4>
                    <p className="text-white">{filme.produtor || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="text-gray-400 font-medium">Duração</h4>
                    <p className="text-white">{filme.duracao}</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex flex-wrap gap-3">
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
                
                <Button 
                  variant="outline"
                  className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                  onClick={handleFavoritoClick}
                >
                  <Plus className="mr-2 h-5 w-5" /> {isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                  onClick={baixarFilme}
                >
                  <Download className="mr-2 h-5 w-5" /> Download
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                  onClick={compartilharFilme}
                >
                  <Share2 className="mr-2 h-5 w-5" /> Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black">
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-900 border border-gray-800 mb-6 p-1 overflow-x-auto flex w-full scrollbar-none">
              <TabsTrigger 
                value="assistir" 
                className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md text-sm py-2"
              >
                Assistir
              </TabsTrigger>
              <TabsTrigger 
                value="comentarios" 
                className="flex-1 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-md text-sm py-2"
              >
                Comentários
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistir" className="mt-6 focus-visible:outline-none">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-semibold">
                  {isTrailer ? 'Trailer Oficial' : 'Assistir Filme'}
                </h2>
                
                <div className="flex gap-3">
                  <Button 
                    variant={isTrailer ? "outline" : "default"} 
                    size="sm" 
                    className={isTrailer ? "border-gray-700 text-white bg-black hover:bg-gray-800" : "bg-movieRed hover:bg-movieRed/90"}
                    onClick={() => setIsTrailer(false)}
                  >
                    Filme
                  </Button>
                  
                  <Button 
                    variant={!isTrailer ? "outline" : "default"} 
                    size="sm" 
                    className={!isTrailer ? "border-gray-700 text-white bg-black hover:bg-gray-800" : "bg-movieRed hover:bg-movieRed/90"}
                    onClick={() => setIsTrailer(true)}
                  >
                    Trailer
                  </Button>
                </div>
              </div>
              
              <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-8 shadow-2xl">
                {isTrailer ? (
                  <iframe
                    src={filme.trailer_url}
                    title={`Trailer: ${filme.titulo}`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                ) : (
                  <VideoPlayer 
                    playerUrl={filme.player_url} 
                    posterUrl={filme.poster_url} 
                    title={filme.titulo} 
                  />
                )}
              </div>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-white text-lg font-bold mb-3">{filme.titulo}</h3>
                <p className="text-gray-400 mb-4">{filme.descricao}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                    onClick={compartilharFilme}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-white bg-black/50 hover:bg-gray-800"
                    onClick={handleFavoritoClick}
                  >
                    <Plus className="mr-2 h-4 w-4" /> {isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  </Button>
                </div>
              </div>
              
              <VejaTambemSection />
            </TabsContent>
            
            <TabsContent value="comentarios" className="mt-6 focus-visible:outline-none">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-gray-500" />
                  </div>
                  <h3 className="text-white text-lg font-medium">Deixe seu comentário</h3>
                </div>
                
                <textarea 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white resize-none h-24 placeholder:text-gray-500"
                  placeholder="Escreva o que achou deste filme..."
                />
                
                <div className="flex justify-end mt-3">
                  <Button className="bg-movieRed hover:bg-movieRed/90">Enviar Comentário</Button>
                </div>
              </div>
              
              <div className="space-y-6 mb-12">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-medium">U</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">Usuário</h4>
                        <span className="text-gray-500 text-sm">há 2 dias</span>
                      </div>
                      
                      <p className="text-gray-300 mt-2">Este é um exemplo de comentário. Em breve, você poderá interagir com outros usuários.</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-gray-300">
                          <Heart className="h-4 w-4" /> 12
                        </button>
                        <button className="text-gray-500 text-sm hover:text-gray-300">Responder</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <VejaTambemSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DetalhesFilme;
