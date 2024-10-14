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
  Spin,
} from "antd";
// import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo data
  const demoCart = {
    orderId: 1001,
    status: 0,
    totalAmount: 40800000,
    totalTax: 0,
    totalDiscount: 0,
    customerId: 1,
    orderLines: [
      {
        fishId: 1,
        fishName: "Platinum Arowana",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 2,
        unitPrice: 10000000,
        totalPrice: 20000000,
      },
      {
        fishId: 2,
        fishName: "Golden Koi",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 1,
        unitPrice: 20800000,
        totalPrice: 20800000,
      },
    ],
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    // Simulating API call delay
    setTimeout(() => {
      setCart(demoCart);
      setLoading(false);
    }, 1000);

    // Commented out API call
    // try {
    //   setLoading(true);
    //   const response = await axios.get('YOUR_API_ENDPOINT/orders');
    //   const activeCart = response.data.find(order => order.status === 0);
    //   setCart(activeCart || null);
    // } catch (error) {
    //   console.error("Error fetching cart:", error);
    //   message.error("Failed to fetch cart data");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleQuantityChange = async (fishId, value) => {
    if (!cart) return;

    const newOrderLines = cart.orderLines.map((line) =>
      line.fishId === fishId
        ? { ...line, quantity: value, totalPrice: value * line.unitPrice }
        : line
    );

    const newCart = {
      ...cart,
      orderLines: newOrderLines,
      totalAmount: newOrderLines.reduce(
        (sum, line) => sum + line.totalPrice,
        0
      ),
    };

    setCart(newCart);

    // Simulating API call
    setTimeout(() => {
      message.success("Cart updated successfully");
    }, 500);

    // Commented out API call
    // try {
    //   await axios.put(`YOUR_API_ENDPOINT/orders/${cart.orderId}`, newCart);
    //   message.success("Cart updated successfully");
    // } catch (error) {
    //   console.error("Error updating cart:", error);
    //   message.error("Failed to update cart");
    //   fetchCart(); // Refresh cart data in case of error
    // }
  };

  const handleRemoveProduct = async (orderId, fishId) => {
    const newOrderLines = cart.orderLines.filter(
      (line) => line.fishId !== fishId
    );
    const newCart = {
      ...cart,
      orderLines: newOrderLines,
      totalAmount: newOrderLines.reduce(
        (sum, line) => sum + line.totalPrice,
        0
      ),
    };
    setCart(newCart);

    // Simulating API call
    setTimeout(() => {
      message.success("Fish removed from cart");
    }, 500);

    // Commented out API call
    // try {
    //   await axios.delete(`YOUR_API_ENDPOINT/orders/${orderId}/fish/${fishId}`);
    //   message.success("Fish removed from cart");
    //   fetchCart(); // Refresh cart data after successful deletion
    // } catch (error) {
    //   console.error("Error removing fish from cart:", error);
    //   message.error("Failed to remove Fish from cart");
    // }
  };

  const columns = [
    {
      title: "Fish",
      dataIndex: "fishName",
      key: "fishName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src={record.imageUrl} alt={text} width={50} />
          <span style={{ marginLeft: 10 }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.fishId, value)}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => handleRemoveProduct(cart.orderId, record.fishId)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

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
        {cart && cart.orderLines && cart.orderLines.length > 0 ? (
          <>
            <Table
              dataSource={cart.orderLines}
              columns={columns}
              pagination={false}
            />
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <p style={{ fontSize: 18, fontWeight: "bold" }}>
                Total Price: {cart.totalAmount.toLocaleString()} VND
              </p>
              <Button
                href="/checkout"
                type="primary"
                style={{ marginRight: 10 }}
              >
                Checkout
              </Button>
              <Button onClick={() => (window.location.href = "/products")}>
                Back to Shop
              </Button>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </Card>
    </>
  );
};

export default Cart;
