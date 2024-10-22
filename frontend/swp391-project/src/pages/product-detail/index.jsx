import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Space,
  Image,
  InputNumber,
  Carousel,
  Breadcrumb,
  Rate,
  message,
  Drawer,
  List,
  Typography,
} from "antd";
import "./index.scss";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const { Text } = Typography;

const config = {
  API_ROOT: "https://localhost:44366/api",
};

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [fishes, setFishes] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchFishes();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `https://66fe08fb699369308956d74e.mockapi.io/KoiProduct/${id}`
      );
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to fetch product data.");
    }
  };

  const fetchFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/fishs`);
      setFishes(response.data);
    } catch (error) {
      console.error("Error fetching fishes:", error);
      message.error("Failed to fetch fish data.");
    }
  };

  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    return fish ? fish.price : 0;
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please log in to view your cart.");
        return;
      }

      const response = await axios.get(`${config.API_ROOT}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setCartItems(response.data[0].orderLines || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      message.error("Failed to fetch cart data.");
    }
  };

  async function handleAddToCart() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please log in to add items to your cart.");
        return;
      }

      const response = await axios.post(
        `${config.API_ROOT}/carts`,
        {
          fishId: parseInt(id),
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success(`Added ${quantity} of ${product.name} to cart`);
        await fetchCart();
        setCartDrawerVisible(true);
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = getFishPrice(item.fishId);
      return total + price * item.quantity;
    }, 0);
  };

  if (!product.name) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Row>
        <Col span={24}>
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb" separator=">">
              <Breadcrumb.Item href="/">
                <FontAwesomeIcon
                  icon={faHome}
                  className="icon"
                ></FontAwesomeIcon>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/products">Product List</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/breed/${product.breed}`}>{product.breed}</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>
      <div className="product-detail-container">
        <Row gutter={16}>
          <Col span={10}>
            <Carousel>
              <div>
                <Image src={product.img_path} alt={product.name} />
              </div>
            </Carousel>
          </Col>
          <Col span={14}>
            <div className="info-container">
              <h1>{product.name}</h1>
              <h2>{product.price} VND</h2>
              <Rate allowHalf defaultValue={5} />

              <div className="product-info">
                <p>
                  <span>Breed:</span> {product.breed}
                </p>
                <p>
                  <span>Age:</span> {product.age}
                </p>
                <p>
                  <span>Gender:</span> {product.gender}
                </p>
              </div>
              <div className="product-submit">
                <InputNumber
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                  style={{ width: 150 }}
                />
                <Button
                  className="add-to-cart"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  size="large"
                  style={{
                    fontSize: 10,
                    padding: "8px 16px",
                    borderRadius: 20,
                  }}
                  loading={loading}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Drawer
        title="Your Cart"
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        visible={cartDrawerVisible}
        width={400}
      >
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Image src={item.imageUrl} width={50} />}
                title={item.fishName}
                description={`Quantity: ${item.quantity}`}
              />
              <div>
                <Text>
                  {(getFishPrice(item.fishId) * item.quantity).toLocaleString()}{" "}
                  VND
                </Text>
              </div>
            </List.Item>
          )}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Text strong>Total: {calculateTotal().toLocaleString()} VND</Text>
        </div>
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button type="primary" onClick={() => setCartDrawerVisible(false)}>
            Close
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => (window.location.href = "/cart")}
          >
            View Full Cart
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default ProductDetail;
