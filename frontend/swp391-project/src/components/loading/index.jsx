import React from "react";
import "./index.scss";
import Picture from "../../images/fish-around.png";
const LoadingKoi = () => {
  return (
    <div className="loading-container">
      <img src={Picture} alt="Loading Koi" className="koi-image" />
      <p>Loading...</p>
    </div>
  );
};

export default LoadingKoi;
