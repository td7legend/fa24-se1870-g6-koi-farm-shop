import React, { useState } from "react";
import ProductCard from "../../product-card";
import "./index.scss";
import Picture from "../../../images/picture-3.png";

const RecentlyAdded = () => {
  const products = [
    {
      id: 1,
      img_path: Picture,
      name: "Koi Fish 1",
      price: 25,
      origin: "Japan",
      size: 30,
      description: "A beautiful koi fish with vibrant colors.",
    },
    {
      id: 2,
      img_path: Picture,
      name: "Koi Fish 2",
      price: 30,
      origin: "Japan",
      size: 35,
      description:
        "A striking koi fish with unique patterns. A striking koi fish with unique patterns. A striking koi fish with unique patterns. A striking koi fish with unique patterns.",
    },
    {
      id: 3,
      img_path: Picture,
      name: "Koi Fish 3",
      price: 35,
      origin: "Japan",
      size: 40,
      description: "An elegant koi fish with smooth scales.",
    },
    {
      id: 4,
      img_path: Picture,
      name: "Koi Fish 4",
      price: 40,
      origin: "Japan",
      size: 25,
      description: "A graceful koi fish with bold patterns.",
    },
    {
      id: 5,
      img_path: Picture,
      name: "Koi Fish 5",
      price: 50,
      origin: "Japan",
      size: 50,
      description: "A majestic koi fish with a radiant glow.",
    },
    {
      id: 6,
      img_path: Picture,
      name: "Koi Fish 6",
      price: 55,
      origin: "Japan",
      size: 45,
      description: "A koi fish with delicate fins and a serene presence.",
    },
    {
      id: 7,
      img_path: Picture,
      name: "Koi Fish 7",
      price: 60,
      origin: "Japan",
      size: 55,
      description: "A koi fish with remarkable color transitions.",
    },
    {
      id: 8,
      img_path: Picture,
      name: "Koi Fish 8",
      price: 65,
      origin: "Japan",
      size: 60,
      description: "A stunning koi fish with flawless features.",
    },
  ];

  const itemsPerPage = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState("");

  const nextProducts = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsPerPage < products.length
          ? prevIndex + itemsPerPage
          : 0
      );
      setFade("fade__in");
    }, 300);
  };

  const prevProducts = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsPerPage >= 0
          ? prevIndex - itemsPerPage
          : Math.floor(products.length / itemsPerPage) * itemsPerPage
      );
      setFade("fade__in");
    }, 300);
  };

  return (
    <section className="recently__added">
      <h2>NEW FISH</h2>
      <div className="product__grid__wrapper">
        <button className="nav__button left" onClick={prevProducts}>
          &lt;
        </button>
        <div className={`products__display ${fade}`}>
          {products
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((product, index) => (
              <div className="product__container" key={index}>
                <ProductCard fish={product} />
              </div>
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
