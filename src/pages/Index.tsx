
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import { MovieCardProps } from '@/components/MovieCard';

// Mock data for demonstration
const heroMovie = {
  title: "REACHER",
  description: "Quando o investigador militar Jack Reacher é preso por um crime que não cometeu, ele se vê no meio de uma conspiração mortal cheia de policiais corruptos, empresários obscuros e políticos conspiradores.",
  imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop", 
  type: 'series' as const
};

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
  }
];

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
  }
];

const categories = ['LANÇAMENTOS', 'RECENTES', 'MAIS VISTOS', 'EM ALTA'];
const seriesCategories = ['NOVOS EPISÓDIOS', 'RECENTES', 'MAIS VISTOS', 'EM ALTA'];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeSeriesCategory, setActiveSeriesCategory] = useState(seriesCategories[0]);

  return (
    <div className="min-h-screen bg-movieDarkBlue">
      <Navbar />
      
      <main>
        <Hero 
          title={heroMovie.title} 
          description={heroMovie.description} 
          imageUrl={heroMovie.imageUrl} 
          type={heroMovie.type}
        />
        
        <div className="py-4">
          <MovieRow 
            title="Filmes" 
            movies={moviesData}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          
          <MovieRow 
            title="Séries" 
            movies={seriesData}
            categories={seriesCategories}
            activeCategory={activeSeriesCategory}
            onCategoryChange={setActiveSeriesCategory}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
