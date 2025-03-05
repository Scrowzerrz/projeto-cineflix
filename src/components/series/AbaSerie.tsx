
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AbaSerieProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AbaSerie = ({ activeTab, setActiveTab }: AbaSerieProps) => {
  return (
    <TabsList className="bg-movieDark/70 backdrop-blur-md mb-6 p-1 rounded-full border border-white/10">
      <TabsTrigger 
        value="assistir" 
        className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
      >
        Assistir
      </TabsTrigger>
      <TabsTrigger 
        value="temporadas" 
        className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
      >
        Episódios
      </TabsTrigger>
      <TabsTrigger 
        value="sobre" 
        className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
      >
        Sobre
      </TabsTrigger>
      <TabsTrigger 
        value="comentarios" 
        className="text-white data-[state=active]:bg-movieRed rounded-full py-2 px-4 transition-all duration-300"
      >
        Comentários
      </TabsTrigger>
    </TabsList>
  );
};

export default AbaSerie;
