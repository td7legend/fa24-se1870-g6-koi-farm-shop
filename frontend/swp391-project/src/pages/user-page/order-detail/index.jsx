import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Table,
  Image,
  Button,
  Spin,
  Breadcrumb,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
const { Title, Text } = Typography;
const { Step } = Steps;
import "./index.scss";
import { useSelector } from "react-redux";
import config from "../../../config/config";
import { useTranslation } from "react-i18next";

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderId = location.state?.orderId;
        if (!orderId) {
          toast.error(t("orderIdNotProvided"));
          navigate("/order-history");
          return;
        }

        if (!token) {
          toast.error(t("noAuthToken"));
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${config.API_ROOT}orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token ?? null}` },
          }
        );

        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error(t("failedFetchOrderDetails"));
        navigate("/order-history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate]);

  if (loading) return <Spin size="large" />;
  if (!order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const columns = [
    {
      title: t("fish"),
      dataIndex: "fishName",
      key: "fish",
      render: (fishName, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={record.imageUrl || "/api/placeholder/80/80"}
            alt={fishName || "Fish"}
            width={80}
            height={80}
            style={{ marginRight: 16 }}
          />
          {fishName || "Unknown Fish"}
        </div>
      ),
    },
    {
      title: t("price"),
      dataIndex: "unitPrice",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    { title: t("quantity"), dataIndex: "quantity", key: "quantity" },
    {
      title: t("subtotal"),
      dataIndex: "totalPrice",
      key: "subtotal",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/user_info/user">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item href="/order-history">
            {t("orderHistory")}
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("orderDetail")}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="layout-container">
        <div className="order-detail-container">
          <Card className="card" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/order-history")}
              style={{ marginBottom: 16, color: "#D4B57E" }}
            >
              {t("backToList")}
            </Button>
            <Title level={3}>
              {t("orderDetail")} • {formatDate(order.orderDate)} •{" "}
              {order.orderLines.length} {t("fish")}
            </Title>

            <Row gutter={24}>
              <Col span={16}>
                <Card className="card" title="ORDER SUMMARY" bordered={false}>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("orderId")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>#{order.orderId}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("status")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {["Processing", "Shipping", "Delivered"][
                          order.status - 1
                        ] || "Unknown"}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("totalAmount")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {order.totalAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("totalTax")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {order.totalTax.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("totalDiscount")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {order.totalDiscount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Steps current={order.status - 1} style={{ margin: "24px 0" }}>
              <Step className="step" title={t("processing")} />
              <Step className="step" title={t("shipped")} />
              <Step className="step" title={t("delivered")} />
            </Steps>

            <Table
              className="table"
              columns={columns}
              dataSource={order.orderLines}
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
