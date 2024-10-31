import { useEffect, useState } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faGlobe,
  faHome,
  faFish,
  faBlog,
  faInfoCircle,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AES, enc } from "crypto-js";
import config from "../../config/config";
import axios from "axios";
import { logout } from "../../store/actions/authActions";
import EnhancedSearchBar from "../autosuggest";
import { Drawer, List, Button, Typography, message } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearCart, setCart } from "../../store/actions/cartAction";
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

const Header = ({ cartDrawerVisible, setCartDrawerVisible }) => {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({});
  const [fishes, setFishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  // const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const { cartItemsRedux } = useSelector((state) => state.cart);

  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    return fish ? fish.price : 0;
  };
  const { t } = useTranslation();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${config.API_ROOT}customers/my-info`,
          {
            headers: { Authorization: `Bearer ${token ?? null}` },
          }
        );
        if (response?.data) {
          setUserData(response.data);
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}cart`, {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
          },
        });
        if (response.data && response.data.length > 0) {
          setCartItems(response.data[0].orderLines || []);
          dispatch(setCart(response.data[0].orderLines || []));
        }
      } catch (error) {
        if (error.status === 404) {
          console.log(t("yourCartIsEmpty"));
          dispatch(clearCart());
        }
        console.log("Error: ", error.message);
      }
    };

    const fetchFishes = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}fishs`);
        setFishes(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };

    if (token) {
      fetchUser();
      fetchCart();
      fetchFishes();
    }

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsNavFixed(true);
      } else {
        setIsNavFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [token, dispatch]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.error(t("loginToSeeYourCart"));
      navigate("/login");
    } else {
      setCartDrawerVisible(true);
    }
  };

  const calculateTotal = () => {
    return cartItemsRedux.reduce((total, item) => {
      const price = getFishPrice(item.fishId);
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <header className={`header ${cartDrawerVisible ? "blur-background" : ""}`}>
      <div className="header__top">
        <div className="header__logo">
          <Link to="/">
            <img src={logo} alt="Golden Koi" />
          </Link>
        </div>
        <div className="search__bar">
          <EnhancedSearchBar />
        </div>

        {/* User Options */}
        <div className="user__options">
          <div className="language" onClick={toggleDropdown}>
            <LanguageSelector />
          </div>

          <div className="cart" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faShoppingCart} className="fa__icon" />{" "}
            {t("yourCart")}
          </div>

          {!isLoggedIn ? (
            <Link to="/login" className="register__sign__in">
              <FontAwesomeIcon icon={faUser} className="fa__icon" />{" "}
              {t("registerSignIn")}
            </Link>
          ) : (
            <Link
              to={`/user-setting/${userData.userId}`}
              className="register__sign__in"
            >
              <FontAwesomeIcon icon={faUser} className="fa__icon" />
              {userData.fullName}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className={`header__menu ${isNavFixed ? "fixed" : ""}`}>
        <nav className="nav__links">
          <ul>
            <li>
              <Link to="/" className="nav__link">
                {t("home")}
              </Link>
            </li>
            <li className="dropdown">
              <Link to="/fish-page">
                <FontAwesomeIcon icon={faFish} className="fa__icon" />{" "}
                {t("fish")}
                <ul className="dropdown-menu">
                  <li className="menu-item">
                    <Link to="/fish-page">{t("fishList")}</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/batch-fish">{t("fishSellByBatch")}</Link>
                  </li>
                </ul>
              </Link>
            </li>
            <li>
              <Link to="/blog">
                <FontAwesomeIcon icon={faBlog} className="fa__icon" />{" "}
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link to="/about-us">
                <FontAwesomeIcon icon={faInfoCircle} className="fa__icon" />{" "}
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link to="/consignment">
                <FontAwesomeIcon icon={faHandHoldingUsd} className="fa__icon" />{" "}
                {t("consignment")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <Drawer
        title={t("yourCart")}
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        visible={cartDrawerVisible}
        width={400}
        className="drawer-container"
      >
        <List
          itemLayout="horizontal"
          dataSource={cartItemsRedux}
          renderItem={(item) => {
            const price = getFishPrice(item.fishId);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <img src={item.imageUrl} width={50} alt={item.fishName} />
                  }
                  title={item.fishName}
                  description={`${t("quantity")}: ${item.quantity}`}
                />
                <div>
                  <Text>{(price * item.quantity).toLocaleString()} VND</Text>{" "}
                </div>
              </List.Item>
            );
          }}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Text strong>
            {t("total")}: {calculateTotal().toLocaleString()} VND
          </Text>
        </div>
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button type="primary" onClick={() => setCartDrawerVisible(false)}>
            {t("close")}
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => (window.location.href = "/cart")}
          >
            {t("viewFullCart")}
          </Button>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
