
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

const SerieComentarios = () => {
  const [reacao, setReacao] = useState<string | null>(null);
  
  const reacoes = [
    { id: 'gostei', emoji: '👍', nome: 'Gostei' },
    { id: 'engracado', emoji: '😂', nome: 'Engraçado' },
    { id: 'amei', emoji: '😍', nome: 'Amei' },
    { id: 'surpreso', emoji: '😮', nome: 'Surpreso' },
    { id: 'bravo', emoji: '😠', nome: 'Bravo' },
    { id: 'triste', emoji: '😢', nome: 'Triste' }
  ];

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-white text-xl font-bold flex items-center mb-6">
        <MessageSquare className="h-5 w-5 mr-2" />
        DEIXE SEU COMENTÁRIO
      </h2>
      
      <div className="bg-[#0a1117] p-6 rounded-md">
        {/* Reações */}
        <div className="mb-8">
          <h3 className="text-center text-white mb-4">Qual sua reação?</h3>
          <p className="text-center text-gray-400 text-sm mb-4">7 Respostas</p>
          
          <div className="flex justify-center gap-6 flex-wrap">
            {reacoes.map((item) => (
              <button
                key={item.id}
                onClick={() => setReacao(item.id)}
                className={`flex flex-col items-center gap-2 transition-transform ${
                  reacao === item.id ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className={`text-xs ${reacao === item.id ? 'text-[#0197f6]' : 'text-gray-400'}`}>
                  {item.nome}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Formulário de comentário */}
        <div className="mt-6">
          <div className="bg-[#0f1721] rounded-md p-4 mb-4">
            <Textarea
              placeholder="Escreva seu comentário aqui..."
              className="bg-transparent border-none resize-none focus-visible:ring-0 text-white min-h-20"
            />
            <div className="flex justify-end mt-2">
              <Button className="bg-[#0197f6] hover:bg-[#0186d9] text-white">
                Enviar
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center py-6">
            <p className="text-white text-lg mb-2">0 Comentários</p>
            <p className="text-gray-400">Seja o primeiro a comentar!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerieComentarios;
