import React, { useState, useEffect } from "react";
import { Button, Card, Table, InputNumber, Image, Breadcrumb, Col } from "antd";

const Cart = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Platinum",
      price: 10000,
      quantity: 2,
      image:
        "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
    },
    {
      id: 2,
      name: "Gold",
      price: 20000,
      quantity: 1,
      image:
        "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
    },
  ]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  const calculateTotalPrice = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = (id, value) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCart(newCart);
  };

  const handleRemoveProduct = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
  };

  const columns = [
    {
      title: "Fish",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src={record.image} alt={text} width={50} />
          <span style={{ marginLeft: 10 }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.id, value)}
        />
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        `${(record.price * record.quantity).toLocaleString()} VND`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleRemoveProduct(record.id)}>Delete</Button>
      ),
    },
  ];

  return (
    <>
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Product List</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <Card
        title="Cart"
        style={{ width: "100%", maxWidth: 800, margin: "auto" }}
      >
        <Table dataSource={cart} columns={columns} pagination={false} />
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            Total Price: {totalPrice.toLocaleString()} VND
          </p>
          <Button href="/checkout" type="primary" style={{ marginRight: 10 }}>
            Checkout
          </Button>
          <Button onClick={() => (window.location.href = "/products")}>
            Back to Shop
          </Button>
        </div>
      </Card>
    </>
  );
};

export default Cart;
