import "./index.scss";

const ImageFrame = ({ imageSrc }) => (
  <div className="image-frame">
    <img src={imageSrc} alt="Frame" />
  </div>
);

export default ImageFrame;
