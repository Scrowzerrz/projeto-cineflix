import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchMovieDetails, incrementarVisualizacaoFilme } from '@/services/filmesService';
import { Button } from '@/components/ui/button';
import { Plus, Download, Share2, Star, Award, Calendar, Clock, Film, Users } from 'lucide-react';
import { toast } from 'sonner';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import FavoritoButton from '@/components/FavoritoButton';
import VideoPlayer from '@/components/player/VideoPlayer';

const DetalhesFilme = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('assistir');
  const [isTrailer, setIsTrailer] = useState(false);
  
  const { 
    data: filme, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['filme-detalhes', id],
    queryFn: () => fetchMovieDetails(id || ''),
    enabled: !!id
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

  const adicionarLista = () => {
    toast.success('Filme adicionado à sua lista!');
  };

  const baixarFilme = () => {
    toast.info('Iniciando download...');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-movieDarkBlue min-h-screen">
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
      <div className="bg-movieDarkBlue min-h-screen">
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

  return (
    <div className="bg-movieDarkBlue min-h-screen">
      <Navbar />
      
      <div className="relative pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-[70vh] z-0"
          style={{ 
            backgroundImage: `url(${filme.poster_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-movieDarkBlue via-movieDarkBlue/95 to-black/30"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="rounded-md overflow-hidden shadow-xl border-2 border-movieGray/10">
                <img 
                  src={filme.poster_url} 
                  alt={filme.titulo} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{filme.titulo}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mt-2">
                  <span className="bg-movieRed/90 text-white px-2 py-0.5 rounded-sm text-xs">
                    {filme.idioma || 'DUB'}
                  </span>
                  <span>{filme.ano}</span>
                  <span>•</span>
                  <span>{filme.duracao}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500 mr-1" />
                    {filme.avaliacao}
                  </span>
                  <span>•</span>
                  <span className="bg-movieLightBlue/20 text-white px-2 py-0.5 rounded-sm text-xs">
                    {filme.qualidade || 'HD'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {filme.generos?.map((genero, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm"
                  >
                    {genero}
                  </span>
                ))}
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-semibold text-xl mb-2">Sinopse</h3>
                <p className="text-white/80 leading-relaxed">
                  {filme.descricao || 'Nenhuma sinopse disponível.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <Film className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Diretor</h4>
                      <p className="text-white">{filme.diretor || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <Users className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Elenco</h4>
                      <p className="text-white">{filme.elenco || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <Award className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Produtor</h4>
                      <p className="text-white">{filme.produtor || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Ano de Lançamento</h4>
                      <p className="text-white">{filme.ano}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8">
                <Button 
                  className="bg-movieRed hover:bg-movieRed/90 text-white flex items-center gap-2 rounded-md px-6"
                  onClick={() => {
                    setActiveTab('assistir');
                    setIsTrailer(false);
                  }}
                >
                  Assistir Agora
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 flex items-center gap-2"
                  onClick={() => {
                    setActiveTab('assistir');
                    setIsTrailer(true);
                  }}
                >
                  Trailer
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                  onClick={adicionarLista}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                  onClick={baixarFilme}
                >
                  <Download className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                  onClick={compartilharFilme}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <FavoritoButton
                  itemId={id || ''}
                  tipo="filme"
                  className="border-white/30 bg-white/10 hover:bg-white/20 w-10 h-10 p-0 flex items-center justify-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-movieDark/60 backdrop-blur-sm mb-6">
            <TabsTrigger value="assistir" className="text-white data-[state=active]:bg-movieRed">Assistir</TabsTrigger>
            <TabsTrigger value="sugestoes" className="text-white data-[state=active]:bg-movieRed">Sugestões</TabsTrigger>
            <TabsTrigger value="comentarios" className="text-white data-[state=active]:bg-movieRed">Comentários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistir" className="mt-6">
            {isTrailer ? (
              <div className="w-full aspect-video bg-black/40 rounded-md overflow-hidden mb-6">
                <iframe
                  src={`${filme.trailer_url}?autoplay=0&showinfo=0&controls=1&rel=0`}
                  title={`Trailer: ${filme.titulo}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <VideoPlayer 
                playerUrl={filme.player_url} 
                posterUrl={filme.poster_url} 
                title={filme.titulo} 
              />
            )}
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">
                {isTrailer ? 'Trailer Oficial' : 'Reproduzir'}
              </h2>
              
              <div className="flex gap-3">
                <Button 
                  variant={isTrailer ? "outline" : "default"} 
                  size="sm" 
                  className={isTrailer ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "bg-movieRed hover:bg-movieRed/90"}
                  onClick={() => setIsTrailer(false)}
                >
                  Filme
                </Button>
                
                <Button 
                  variant={!isTrailer ? "outline" : "default"} 
                  size="sm" 
                  className={!isTrailer ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "bg-movieRed hover:bg-movieRed/90"}
                  onClick={() => setIsTrailer(true)}
                >
                  Trailer
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sugestoes" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-white text-xl mb-2">Sugestões em breve</h3>
              <p className="text-movieGray">Estamos trabalhando para trazer sugestões de filmes similares.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="comentarios" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-white text-xl mb-2">Comentários em breve</h3>
              <p className="text-movieGray">Os comentários estarão disponíveis em breve.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default DetalhesFilme;
