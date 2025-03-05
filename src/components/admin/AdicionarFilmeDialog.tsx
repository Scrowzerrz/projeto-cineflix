
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilmeFormData, filmeSchema, CATEGORIAS, QUALIDADES, GENEROS } from "@/schemas/filmeSchema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdicionarFilmeDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FilmeFormData>({
    resolver: zodResolver(filmeSchema),
    defaultValues: {
      destaque: false,
      generos: [],
    },
  });

  const onSubmit = async (data: FilmeFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('filmes')
        .insert([{
          ...data,
          tipo: 'movie',
        }]);

      if (error) throw error;

      toast.success("Filme adicionado com sucesso!");
      setOpen(false);
      form.reset();
      // Recarregar a lista de filmes
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      toast.error("Erro ao adicionar filme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-movieRed hover:bg-red-700 gap-1">
          <Plus className="h-4 w-4" />
          <span>Novo Filme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Filme</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do filme. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do filme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ano */}
              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano *</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duração */}
              <FormField
                control={form.control}
                name="duracao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração *</FormLabel>
                    <FormControl>
                      <Input placeholder="2h 30min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Selecione uma categoria</option>
                        {CATEGORIAS.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Qualidade */}
              <FormField
                control={form.control}
                name="qualidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualidade *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Selecione a qualidade</option>
                        {QUALIDADES.map((qualidade) => (
                          <option key={qualidade} value={qualidade}>
                            {qualidade}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gêneros */}
              <FormField
                control={form.control}
                name="generos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gêneros *</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        multiple
                        value={field.value}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value);
                          field.onChange(values);
                        }}
                      >
                        {GENEROS.map((genero) => (
                          <option key={genero} value={genero}>
                            {genero}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Diretor */}
              <FormField
                control={form.control}
                name="diretor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diretor *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do diretor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Elenco */}
              <FormField
                control={form.control}
                name="elenco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Elenco *</FormLabel>
                    <FormControl>
                      <Input placeholder="Atores principais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Produtor */}
              <FormField
                control={form.control}
                name="produtor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produtor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produtor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Idioma */}
              <FormField
                control={form.control}
                name="idioma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma *</FormLabel>
                    <FormControl>
                      <Input placeholder="Português, Inglês, etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Avaliação */}
              <FormField
                control={form.control}
                name="avaliacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avaliação</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="10" placeholder="8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URLs em tela cheia */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="poster_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Poster *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trailer_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Trailer</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="player_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Player *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição em tela cheia */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite a sinopse do filme..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Destaque */}
            <FormField
              control={form.control}
              name="destaque"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Destacar este filme na página inicial
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Adicionar Filme'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
