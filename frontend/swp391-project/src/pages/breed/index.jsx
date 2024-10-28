import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Col,
  FloatButton,
  Pagination,
  Row,
  Select,
  Slider,
  Tag,
  Button,
  Input, // <-- Add Input from antd for price inputs
} from "antd";
import Search from "antd/es/transfer/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../../components/product-card";
import "./index.scss";
import ogonImage from "../../images/ogon.jpg";
import ochibaImage from "../../images/ochiba.jpg";
import kujakuImage from "../../images/kujaku.jpg";
import kohakuImage from "../../images/kohaku.jpg";
import ImageFrame from "../../components/home/ImageFrame";
import { useTranslation } from "react-i18next";

const BreedFishPage = () => {
  const { breedName } = useParams();
  const [breedFish, setBreedFish] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [priceRange, setPriceRange] = useState([100000, 100000000]);
  const [minPrice, setMinPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchBreedFish = async () => {
      try {
        const response = await axios.get(
          `https://66fe08fb699369308956d74e.mockapi.io/KoiProduct?breed=${breedName}`
        );
        setBreedFish(response.data);
      } catch (error) {
        console.error("Error fetching breed fish:", error);
      }
    };

    fetchBreedFish();
  }, [breedName]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const toggleSelection = (value, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(selectedArray.filter((item) => item !== value));
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleManualPriceChange = () => {
    setPriceRange([minPrice, maxPrice]);
    setCurrentPage(1);
  };

  const fishImages = {
    Ogon: ogonImage,
    Ochiba: ochibaImage,
    Kujaku: kujakuImage,
    kohaku: kohakuImage,
  };

  const imageSrc = fishImages[breedName] || "default_image_link";

  const origins = [...new Set(breedFish.map((Fish) => Fish.origin))];
  const sizes = [...new Set(breedFish.map((Fish) => Fish.size))];
  const ages = [...new Set(breedFish.map((Fish) => Fish.age))];

  const filteredFishs =
    searchQuery === ""
      ? breedFish
          .filter((Fish) => {
            if (selectedOrigins.length === 0) return true;
            return selectedOrigins.includes(Fish.origin);
          })
          .filter((Fish) => {
            if (selectedSizes.length === 0) return true;
            return selectedSizes.includes(Fish.size);
          })
          .filter((Fish) => {
            if (selectedAges.length === 0) return true;
            return selectedAges.includes(Fish.age);
          })
          .filter((Fish) => {
            return Fish.price >= priceRange[0] && Fish.price <= priceRange[1];
          })
      : breedFish.filter((Fish) => {
          return (
            Fish.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedOrigins.length === 0 ||
              selectedOrigins.includes(Fish.origin)) &&
            (selectedSizes.length === 0 || selectedSizes.includes(Fish.size)) &&
            (selectedAges.length === 0 || selectedAges.includes(Fish.age)) &&
            Fish.price >= priceRange[0] &&
            Fish.price <= priceRange[1]
          );
        });

  const sortedFishs = filteredFishs.sort((a, b) => {
    if (sortOrder === "newest") {
      return b.date - a.date;
    } else if (sortOrder === "oldest") {
      return a.date - b.date;
    } else if (sortOrder === "price-asc") {
      return a.price - b.price;
    } else if (sortOrder === "price-desc") {
      return b.price - a.price;
    } else {
      return 0;
    }
  });

  const paginatedFishs = sortedFishs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleChangPagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bread-page">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/fish-page">Fish List</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            {breedName}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="breed-page-container">
        <Col span={24}></Col>
        <Row className="row-container">
          <Col className="left-side">
            <div className="product-list-filter">
              <div className="search-container">
                <h1>{t("filter")}</h1>
                <Search
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={t("searchFishByName")}
                ></Search>
              </div>
              <hr className="divider" />
              <div className="filter-container">
                <div className="breed-filter">
                  <h3>{t("origin")}</h3>
                  <div className="button-group">
                    {origins.map((origin) => (
                      <Button
                        key={origin}
                        className={`filter-button ${
                          selectedOrigins.includes(origin) ? "selected" : ""
                        }`}
                        onClick={() =>
                          toggleSelection(
                            origin,
                            selectedOrigins,
                            setSelectedOrigins
                          )
                        }
                      >
                        {origin}
                      </Button>
                    ))}
                  </div>
                </div>
                <hr className="divider" />
                <div className="size-filter">
                  <h3>{t("size")}</h3>
                  <div className="button-group">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        className={`filter-button ${
                          selectedSizes.includes(size) ? "selected" : ""
                        }`}
                        onClick={() =>
                          toggleSelection(size, selectedSizes, setSelectedSizes)
                        }
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <hr className="divider" />
                <div className="age-filter">
                  <h3>{t("age")}</h3>
                  <div className="button-group">
                    {ages.map((age) => (
                      <Button
                        key={age}
                        className={`filter-button ${
                          selectedAges.includes(age) ? "selected" : ""
                        }`}
                        onClick={() =>
                          toggleSelection(age, selectedAges, setSelectedAges)
                        }
                      >
                        {age} {t("years")}
                      </Button>
                    ))}
                  </div>
                </div>
                <hr className="divider" />
                <div className="price-filter">
                  <Slider
                    range
                    min={100000}
                    max={100000000}
                    defaultValue={[100000, 100000000]}
                    value={priceRange}
                    onChange={handlePriceChange}
                  />
                  <div className="price-range">
                    <span style={{ fontSize: 16 }}>
                      {t("price")}: ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <div className="price-inputs">
                    <Input
                      type="number"
                      placeholder={t("minPrice")}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      style={{
                        marginTop: 10,
                        marginRight: 8,
                        width: "47%",
                        borderRadius: "10px",
                        border: "1px solid #bbab6f",
                      }}
                    />
                    <Input
                      type="number"
                      placeholder={t("maxPrice")}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{
                        width: "47%",
                        borderRadius: "10px",
                        border: "1px solid #bbab6f",
                      }}
                    />
                    <Button
                      type="primary"
                      onClick={handleManualPriceChange}
                      style={{
                        marginTop: 8,
                        borderRadius: "10px",
                        backgroundColor: "#bbab6f",
                      }}
                    >
                      {t("apply")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col className="right-side">
            <div className="banner" breedName={breedName}>
              <ImageFrame imageSrc={imageSrc} />
              <h1>{breedName}</h1>
            </div>
            <div className="top-controls">
              <div className="pagination">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredFishs.length}
                  onChange={handleChangPagination}
                />
              </div>
              <div className="sort-container">
                <div>{t("sortBy")}</div>
                <Select
                  value={sortOrder}
                  onChange={handleSortChange}
                  style={{ width: 200 }}
                >
                  <Select.Option value="price-asc">
                    {t("priceLowToHigh")}
                  </Select.Option>
                  <Select.Option value="price-desc">
                    {t("priceHighToLow")}
                  </Select.Option>
                </Select>
              </div>
            </div>

            <div className="filter-tags">
              {selectedOrigins.length > 0 && (
                <Tag closable onClose={() => setSelectedOrigins([])}>
                  {t("origin")}: {selectedOrigins.join(", ")}
                </Tag>
              )}
              {selectedSizes.length > 0 && (
                <Tag closable onClose={() => setSelectedSizes([])}>
                  {t("size")}: {selectedSizes.join(", ")}
                </Tag>
              )}
              {selectedAges.length > 0 && (
                <Tag closable onClose={() => setSelectedAges([])}>
                  {t("age")}: {selectedAges.join(", ")} {t("years")}
                </Tag>
              )}
              {priceRange[0] !== 0 ||
                (priceRange[1] !== 100 && (
                  <Tag
                    style={{
                      fontSize: 16,
                      padding: "8px 16px",
                      borderRadius: 5,
                    }}
                    color="blue"
                    closable
                    onClose={() => setPriceRange([0, 100])}
                  >
                    {t("price")}: ${priceRange[0]} - ${priceRange[1]}
                  </Tag>
                ))}
              {searchQuery !== "" && (
                <Tag
                  style={{
                    fontSize: 16,
                    padding: "8px 16px",
                    borderRadius: 5,
                  }}
                  color="blue"
                  closable
                  onClose={() => setSearchQuery("")}
                >
                  {t("search")}: {searchQuery}
                </Tag>
              )}
            </div>

            <div className="fish-list-breed">
              {paginatedFishs.map((fish) => (
                <ProductCard key={fish.id} fish={fish} />
              ))}
            </div>
            <FloatButton.BackTop />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BreedFishPage;
