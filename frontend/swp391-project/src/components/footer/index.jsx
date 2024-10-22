import "./index.scss";
import logo from "../../images/logo.png";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Logo, địa chỉ, số điện thoại, email */}
        <div className="footer__top">
          <div className="footer__logo-section">
            <Link to="/">
              <img src={logo} alt="Golden Koi" className="footer__logo-small" />
            </Link>
          </div>

          <div className="footer__info">
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
        </div>

        {/* Đường kẻ ngang */}
        <hr className="footer__divider" />

        {/* Footer Menu */}
        <div className="footer__menu">
          <div className="footer__column">
            <h4>Personal</h4>
            <ul>
              <li>
                <Link to="/user-dashboard/:id">Account</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/user-setting/:id">Change Password</Link>
              </li>
              <li>
                <Link to="/order-history">Order History</Link>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <h4>About Us</h4>
            <ul>
              <li>
                <Link to="/consignment">Consignment</Link>
              </li>
              <li>
                <Link to="/products">Product</Link>
              </li>
              <li>
                <Link to="/">Home Page</Link>
              </li>
              <li>
                <Link to="/about-us">About Our Shop</Link>
              </li>
            </ul>
          </div>

          <div className="footer__column">
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
                <Link to="/shopping-guide">Shopping Guide</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p>© 2024 Golden Koi. All rights reserved.</p>
          <div className="footer__social-media">
            <Link
              to="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </Link>
            <Link
              to="https://www.instagram.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link
              to="https://www.twitter.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            {/* Thêm các logo khác nếu cần */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
