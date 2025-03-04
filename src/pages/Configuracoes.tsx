
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Shield, Bell, Eye, Monitor, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Configuracoes = () => {
  const { perfil } = useAuth();
  const navigate = useNavigate();

  const [salvandoGeral, setSalvandoGeral] = useState(false);
  const [salvandoPrivacidade, setSalvandoPrivacidade] = useState(false);
  const [salvandoNotificacoes, setSalvandoNotificacoes] = useState(false);

  // Estados para as configurações
  const [configuracoes, setConfiguracoes] = useState({
    tema: 'escuro',
    idioma: 'pt',
    qualidadeReproducao: 'auto',
    autoPlay: true,
    
    perfilPrivado: false,
    historicoPrivado: true,
    mostrarAtividade: true,
    
    notificarLancamentos: true,
    notificarAtualizacoesSeries: true,
    notificarRecomendacoes: false,
    notificarEmail: true
  });

  const handleChange = (name: string, value: string | boolean) => {
    setConfiguracoes(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvarGeral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoGeral(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Configurações gerais salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSalvandoGeral(false);
    }
  };

  const handleSalvarPrivacidade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoPrivacidade(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Configurações de privacidade salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de privacidade');
    } finally {
      setSalvandoPrivacidade(false);
    }
  };

  const handleSalvarNotificacoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoNotificacoes(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Configurações de notificações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações de notificações');
    } finally {
      setSalvandoNotificacoes(false);
    }
  };

  if (!perfil) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-movieDarkBlue pt-24 px-4 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Configurações</h1>
        
        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList className="bg-movieDark border-movieGray/20 grid w-full grid-cols-3">
            <TabsTrigger value="geral" className="text-white data-[state=active]:bg-movieRed">
              <Monitor className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="privacidade" className="text-white data-[state=active]:bg-movieRed">
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="text-white data-[state=active]:bg-movieRed">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>
          
          {/* Configurações Gerais */}
          <TabsContent value="geral">
            <Card className="bg-movieDark border-movieGray/20">
              <form onSubmit={handleSalvarGeral}>
                <CardHeader>
                  <CardTitle className="text-white">Configurações Gerais</CardTitle>
                  <CardDescription className="text-gray-400">
                    Personalize sua experiência no Cineflix
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="tema" className="text-white">Tema</Label>
                      <Select 
                        value={configuracoes.tema}
                        onValueChange={(value) => handleChange('tema', value)}
                      >
                        <SelectTrigger className="bg-movieDarkBlue border-movieGray/20 text-white">
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent className="bg-movieDark border-movieGray/20">
                          <SelectItem value="escuro" className="text-white hover:bg-movieGray/20">Escuro</SelectItem>
                          <SelectItem value="claro" className="text-white hover:bg-movieGray/20">Claro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idioma" className="text-white">Idioma</Label>
                      <Select 
                        value={configuracoes.idioma}
                        onValueChange={(value) => handleChange('idioma', value)}
                      >
                        <SelectTrigger className="bg-movieDarkBlue border-movieGray/20 text-white">
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                        <SelectContent className="bg-movieDark border-movieGray/20">
                          <SelectItem value="pt" className="text-white hover:bg-movieGray/20">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              Português
                            </div>
                          </SelectItem>
                          <SelectItem value="en" className="text-white hover:bg-movieGray/20">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              English
                            </div>
                          </SelectItem>
                          <SelectItem value="es" className="text-white hover:bg-movieGray/20">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              Español
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="qualidadeReproducao" className="text-white">Qualidade de Reprodução</Label>
                      <Select 
                        value={configuracoes.qualidadeReproducao}
                        onValueChange={(value) => handleChange('qualidadeReproducao', value)}
                      >
                        <SelectTrigger className="bg-movieDarkBlue border-movieGray/20 text-white">
                          <SelectValue placeholder="Selecione a qualidade" />
                        </SelectTrigger>
                        <SelectContent className="bg-movieDark border-movieGray/20">
                          <SelectItem value="auto" className="text-white hover:bg-movieGray/20">Automático</SelectItem>
                          <SelectItem value="baixa" className="text-white hover:bg-movieGray/20">Baixa (para economia de dados)</SelectItem>
                          <SelectItem value="media" className="text-white hover:bg-movieGray/20">Média</SelectItem>
                          <SelectItem value="alta" className="text-white hover:bg-movieGray/20">Alta (HD)</SelectItem>
                          <SelectItem value="ultra" className="text-white hover:bg-movieGray/20">Ultra (4K)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 pt-8">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoplay" className="text-white">Reprodução Automática</Label>
                        <p className="text-xs text-gray-400">Iniciar próximo episódio automaticamente</p>
                      </div>
                      <Switch
                        id="autoplay"
                        checked={configuracoes.autoPlay}
                        onCheckedChange={(checked) => handleChange('autoPlay', checked)}
                        className="data-[state=checked]:bg-movieRed"
                      />
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-movieRed hover:bg-red-700 text-white"
                    disabled={salvandoGeral}
                  >
                    {salvandoGeral ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          {/* Configurações de Privacidade */}
          <TabsContent value="privacidade">
            <Card className="bg-movieDark border-movieGray/20">
              <form onSubmit={handleSalvarPrivacidade}>
                <CardHeader>
                  <CardTitle className="text-white">Privacidade e Segurança</CardTitle>
                  <CardDescription className="text-gray-400">
                    Controle suas informações pessoais e de navegação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="perfilPrivado" className="text-white">Perfil Privado</Label>
                      <p className="text-xs text-gray-400">Seu perfil será visível apenas para você</p>
                    </div>
                    <Switch
                      id="perfilPrivado"
                      checked={configuracoes.perfilPrivado}
                      onCheckedChange={(checked) => handleChange('perfilPrivado', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="historicoPrivado" className="text-white">Histórico Privado</Label>
                      <p className="text-xs text-gray-400">Seu histórico de reprodução não será compartilhado</p>
                    </div>
                    <Switch
                      id="historicoPrivado"
                      checked={configuracoes.historicoPrivado}
                      onCheckedChange={(checked) => handleChange('historicoPrivado', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="mostrarAtividade" className="text-white">Mostrar Atividade</Label>
                      <p className="text-xs text-gray-400">Permitir que outros vejam quando você está online</p>
                    </div>
                    <Switch
                      id="mostrarAtividade"
                      checked={configuracoes.mostrarAtividade}
                      onCheckedChange={(checked) => handleChange('mostrarAtividade', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-movieRed hover:bg-red-700 text-white"
                    disabled={salvandoPrivacidade}
                  >
                    {salvandoPrivacidade ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Configurações'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          {/* Configurações de Notificações */}
          <TabsContent value="notificacoes">
            <Card className="bg-movieDark border-movieGray/20">
              <form onSubmit={handleSalvarNotificacoes}>
                <CardHeader>
                  <CardTitle className="text-white">Notificações</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie como e quando deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificarLancamentos" className="text-white">Novos Lançamentos</Label>
                      <p className="text-xs text-gray-400">Receber notificações sobre novos filmes</p>
                    </div>
                    <Switch
                      id="notificarLancamentos"
                      checked={configuracoes.notificarLancamentos}
                      onCheckedChange={(checked) => handleChange('notificarLancamentos', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificarAtualizacoesSeries" className="text-white">Novos Episódios</Label>
                      <p className="text-xs text-gray-400">Receber notificações sobre novos episódios de séries que você segue</p>
                    </div>
                    <Switch
                      id="notificarAtualizacoesSeries"
                      checked={configuracoes.notificarAtualizacoesSeries}
                      onCheckedChange={(checked) => handleChange('notificarAtualizacoesSeries', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificarRecomendacoes" className="text-white">Recomendações</Label>
                      <p className="text-xs text-gray-400">Receber notificações sobre conteúdos recomendados para você</p>
                    </div>
                    <Switch
                      id="notificarRecomendacoes"
                      checked={configuracoes.notificarRecomendacoes}
                      onCheckedChange={(checked) => handleChange('notificarRecomendacoes', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="notificarEmail" className="text-white">Resumo por Email</Label>
                      <p className="text-xs text-gray-400">Receber emails semanais com novidades</p>
                    </div>
                    <Switch
                      id="notificarEmail"
                      checked={configuracoes.notificarEmail}
                      onCheckedChange={(checked) => handleChange('notificarEmail', checked)}
                      className="data-[state=checked]:bg-movieRed"
                    />
                  </div>
                </CardContent>
                <div className="p-6 pt-0 flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-movieRed hover:bg-red-700 text-white"
                    disabled={salvandoNotificacoes}
                  >
                    {salvandoNotificacoes ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Notificações'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuracoes;
