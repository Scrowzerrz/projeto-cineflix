
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Camera } from 'lucide-react';

const Perfil = () => {
  const { perfil, refreshPerfil } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState(perfil?.nome || '');
  const [carregando, setCarregando] = useState(false);
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!perfil) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    try {
      setCarregando(true);
      
      const { error } = await supabase
        .from('perfis')
        .update({ nome })
        .eq('id', perfil.id);
      
      if (error) {
        throw error;
      }
      
      await refreshPerfil();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setCarregando(false);
    }
  };

  const handleImagemUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !perfil) return;
    
    try {
      setCarregandoImagem(true);
      
      // Verificar tipo de arquivo e tamanho
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo de 2MB.');
        return;
      }
      
      // Gerar nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${perfil.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatares/${fileName}`;
      
      // Fazer upload para o Storage
      const { error: uploadError } = await supabase
        .storage
        .from('perfis')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Obter URL pública do arquivo
      const { data } = supabase
        .storage
        .from('perfis')
        .getPublicUrl(filePath);
      
      // Atualizar perfil do usuário com a nova URL
      const { error: updateError } = await supabase
        .from('perfis')
        .update({ avatar_url: data.publicUrl })
        .eq('id', perfil.id);
      
      if (updateError) {
        throw updateError;
      }
      
      await refreshPerfil();
      toast.success('Imagem de perfil atualizada!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao atualizar imagem de perfil');
    } finally {
      setCarregandoImagem(false);
    }
  };

  if (!perfil) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-movieDarkBlue pt-24 px-4 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Seu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna de avatar */}
          <Card className="bg-movieDark border-movieGray/20">
            <CardHeader>
              <CardTitle className="text-white">Foto de Perfil</CardTitle>
              <CardDescription className="text-gray-400">
                Sua foto pública no Cineflix
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-2 border-white/10">
                  <AvatarImage src={perfil.avatar_url || ''} />
                  <AvatarFallback className="bg-movieRed text-white text-3xl">
                    {perfil.nome ? perfil.nome.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute -bottom-2 -right-2 p-2 bg-movieRed text-white rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                >
                  {carregandoImagem ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImagemUpload}
                    disabled={carregandoImagem}
                  />
                </label>
              </div>
              <p className="text-center text-sm text-gray-400 max-w-xs">
                Clique no ícone da câmera para alterar sua foto. Imagens menores que 2MB.
              </p>
            </CardContent>
          </Card>
          
          {/* Coluna de informações */}
          <Card className="bg-movieDark border-movieGray/20 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-white">Informações da Conta</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">Nome</Label>
                  <Input 
                    id="nome" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)}
                    className="bg-movieDarkBlue border-movieGray/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input 
                    id="email" 
                    value={perfil.email} 
                    disabled
                    className="bg-movieDarkBlue/50 border-movieGray/20 text-gray-400"
                  />
                  <p className="text-xs text-gray-500">
                    O email não pode ser alterado
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-movieRed hover:bg-red-700 text-white"
                  disabled={carregando}
                >
                  {carregando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
