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

const { Text } = Typography;

const Header = () => {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({});
  const [fishes, setFishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const decryptedToken = token
    ? AES.decrypt(token, config.SECRET_KEY).toString(enc.Utf8)
    : null;

  // Move getFishPrice outside of useEffect
  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    return fish ? fish.price : 0;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${config.API_ROOT}customers/my-info`,
          {
            headers: { Authorization: `Bearer ${decryptedToken ?? null}` },
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
            Authorization: `Bearer ${decryptedToken ?? null}`,
          },
        });
        if (response.data && response.data.length > 0) {
          setCartItems(response.data[0].orderLines || []);
        }
      } catch (error) {
        message.error("Failed to fetch cart data.");
      }
    };

    const fetchFishes = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}fishs`);
        setFishes(response.data);
      } catch (error) {
        message.error("Failed to fetch fish data.");
      }
    };

    if (decryptedToken) {
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
  }, [decryptedToken, dispatch]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = getFishPrice(item.fishId); // getFishPrice is now accessible here
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <header className="header">
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
            <FontAwesomeIcon icon={faGlobe} className="fa__icon" /> {language}
          </div>

          {!isLoggedIn ? (
            <div className="cart">
              <FontAwesomeIcon icon={faShoppingCart} className="fa__icon" />{" "}
              Your Cart
            </div>
          ) : (
            <div className="cart" onClick={() => setCartDrawerVisible(true)}>
              <FontAwesomeIcon icon={faShoppingCart} className="fa__icon" />{" "}
              Your Cart
            </div>
          )}

          {!isLoggedIn ? (
            <Link to="/login" className="register__sign__in">
              <FontAwesomeIcon icon={faUser} className="fa__icon" />{" "}
              Register/Sign in
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

          {/* Language Dropdown */}
          {isDropdownOpen && (
            <div className="language__dropdown">
              <div onClick={() => handleLanguageChange("English")}>
                <img
                  src="/path/to/us-flag.png"
                  alt="English"
                  className="flag__icon"
                />
              </div>
              <div onClick={() => handleLanguageChange("Tiếng Việt")}>
                <img
                  src="/path/to/vn-flag.png"
                  alt="Tiếng Việt"
                  className="flag__icon"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className={`header__menu ${isNavFixed ? "fixed" : ""}`}>
        <nav className="nav__links">
          <ul>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} className="fa__icon" /> Home
              </Link>
            </li>
            <li className="dropdown">
              <Link to="/fish-page">
                <FontAwesomeIcon icon={faFish} className="fa__icon" /> Fish
                <ul className="dropdown-menu">
                  <li className="menu-item">
                    <Link to="/breed/Ogon">Ogon</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/breed/Ochiba">Ochiba</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/breed/Kujaku">Kujaku</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/breed/kohaku">Kohaku</Link>
                  </li>
                </ul>
              </Link>
            </li>
            <li>
              <Link to="/blog">
                <FontAwesomeIcon icon={faBlog} className="fa__icon" /> Blog
              </Link>
            </li>
            <li>
              <Link to="/about-us">
                <FontAwesomeIcon icon={faInfoCircle} className="fa__icon" />{" "}
                About Us
              </Link>
            </li>
            <li>
              <Link to="/consignment">
                <FontAwesomeIcon icon={faHandHoldingUsd} className="fa__icon" />{" "}
                Consignment
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <Drawer
        title="Your Cart"
        placement="right"
        onClose={() => setCartDrawerVisible(false)}
        visible={cartDrawerVisible}
        width={400}
      >
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <img src={item.imageUrl} width={50} alt={item.fishName} />
                }
                title={item.fishName}
                description={`Quantity: ${item.quantity}`}
              />
              <div>
                <Text>
                  {(getFishPrice(item.fishId) * item.quantity).toLocaleString()}{" "}
                  VND
                </Text>
              </div>
            </List.Item>
          )}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Text strong>Total: {calculateTotal().toLocaleString()} VND</Text>
        </div>
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button type="primary" onClick={() => setCartDrawerVisible(false)}>
            Close
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => (window.location.href = "/cart")}
          >
            View Full Cart
          </Button>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
