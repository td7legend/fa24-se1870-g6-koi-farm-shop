import { Link } from "react-router-dom";
import "./index.scss";
const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.name}`} className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p className="product-price">${product.price}</p> 
    </Link>
  );
};

export default ProductCard;
