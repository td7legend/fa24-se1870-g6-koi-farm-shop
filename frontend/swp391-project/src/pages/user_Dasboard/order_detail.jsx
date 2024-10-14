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
  message,
  Breadcrumb,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";

const { Title, Text } = Typography;
const { Step } = Steps;

// Demo data
const demoOrders = [
  {
    orderId: 1001,
    status: 1,
    totalAmount: 1350000,
    totalTax: 135000,
    totalDiscount: 0,
    customerId: 1,
    orderLines: [
      {
        fishId: 1,
        fishName: "Koi Carp",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 2,
        unitPrice: 500000,
        totalPrice: 1000000,
      },
      {
        fishId: 2,
        fishName: "Goldfish",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 1,
        unitPrice: 350000,
        totalPrice: 350000,
      },
    ],
  },
  {
    orderId: 1002,
    status: 2,
    totalAmount: 2800000,
    totalTax: 280000,
    totalDiscount: 100000,
    customerId: 2,
    orderLines: [
      {
        fishId: 3,
        fishName: "Arowana",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 1,
        unitPrice: 2800000,
        totalPrice: 2800000,
      },
    ],
  },
  {
    orderId: 1003,
    status: 3,
    totalAmount: 750000,
    totalTax: 75000,
    totalDiscount: 50000,
    customerId: 1,
    orderLines: [
      {
        fishId: 4,
        fishName: "Guppy",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 5,
        unitPrice: 150000,
        totalPrice: 750000,
      },
    ],
  },
];

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
          message.error("Order ID not provided");
          navigate("/order-history");
          return;
        }
        // Simulating API call
        // const response = await axios.get(`YOUR_API_ENDPOINT_HERE/${orderId}`);
        // setOrder(response.data);

        const demoOrder = demoOrders.find((o) => o.orderId === orderId);
        if (demoOrder) {
          setOrder(demoOrder);
        } else {
          message.error("Order not found");
          navigate("/order-history");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate]);

  if (loading) return <Spin size="large" />;
  if (!order) return null;

  const totalPrice = order.orderLines.reduce(
    (sum, line) => sum + line.totalPrice,
    0
  );

  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "fishName",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={record.imageUrl}
            alt={record.fishName}
            width={80}
            height={80}
            style={{ marginRight: 16 }}
          />
          {record.fishName}
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
          <Breadcrumb.Item href="/user_info/user">
            User Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/order-history">Order History</Breadcrumb.Item>
          <Breadcrumb.Item>Order Detail</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/order-history")}
          style={{ marginBottom: 16, color: "#D4B57E" }}
        >
          Back to List
        </Button>
        <Title level={3}>
          Order Details • {new Date(order.orderId * 1000).toLocaleDateString()}{" "}
          • {order.orderLines.length} Products
        </Title>

        <Row gutter={24}>
          <Col span={16}>
            <Card title="ORDER SUMMARY" bordered={false}>
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
                    {totalPrice.toLocaleString("vi-VN", {
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
          <Step title="Processing" />
          <Step title="Shipped" />
          <Step title="Delivered" />
        </Steps>

        <Table
          columns={columns}
          dataSource={order.orderLines}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
