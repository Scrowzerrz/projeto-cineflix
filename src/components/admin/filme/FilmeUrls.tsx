
import { UseFormReturn } from "react-hook-form";
import { FilmeFormData } from "@/schemas/filmeSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FilmeUrlsProps {
  form: UseFormReturn<FilmeFormData>;
}

export function FilmeUrls({ form }: FilmeUrlsProps) {
  return (
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
            <FormMessage className="text-xs">
              Cole a URL completa do iframe do trailer (YouTube, Vimeo, etc.)
            </FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="player_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Player Externo *</FormLabel>
            <FormControl>
              <Input placeholder='<iframe src="https://filemoon.to/e/..." ...' {...field} />
            </FormControl>
            <FormMessage className="text-xs">
              Cole aqui o código iframe completo do player externo (exemplo: &lt;iframe src="https://filemoon.to/e/..."&gt;&lt;/iframe&gt;) 
              ou apenas a URL direta (exemplo: https://filemoon.to/e/...)
            </FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
