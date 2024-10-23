import { Link } from "react-router-dom";
import "./index.scss";
import { Tag, Button, notification } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../currency";

const ProductCard = ({ fish }) => {
  const handleAddToCart = () => {
    notification.open({
      message: "Fish added to cart",
      description: `${fish.name} has been added to your cart`,
      placement: "topRight",
      duration: 2,
    });
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

          <Button
            className="add-to-cart"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
