import "./index.scss"; // Add custom styles here
import logo from "../../images/logo.png";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__1">
          {/* Logo and contact information */}
          <Link to="/">
            <img src={logo} alt="Golden Koi" />
          </Link>
          <p>
            <FontAwesomeIcon icon={faLocationDot} className="icon" />
            Lô E2a-7, Đường D1, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} className="icon" />
            Hotline: 024xxx.xxx.xxx
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            Email: goldenkoi.vn@gmail.com
          </p>
        </div>

        <div className="footer__2">
          {/* Cách nhân */}
          <h4>Personal</h4>
          <ul>
            <li>
              <Link>Account</Link>
            </li>
            <li>
              <Link>Cart</Link>
            </li>
            <li>
              <Link>Change Password</Link>
            </li>
            <li>
              <Link>Order History</Link>
            </li>
          </ul>
        </div>

        <div className="footer__3">
          {/* Về chúng tôi and Hỗ trợ */}
          <h4>About Us</h4>
          <ul>
            <li>
              <Link to="/consignment"> Consignment</Link>
            </li>
            <li>
              <Link to="/products">Product</Link>
            </li>
            <li>
              <Link>Home Page</Link>
            </li>
            <li>
              <Link to="/about-us">About Our Shop</Link>
            </li>
          </ul>
        </div>
        <div className="footer__4">
          <h4>Support</h4>
          <ul>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/faqs-page">FAQs</Link>
            </li>
            <li>
              <Link to="/policy-page">Policy</Link>
            </li>
            <li>
              <Link>Shopping Guide</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
