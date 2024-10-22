import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/product-card";
import "./index.scss";
import { Link } from "react-router-dom";
import { Breadcrumb, Col } from "antd";
import ImageFrame from "../../components/home/ImageFrame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ogonImage from "../../images/ogon.jpg";
import ochibaImage from "../../images/ochiba.jpg";
import kujakuImage from "../../images/kujaku.jpg";
import kohakuImage from "../../images/kohaku.jpg";

const fishImages = {
  Ogon: ogonImage,
  Ochiba: ochibaImage,
  Kujaku: kujakuImage,
  kohaku: kohakuImage,
};

const AllFishPage = () => {
  const [allFish, setAllFish] = useState([]);
  const [fishByBreed, setFishByBreed] = useState({});
  const [currentPage, setCurrentPage] = useState({});

  const itemsPerPage = 4;

  const fetchAllFish = async () => {
    const response = await axios.get(
      "https://66fe08fb699369308956d74e.mockapi.io/KoiProduct"
    );
    const fishData = response.data;
    setAllFish(fishData);
    categorizeFishByBreed(fishData);
  };

  const categorizeFishByBreed = (fishData) => {
    const breedMap = fishData.reduce((acc, fish) => {
      const breed = fish.breed;
      if (!acc[breed]) {
        acc[breed] = [];
      }
      acc[breed].push(fish);
      return acc;
    }, {});
    setFishByBreed(breedMap);

    const initialPageState = {};
    Object.keys(breedMap).forEach((breed) => {
      initialPageState[breed] = 1;
    });
    setCurrentPage(initialPageState);
  };

  useEffect(() => {
    fetchAllFish();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add("visible");
      }, index * 200);
    });
  }, [allFish]);

  const handlePageChange = (breed, direction) => {
    setCurrentPage((prevState) => {
      const newPage = prevState[breed] + direction;
      if (
        newPage < 1 ||
        newPage > Math.ceil(fishByBreed[breed].length / itemsPerPage)
      ) {
        return prevState;
      }
      return {
        ...prevState,
        [breed]: newPage,
      };
    });
  };

  return (
    <div className="all-fish-page-container">
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-page">
              Product List
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>

      {Object.keys(fishByBreed).map((breed, index) => {
        const breedFish = fishByBreed[breed];
        const currentPageForBreed = currentPage[breed] || 1;

        const startIndex = (currentPageForBreed - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const fishToDisplay = breedFish.slice(startIndex, endIndex);

        const imageSrc = fishImages[breed] || "default_image_link";

        return (
          <div
            key={breed}
            className="all-fish-page fade-in-section"
            style={{ marginBottom: "50px" }}
          >
            <ImageFrame imageSrc={imageSrc} />
            <Link to={`/breed/${breed}`} className="breed-link">
              <h2 className="breed-title">{breed}</h2>
            </Link>

            <div className="fish-list">
              <button
                className="nav__button left"
                onClick={() => handlePageChange(breed, -1)}
                disabled={currentPageForBreed === 1}
              >
                &lt;
              </button>

              {fishToDisplay.map((fish) => (
                <ProductCard
                  fish={fish}
                  key={fish.id}
                  className="product-card"
                />
              ))}

              <button
                className="nav__button right"
                onClick={() => handlePageChange(breed, 1)}
                disabled={endIndex >= breedFish.length}
              >
                &gt;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllFishPage;
