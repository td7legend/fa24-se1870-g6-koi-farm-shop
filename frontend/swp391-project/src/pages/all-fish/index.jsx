import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Col } from "antd";
import ImageFrame from "../../components/home/ImageFrame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ogonImage from "../../images/ogon.jpg";
import ochibaImage from "../../images/ochiba.jpg";
import kujakuImage from "../../images/kujaku.jpg";
import kohakuImage from "../../images/kohaku.jpg";
import showaImage from "../../images/showa.jpg";
import asagiImage from "../../images/asagi.jpg";
import tanchoImage from "../../images/tancho.jpg";
import shusuiImage from "../../images/shusui.jpg";
import goromoImage from "../../images/goromo.jpg";
import benigoiImage from "../../images/benigoi.jpg";
import goshikiImage from "../../images/goshiki.jpg";
import ginrinImage from "../../images/ginrin.jpg";
import doitsuImage from "../../images/doitsu.jpg";
import bekkoImage from "../../images/bekko.jpg";
import ProductCard from "../../components/product-card";
import CompareModal from "../../components/compareModel/CompareModal";
import { useTranslation } from "react-i18next";
import config from "../../config/config";

const fishImages = {
  Ogon: ogonImage,
  Ochiba: ochibaImage,
  Kujaku: kujakuImage,
  Kohaku: kohakuImage,
  Showa: showaImage,
  Asagi: asagiImage,
  Tancho: tanchoImage,
  Shusui: shusuiImage,
  Goromo: goromoImage,
  Benigoi: benigoiImage,
  Goshiki: goshikiImage,
  Ginrin: ginrinImage,
  Doitsu: doitsuImage,
  Bekko: bekkoImage,
};

const AllFishPage = () => {
  const [allFish, setAllFish] = useState([]);
  const [fishByType, setFishByType] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [selectedFishForCompare, setSelectedFishForCompare] = useState(null);
  const { t } = useTranslation();
  const [fishTypes, setFishTypes] = useState([]);
  const itemsPerPage = 4;
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllFish = async () => {
    try {
      const [fishResponse, typesResponse] = await Promise.all([
        axios.get(`${config.API_ROOT}fishs`),
        axios.get(`${config.API_ROOT}fishtypes`),
      ]);

      const fishData = fishResponse.data.filter((fish) => fish.quantity > 0);
      const typesData = typesResponse.data;

      setAllFish(fishData);
      setFishTypes(typesData);

      categorizeFishByType(fishData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const categorizeFishByType = (fishData) => {
    if (!fishData.length) return;

    const typeMap = fishData.reduce((acc, fish) => {
      const typeId = fish.fishTypeId.toString();
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(fish);
      return acc;
    }, {});

    setFishByType(typeMap);

    const initialPageState = {};
    Object.keys(typeMap).forEach((typeId) => {
      initialPageState[typeId] = 1;
    });
    setCurrentPage(initialPageState);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchAllFish();
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search");
    setSearchQuery(query || "");
  }, [location.search]);

  useEffect(() => {
    if (!isLoading) {
      const sections = document.querySelectorAll(".fade-in-section");
      sections.forEach((section, index) => {
        setTimeout(() => {
          section.classList.add("visible");
        }, index * 200);
      });
    }
  }, [allFish, isLoading]);

  useEffect(() => {
    console.log("Fish Types:", fishTypes);
    console.log("Fish By Type:", fishByType);
  }, [fishTypes, fishByType]);

  const handlePageChange = (typeId, direction) => {
    setCurrentPage((prevState) => {
      const newPage = prevState[typeId] + direction;
      if (
        newPage < 1 ||
        newPage > Math.ceil(fishByType[typeId].length / itemsPerPage)
      ) {
        return prevState;
      }
      return {
        ...prevState,
        [typeId]: newPage,
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
    <div className="all-fish-page-form">
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon" />
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-page">
              Fish List
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="all-fish-page-container">
        {searchQuery && (
          <div className="search-result">
            <h2>
              {t("searchResultsFor")}: {searchQuery}
            </h2>
          </div>
        )}

        {Object.keys(fishByType).map((typeId) => {
          const typeFish = fishByType[typeId].filter(filterFishBySearch);
          if (typeFish.length === 0) return null;

          const currentPageForType = currentPage[typeId] || 1;
          const startIndex = (currentPageForType - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const fishToDisplay = typeFish.slice(startIndex, endIndex);

          const fishType = fishTypes.find(
            (type) => type.fishTypeId === parseInt(typeId)
          );

          console.log("Type ID:", typeId);
          console.log("Found Fish Type:", fishType);

          const typeName = fishType ? fishType.name : "Unknown Type";
          console.log("Type Name:", typeName);

          const imageSrc =
            fishImages[typeName] ||
            fishImages[typeName.toLowerCase()] ||
            "default_image_link";
          console.log("Image Source:", imageSrc);

          return (
            <div
              key={typeId}
              className="all-fish-page fade-in-section"
              style={{ marginBottom: "50px" }}
            >
              <div className="fish-banner">
                <ImageFrame imageSrc={imageSrc} />
              </div>
              <Link to={`/breed/${typeId}`} className="breed-link">
                <h2 className="breed-title">{typeName}</h2>
              </Link>
              <div className="fish-list">
                <button
                  className="nav__button left"
                  onClick={() => handlePageChange(typeId, -1)}
                  disabled={currentPageForType === 1}
                >
                  &lt;
                </button>

                {fishToDisplay.map((fish) => (
                  <ProductCard
                    className="product-card"
                    fish={fish}
                    key={fish.fishId}
                    onCompare={handleCompare}
                  />
                ))}

                <button
                  className="nav__button right"
                  onClick={() => handlePageChange(typeId, 1)}
                  disabled={endIndex >= typeFish.length}
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
    </div>
  );
};

export default AllFishPage;
