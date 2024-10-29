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
import { useDispatch, useSelector } from "react-redux";
import config from "../../config/config";
import { AES, enc } from "crypto-js";
import { setCart } from "../../store/actions/cartAction";
import { useTranslation } from "react-i18next";
import LoadingKoi from "../../components/loading";

const Cart = () => {
  const [cart, setCartNoneRedux] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchCart();
    fetchFishes();
  }, []);
  const { t } = useTranslation();
  const fetchCart = async () => {
    try {
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        return;
      }

      const response = await axios.get(`${config.API_ROOT}cart`, {
        headers: {
          Authorization: `Bearer ${token ?? null}`,
        },
      });

      if (response.data && response.data.length > 0) {
        setCartNoneRedux(response.data[0]);
        dispatch(setCart(response.data[0].orderLines || []));
      } else {
        setCartNoneRedux(null);
        message.info(t("yourCartIsEmpty"));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // toast.error("Failed to fetch cart data. Please try again later.");
    }
  };

  const fetchFishes = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}fishs`);
      setFishes(response.data);
    } catch (error) {
      console.error("Error fetching fishes:", error);
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
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        return;
      }

      await axios.patch(
        `${config.API_ROOT}carts`,
        { fishId, isAdd, isRemove },
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
          },
        }
      );

      fetchCart();
      toast.success(
        isRemove ? t("fishRemovedFromCart") : t("cartUpdatedSuccessfully")
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(t("failedToUpdateCartPleaseTryAgain"));
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
      title: t("fish"),
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
      title: t("price"),
      key: "price",
      render: (_, record) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {`${getFishPrice(record.fishId).toLocaleString()} VND`}
        </span>
      ),
    },
    {
      title: t("quantity"),
      key: "quantity",
      render: (_, record) => (
        <div className="quantity-input">
          <Button
            className="button-quantity"
            onClick={() => handleDecreaseQuantity(record.fishId)}
            style={{ border: "none" }}
          >
            -
          </Button>
          <span style={{ margin: "0 10px" }}>{record.quantity}</span>
          <Button
            className="button-quantity"
            onClick={() => handleIncreaseQuantity(record.fishId)}
            style={{ border: "none" }}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: t("total"),
      key: "total",
      render: (_, record) => (
        <span style={{ whiteSpace: "nowrap" }}>
          {`${(
            getFishPrice(record.fishId) * record.quantity
          ).toLocaleString()} VND`}
        </span>
      ),
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <Button
          className="button-main"
          onClick={() => handleRemoveItem(record.fishId)}
        >
          {t("remove")}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <LoadingKoi />;
  }

  return (
    <div className="cart-page">
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">
              {t("productList")}
            </Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-page">
              {t("cart")}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="cart-container">
        <Card
          className="card"
          title={t("cart")}
          style={{
            width: "100%",
            maxWidth: 800,
            margin: "20px auto",
            padding: "20px",
            borderRadius: "20px",
            background: "rgba(255, 250, 240, 0.7)",
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
                  style={{ fontSize: 15, fontWeight: "bold", marginBottom: 10 }}
                >
                  {t("totalPrice")}: {calculateTotalPrice().toLocaleString()}{" "}
                  VND
                </p>
                <Button
                  className="button"
                  size="large"
                  onClick={() => (window.location.href = "/products")}
                  style={{ marginRight: 10 }}
                >
                  {t("backToShop")}
                </Button>
                <Button
                  className="button-main"
                  href="/checkout"
                  size="large"
                  style={{ width: 200 }}
                >
                  {t("checkout")}
                </Button>
              </div>
            </>
          ) : (
            <p>{t("yourCartIsEmpty")}</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Cart;
