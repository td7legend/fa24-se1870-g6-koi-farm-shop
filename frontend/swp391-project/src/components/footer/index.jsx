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
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
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
              {t("hotline")}: 024xxx.xxx.xxx
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
            <h4>{t("personal")}</h4>
            <ul>
              <li>
                <Link to="/user-dashboard/:id">{t("account")}</Link>
              </li>
              <li>
                <Link to="/cart">{t("cart")}</Link>
              </li>
              <li>
                <Link to="/user-setting/:id">{t("changePassword")}</Link>
              </li>
              <li>
                <Link to="/order-history">{t("orderHistory")}</Link>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <h4>{t("aboutUs")}</h4>
            <ul>
              <li>
                <Link to="/consignment">{t("consignment")}</Link>
              </li>
              <li>
                <Link to="/fish-page">{t("fishs")}</Link>
              </li>
              <li>
                <Link to="/">{t("home")}</Link>
              </li>
              <li>
                <Link to="/about-us">{t("aboutOurShop")}</Link>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <h4>{t("support")}</h4>
            <ul>
              <li>
                <Link to="/contact">{t("contact")}</Link>
              </li>
              <li>
                <Link to="/faqs-page">FAQs</Link>
              </li>
              <li>
                <Link to="/policy-page">{t("policy")}</Link>
              </li>
              <li>
                <Link to="/shopping-guide">{t("shoppingGuide")}</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p>© 2024 Golden Koi. {t("allRightsReserved")}</p>
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
