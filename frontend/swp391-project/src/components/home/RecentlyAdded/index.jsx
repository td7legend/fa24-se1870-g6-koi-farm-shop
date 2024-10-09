import React, { useState } from "react";
import ProductCard from "../Product";
import "./index.scss";
import Picture from "../../../images/picture-3.png";

const RecentlyAdded = () => {
  const products = [
    { image: Picture, name: "Koi Fish 1", price: 25 },
    { image: Picture, name: "Koi Fish 2", price: 30 },
    { image: Picture, name: "Koi Fish 3", price: 35 },
    { image: Picture, name: "Koi Fish 4", price: 40 },
    { image: Picture, name: "Koi Fish 5", price: 50 },
    { image: Picture, name: "Koi Fish 6", price: 55 },
    { image: Picture, name: "Koi Fish 7", price: 60 },
    { image: Picture, name: "Koi Fish 8", price: 65 },
  ];

  const itemsPerPage = 4; // Number of products to show at once
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState("");

  const nextProducts = () => {
    setFade("fade__out"); // Start fade-out effect
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsPerPage < products.length
          ? prevIndex + itemsPerPage
          : 0
      );
      setFade("fade__in"); // Start fade-in effect
    }, 300); // Duration of the fade-out animation
  };

  const prevProducts = () => {
    setFade("fade__out"); // Start fade-out effect
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsPerPage >= 0
          ? prevIndex - itemsPerPage
          : Math.floor(products.length / itemsPerPage) * itemsPerPage
      );
      setFade("fade__in"); // Start fade-in effect
    }, 300); // Duration of the fade-out animation
  };

  return (
    <section className="recently__added">
      <h2>New Fish</h2>
      <div className="product__grid__wrapper">
        <button className="nav__button left" onClick={prevProducts}>
          &lt;
        </button>
        <div className={`products__display ${fade}`}>
          {products
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
        <button className="nav__button right" onClick={nextProducts}>
          &gt;
        </button>
      </div>
    </section>
  );
};

export default RecentlyAdded;
