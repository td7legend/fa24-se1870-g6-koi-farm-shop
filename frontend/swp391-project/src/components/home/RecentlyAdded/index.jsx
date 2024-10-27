import React, { useState, useEffect } from "react";
import "./index.scss";
import axios from "axios";
import config from "../../../config/config";
import ProductCard from "../Product";
import { useTranslation } from "react-i18next";

const RecentlyAdded = () => {
  const [newFishes, setNewFishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(""); // For CSS animations
  const itemsPerPage = 4; // Number of products to show at once
  const itemsToShow = 8; // Number of products to fetch
  const { t } = useTranslation();
  const fetchRecentlyAdded = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
      // Only take the last 8 items and reverse them
      setNewFishes(response.data.slice(-itemsToShow).reverse());
    } catch (error) {
      console.error("Error fetching fishs:", error);
    }
  };

  useEffect(() => {
    fetchRecentlyAdded();
  }, []);

  const nextProducts = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % itemsToShow);
      setFade("fade__in");
    }, 300);
  };

  const prevProducts = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - itemsPerPage + itemsToShow) % itemsToShow
      );
      setFade("fade__in");
    }, 300);
  };

  return (
    <section className="recently__added">
      <h2>{t("newFish")}</h2>
      <div className="product__grid__wrapper">
        <button className="nav__button left" onClick={prevProducts}>
          &lt;
        </button>
        <div className={`products__display ${fade}`}>
          {newFishes
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((newFish, index) => (
              <ProductCard key={index} product={newFish} />
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
