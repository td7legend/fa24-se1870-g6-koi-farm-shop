import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Empty,
  Rate,
  Image,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  CloseOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import ProductCard from "../product-card";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const CompareModal = ({ isVisible, onClose, initialFish, allFish }) => {
  const [comparedFishes, setComparedFishes] = useState([initialFish, null]);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [selectIndex, setSelectIndex] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (initialFish) {
      setComparedFishes([initialFish, null]);
    }
  }, [initialFish]);

  const handleSelectFish = (fish) => {
    setComparedFishes((prev) => {
      const newFishes = [...prev];
      newFishes[selectIndex] = fish;
      return newFishes;
    });
    setIsSelectModalVisible(false);
  };

  const handleRemoveFish = (index) => {
    setComparedFishes((prev) => {
      const newFishes = [...prev];
      newFishes[index] = null;
      return newFishes;
    });
  };

  const availableFishes = useMemo(() => {
    const comparedFishIds = comparedFishes
      .filter((fish) => fish !== null)
      .map((fish) => fish.id);
    return allFish.filter((fish) => !comparedFishIds.includes(fish.id));
  }, [allFish, comparedFishes]);

  const renderComparisonRow = (
    label,
    property,
    compare = null,
    formatValue = null,
    customRender = null
  ) => {
    const values = comparedFishes.map((fish) => (fish ? fish[property] : null));

    return (
      <Row
        gutter={16}
        style={{ marginBottom: 16, alignItems: "center" }}
        key={`${property}-${values.join("-")}`}
      >
        <Col span={6}>
          <Text strong>{t(property)}</Text>
        </Col>
        {comparedFishes.map((fish, index) => (
          <Col span={9} key={index}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {customRender ? (
                customRender(fish ? fish[property] : null)
              ) : (
                <Text>
                  {fish
                    ? formatValue
                      ? formatValue(fish[property])
                      : fish[property]
                    : "-"}
                </Text>
              )}
              {compare && values[0] !== null && values[1] !== null && (
                <span style={{ marginLeft: "8px" }}>
                  {compare(values[index], values[1 - index])}
                </span>
              )}
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  const compareNumeric = (a, b, higherIsBetter = true) => {
    if (a === b) return null;
    if (higherIsBetter ? a > b : a < b) {
      return <ArrowUpOutlined style={{ color: "green" }} />;
    } else {
      return <ArrowDownOutlined style={{ color: "red" }} />;
    }
  };

  const comparePrice = (a, b) => {
    console.log("Comparing prices:", a, b); // Để kiểm tra giá trị
    const priceA = parseFloat(a);
    const priceB = parseFloat(b);
    console.log("Parsed prices:", priceA, priceB); // Để kiểm tra giá trị sau khi parse

    if (isNaN(priceA) || isNaN(priceB)) {
      console.error("Invalid price value:", a, b);
      return null;
    }

    if (priceA === priceB) return null;
    if (priceA < priceB) {
      return <ArrowUpOutlined style={{ color: "green" }} />;
    } else {
      return <ArrowDownOutlined style={{ color: "red" }} />;
    }
  };

  const compareOrigin = (a, b) => {
    console.log("Comparing origins:", a, b); // Để kiểm tra giá trị
    const originRank = { Japan: 3, F1: 2, VietNam: 1 };
    const rankA = originRank[a] || 0;
    const rankB = originRank[b] || 0;
    console.log("Origin ranks:", rankA, rankB); // Để kiểm tra giá trị rank

    if (rankA === rankB) return null;
    if (rankA > rankB) {
      return <ArrowUpOutlined style={{ color: "green" }} />;
    } else {
      return <ArrowDownOutlined style={{ color: "red" }} />;
    }
  };

  const formatPrice = (price) => `${parseFloat(price).toLocaleString()} VND`;

  const renderRating = (rating) => {
    return rating !== null ? (
      <Rate disabled defaultValue={rating} allowHalf />
    ) : (
      "-"
    );
  };

  return (
    <>
      <Modal
        title={t("compareFishes")}
        visible={isVisible}
        onCancel={onClose}
        width={800}
        footer={null}
      >
        {comparedFishes.some((fish) => fish !== null) ? (
          <>
            <Row gutter={16}>
              {comparedFishes.map((fish, index) => (
                <Col span={12} key={index}>
                  {fish ? (
                    <Card
                      cover={
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            overflow: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f0f0f0",
                            position: "relative",
                          }}
                        >
                          <Image
                            alt={fish.name}
                            src={fish.img_path}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                            preview={{
                              maskClassName: "customize-mask",
                              mask: (
                                <ZoomInOutlined style={{ fontSize: "24px" }} />
                              ),
                            }}
                          />
                        </div>
                      }
                      extra={
                        <Tooltip title="Remove">
                          <Button
                            icon={<CloseOutlined />}
                            onClick={() => handleRemoveFish(index)}
                          />
                        </Tooltip>
                      }
                    >
                      <Card.Meta
                        title={fish.name}
                        description={fish.breed}
                        style={{ textAlign: "center" }}
                      />
                    </Card>
                  ) : (
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setSelectIndex(index);
                        setIsSelectModalVisible(true);
                      }}
                      style={{ width: "100%", height: "100%", minHeight: 200 }}
                    >
                      {t("addFishToCompare")}
                    </Button>
                  )}
                </Col>
              ))}
            </Row>
            <div style={{ marginTop: 20 }}>
              {renderComparisonRow("name")}
              {renderComparisonRow("breed")}
              {renderComparisonRow("size", null, (a, b) =>
                compareNumeric(a, b)
              )}
              {renderComparisonRow("price", "price", comparePrice, formatPrice)}
              {renderComparisonRow("origin", "origin", compareOrigin)}
              {renderComparisonRow(
                "rating",
                "rating",
                (a, b) => compareNumeric(a, b),
                null,
                renderRating
              )}
              {renderComparisonRow("gender", "gender")}
              {renderComparisonRow("age", "age", (a, b) =>
                compareNumeric(a, b)
              )}
            </div>
          </>
        ) : (
          <Empty description={t("noFishSelectedForComparison")} />
        )}
      </Modal>

      <Modal
        title={t("selectFishToCompare")}
        visible={isSelectModalVisible}
        onCancel={() => setIsSelectModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          {availableFishes.map((fish) => (
            <Col span={8} key={fish.id}>
              <ProductCard
                fish={fish}
                onCompare={() => handleSelectFish(fish)}
              />
            </Col>
          ))}
        </Row>
        {availableFishes.length === 0 && (
          <Empty description={t("noMoreFishAvailableForComparison")} />
        )}
      </Modal>
    </>
  );
};

export default CompareModal;
