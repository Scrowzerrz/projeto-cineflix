
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilmeFormData, filmeSchema } from "@/schemas/filmeSchema";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { FilmeInfoBasica } from "./FilmeInfoBasica";
import { FilmeMetadados } from "./FilmeMetadados";
import { FilmeUrls } from "./FilmeUrls";
import { FilmeDescricao } from "./FilmeDescricao";
import { FilmeSubmitButtons } from "./FilmeSubmitButtons";

interface FilmeFormProps {
  onSuccess: () => void;
}

export function FilmeForm({ onSuccess }: FilmeFormProps) {
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tipo: 'movie'
        }] as any);

      if (error) throw error;

      toast.success("Filme adicionado com sucesso!");
      form.reset();
      onSuccess();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      toast.error("Erro ao adicionar filme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FilmeInfoBasica form={form} />
          <FilmeMetadados form={form} />
        </div>
        <FilmeUrls form={form} />
        <FilmeDescricao form={form} />
        <FilmeSubmitButtons loading={loading} onCancel={onSuccess} />
      </form>
    </Form>
  );
}
