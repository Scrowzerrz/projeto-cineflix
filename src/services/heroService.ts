
import { supabase } from "@/integrations/supabase/client";
import { HeroMovie, FilmeDB } from './types/movieTypes';
import { serieToFilmeDB } from "./utils/movieUtils";

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
          
          // Convertemos os dados da série para o formato FilmeDB
          data = serieToFilmeDB(fallbackSeries.data);
        } else {
          // Se encontrarmos um filme, garantimos que todos os campos estejam presentes
          data = {
            ...fallbackFilmes.data,
            avaliacao: fallbackFilmes.data.avaliacao || '0.0',
            categoria: fallbackFilmes.data.categoria || '',
            descricao: fallbackFilmes.data.descricao || '',
            destaque: fallbackFilmes.data.destaque || false,
            diretor: fallbackFilmes.data.diretor || '',
            duracao: fallbackFilmes.data.duracao || '',
            elenco: fallbackFilmes.data.elenco || '',
            generos: fallbackFilmes.data.generos || [],
            idioma: fallbackFilmes.data.idioma || '',
            player_url: fallbackFilmes.data.player_url || '',
            produtor: fallbackFilmes.data.produtor || '',
            tipo: fallbackFilmes.data.tipo || 'movie',
            trailer_url: fallbackFilmes.data.trailer_url || ''
          } as FilmeDB;
        }
      } else {
        // Usamos a série em destaque, convertendo para o formato FilmeDB
        data = serieToFilmeDB(seriesResult.data);
      }
    } else {
      // Se encontrarmos um filme em destaque, garantimos que todos os campos estejam presentes
      data = {
        ...data,
        avaliacao: data.avaliacao || '0.0',
        categoria: data.categoria || '',
        descricao: data.descricao || '',
        destaque: data.destaque || false,
        diretor: data.diretor || '',
        duracao: data.duracao || '',
        elenco: data.elenco || '',
        generos: data.generos || [],
        idioma: data.idioma || '',
        player_url: data.player_url || '',
        produtor: data.produtor || '',
        tipo: data.tipo || 'movie',
        trailer_url: data.trailer_url || ''
      } as FilmeDB;
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
