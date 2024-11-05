import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { Tag, Button, notification, message } from "antd";
import { ShoppingCartOutlined, SwapOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import CurrencyFormatter from "../currency";
import config from "../../config/config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../store/actions/cartAction";
import { useTranslation } from "react-i18next";

const ProductCard = ({ fish, onCompare }) => {
  const { cartItemsRedux } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);
  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        message.error(t("pleaseLogInToAddItemsToYourCart"));
        return;
      }
      const response = await axios.post(
        `${config.API_ROOT}carts`,
        {
          fishId: parseInt(fish.fishId),
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
          description: `${fish.name} ${t("hasBeenAddedToYourCart")}`,
          placement: "topRight",
          duration: 2,
        });
        if (cartItemsRedux.length === 0) {
          dispatch(setCart([{ fish, quantity: 1 }]));
        } else {
          dispatch(addToCart(fish, 1));
        }
      }
    } catch (error) {
      console.error("Error adding fish to cart:", error);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (onCompare) {
      onCompare(fish);
    }
  };
  return (
    <Link to={`/fish/${fish.fishId}`} className="product-card-wrapper">
      <div className="product-card">
        <div className="image">
          <img src={fish.imageUrl} alt={fish.name} />
        </div>
        <div className="info-container">
          <div className="info">
            <h2>{fish.name}</h2>
            <p className="description">{fish.description}</p>
            <div className="tag">
              <div className="tag-item-origin">
                {t("origin")}: {fish.class}
              </div>
              <div className="tag-item-size">
                {t("size")}: {fish.size} cm
              </div>
              <div className="tag-item-age">
                {t("age")}: {fish.age} {t("years")}
              </div>
              <div className="tag-item-gender">
                {t("gender")}: {fish.gender === 1 ? t("male") : t("female")}
              </div>
            </div>
            <p className="price">
              {t("price")}: <CurrencyFormatter amount={fish.price} />
            </p>
          </div>
          <div className="button-container">
            <Button
              className="add-to-cart"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              {t("addToCart")}
            </Button>
            {onCompare && (
              <Button
                className="compare"
                icon={<FontAwesomeIcon icon={faBalanceScale} />}
                onClick={handleCompare}
                shape="circle"
                // size="large"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
