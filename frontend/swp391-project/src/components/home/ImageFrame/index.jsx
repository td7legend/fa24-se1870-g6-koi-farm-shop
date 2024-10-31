import "./index.scss";

const ImageFrame = ({ imageSrc, breedName }) => (
  <div className="image-frame">
    <img src={imageSrc} />
  </div>
);

export default ImageFrame;
