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

const config = {
  API_ROOT: "https://localhost:44366/api",
};

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderId = location.state?.orderId;
        if (!orderId) {
          toast.error("Order ID not provided");
          navigate("/order-history");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${config.API_ROOT}/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to fetch order details");
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
      title: "FISH",
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
      title: "PRICE",
      dataIndex: "unitPrice",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    { title: "QUANTITY", dataIndex: "quantity", key: "quantity" },
    {
      title: "SUBTOTAL",
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
          <Breadcrumb.Item href="/order-history">Order History</Breadcrumb.Item>
          <Breadcrumb.Item>Order Detail</Breadcrumb.Item>
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
              Back to List
            </Button>
            <Title level={3}>
              Order Details • {formatDate(order.orderDate)} •{" "}
              {order.orderLines.length} Fish
            </Title>

            <Row gutter={24}>
              <Col span={16}>
                <Card className="card" title="ORDER SUMMARY" bordered={false}>
                  <Row>
                    <Col span={12}>
                      <Text strong>ORDER ID:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>#{order.orderId}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>STATUS:</Text>
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
                      <Text strong>TOTAL AMOUNT:</Text>
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
                      <Text strong>TOTAL TAX:</Text>
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
                      <Text strong>TOTAL DISCOUNT:</Text>
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
              <Step className="step" title="Processing" />
              <Step className="step" title="Shipped" />
              <Step className="step" title="Delivered" />
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
