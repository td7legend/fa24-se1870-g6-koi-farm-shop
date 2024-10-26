import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, Pagination } from "antd";
import { Link } from "react-router-dom";
import config from "../../config/config";
import "./index.scss";
const { Meta } = Card;

const BatchFishFilter = () => {
  const [allFishes, setAllFishes] = useState([]);
  const [batchFishes, setBatchFishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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
      console.error("Lỗi khi lấy dữ liệu cá:", error);
    }
  };

  const filterBatchFishes = () => {
    const filteredFishes = allFishes.filter((fish) => fish.batch === true);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setBatchFishes(filteredFishes.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalItems = allFishes.filter((fish) => fish.batch === true).length;

  return (
    <div className="batch-fish-filter">
      <h2>Fish sell by batch</h2>
      <Row gutter={[16, 16]}>
        {batchFishes.map((fish) => (
          <Col xs={24} sm={12} md={8} lg={6} key={fish.fishId}>
            <Link to={`/fish/${fish.fishId}`}>
              <Card
                hoverable
                cover={<img alt={fish.name} src={fish.imageUrl} />}
                className="fish-card"
              >
                <Meta
                  title={fish.name}
                  description={`Giá: ${fish.price.toLocaleString()} VND`}
                />
                <p>Số lượng: {fish.quantity}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        className="pagination"
      />
    </div>
  );
};

export default BatchFishFilter;
