
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FilmeSubmitButtonsProps {
  loading: boolean;
  onCancel: () => void;
}

export function FilmeSubmitButtons({ loading, onCancel }: FilmeSubmitButtonsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
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
  );
}
