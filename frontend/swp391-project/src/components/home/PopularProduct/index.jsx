import { useState } from "react";
import ProductCard from "../Product";
import "./index.scss";
import Picture from "../../../images/picture-3.png";

const PopularProduct = () => {
  const products = [
    { image: Picture, name: "Popular Koi 1", price: 25 },
    { image: Picture, name: "Popular Koi 2", price: 30 },
    { image: Picture, name: "Popular Koi 3", price: 35 },
    { image: Picture, name: "Popular Koi 4", price: 40 },
    { image: Picture, name: "Popular Koi 5", price: 50 },
    { image: Picture, name: "Popular Koi 6", price: 55 },
    { image: Picture, name: "Popular Koi 7", price: 60 },
    { image: Picture, name: "Popular Koi 8", price: 65 },
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
    <section className="popular__product">
      <h2>POPULAR PRODUCTS</h2>
      <div className="popular__product__grid">
        <button className="nav__button left" onClick={prevProducts}>
          &lt;
        </button>
        <div className={`popular_products__display ${fade}`}>
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

export default PopularProduct;
