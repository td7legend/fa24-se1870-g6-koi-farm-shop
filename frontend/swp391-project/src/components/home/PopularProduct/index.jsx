import { useState, useEffect } from "react";
import "./index.scss";
import Picture from "../../../images/picture-3.png";
import config from "../../../config/config";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Product from "../Product";

const PopularProduct = () => {
  const [products, setProducts] = useState([]);
  const { t } = useTranslation();
  const itemsPerPage = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState("");
  // sài tạm mốt co api thi update
  const fetchPopularProducts = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching popular products:", error);
    }
  };

  useEffect(() => {
    fetchPopularProducts();
  }, []);
  const nextProducts = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + itemsPerPage) % products.length;
        return newIndex;
      });
      setFade("fade__in");
    }, 300); // Match the CSS transition duration
  };

  const prevProducts = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex =
          (prevIndex - itemsPerPage + products.length) % products.length;
        return newIndex;
      });
      setFade("fade__in");
    }, 300); // Match the CSS transition duration
  };

  return (
    <section className="popular__product">
      <h2>{t("popularProducts")}</h2>
      <div className="popular__product__grid">
        <button className="nav__button left" onClick={prevProducts}>
          &lt;
        </button>
        <div
          className={`products__display ${fade}`}
          style={{ display: "flex", gap: "30px" }}
        >
          {products
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((topFish, index) => (
              <Product key={index} product={topFish} />
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
