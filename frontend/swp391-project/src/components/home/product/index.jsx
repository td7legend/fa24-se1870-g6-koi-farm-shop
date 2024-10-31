import { Link } from "react-router-dom";
import "./index.scss";
import { Tag, Button, notification } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../../currency";
import { useTranslation } from "react-i18next";

const Product = ({ product }) => {
  const { t } = useTranslation();
  const handleAddToCart = () => {
    notification.open({
      message: t("fishAddedToCart"),
      description: `${product.name} ${t("hasBeenAddedToYourCart")}`,
      placement: "topRight",
      duration: 5,
    });
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
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default Product;
