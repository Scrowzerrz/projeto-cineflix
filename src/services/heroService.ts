
import { supabase } from "@/integrations/supabase/client";
import { HeroMovie } from './types/movieTypes';

// Função para buscar filme em destaque do Supabase
export const fetchHeroMovie = async (): Promise<HeroMovie> => {
  try {
    // Primeiro tentamos buscar um filme em destaque
    let { data, error } = await supabase
      .from('filmes')
      .select('*')
      .eq('destaque', true)
      .single();
    
    // Se não encontrarmos um filme em destaque, tentamos uma série em destaque
    if (error || !data) {
      const seriesResult = await supabase
        .from('series')
        .select('*')
        .eq('destaque', true)
        .single();
      
      if (seriesResult.error) {
        // Se não houver destaque em séries, buscamos qualquer filme
        const fallbackFilmes = await supabase
          .from('filmes')
          .select('*')
          .limit(1)
          .single();
          
        if (fallbackFilmes.error || !fallbackFilmes.data) {
          // Se não houver nenhum filme, buscamos qualquer série
          const fallbackSeries = await supabase
            .from('series')
            .select('*')
            .limit(1)
            .single();
            
          if (fallbackSeries.error || !fallbackSeries.data) {
            // Se não houver NADA no banco, aí sim mostramos um erro
            throw new Error('Nenhum filme ou série encontrado no banco de dados');
          }
          
          // Usamos uma série qualquer como destaque
          data = fallbackSeries.data;
        } else {
          // Usamos um filme qualquer como destaque
          data = fallbackFilmes.data;
        }
      } else {
        // Usamos a série em destaque
        data = seriesResult.data;
      }
    }
    
    if (!data) {
      throw new Error('Nenhum filme ou série encontrado');
    }
    
    return {
      title: data.titulo,
      description: data.descricao || 'Sem descrição disponível',
      imageUrl: data.poster_url,
      // Garante que 'tipo' seja 'movie' ou 'series'
      type: data.tipo === 'series' ? 'series' : 'movie',
      rating: data.avaliacao || '0.0',
      year: data.ano,
      duration: data.duracao || '0min'
    };
  } catch (error) {
    console.error('Erro ao buscar filme/série em destaque:', error);
    // Lançar o erro para tratamento na interface
    throw new Error('Não foi possível carregar conteúdo em destaque');
  }
};
