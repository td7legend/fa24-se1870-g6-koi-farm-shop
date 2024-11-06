import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb, Col, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CurrencyFormatter from "../currency";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import "./index.scss";
function ConsignmentFishFilter() {
  const [allFishes, setAllFishes] = useState([]);
  const [consignmentFishes, setConsignmentFishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllFishes();
  }, []);

  useEffect(() => {
    filterConsignmentFishes();
  }, [allFishes, currentPage]);

  const fetchAllFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
      setAllFishes(response.data);
    } catch (error) {
      console.error("Error when retrieving fish data:", error);
    }
  };

  const filterConsignmentFishes = () => {
    const filteredFishes = allFishes.filter(
      (fish) => fish.consignmentLineId !== null && fish.quantity > 0
    );
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setConsignmentFishes(filteredFishes.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalItems = allFishes.filter(
    (fish) => fish.consignmentLineId !== null
  ).length;
  return (
    <div className="consignment-fish-page">
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon" />
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-page">
              Consignment Fish
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="consignment-fish-filter">
        <h2>{t("consignmentFish")}</h2>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
        <Row gutter={[16, 16]}>
          {consignmentFishes.map((fish) => (
            <Col xs={24} sm={12} md={8} lg={6} key={fish.fishId}>
              <Link
                to={`/fish/${fish.fishId}`}
                className="consignment-fish-wrapper"
              >
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
}

export default ConsignmentFishFilter;
