import { Link } from "react-router-dom";
import "./index.scss";
import CurrencyFormatter from "../../currency";
const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.name}`} className="product-card">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="product-image"
      />
      <h3 style={{ height: "100px" }}>{product.name}</h3>
      <p className="product-price">
        <CurrencyFormatter amount={product.price} />
      </p>
    </Link>
  );
};

export default ProductCard;
