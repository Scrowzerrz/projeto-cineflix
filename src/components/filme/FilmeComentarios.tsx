
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const FilmeComentarios = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-gray-500" />
          </div>
          <h3 className="text-white text-lg font-medium">Deixe seu comentário</h3>
        </div>
        
        <Textarea 
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white resize-none h-24 placeholder:text-gray-500"
          placeholder="Escreva o que achou deste filme..."
        />
        
        <div className="flex justify-end mt-3">
          <Button className="bg-movieRed hover:bg-movieRed/90">Enviar Comentário</Button>
        </div>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
            <span className="text-white font-medium">U</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Usuário</h4>
              <span className="text-gray-500 text-sm">há 2 dias</span>
            </div>
            
            <p className="text-gray-300 mt-2">Este é um exemplo de comentário. Em breve, você poderá interagir com outros usuários.</p>
            
            <div className="flex items-center gap-4 mt-3">
              <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-gray-300">
                <Heart className="h-4 w-4" /> 12
              </button>
              <button className="text-gray-500 text-sm hover:text-gray-300">Responder</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmeComentarios;
