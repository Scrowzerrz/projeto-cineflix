
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface SerieCommentsProps {
  serieId?: string;
}

const SerieComments = ({ serieId }: SerieCommentsProps) => {
  return (
    <Card className="bg-movieDark/30 border-white/5 backdrop-blur-sm text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-movieRed" />
          Comentários
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <h3 className="text-white text-xl mb-2">Comentários em breve</h3>
        <p className="text-movieGray">Os comentários estarão disponíveis em breve.</p>
        <p className="text-movieGray/70 text-sm mt-4">Compartilhe suas opiniões sobre esta série.</p>
      </CardContent>
    </Card>
  );
};

export default SerieComments;
