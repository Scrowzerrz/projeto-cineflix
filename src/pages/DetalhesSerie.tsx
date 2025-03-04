
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSerieDetails } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Play, Plus, Share2, ThumbsUp, Star, Award, Calendar, Clock, Tv, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { EpisodioCard } from '@/components/EpisodioCard';

const DetalhesSerie = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('temporadas');
  const [temporadaAtiva, setTemporadaAtiva] = useState(1);
  const [episodioAtivo, setEpisodioAtivo] = useState<string | null>(null);
  const [isTrailer, setIsTrailer] = useState(false);
  
  // Buscar detalhes da série
  const { 
    data: serie, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['serie-detalhes', id],
    queryFn: () => fetchSerieDetails(id || ''),
    enabled: !!id
  });

  // Efeito para definir o primeiro episódio como ativo quando carregar
  useEffect(() => {
    if (serie && serie.temporadas.length > 0 && serie.temporadas[0].episodios?.length) {
      setEpisodioAtivo(serie.temporadas[0].episodios[0].id);
    }
  }, [serie]);

  // Compartilhar série
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
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  // Adicionar à lista
  const adicionarLista = () => {
    toast.success('Série adicionada à sua lista!');
  };

  // Curtir série
  const curtirSerie = () => {
    toast.success('Você curtiu esta série!');
  };

  // Obter temporada ativa
  const getTemporadaAtiva = () => {
    if (!serie || !serie.temporadas.length) return null;
    return serie.temporadas.find(t => t.numero === temporadaAtiva) || serie.temporadas[0];
  };

  // Obter episódio ativo
  const getEpisodioAtivo = () => {
    const temporada = getTemporadaAtiva();
    if (!temporada || !temporada.episodios?.length) return null;
    return temporada.episodios.find(e => e.id === episodioAtivo) || temporada.episodios[0];
  };

  // Trocar temporada
  const trocarTemporada = (numero: number) => {
    setTemporadaAtiva(numero);
    const temporada = serie?.temporadas.find(t => t.numero === numero);
    if (temporada && temporada.episodios?.length) {
      setEpisodioAtivo(temporada.episodios[0].id);
    }
  };

  // Mudança de episódio
  const trocarEpisodio = (id: string) => {
    setEpisodioAtivo(id);
    setActiveTab('assistir');
    setIsTrailer(false);
    // Rolar para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Rolar para o topo quando o componente for montado
    window.scrollTo(0, 0);
  }, []);

  // Renderizar conteúdo baseado no estado de carregamento/erro
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

  if (error || !serie) {
    return (
      <div className="bg-movieDarkBlue min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-white text-2xl mb-2">Série não encontrada</h2>
            <p className="text-movieGray mb-6">Não foi possível encontrar a série solicitada</p>
            <Link to="/series">
              <Button className="bg-movieRed hover:bg-movieRed/90">
                Voltar para séries
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const episodioAtual = getEpisodioAtivo();
  const temporadaAtual = getTemporadaAtiva();

  return (
    <div className="bg-movieDarkBlue min-h-screen">
      <Navbar />
      
      {/* Hero Section com Backdrop e Informações */}
      <div className="relative pt-16">
        {/* Background Image com Gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center h-[70vh] z-0"
          style={{ 
            backgroundImage: `url(${serie.poster_url})`,
            backgroundPosition: '50% 25%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-movieDarkBlue via-movieDarkBlue/95 to-black/30"></div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 pt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="rounded-md overflow-hidden shadow-xl border-2 border-movieGray/10">
                <img 
                  src={serie.poster_url} 
                  alt={serie.titulo} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Informações da série */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              {/* Título e meta */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{serie.titulo}</h1>
                {serie.titulo_original && (
                  <p className="text-movieGray text-lg mb-2">Título original: {serie.titulo_original}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mt-2">
                  <span className="bg-movieRed/90 text-white px-2 py-0.5 rounded-sm text-xs">
                    {serie.idioma || 'DUB'}
                  </span>
                  <span>{serie.ano}</span>
                  <span>•</span>
                  <span>{serie.duracao}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500 mr-1" />
                    {serie.avaliacao}
                  </span>
                  <span>•</span>
                  <span className="bg-movieLightBlue/20 text-white px-2 py-0.5 rounded-sm text-xs">
                    {serie.qualidade || 'HD'}
                  </span>
                </div>
              </div>
              
              {/* Gêneros */}
              <div className="flex flex-wrap gap-2 mb-6">
                {serie.generos?.map((genero, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm"
                  >
                    {genero}
                  </span>
                ))}
              </div>
              
              {/* Sinopse */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-xl mb-2">Sinopse</h3>
                <p className="text-white/80 leading-relaxed">
                  {serie.descricao || 'Nenhuma sinopse disponível.'}
                </p>
              </div>
              
              {/* Detalhes técnicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <Tv className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Diretor</h4>
                      <p className="text-white">{serie.diretor || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <Award className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Elenco</h4>
                      <p className="text-white">{serie.elenco || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Produtor</h4>
                      <p className="text-white">{serie.produtor || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <Clock className="h-5 w-5 text-movieGray mt-0.5" />
                    <div>
                      <h4 className="text-white/80 font-medium">Ano de Lançamento</h4>
                      <p className="text-white">{serie.ano}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Temporadas disponíveis */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-xl mb-3">Temporadas</h3>
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
              
              {/* Ações */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Button 
                  className="bg-movieRed hover:bg-movieRed/90 text-white flex items-center gap-2 rounded-md px-6"
                  onClick={() => {
                    setActiveTab('assistir');
                    setIsTrailer(false);
                  }}
                >
                  <Play className="h-5 w-5 fill-white" /> Assistir Agora
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 flex items-center gap-2"
                  onClick={() => {
                    setActiveTab('assistir');
                    setIsTrailer(true);
                  }}
                >
                  <Play className="h-5 w-5" /> Trailer
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
                  onClick={compartilharSerie}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                  onClick={curtirSerie}
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs para Assistir / Temporadas / Sobre */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-movieDark/60 backdrop-blur-sm mb-6">
            <TabsTrigger value="assistir" className="text-white data-[state=active]:bg-movieRed">Assistir</TabsTrigger>
            <TabsTrigger value="temporadas" className="text-white data-[state=active]:bg-movieRed">Episódios</TabsTrigger>
            <TabsTrigger value="sobre" className="text-white data-[state=active]:bg-movieRed">Sobre</TabsTrigger>
            <TabsTrigger value="comentarios" className="text-white data-[state=active]:bg-movieRed">Comentários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistir" className="mt-6">
            <div className="w-full aspect-video bg-black/40 rounded-md overflow-hidden mb-6">
              {isTrailer ? (
                <iframe
                  src={serie.trailer_url}
                  title={`Trailer: ${serie.titulo}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              ) : episodioAtual ? (
                <iframe 
                  src={episodioAtual.player_url} 
                  title={`${serie.titulo} - ${episodioAtual.titulo}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white">Selecione um episódio para assistir</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white text-xl font-semibold">
                  {isTrailer ? 'Trailer Oficial' : (episodioAtual ? episodioAtual.titulo : 'Selecione um episódio')}
                </h2>
                {!isTrailer && episodioAtual && (
                  <p className="text-movieGray">{temporadaAtual?.titulo} • {episodioAtual.duracao}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant={isTrailer ? "outline" : "default"} 
                  size="sm" 
                  className={isTrailer ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "bg-movieRed hover:bg-movieRed/90"}
                  onClick={() => setIsTrailer(false)}
                >
                  <Play className={`h-4 w-4 ${!isTrailer ? "fill-white" : ""}`} /> Episódio
                </Button>
                
                <Button 
                  variant={!isTrailer ? "outline" : "default"} 
                  size="sm" 
                  className={!isTrailer ? "border-white/30 text-white bg-white/10 hover:bg-white/20" : "bg-movieRed hover:bg-movieRed/90"}
                  onClick={() => setIsTrailer(true)}
                >
                  <Play className={`h-4 w-4 ${isTrailer ? "fill-white" : ""}`} /> Trailer
                </Button>
              </div>
            </div>

            {episodioAtual && !isTrailer && (
              <div className="bg-movieDark/30 p-4 rounded-md mb-6">
                <p className="text-white/80">{episodioAtual.descricao || 'Nenhuma descrição disponível para este episódio.'}</p>
              </div>
            )}

            {/* Navegação entre episódios */}
            {temporadaAtual?.episodios && temporadaAtual.episodios.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-4">Mais episódios</h3>
                <div className="flex gap-4 mb-4 overflow-x-auto pb-4">
                  {temporadaAtual.episodios.map((ep) => (
                    <div 
                      key={ep.id}
                      className={`flex-shrink-0 w-48 cursor-pointer transition-all ${ep.id === episodioAtivo ? 'ring-2 ring-movieRed' : 'opacity-70 hover:opacity-100'}`}
                      onClick={() => trocarEpisodio(ep.id)}
                    >
                      <div className="aspect-video bg-movieDark rounded-md overflow-hidden relative">
                        <img 
                          src={ep.thumbnail_url} 
                          alt={ep.titulo} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                          <span className="text-white text-sm font-medium">{ep.numero}. {ep.titulo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="temporadas" className="mt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">
                  {temporadaAtual?.titulo || `Temporada ${temporadaAtiva}`}
                </h2>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                    disabled={temporadaAtiva <= 1}
                    onClick={() => trocarTemporada(temporadaAtiva - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/30 text-white bg-white/10 hover:bg-white/20"
                    disabled={temporadaAtiva >= serie.temporadas.length}
                    onClick={() => trocarTemporada(temporadaAtiva + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Lista de episódios */}
              <div className="space-y-4">
                {temporadaAtual?.episodios?.map((episodio) => (
                  <div 
                    key={episodio.id}
                    className={`p-3 rounded-lg transition-all cursor-pointer ${
                      episodio.id === episodioAtivo 
                        ? 'bg-movieRed/20 border border-movieRed/30' 
                        : 'bg-movieDark/50 hover:bg-movieDark/80 border border-transparent'
                    }`}
                    onClick={() => trocarEpisodio(episodio.id)}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 sm:w-40 flex-shrink-0">
                        <div className="aspect-video bg-movieDark rounded-md overflow-hidden relative">
                          <img 
                            src={episodio.thumbnail_url} 
                            alt={episodio.titulo} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-medium">
                            {episodio.numero}. {episodio.titulo}
                          </h3>
                          <span className="text-movieGray text-sm">{episodio.duracao}</span>
                        </div>
                        <p className="text-movieGray text-sm line-clamp-2 mt-1">
                          {episodio.descricao || 'Nenhuma descrição disponível.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!temporadaAtual?.episodios || temporadaAtual.episodios.length === 0) && (
                  <div className="text-center py-12 bg-movieDark/30 rounded-lg">
                    <p className="text-white text-xl mb-2">Nenhum episódio disponível</p>
                    <p className="text-movieGray">Esta temporada ainda não possui episódios cadastrados.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sobre" className="mt-6">
            <div className="bg-movieDark/30 p-6 rounded-lg">
              <h2 className="text-white text-2xl font-semibold mb-4">{serie.titulo}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white text-lg font-medium mb-2">Sinopse</h3>
                  <p className="text-white/80 leading-relaxed">
                    {serie.descricao || 'Nenhuma sinopse disponível.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2">Detalhes</h3>
                    <ul className="space-y-2 text-white/80">
                      <li><span className="text-movieGray">Título Original:</span> {serie.titulo_original || serie.titulo}</li>
                      <li><span className="text-movieGray">Ano de Lançamento:</span> {serie.ano}</li>
                      <li><span className="text-movieGray">Gêneros:</span> {serie.generos?.join(', ') || 'Não informado'}</li>
                      <li><span className="text-movieGray">Duração:</span> {serie.duracao}</li>
                      <li><span className="text-movieGray">Idioma:</span> {serie.idioma || 'DUB'}</li>
                      <li><span className="text-movieGray">Qualidade:</span> {serie.qualidade || 'HD'}</li>
                      <li><span className="text-movieGray">Categoria:</span> {serie.categoria || 'Não informada'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white text-lg font-medium mb-2">Elenco e Equipe</h3>
                    <ul className="space-y-2 text-white/80">
                      <li><span className="text-movieGray">Diretor:</span> {serie.diretor || 'Não informado'}</li>
                      <li><span className="text-movieGray">Elenco:</span> {serie.elenco || 'Não informado'}</li>
                      <li><span className="text-movieGray">Produtor:</span> {serie.produtor || 'Não informado'}</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white text-lg font-medium mb-2">Temporadas</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {serie.temporadas.map((temporada) => (
                      <div 
                        key={temporada.id} 
                        className="cursor-pointer"
                        onClick={() => {
                          trocarTemporada(temporada.numero);
                          setActiveTab('temporadas');
                        }}
                      >
                        <div className="bg-movieDark rounded-md overflow-hidden">
                          <img 
                            src={temporada.poster_url} 
                            alt={temporada.titulo || `Temporada ${temporada.numero}`} 
                            className="w-full h-auto aspect-[2/3] object-cover"
                          />
                          <div className="p-2 text-center">
                            <p className="text-white font-medium">{temporada.titulo || `Temporada ${temporada.numero}`}</p>
                            <p className="text-movieGray text-sm">{temporada.ano}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comentarios" className="mt-6">
            <div className="text-center py-12 bg-movieDark/30 rounded-lg">
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

export default DetalhesSerie;
