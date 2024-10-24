import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss"; // Import CSS để điều chỉnh layout
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Col } from "antd";
import ImageFrame from "../../components/home/ImageFrame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ogonImage from "../../images/ogon.jpg";
import ochibaImage from "../../images/ochiba.jpg";
import kujakuImage from "../../images/kujaku.jpg";
import kohakuImage from "../../images/kohaku.jpg";
import ProductCard from "../../components/product-card";
import CompareModal from "../../components/compareModel/CompareModal";

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
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [selectedFishForCompare, setSelectedFishForCompare] = useState(null);

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
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    setSearchQuery(query || "");
  }, [location.search]);

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

  const filterFishBySearch = (fish) => {
    if (!searchQuery) return true;
    return fish.name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const handleCompare = (fish) => {
    setSelectedFishForCompare(fish);
    setIsCompareModalVisible(true);
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

      {searchQuery && <h2>Search results for: {searchQuery}</h2>}

      {Object.keys(fishByBreed).map((breed) => {
        const breedFish = fishByBreed[breed].filter(filterFishBySearch);
        if (breedFish.length === 0) return null;

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
                  onCompare={handleCompare}
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
      <CompareModal
        isVisible={isCompareModalVisible}
        onClose={() => setIsCompareModalVisible(false)}
        initialFish={selectedFishForCompare}
        allFish={allFish}
      />
    </div>
  );
};

export default AllFishPage;
