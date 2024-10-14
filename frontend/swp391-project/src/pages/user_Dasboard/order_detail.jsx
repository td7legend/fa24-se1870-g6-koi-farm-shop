import React from "react";
import { Card, Row, Col, Typography, Steps, Table, Image, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

// Static data mimicking the database structure
const staticOrderData = {
  order: {
    OrderID: 4152,
    CustomerID: 1001,
    Status: 1,
    TotalAmount: 20800000,
    TotalTax: 0,
    TotalDiscount: 0,
  },
  orderLines: [
    {
      OrderLineID: 1,
      OrderID: 4152,
      FishID: 1,
      Quantity: 1,
      UnitPrice: 8000000,
      TotalPrice: 8000000,
    },
    {
      OrderLineID: 2,
      OrderID: 4152,
      FishID: 2,
      Quantity: 1,
      UnitPrice: 800000,
      TotalPrice: 800000,
    },
    {
      OrderLineID: 3,
      OrderID: 4152,
      FishID: 3,
      Quantity: 1,
      UnitPrice: 12000000,
      TotalPrice: 12000000,
    },
  ],
  customer: {
    CustomerID: 1001,
    Name: "Dainne Russell",
    Address: "4140 Parker Rd. Allentown, New Mexico 31134",
    Email: "dainne.ressell@gmail.com",
    Phone: "(671) 555-0110",
  },
  fishProducts: {
    1: { Name: "Goromo", Image: "/api/placeholder/80/80" },
    2: { Name: "Platinum Tosai", Image: "/api/placeholder/80/80" },
    3: { Name: "Kohaku", Image: "/api/placeholder/80/80" },
  },
};

const OrderDetailsPage = ({ orderId, onBackToList }) => {
  // In a real scenario, you would fetch data based on orderId
  // For now, we'll just use our static data

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const orderStatusMap = [
    "Order received",
    "Processing",
    "On the way",
    "Delivered",
  ];

  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "FishID",
      key: "product",
      render: (FishID) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={staticOrderData.fishProducts[FishID].Image}
            alt={staticOrderData.fishProducts[FishID].Name}
            width={80}
            height={80}
            style={{ marginRight: 16 }}
          />
          {staticOrderData.fishProducts[FishID].Name}
        </div>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "UnitPrice",
      key: "price",
      render: (price) => formatCurrency(price),
    },
    { title: "QUANTITY", dataIndex: "Quantity", key: "quantity" },
    {
      title: "SUBTOTAL",
      dataIndex: "TotalPrice",
      key: "subtotal",
      render: (price) => formatCurrency(price),
    },
  ];

  return (
    <Card style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={onBackToList}
        style={{ marginBottom: 16, color: "#D4B57E" }}
      >
        Back to List
      </Button>
      <Title level={3}>
        Order Details • April 24, 2021 • {staticOrderData.orderLines.length}{" "}
        Products
      </Title>

      <Row gutter={24}>
        <Col span={8}>
          <Card title="BILLING ADDRESS" bordered={false}>
            <Text>{staticOrderData.customer.Name}</Text>
            <br />
            <Text>{staticOrderData.customer.Address}</Text>
            <br />
            <Text>EMAIL</Text>
            <br />
            <Text>{staticOrderData.customer.Email}</Text>
            <br />
            <Text>PHONE</Text>
            <br />
            <Text>{staticOrderData.customer.Phone}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="SHIPPING ADDRESS" bordered={false}>
            <Text>{staticOrderData.customer.Name}</Text>
            <br />
            <Text>{staticOrderData.customer.Address}</Text>
            <br />
            <Text>EMAIL</Text>
            <br />
            <Text>{staticOrderData.customer.Email}</Text>
            <br />
            <Text>PHONE</Text>
            <br />
            <Text>{staticOrderData.customer.Phone}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Row>
              <Col span={12}>
                <Text strong>ORDER ID:</Text>
              </Col>
              <Col span={12}>
                <Text>#{staticOrderData.order.OrderID}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>PAYMENT METHOD:</Text>
              </Col>
              <Col span={12}>
                <Text>COD</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Subtotal:</Text>
              </Col>
              <Col span={12}>
                <Text>{formatCurrency(staticOrderData.order.TotalAmount)}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Discount:</Text>
              </Col>
              <Col span={12}>
                <Text>
                  {formatCurrency(staticOrderData.order.TotalDiscount)}
                </Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Shipping:</Text>
              </Col>
              <Col span={12}>
                <Text>Free</Text>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Total:</Text>
              </Col>
              <Col span={12}>
                <Text strong style={{ color: "#D4B57E" }}>
                  {formatCurrency(staticOrderData.order.TotalAmount)}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Steps
        current={staticOrderData.order.Status}
        style={{ margin: "24px 0" }}
      >
        {orderStatusMap.map((status, index) => (
          <Step key={index} title={status} />
        ))}
      </Steps>

      <Table
        columns={columns}
        dataSource={staticOrderData.orderLines}
        pagination={false}
      />
    </Card>
  );
};

export default OrderDetailsPage;
