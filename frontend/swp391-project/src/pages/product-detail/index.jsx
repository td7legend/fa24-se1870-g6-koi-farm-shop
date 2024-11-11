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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MessageOutlined,
  MailOutlined,
} from "@ant-design/icons";

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
  const [productImages, setProductImages] = useState([]);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [certificateImages, setCertificateImages] = useState([]);
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

  useEffect(() => {
    if (id) {
      fetchProductImages();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCertificateImages();
    }
  }, [id]);

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
  const fetchCertificateImages = async () => {
    try {
      const response = await axios.get(
        `${config.API_ROOT}fishs/certificates/${id}`
      );
      const imageUrls = response.data.map((cert) => cert.url);
      setCertificateImages(imageUrls);
    } catch (error) {
      // toast.error(t("failedToFetchCertificateImages"));
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

  const fetchProductImages = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs/images/${id}`);
      if (response.data) {
        const images = response.data.map((item) => ({
          imageUrl: item.imageUrl,
        }));
        setProductImages(images);
      }
    } catch (error) {
      console.error("Failed to fetch product images:", error);
    }
  };

  const mainSliderSettings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: nav2,
  };

  const thumbnailSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    focusOnSelect: true,
    asNavFor: nav1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

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
        <Row gutter={[24, 24]}>
          <Col span={10}>
            <div className="product-slider-container">
              <Slider
                asNavFor={nav2}
                ref={(slider1) => setNav1(slider1)}
                className="main-slider"
              >
                <div>
                  <Image
                    src={product.imageUrl}
                    alt={product?.name}
                    preview={true}
                    className="main-image"
                  />
                </div>
                {productImages.map((img, idx) => (
                  <div key={idx}>
                    <Image
                      src={img.imageUrl}
                      alt={`${product?.name} ${idx + 1}`}
                      preview={true}
                      className="main-image"
                    />
                  </div>
                ))}
              </Slider>

              <Slider
                asNavFor={nav1}
                ref={(slider2) => setNav2(slider2)}
                slidesToShow={3}
                swipeToSlide={true}
                focusOnSelect={true}
                className="thumbnail-slider"
              >
                <div>
                  <img src={product.imageUrl} alt={product?.name} />
                </div>
                {productImages.map((img, idx) => (
                  <div key={idx}>
                    <img
                      src={img.imageUrl}
                      alt={`${product?.name} ${idx + 1}`}
                    />
                  </div>
                ))}
              </Slider>
            </div>
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
                  {capitalizeFirstLetter(currentFishTypes.name)}
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
                <div
                  className={`tab-item ${
                    activeTab === "certificate" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("certificate")}
                >
                  {t("Certificate Images")}
                </div>
              </div>

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
              {activeTab === "certificate" && (
                <div className="product-certificates">
                  <h3>{t("Certificate Images")}</h3>
                  <div className="certificate-grid">
                    {certificateImages.length > 0 ? (
                      certificateImages.map((url, index) => (
                        <div key={index} className="certificate-item">
                          <Image
                            src={url}
                            alt={`Certificate ${index + 1}`}
                            preview={true}
                            className="certificate-image"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="no-certificates">
                        {t("No certificates available")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* <Col span={5}>
            <div className="contact-info-card">
              <div className="card-header">THÔNG TIN LIÊN HỆ</div>
              <div className="contact-items-container">
                <div className="contact-item">
                  <EnvironmentOutlined className="icon" />
                  <div className="text">
                    Lô E2a-7, Đường D1, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ
                    Chí Minh
                  </div>
                </div>
                <div className="contact-item">
                  <PhoneOutlined className="icon" />
                  <div className="text">
                    <a href="tel:0932144888">0932.144.888</a>
                  </div>
                </div>
                <div className="contact-item">
                  <MessageOutlined className="icon" />
                  <div className="text">
                    <a href="tel:0971466888">0971.466.888</a>
                  </div>
                </div>
                <div className="contact-item">
                  <MailOutlined className="icon" />
                  <div className="text">
                    <a href="mailto:goldenkoi.vn@gmail.com">
                      goldenkoi.vn@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Col> */}
        </Row>
      </div>
    </div>
  );
}

export default ProductDetail;
