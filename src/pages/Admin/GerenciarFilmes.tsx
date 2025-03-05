import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash2, Star, Eye, Film } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { FilmeDB } from '@/services/types/movieTypes';
import { NovoFilmeDialog } from '@/components/admin/filme/NovoFilmeDialog';
import { EditarFilmeDialog } from '@/components/admin/filme/EditarFilmeDialog';
import { VisualizarFilmeDialog } from '@/components/admin/filme/VisualizarFilmeDialog';

const GerenciarFilmes = () => {
  const [filmes, setFilmes] = useState<FilmeDB[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termo, setTermo] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    carregarFilmes();
  }, []);

  const carregarFilmes = async () => {
    setCarregando(true);
    
    try {
      let query = supabase
        .from('filmes')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setFilmes(data || []);
    } catch (erro) {
      console.error("Erro ao carregar filmes:", erro);
      toast.error("Erro ao carregar lista de filmes");
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`Tem certeza que deseja excluir o filme "${titulo}"?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('filmes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFilmes(filmes.filter(filme => filme.id !== id));
      toast.success(`Filme "${titulo}" excluído com sucesso`);
    } catch (erro) {
      console.error("Erro ao excluir filme:", erro);
      toast.error("Erro ao excluir filme");
    }
  };

  const filmesFiltrados = filmes.filter(filme => 
    filme.titulo.toLowerCase().includes(termo.toLowerCase())
  );

  const totalPaginas = Math.ceil(filmesFiltrados.length / itensPorPagina);
  const indiceFinal = paginaAtual * itensPorPagina;
  const indiceInicial = indiceFinal - itensPorPagina;
  const filmesPaginados = filmesFiltrados.slice(indiceInicial, indiceFinal);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Gerenciar Filmes</h2>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar filme..."
              className="pl-9 bg-movieDark border-gray-700"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />
          </div>
          
          <NovoFilmeDialog />
        </div>
      </div>
      
      <Card className="bg-movieDark border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-medium">Filme</th>
                <th className="text-left py-3 px-4 font-medium w-20">Ano</th>
                <th className="text-left py-3 px-4 font-medium w-24">Qualidade</th>
                <th className="text-left py-3 px-4 font-medium w-24">Avaliação</th>
                <th className="text-left py-3 px-4 font-medium w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3 px-4">
                      <div className="h-6 w-full bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-12 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-16 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-10 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-20 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filmesPaginados.length > 0 ? (
                filmesPaginados.map((filme) => (
                  <tr key={filme.id} className="border-b border-gray-800 hover:bg-movieDarkBlue/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4 text-movieRed" />
                        <span className="font-medium">{filme.titulo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{filme.ano}</td>
                    <td className="py-3 px-4">
                      {filme.qualidade && (
                        <span className="bg-movieRed px-2 py-0.5 text-xs font-medium rounded-sm">
                          {filme.qualidade}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-movieRed stroke-movieRed" />
                        <span>{filme.avaliacao || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <EditarFilmeDialog 
                          filme={filme} 
                          onSuccess={carregarFilmes} 
                        />
                        
                        <VisualizarFilmeDialog filme={filme} />
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 bg-red-600/20 hover:bg-red-600/40 text-red-400"
                          onClick={() => handleDelete(filme.id, filme.titulo)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                    Nenhum filme encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filmesFiltrados.length > itensPorPagina && (
          <div className="flex items-center justify-between border-t border-gray-800 p-4">
            <div className="text-sm text-gray-400">
              Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, filmesFiltrados.length)} de {filmesFiltrados.length}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700"
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(paginaAtual - 1)}
              >
                Anterior
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(paginaAtual + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GerenciarFilmes;
