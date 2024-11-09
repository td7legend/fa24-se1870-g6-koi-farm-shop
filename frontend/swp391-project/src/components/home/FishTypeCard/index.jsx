import { Link } from "react-router-dom";
import "./index.scss";

const FishTypeCard = ({ fishType }) => {
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/fishTypes%2F${fishType.fishTypeName}.jpg?alt=media`;

  return (
    <Link to={`/breed/${fishType.fishTypeId}`} className="fish-type-card">
      <div className="fish-type-image">
        <img src={imageUrl} alt={fishType.fishTypeName} />
      </div>
      <h3 className="fish-type-name">{fishType.fishTypeName}</h3>
    </Link>
  );
};

export default FishTypeCard;
