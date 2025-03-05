
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Shield, UserCircle, Trash2, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface Usuario {
  id: string;
  nome: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  eh_admin: boolean;
}

const GerenciarUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termo, setTermo] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setCarregando(true);
    
    try {
      console.log("Carregando usuários do sistema...");
      
      // Buscar perfis de usuários com ordenação e sem limites
      const { data: perfis, error: erroPerf } = await supabase
        .from('perfis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (erroPerf) {
        console.error("Erro ao buscar perfis:", erroPerf);
        throw erroPerf;
      }
      
      console.log(`Encontrados ${perfis?.length || 0} perfis de usuários`);
      
      if (!perfis || perfis.length === 0) {
        setUsuarios([]);
        setCarregando(false);
        return;
      }
      
      // Buscar função de admin para cada usuário
      const usuariosComPapel = await Promise.all(
        perfis.map(async (perfil) => {
          try {
            const { data: ehAdmin, error: erroAdmin } = await supabase
              .rpc('tem_papel', { 
                usuario_id: perfil.id, 
                tipo_papel_param: 'admin' 
              });
            
            if (erroAdmin) {
              console.error(`Erro ao verificar papel admin para usuário ${perfil.id}:`, erroAdmin);
              return {
                ...perfil,
                eh_admin: false
              };
            }
            
            return {
              ...perfil,
              eh_admin: ehAdmin || false
            };
          } catch (erro) {
            console.error(`Erro ao processar usuário ${perfil.id}:`, erro);
            return {
              ...perfil,
              eh_admin: false
            };
          }
        })
      );
      
      console.log(`Processados ${usuariosComPapel.length} usuários com seus papéis`);
      setUsuarios(usuariosComPapel);
    } catch (erro) {
      console.error("Erro ao carregar usuários:", erro);
      toast.error("Erro ao carregar lista de usuários");
    } finally {
      setCarregando(false);
    }
  };

  const alternarAdmin = async (usuario: Usuario) => {
    try {
      setCarregando(true);
      
      if (usuario.eh_admin) {
        // Remover papel de admin
        const { error } = await supabase
          .from('papeis_usuario')
          .delete()
          .eq('user_id', usuario.id)
          .eq('papel', 'admin');
        
        if (error) throw error;
        
        toast.success(`Permissões de admin removidas para ${usuario.nome || usuario.email}`);
      } else {
        // Adicionar papel de admin
        const { error } = await supabase
          .from('papeis_usuario')
          .insert({
            user_id: usuario.id,
            papel: 'admin'
          });
        
        if (error) throw error;
        
        toast.success(`Permissões de admin concedidas para ${usuario.nome || usuario.email}`);
      }
      
      // Atualizar lista de usuários
      await carregarUsuarios();
    } catch (erro) {
      console.error("Erro ao alterar permissões:", erro);
      toast.error("Erro ao alterar permissões de administrador");
    } finally {
      setCarregando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    (usuario.nome?.toLowerCase().includes(termo.toLowerCase()) || 
    usuario.email.toLowerCase().includes(termo.toLowerCase()))
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const indiceFinal = paginaAtual * itensPorPagina;
  const indiceInicial = indiceFinal - itensPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicial, indiceFinal);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar usuário..."
              className="pl-9 bg-movieDark border-gray-700"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Card className="bg-movieDark border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-medium">Usuário</th>
                <th className="text-left py-3 px-4 font-medium w-48">Email</th>
                <th className="text-left py-3 px-4 font-medium w-36">Cadastrado em</th>
                <th className="text-left py-3 px-4 font-medium w-32">Admin</th>
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
                      <div className="h-6 w-full bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-full bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-10 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-6 w-20 bg-gray-700 animate-pulse rounded"></div>
                    </td>
                  </tr>
                ))
              ) : usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-gray-800 hover:bg-movieDarkBlue/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{usuario.nome || 'Sem nome'}</span>
                        {usuario.eh_admin && (
                          <Shield className="h-4 w-4 text-movieRed fill-movieRed" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{usuario.email}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`admin-${usuario.id}`}
                          checked={usuario.eh_admin}
                          onCheckedChange={() => alternarAdmin(usuario)}
                          disabled={carregando}
                          className="data-[state=checked]:bg-movieRed"
                        />
                        <Label 
                          htmlFor={`admin-${usuario.id}`}
                          className="text-xs text-gray-400"
                        >
                          {usuario.eh_admin ? 'Ativo' : 'Inativo'}
                        </Label>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-700 gap-1"
                          >
                            <span>Ações</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="bg-movieDark border border-gray-700"
                        >
                          <DropdownMenuItem 
                            className="hover:bg-movieDarkBlue cursor-pointer flex items-center gap-2"
                          >
                            <UserCircle className="h-4 w-4" />
                            <span>Ver perfil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="hover:bg-red-900/30 text-red-400 cursor-pointer flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Excluir conta</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-gray-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        {usuariosFiltrados.length > itensPorPagina && (
          <div className="flex items-center justify-between border-t border-gray-800 p-4">
            <div className="text-sm text-gray-400">
              Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, usuariosFiltrados.length)} de {usuariosFiltrados.length}
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

export default GerenciarUsuarios;
