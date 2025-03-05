
import { UseFormReturn } from "react-hook-form";
import { FilmeFormData, CATEGORIAS, QUALIDADES, GENEROS } from "@/schemas/filmeSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FilmeMetadadosProps {
  form: UseFormReturn<FilmeFormData>;
}

export function FilmeMetadados({ form }: FilmeMetadadosProps) {
  return (
    <>
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
    </>
  );
}
