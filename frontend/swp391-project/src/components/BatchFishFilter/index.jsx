import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, Pagination, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import config from "../../config/config";
import "./index.scss";
import { useTranslation } from "react-i18next";
import CurrencyFormatter from "../currency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
const { Meta } = Card;

const BatchFishFilter = () => {
  const [allFishes, setAllFishes] = useState([]);
  const [batchFishes, setBatchFishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllFishes();
  }, []);

  useEffect(() => {
    filterBatchFishes();
  }, [allFishes, currentPage]);

  const fetchAllFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
      setAllFishes(response.data);
    } catch (error) {
      console.error("Error when retrieving fish data:", error);
    }
  };

  const filterBatchFishes = () => {
    const filteredFishes = allFishes.filter(
      (fish) => fish.batch === true && fish.quantity > 0
    );
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setBatchFishes(filteredFishes.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalItems = allFishes.filter((fish) => fish.batch === true).length;

  return (
    <div className="batch-fish-page">
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon" />
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-page">
              {t("batchFish")}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="batch-fish-filter">
        <h2>{t("fishSellByBatch")}</h2>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
        <Row gutter={[16, 16]}>
          {batchFishes.map((fish) => (
            <Col xs={24} sm={12} md={8} lg={6} key={fish.fishId}>
              <Link to={`/fish/${fish.fishId}`} className="batch-fish-wrapper">
                <div className="image">
                  <img src={fish.imageUrl} alt={fish.name} />
                </div>
                <div className="info-container">
                  <div className="info">
                    <h2>{fish.name}</h2>
                    <p className="price">
                      {t("price")}: <CurrencyFormatter amount={fish.price} />
                    </p>
                    <p>
                      {t("amount")}: {fish.quantity}
                    </p>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BatchFishFilter;
