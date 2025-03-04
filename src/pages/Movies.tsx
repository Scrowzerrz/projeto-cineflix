
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard, { MovieCardProps } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { fetchMovies } from '@/services/movieService';

const genres = [
  'Todos', 'Ação', 'Aventura', 'Animação', 'Comédia', 'Crime', 'Documentário', 
  'Drama', 'Família', 'Fantasia', 'História', 'Horror', 'Música', 'Mistério', 
  'Romance', 'Ficção Científica', 'Thriller', 'Guerra', 'Faroeste'
];

const Movies = () => {
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [activeTab, setActiveTab] = useState('populares');
  
  // Fetch movies based on active tab
  const { 
    data: movies, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['movies', activeTab, selectedGenre, selectedYear],
    queryFn: () => fetchMovies(activeTab)
  });

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [activeTab, selectedGenre, selectedYear, refetch]);

  // Render content based on loading/error state
  const renderContent = () => {
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
            <p className="text-white text-2xl">Erro ao carregar filmes</p>
            <p className="text-movieGray">Por favor, tente novamente mais tarde</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies?.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-movieDarkBlue">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 pt-4">Filmes</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="bg-movieDark/60 backdrop-blur-sm">
              <TabsTrigger value="populares" className="text-white data-[state=active]:bg-movieRed">Populares</TabsTrigger>
              <TabsTrigger value="lancamentos" className="text-white data-[state=active]:bg-movieRed">Lançamentos</TabsTrigger>
              <TabsTrigger value="top-rated" className="text-white data-[state=active]:bg-movieRed">Mais Avaliados</TabsTrigger>
              <TabsTrigger value="proximos" className="text-white data-[state=active]:bg-movieRed">Em Breve</TabsTrigger>
            </TabsList>
            
            <div className="my-6 flex flex-wrap gap-4">
              <div className="flex-1">
                <label className="block text-movieGray text-sm mb-2">Gênero</label>
                <select 
                  className="w-full bg-movieDark text-white border border-movieGray/20 rounded-md p-2.5"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-movieGray text-sm mb-2">Ano</label>
                <select 
                  className="w-full bg-movieDark text-white border border-movieGray/20 rounded-md p-2.5"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
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
              {renderContent()}
            </TabsContent>
            
            <TabsContent value="lancamentos" className="mt-6">
              {renderContent()}
            </TabsContent>
            
            <TabsContent value="top-rated" className="mt-6">
              {renderContent()}
            </TabsContent>
            
            <TabsContent value="proximos" className="mt-6">
              {renderContent()}
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

export default Movies;
