import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  InputNumber,
  Image,
  Breadcrumb,
  Col,
  message,
} from "antd";
import axios from "axios";

// Placeholder API functions
const getCart = async () => {
  // Replace this with your actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          orderId: 101,
          fishId: 1,
          name: "Platinum",
          price: 10000,
          quantity: 2,
          status: 0,
          image:
            "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        },
        {
          id: 2,
          orderId: 101,
          fishId: 2,
          name: "Gold",
          price: 20000,
          quantity: 1,
          status: 0,
          image:
            "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        },
      ]);
    }, 500);
  });
};

const deleteCartItem = async (orderId, fishId) => {
  console.log(`Deleting item: orderId=${orderId}, fishId=${fishId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

const updateCart = async (cartData) => {
  console.log("Updating cart:", cartData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.filter((cart) => cart.status === 0));
    } catch (error) {
      message.error("Failed to fetch cart data");
    }
  };

  const calculateTotalPrice = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleQuantityChange = async (id, value) => {
    const newCart = cart.map((fish) =>
      fish.id === id ? { ...fish, quantity: value } : fish
    );
    setCart(newCart);

    try {
      await updateCart(newCart);
    } catch (error) {
      message.error("Failed to update cart");
    }
  };

  const handleRemoveProduct = async (orderId, fishId) => {
    try {
      await deleteCartItem(orderId, fishId);
      const newCart = cart.filter((fish) => fish.fishId !== fishId);
      setCart(newCart);
      message.success("Fish removed from cart");
    } catch (error) {
      message.error("Failed to remove Fish from cart");
    }
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
        <Button
          onClick={() => handleRemoveProduct(record.orderId, record.fishId)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Product List</Breadcrumb.Item>
            <Breadcrumb.Item>Cart</Breadcrumb.Item>
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
