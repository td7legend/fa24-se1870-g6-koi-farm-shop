import { useEffect, useRef, useState } from "react";
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
  faCog,
  faHistory,
  faSignOutAlt,
  
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AES, enc } from "crypto-js";
import config from "../../config/config";
import axios from "axios";
import { logout } from "../../store/actions/authActions";
import EnhancedSearchBar from "../autosuggest";
import { Drawer, List, Button, Typography, message, Badge } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearCart, setCart } from "../../store/actions/cartAction";
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

const Header = ({ cartDrawerVisible, setCartDrawerVisible }) => {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({});
  const [fishes, setFishes] = useState([]);
  const { cartItemsRedux } = useSelector((state) => state.cart);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const { t } = useTranslation();

  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    return fish ? fish.price : 0;
  };

  // Fetch user, cart, and fish data if token is present
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
          dispatch(setCart(response.data[0].orderLines || []));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(t("yourCartIsEmpty"));
          dispatch(clearCart());
        } else {
          console.log("Error: ", error.message);
        }
      }
    };

    const fetchFishes = async () => {
      try {
        const response = await axios.get(`${config.API_ROOT}fishs`);
        setFishes(response.data);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };

    if (token) {
      fetchUser();
      fetchCart();
      fetchFishes();
    }
  }, [token, dispatch]);

  // Handle clicks outside of user dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      setIsNavFixed(true);
    } else {
      setIsNavFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

<<<<<<< HEAD
  const renderDashboardButton = () => {
    if (role === "Staff") {
      return (
        <li>
          <Link
            to="/staff-dashboard/order-management"
            className="dashboard-link"
          >
            <FontAwesomeIcon icon={faUser} className="fa__icon" />
            {t("staffDashboard")}
          </Link>
        </li>
      );
    } else if (role === "Manager") {
      return (
        <li>
          <Link
            to="/admin-dashboard/staff-management"
            className="dashboard-link"
          >
            <FontAwesomeIcon icon={faUser} className="fa__icon" />
            {t("adminDashboard")}
          </Link>
        </li>
      );
    }
    return null;
  };

  const renderUserDropdown = () => {
    if (!isLoggedIn) return null;

    return (
      <div className="user-dropdown-menu">
        <div className="user-info">
          <div className="info-item">
            <span className="label">{t("role")}:</span>
            <span className="value">{role}</span>
          </div>
          <div className="info-item">
            <span className="label">{t("loyaltyPoints")}:</span>
            <span className="value">{userData.loyaltyPoint || 0}</span>
          </div>
          <div className="info-item">
            <span className="label">{t("membershipLevel")}:</span>
            <span className="value">
              {userData.membershipLevel || "Bronze"}
            </span>
          </div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-links">
            <Link
              to={`/user-dashboard/${userData.userId}`}
              className="dropdown-link"
            >
              <FontAwesomeIcon icon={faUser} className="fa__icon" />
              {t("dashboard")}
            </Link>
            <Link
              to={`/user-setting/${userData.userId}`}
              className="dropdown-link"
            >
              <FontAwesomeIcon icon={faCog} className="fa__icon" />
              {t("settings")}
            </Link>
            <Link to="/order-history" className="dropdown-link">
              <FontAwesomeIcon icon={faHistory} className="fa__icon" />
              {t("orderHistory")}
            </Link>
            <button
              className="dropdown-link logout-btn"
              onClick={() => dispatch(logout())}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="fa__icon" />
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    );
=======
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
>>>>>>> cd3b9e58f7a03747decc089c9b4728183d120f7c
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
            {t("yourCart")}
            <Badge
              count={cartItemsRedux.length}
              overflowCount={9}
              offset={[5, -10]}
              // style={{ background: "#c3b88c" }}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="fa__icon cart-icon"
              />
            </Badge>
          </div>

          {!isLoggedIn ? (
            <Link to="/login" className="register__sign__in">
              {t("registerSignIn")}
              <FontAwesomeIcon icon={faUser} className="fa__icon" />{" "}
            </Link>
          ) : (
            <div
              className="user-profile-wrapper"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <div className="register__sign__in">
                <FontAwesomeIcon icon={faUser} className="fa__icon" />
                {userData.fullName}
              </div>
              {isUserDropdownOpen && renderUserDropdown()}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className={`header__menu ${isNavFixed ? "fixed" : ""}`}>
        <nav className="nav__links">
          <ul>
            <li>
              <Link to="/" className="nav__link">
                <FontAwesomeIcon icon={faHome} className="fa__icon" />
                {t("home")}
              </Link>
            </li>
            <li className="dropdown">
              <Link to="/fish-page">
                <FontAwesomeIcon icon={faFish} className="fa__icon" />
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
              <Link to="/blog-page">
                <FontAwesomeIcon icon={faBlog} className="fa__icon" />
                {t("blog")}
              </Link>
            </li>
            <li>
              <Link to="/about-us">
                <FontAwesomeIcon icon={faInfoCircle} className="fa__icon" />
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link to="/consignment">
                <FontAwesomeIcon icon={faHandHoldingUsd} className="fa__icon" />
                {t("consignment")}
              </Link>
            </li>
            {renderDashboardButton()}
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
