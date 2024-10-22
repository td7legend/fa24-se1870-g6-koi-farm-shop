import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Table,
  Image,
  Breadcrumb,
  Col,
  message,
  Spin,
} from "antd";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "./index.scss";
import { toast } from "react-toastify";

const config = {
  API_ROOT: "https://localhost:44366/api",
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
    fetchFishes();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const response = await axios.get(`${config.API_ROOT}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setCart(response.data[0]);
      } else {
        setCart(null);
        message.info("Your cart is empty.");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // toast.error("Failed to fetch cart data. Please try again later.");
    }
  };

  const fetchFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/fishs`);
      setFishes(response.data);
    } catch (error) {
      console.error("Error fetching fishes:", error);
      toast.error("Failed to fetch fish data. Some prices may be unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    return fish ? fish.price : 0;
  };

  const calculateTotalPrice = () => {
    if (!cart || !cart.orderLines) return 0;
    return cart.orderLines.reduce((total, line) => {
      const price = getFishPrice(line.fishId);
      return total + price * line.quantity;
    }, 0);
  };

  const updateCart = async (fishId, isAdd, isRemove) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      await axios.patch(
        `${config.API_ROOT}/carts`,
        { fishId, isAdd, isRemove },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart(); // Refresh cart after update
      toast.success(
        isRemove ? "Fish removed from cart" : "Cart updated successfully"
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart. Please try again.");
    }
  };

  const handleIncreaseQuantity = (fishId) => {
    updateCart(fishId, true, false);
  };
  const handleDecreaseQuantity = (fishId) => {
    updateCart(fishId, false, false);
  };

  const handleRemoveItem = (fishId) => {
    updateCart(fishId, false, true);
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
      key: "price",
      render: (_, record) =>
        `${getFishPrice(record.fishId).toLocaleString()} VND`,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <div className="quantity-input">
          <Button
            style={{ padding: 12 }}
            className="button"
            onClick={() => handleDecreaseQuantity(record.fishId)}
          >
            -
          </Button>
          <span style={{ margin: "0 10px" }}>{record.quantity}</span>
          <Button
            style={{ padding: 12 }}
            className="button"
            onClick={() => handleIncreaseQuantity(record.fishId)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        `${(
          getFishPrice(record.fishId) * record.quantity
        ).toLocaleString()} VND`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          className="button-main"
          onClick={() => handleRemoveItem(record.fishId)}
        >
          Remove
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
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Product List</Breadcrumb.Item>
            <Breadcrumb.Item>Cart</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="cart-container">
        <Card
          className="card"
          title="Cart"
          style={{
            width: "100%",
            maxWidth: 950,
            margin: "20px auto",
            padding: "20px",
          }}
        >
          {cart && cart.orderLines && cart.orderLines.length > 0 ? (
            <>
              <Table
                className="table"
                dataSource={cart.orderLines}
                columns={columns}
                pagination={false}
              />
              <div
                style={{ textAlign: "right", margin: "5px 0", padding: "5px" }}
              >
                <p
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
                >
                  Total Price: {calculateTotalPrice().toLocaleString()} VND
                </p>
                <Button
                  className="button"
                  size="large"
                  onClick={() => (window.location.href = "/products")}
                  style={{ marginRight: 10 }}
                >
                  Back to Shop
                </Button>
                <Button
                  className="button-main"
                  href="/checkout"
                  size="large"
                  style={{ width: 200 }}
                >
                  Checkout
                </Button>
              </div>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </Card>
      </div>
    </>
  );
};

export default Cart;
