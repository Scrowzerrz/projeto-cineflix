
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard, { MovieCardProps } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon } from 'lucide-react';

// Combining data from both movies and series
const allData: MovieCardProps[] = [
  // Movies
  {
    id: '1',
    title: 'Acompanhante Perfeita',
    posterUrl: 'https://images.unsplash.com/photo-1611156034565-969e0162c480?q=80&w=987&auto=format&fit=crop',
    year: '2023',
    duration: '97min',
    quality: 'HD'
  },
  {
    id: '2',
    title: 'Ainda Estou Aqui',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop',
    year: '2024',
    duration: '135min',
    quality: 'CAM'
  },
  {
    id: '3',
    title: 'Capitão América: Mundo Novo',
    posterUrl: 'https://images.unsplash.com/photo-1514346261576-5be36aaf3a6d?q=80&w=987&auto=format&fit=crop',
    year: '2025',
    duration: '119min',
    quality: 'DUB'
  },
  // Series
  {
    id: '10',
    title: 'Demolidor: Renascido',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1559&auto=format&fit=crop',
    year: '2025',
    duration: '90min',
    type: 'series',
    quality: 'HD'
  },
  {
    id: '11',
    title: 'Suits LA',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1170&auto=format&fit=crop',
    year: '2025',
    duration: '43min',
    type: 'series',
    quality: 'LEG'
  },
  {
    id: '12',
    title: 'Paradise',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
    year: '2025',
    duration: '58min',
    type: 'series',
    quality: 'LEG'
  }
];

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MovieCardProps[]>([]);
  const [activeTab, setActiveTab] = useState('todos');
  
  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);
  
  const performSearch = (query: string) => {
    // Simple search logic for demonstration
    const results = allData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };
  
  const getFilteredResults = () => {
    if (activeTab === 'todos') return searchResults;
    if (activeTab === 'filmes') return searchResults.filter(item => item.type !== 'series');
    if (activeTab === 'series') return searchResults.filter(item => item.type === 'series');
    return searchResults;
  };
  
  return (
    <div className="min-h-screen bg-movieDarkBlue">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-8 pt-4">Pesquisar</h1>
          
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-movieGray" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-10 pr-4 bg-movieDark border border-movieGray/20 rounded-md text-white placeholder:text-movieGray/60 focus:outline-none focus:ring-2 focus:ring-movieRed/50"
                placeholder="Pesquisar filmes, séries, atores..."
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-movieRed hover:bg-movieRed/90"
              >
                Buscar
              </Button>
            </div>
          </form>
          
          {searchResults.length > 0 ? (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                <TabsList className="bg-movieDark/60 backdrop-blur-sm">
                  <TabsTrigger value="todos" className="text-white data-[state=active]:bg-movieRed">Todos</TabsTrigger>
                  <TabsTrigger value="filmes" className="text-white data-[state=active]:bg-movieRed">Filmes</TabsTrigger>
                  <TabsTrigger value="series" className="text-white data-[state=active]:bg-movieRed">Séries</TabsTrigger>
                </TabsList>
                
                <TabsContent value="todos" className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {getFilteredResults().map((item) => (
                      <MovieCard key={item.id} {...item} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="filmes" className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {getFilteredResults().map((item) => (
                      <MovieCard key={item.id} {...item} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="series" className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {getFilteredResults().map((item) => (
                      <MovieCard key={item.id} {...item} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-movieDark/80 flex items-center justify-center mb-6">
                <SearchIcon className="h-10 w-10 text-movieRed" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Nenhum resultado encontrado</h2>
              <p className="text-movieGray max-w-md">
                Não encontramos nenhum resultado para "{searchQuery}". Tente usar termos diferentes ou mais gerais.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-movieDark/80 flex items-center justify-center mb-6">
                <SearchIcon className="h-10 w-10 text-movieGray" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Busque seus filmes e séries favoritos</h2>
              <p className="text-movieGray max-w-md">
                Digite o título de um filme ou série para começar a buscar.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
