
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard, { MovieCardProps } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { fetchAllSeries } from '@/services/movieService';

const generos = [
  'Todos', 'Ação', 'Aventura', 'Animação', 'Comédia', 'Crime', 'Documentário', 
  'Drama', 'Família', 'Fantasia', 'História', 'Horror', 'Música', 'Mistério', 
  'Romance', 'Ficção Científica', 'Thriller', 'Guerra'
];

const Series = () => {
  const [generoSelecionado, setGeneroSelecionado] = useState('Todos');
  const [anoSelecionado, setAnoSelecionado] = useState('Todos');
  const [abaPrincipal, setAbaPrincipal] = useState('populares');
  
  // Buscar séries usando React Query
  const { 
    data: series, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['series', abaPrincipal, generoSelecionado, anoSelecionado],
    queryFn: () => fetchAllSeries(generoSelecionado)
  });

  // Atualizar quando os filtros mudarem
  useEffect(() => {
    refetch();
  }, [abaPrincipal, generoSelecionado, anoSelecionado, refetch]);

  // Renderizar conteúdo baseado no estado de carregamento/erro
  const renderConteudo = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 text-movieRed animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-white text-2xl">Erro ao carregar séries</p>
            <p className="text-movieGray">Por favor, tente novamente mais tarde</p>
          </div>
        </div>
      );
    }

    if (!series || series.length === 0) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-white text-2xl">Nenhuma série encontrada</p>
            <p className="text-movieGray">Tente mudar os filtros de busca</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {series.map((serie) => (
          <div key={serie.id}>
            <MovieCard {...serie} type="series" />
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-movieDarkBlue">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 pt-4">Séries</h1>
          
          <Tabs value={abaPrincipal} onValueChange={setAbaPrincipal} className="w-full mb-8">
            <TabsList className="bg-movieDark/60 backdrop-blur-sm">
              <TabsTrigger value="populares" className="text-white data-[state=active]:bg-movieRed">Populares</TabsTrigger>
              <TabsTrigger value="recentes" className="text-white data-[state=active]:bg-movieRed">Recentes</TabsTrigger>
              <TabsTrigger value="top-rated" className="text-white data-[state=active]:bg-movieRed">Mais Avaliadas</TabsTrigger>
              <TabsTrigger value="novas-temporadas" className="text-white data-[state=active]:bg-movieRed">Novas Temporadas</TabsTrigger>
            </TabsList>
            
            <div className="my-6 flex flex-wrap gap-4">
              <div className="flex-1">
                <label className="block text-movieGray text-sm mb-2">Gênero</label>
                <select 
                  className="w-full bg-movieDark text-white border border-movieGray/20 rounded-md p-2.5"
                  value={generoSelecionado}
                  onChange={(e) => setGeneroSelecionado(e.target.value)}
                >
                  {generos.map((genero) => (
                    <option key={genero} value={genero}>{genero}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-movieGray text-sm mb-2">Ano</label>
                <select 
                  className="w-full bg-movieDark text-white border border-movieGray/20 rounded-md p-2.5"
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {[...Array(10)].map((_, i) => {
                    const year = 2024 - i;
                    return <option key={year} value={year.toString()}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
            
            <TabsContent value="populares" className="mt-6">
              {renderConteudo()}
            </TabsContent>
            
            <TabsContent value="recentes" className="mt-6">
              {renderConteudo()}
            </TabsContent>
            
            <TabsContent value="top-rated" className="mt-6">
              {renderConteudo()}
            </TabsContent>
            
            <TabsContent value="novas-temporadas" className="mt-6">
              {renderConteudo()}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mt-10">
            <Button 
              className="bg-movieRed hover:bg-movieRed/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Carregando...
                </>
              ) : 'Carregar Mais'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Series;
