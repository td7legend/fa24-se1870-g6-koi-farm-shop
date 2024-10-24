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
import { useSelector } from "react-redux";
import config from "../../config/config";
import { AES, enc } from "crypto-js";
import CurrencyFormatter from "../../components/currency";

const { Text } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [fishes, setFishes] = useState([]);
  const [fishTypes, setFishTypes] = useState([]);
  const [currentFishTypes, setCurrentFishTypes] = useState({});
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const decryptedToken = token
    ? AES.decrypt(token, config.SECRET_KEY).toString(enc.Utf8)
    : null;
  const decryptedRole = role
    ? parseInt(AES.decrypt(role, config.SECRET_KEY).toString(enc.Utf8))
    : 0;

  useEffect(() => {
    console.log("Current ID:", id);
    if (id) {
      fetchProduct();
    } else {
      console.error("Invalid ID");
    }
    fetchFishes();
    getFishTypes();
    getCurrentFishTypes();
  }, [id]);

  const fetchProduct = async () => {
    console.log("Fetching product with ID:", id); // Log ID để kiểm tra
    try {
      const response = await axios.get(`${config.API_ROOT}fishs/${id}`);
      console.log("API response:", response.data); // Log phản hồi từ API
      if (response.data) {
        setProduct(response.data);
        console.log("New product set to:", response.data); // Log giá trị mới được thiết lập
      } else {
        console.error("No product data received");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to fetch product data.");
    }
  };

  // Thêm useEffect để theo dõi sự thay đổi của product
  useEffect(() => {
    console.log("Updated product:", product);
    if (product && product.fishTypeId) {
      getCurrentFishTypes(); // Gọi hàm này sau khi product đã được cập nhật
    }
    decryptedToken;
  }, [product, decryptedToken]);

  const fetchFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
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
      const response = await axios.get(`${config.API_ROOT}cart`, {
        headers: {
          Authorization: `Bearer ${decryptedToken ?? null}`,
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
      if (!token) {
        message.error("Please log in to add items to your cart.");
        return;
      }

      const response = await axios.post(
        `${config.API_ROOT}carts`,
        {
          fishId: parseInt(id),
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${decryptedToken ?? null}`,
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
  async function getFishTypes() {
    try {
      const response = await axios.get(`${config.API_ROOT}fishtypes`);
      setFishTypes(response.data);
    } catch (error) {
      console.log("Error: ", error.message);
    }
  }

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function getCurrentFishTypes() {
    if (fishTypes.length > 0 && product.fishTypeId) {
      const temp = fishTypes.filter(
        (fishType) => fishType.fishTypeId === product.fishTypeId
      );
      setCurrentFishTypes(temp[0] || null);
    } else {
      console.error(
        "No fish types available or product does not have fishTypeId"
      );
    }
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
              <Breadcrumb.Item href="/fish-page">Fish List</Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/breed/${currentFishTypes.name}`}>
                  {capitalizeFirstLetter(currentFishTypes.name)}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{product?.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>
      <div className="product-detail-container">
        <Row gutter={16}>
          <Col span={10}>
            <Carousel>
              <div>
                <Image src={product.imageUrl} alt={product?.name} />
              </div>
            </Carousel>
          </Col>
          <Col span={14}>
            <div className="info-container">
              <h1>{product.name}</h1>
              <h2>
                Price: <CurrencyFormatter amount={product.price} />
              </h2>
              <Rate allowHalf defaultValue={5} />

              <div className="product-info">
                <p>
                  <span>Breed:</span> {currentFishTypes.name}
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
