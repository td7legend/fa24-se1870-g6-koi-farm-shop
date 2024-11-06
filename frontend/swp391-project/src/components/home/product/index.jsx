import { Link } from "react-router-dom";
import "./index.scss";
import { Tag, Button, notification, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../../currency";
import { useTranslation } from "react-i18next";
import axios from "axios";
import config from "../../../config/config";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addToCart, setCart } from "../../../store/actions/cartAction";

const Product = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItemsRedux } = useSelector((state) => state.cart);
  const fetchCart = async () => {
    const response = await axios.get(`${config.API_ROOT}cart`, {
      headers: {
        Authorization: `Bearer ${token ?? null}`,
      },
    });
    if (response.data) {
      dispatch(setCart(response.data[0].orderLines || []));
    }
  };
  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        message.error(t("pleaseLogInToAddItemsToYourCart"));
        return;
      }
      setIsLoading(true);
      const response = await axios.post(
        `${config.API_ROOT}carts`,
        {
          fishId: parseInt(product.fishId),
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        notification.open({
          message: t("fishAddedToCart"),
          description: `${product.name} ${t("hasBeenAddedToYourCart")}`,
          placement: "topRight",
          duration: 2,
        });
        fetchCart();
      }
    } catch (error) {
      console.error("Error adding fish to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/fish/${product.fishId}`} className="product-card-wrapper">
      <div className="product-card">
        <div className="image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="info-container">
          <div className="info">
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>
            <div className="tag">
              <div className="tag-item-origin">{product.origin}</div>
              <div className="tag-item-size">
                {t("size")}: {product.size} cm
              </div>
            </div>
            <p className="price">
              {t("price")}: <CurrencyFormatter amount={product.price} />
            </p>
          </div>

          <Button
            className="add-to-cart"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
          >
            {isLoading ? t("adding") : t("addToCart")}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default Product;
