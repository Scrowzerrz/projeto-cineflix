
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard, { MovieCardProps } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const seriesData: MovieCardProps[] = [
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
  },
  {
    id: '13',
    title: 'What If...?',
    posterUrl: 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?q=80&w=1170&auto=format&fit=crop',
    year: '2021',
    duration: '34min',
    type: 'series',
    quality: 'LEG'
  },
  {
    id: '14',
    title: 'The Last of Us',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop',
    year: '2023',
    duration: '55min',
    type: 'series',
    quality: 'DUB'
  },
  {
    id: '15',
    title: 'Stranger Things',
    posterUrl: 'https://images.unsplash.com/photo-1626814026159-abcddac314ab?q=80&w=2070&auto=format&fit=crop',
    year: '2022',
    duration: '55min',
    type: 'series',
    quality: 'HD'
  },
  {
    id: '16',
    title: 'Game of Thrones',
    posterUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1035&auto=format&fit=crop',
    year: '2011',
    duration: '60min',
    type: 'series',
    quality: 'HD'
  },
  {
    id: '17',
    title: 'The Witcher',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop',
    year: '2019',
    duration: '60min',
    type: 'series',
    quality: 'HD'
  },
  {
    id: '18',
    title: 'Breaking Bad',
    posterUrl: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1176&auto=format&fit=crop',
    year: '2008',
    duration: '49min',
    type: 'series',
    quality: 'HD'
  },
  {
    id: '19',
    title: 'Arcane',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop',
    year: '2021',
    duration: '45min',
    type: 'series',
    quality: 'DUB'
  },
  {
    id: '20',
    title: 'Dark',
    posterUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop',
    year: '2017',
    duration: '60min',
    type: 'series',
    quality: 'LEG'
  },
  {
    id: '21',
    title: 'Reacher',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
    year: '2022',
    duration: '50min',
    type: 'series',
    quality: 'DUB'
  }
];

const genres = [
  'Todos', 'Ação', 'Aventura', 'Animação', 'Comédia', 'Crime', 'Documentário', 
  'Drama', 'Família', 'Fantasia', 'História', 'Horror', 'Música', 'Mistério', 
  'Romance', 'Ficção Científica', 'Thriller', 'Guerra'
];

const Series = () => {
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedYear, setSelectedYear] = useState('Todos');
  
  // Simulating filtered series
  const filteredSeries = seriesData;
  
  return (
    <div className="min-h-screen bg-movieDarkBlue">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 pt-4">Séries</h1>
          
          <Tabs defaultValue="populares" className="w-full mb-8">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredSeries.map((series) => (
                  <MovieCard key={series.id} {...series} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recentes" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredSeries.slice(0, 6).map((series) => (
                  <MovieCard key={series.id} {...series} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="top-rated" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredSeries.slice(6, 12).map((series) => (
                  <MovieCard key={series.id} {...series} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="novas-temporadas" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredSeries.slice(3, 9).map((series) => (
                  <MovieCard key={series.id} {...series} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mt-10">
            <Button className="bg-movieRed hover:bg-movieRed/90">Carregar Mais</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Series;
