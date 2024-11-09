import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Image,
  InputNumber,
  Carousel,
  Breadcrumb,
  Rate,
  Typography,
  Input,
} from "antd";
import "./index.scss";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config/config";
import CurrencyFormatter from "../../components/currency";
import { setCart } from "../../store/actions/cartAction";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const { Text } = Typography;

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [fishes, setFishes] = useState([]);
  const [fishTypes, setFishTypes] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [currentFishTypes, setCurrentFishTypes] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    fetchFishes();
  }, [id]);

  useEffect(() => {
    getFishTypes();
  }, []);

  useEffect(() => {
    getCurrentFishTypes();
  }, [product, fishTypes]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs/${id}`);
      if (response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      toast.error(t("failedToFetchProductData"));
    }
  };

  const fetchFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
      setFishes(response.data);
    } catch (error) {
      toast.error(t("failedToFetchFishData"));
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}ratings/fish/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.length > 0) {
        setRatings(response.data);
        const userRating = response.data.find(
          (rating) => rating.customerName === "TranDuy"
        );
        if (userRating) {
          setUserRating(userRating.ratingValue);
          setRatingComment(userRating.comment);
        }
      }
    } catch (error) {
      console.log("Error fetching ratings.", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRatings();
    }
  }, [id]);

  const handleSubmitRatingAndComment = async () => {
    if (!token) {
      toast.error(t("Please log in to rate this product"));
      return;
    }

    if (!userRating) {
      toast.error(t("Please rate this product"));
      return;
    }

    setSubmittingRating(true);
    try {
      const response = await axios.post(
        `${config.API_ROOT}ratings/rate-fish`,
        {
          fishId: parseInt(id),
          ratingValue: userRating,
          comment: ratingComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(t("Rating Submitted Successfully"));
        setRatingComment("");
        fetchRatings();
        await fetchProduct();
      }
    } catch (error) {
      toast.error(error.response?.data || t("failedToSubmitRating"));
    } finally {
      setSubmittingRating(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}cart`, {
        headers: {
          Authorization: `Bearer ${token ?? null}`,
        },
      });
      if (response.data && response.data.length > 0) {
        setCartItems(response.data[0].orderLines || []);
        dispatch(setCart(response.data[0].orderLines || []));
      }
    } catch (error) {
      toast.error(t("yourCartIsEmpty"));
    }
  };

  async function handleAddToCart() {
    setLoading(true);
    try {
      if (!token) {
        toast.error(t("pleaseLogInToAddItemsToYourCart"));
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
            Authorization: `Bearer ${token ?? null}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Added ${quantity} of ${product.name} to cart`);
        await fetchCart();
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      toast.error(t("failedToAddItemToCartPleaseTryAgain"));
    } finally {
      setLoading(false);
    }
  }

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  async function getFishTypes() {
    try {
      const response = await axios.get(`${config.API_ROOT}fishtypes`);
      setFishTypes(response.data);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }

  function getCurrentFishTypes() {
    if (fishTypes.length > 0 && product.fishTypeId) {
      const temp = fishTypes.filter(
        (fishType) => fishType.fishTypeId === product.fishTypeId
      );
      setCurrentFishTypes(temp[0] || { name: "" });
    } else {
      setCurrentFishTypes({ name: "" });
    }
  }

  if (!product.name) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="product-detail-page">
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
              <Breadcrumb.Item href="/fish-page">
                {t("fishList")}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/breed/${currentFishTypes.fishTypeId}`}>
                  {capitalizeFirstLetter(currentFishTypes.name) || "Loading..."}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumb-page">
                {product?.name}
              </Breadcrumb.Item>
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
                Price:{" "}
                <span className="price">
                  <CurrencyFormatter amount={product.price} />
                </span>
              </h2>
              <Rate value={product.overallRating || 0} disabled />

              <div className="product-info">
                <p>
                  <span>{t("breed")}:</span>{" "}
                  {capitalizeFirstLetter(currentFishTypes.name) || "Loading..."}
                </p>
                <p>
                  <span>{t("age")}:</span> {product.age}
                </p>
                <p>
                  <span>{t("gender")}:</span>{" "}
                  {product.gender === 0 ? t("Male") : t("Female")}
                </p>
              </div>

              <div className="product-submit">
                <InputNumber
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                  style={{ width: 150, borderRadius: 10 }}
                  className="quantity-input"
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
                    border: "none",
                  }}
                  loading={loading}
                >
                  {t("addToCart")}
                </Button>
              </div>

              {/* Tab Box */}
              <div className="tab-container">
                <div
                  className={`tab-item ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  {t("description")}
                </div>
                <div
                  className={`tab-item ${
                    activeTab === "rating" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("rating")}
                >
                  {t("rating")}
                </div>
              </div>

              {/* Content Box */}
              {activeTab === "description" && (
                <div className="product-description">
                  <h3>{t("description")}</h3>
                  <p>
                    {capitalizeFirstLetter(product.description) ||
                      t("noDescriptionAvailable")}
                  </p>
                </div>
              )}
              {activeTab === "rating" && (
                <div className="product-ratings">
                  {/* Left side: Rating submission form */}
                  <div className="rating-form">
                    <h4>{t("Write A Review")}</h4>
                    <div>
                      <Rate
                        value={userRating}
                        onChange={setUserRating}
                        disabled={submittingRating}
                      />
                    </div>
                    <div>
                      <Input.TextArea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder={t("Write Your Comment Here")}
                        rows={4}
                        disabled={submittingRating}
                      />
                    </div>
                    <Button
                      type="primary"
                      onClick={handleSubmitRatingAndComment}
                      loading={submittingRating}
                      disabled={!userRating}
                    >
                      {t("Submit Review")}
                    </Button>
                  </div>

                  {/* Right side: Display all reviews */}
                  <div className="all-ratings">
                    <h4>{t("All Reviews")}</h4>
                    {ratings.length > 0 ? (
                      ratings.map((rating, index) => (
                        <div key={index} className="rating-card">
                          <div className="customer-info">
                            <span className="customer-name">
                              {rating.customerName}
                            </span>
                            <Rate disabled value={rating.ratingValue} />
                          </div>
                          {rating.comment && (
                            <p className="customer-comment">{rating.comment}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-reviews">{t("noReviewsYet")}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProductDetail;
