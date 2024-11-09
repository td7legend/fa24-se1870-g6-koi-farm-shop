import { useState, useEffect } from "react";
import "./index.scss";
import Picture from "../../../images/picture-3.png";
import config from "../../../config/config";
import axios from "axios";
import { useTranslation } from "react-i18next";
import FishTypeCard from "../FishTypeCard";

const PopularProduct = () => {
  const [popularType, setPopularType] = useState([]);
  const { t } = useTranslation();
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const [fade, setFade] = useState("");

  const fetchPopularTypes = async () => {
    try {
      const response = await axios.get(
        `${config.API_ROOT}fishtypes/top-selling-fishtypes`
      );
      const data = response.data;
      setPopularType(data);
    } catch (error) {
      console.error("Error fetching popular products:", error);
    }
  };

  useEffect(() => {
    fetchPopularTypes();
  }, []);

  const maxPage = Math.max(0, Math.ceil(popularType.length / itemsPerPage) - 1);

  const nextProducts = () => {
    if (currentPage < maxPage) {
      setFade("fade__out");
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setFade("fade__in");
      }, 300);
    }
  };

  const prevProducts = () => {
    if (currentPage > 0) {
      setFade("fade__out");
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setFade("fade__in");
      }, 300);
    }
  };

  return (
    <section className="popular__product">
      <h2>{t("popularTypeFish")}</h2>
      <div className="popular__product__container">
        <button
          className="nav__button left"
          onClick={prevProducts}
          disabled={currentPage === 0}
        >
          &lt;
        </button>
        <div className={`products__display ${fade}`}>
          {popularType
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((fishType) => (
              <div key={fishType.fishTypeId} className="product-slot">
                <FishTypeCard fishType={fishType} />
              </div>
            ))}
        </div>
        <button
          className="nav__button right"
          onClick={nextProducts}
          disabled={currentPage >= maxPage}
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default PopularProduct;
