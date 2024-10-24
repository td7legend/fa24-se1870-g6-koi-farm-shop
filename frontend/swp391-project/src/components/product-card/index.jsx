import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import {Tag, Button, notification } from "antd";
import { ShoppingCartOutlined, SwapOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import CurrencyFormatter from "../currency";

const ProductCard = ({ fish, onCompare }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    notification.open({
      message: "Fish added to cart",
      description: `${fish.name} has been added to your cart`,
      placement: "topRight",
      duration: 2,
    });
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (onCompare) {
      onCompare(fish);
    }
  };

  return (
    <Link to={`/fish/${fish.id}`} className="product-card-wrapper">
      <div className="product-card">
        <div className="image">
          <img src={fish.img_path} alt={fish.name} />
        </div>
        <div className="info-container">
          <div className="info">
            <h2>{fish.name}</h2>
            <p className="description">{fish.description}</p>
            <div className="tag">
              <div className="tag-item-origin">{fish.origin}</div>
              <div className="tag-item-size">Size: {fish.size} cm</div>
            </div>
            <p className="price">
              Price: <CurrencyFormatter amount={fish.price} />
            </p>
          </div>
          <div className="button-container">
            <Button
              className="add-to-cart"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            {onCompare && (
              <Button
                className="compare"
                icon={<FontAwesomeIcon icon={faBalanceScale} />}
                onClick={handleCompare}
              >
                Compare
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
