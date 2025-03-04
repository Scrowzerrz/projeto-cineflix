
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard, { MovieCardProps } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - reusing from Index.tsx
const moviesData: MovieCardProps[] = [
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
  {
    id: '4',
    title: 'O Macaco',
    posterUrl: 'https://images.unsplash.com/photo-1540125895252-edefe1ac41ad?q=80&w=987&auto=format&fit=crop',
    year: '2023',
    duration: '98min',
    quality: 'LEG'
  },
  {
    id: '5',
    title: 'O Homem do Saco',
    posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1170&auto=format&fit=crop',
    year: '2024',
    duration: '93min',
    quality: 'HD'
  },
  {
    id: '6',
    title: 'A Casa Vazia',
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1170&auto=format&fit=crop',
    year: '2023',
    duration: '105min',
    quality: 'DUB'
  },
  {
    id: '7',
    title: 'Águas Profundas',
    posterUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1332&auto=format&fit=crop',
    year: '2024',
    duration: '110min',
    quality: 'LEG'
  },
  {
    id: '8',
    title: 'Ameaça Invisível',
    posterUrl: 'https://images.unsplash.com/photo-1559108318-39ed452bb6c9?q=80&w=988&auto=format&fit=crop',
    year: '2023',
    duration: '124min',
    quality: 'HD'
  },
  {
    id: '9',
    title: 'Venom: O Último Dançarino',
    posterUrl: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1170&auto=format&fit=crop',
    year: '2024',
    duration: '112min',
    quality: 'CAM'
  },
  {
    id: '10',
    title: 'A Incrível História de Henry Sugar',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1170&auto=format&fit=crop',
    year: '2023',
    duration: '85min',
    quality: 'HD'
  },
  {
    id: '11',
    title: 'Planeta dos Macacos: O Reinado',
    posterUrl: 'https://images.unsplash.com/photo-1533732457507-2a9d5165f9c2?q=80&w=1170&auto=format&fit=crop',
    year: '2024',
    duration: '147min',
    quality: 'DUB'
  },
  {
    id: '12',
    title: 'O Ultimato',
    posterUrl: 'https://images.unsplash.com/photo-1540125895252-edefe1ac41ad?q=80&w=987&auto=format&fit=crop',
    year: '2023',
    duration: '128min',
    quality: 'HD'
  }
];

const genres = [
  'Todos', 'Ação', 'Aventura', 'Animação', 'Comédia', 'Crime', 'Documentário', 
  'Drama', 'Família', 'Fantasia', 'História', 'Horror', 'Música', 'Mistério', 
  'Romance', 'Ficção Científica', 'Thriller', 'Guerra', 'Faroeste'
];

const Movies = () => {
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedYear, setSelectedYear] = useState('Todos');
  
  // Simulating filtered movies
  const filteredMovies = moviesData;
  
  return (
    <div className="min-h-screen bg-movieDarkBlue">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 pt-4">Filmes</h1>
          
          <Tabs defaultValue="populares" className="w-full mb-8">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} {...movie} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="lancamentos" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.slice(0, 6).map((movie) => (
                  <MovieCard key={movie.id} {...movie} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="top-rated" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.slice(6, 12).map((movie) => (
                  <MovieCard key={movie.id} {...movie} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="proximos" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.slice(3, 9).map((movie) => (
                  <MovieCard key={movie.id} {...movie} />
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

export default Movies;
