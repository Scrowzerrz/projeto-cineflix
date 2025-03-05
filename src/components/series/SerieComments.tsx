
interface SerieCommentsProps {
  serieId: string;
}

const SerieComments = ({ serieId }: SerieCommentsProps) => {
  return (
    <div className="text-center py-12 bg-movieDark/30 rounded-lg">
      <h3 className="text-white text-xl mb-2">Comentários em breve</h3>
      <p className="text-movieGray">Os comentários estarão disponíveis em breve para a série {serieId}.</p>
    </div>
  );
};

export default SerieComments;
