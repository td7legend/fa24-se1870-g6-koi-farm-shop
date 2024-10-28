import "./index.scss";

const ImageFrame = ({ imageSrc, breedName }) => (
  <div className="image-frame">
    <img src={imageSrc} alt={breedName || "Frame"} />
    <div className="breed-name">{breedName}</div>
  </div>
);

export default ImageFrame;
