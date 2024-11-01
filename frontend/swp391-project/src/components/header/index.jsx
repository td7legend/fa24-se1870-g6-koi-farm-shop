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
import { Drawer, List, Button, Typography, message, Badge, Modal } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearCart, setCart } from "../../store/actions/cartAction";
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from "react-i18next";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
        if (role === "Customer") {
          const response = await axios.get(
            `${config.API_ROOT}customers/my-info`,
            {
              headers: { Authorization: `Bearer ${token ?? null}` },
            }
          );
          if (response?.data) {
            setUserData(response.data);
          }
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    const fetchCart = async () => {
      if (role === "Customer") {
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
  }, [token, dispatch, role]);

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

  const handleConfirmLogout = () => {
    Modal.confirm({
      title: t("confirmLogout"),
      icon: <ExclamationCircleOutlined />,
      content: t("logoutConfirmMessage"),
      okText: t("yes"),
      cancelText: t("no"),
      onOk() {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  const renderDashboardButton = () => {
    if (role === "Manager") {
      return (
        <div className="dashboard-wrapper">
          <Link
            to="/admin-dashboard/staff-management"
            className="dashboard-button"
          >
            <FontAwesomeIcon icon={faUser} className="fa__icon" />
            {t("adminDashboard")}
          </Link>
          <button className="logout-button" onClick={handleConfirmLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="fa__icon" />
            {t("logout")}
          </button>
        </div>
      );
    } else if (role === "Staff") {
      return (
        <div className="dashboard-wrapper">
          <Link
            to="/staff-dashboard/order-management"
            className="dashboard-button"
          >
            <FontAwesomeIcon icon={faUser} className="fa__icon" />
            {t("staffDashboard")}
          </Link>
          <button className="logout-button" onClick={handleConfirmLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="fa__icon" />
            {t("logout")}
          </button>
        </div>
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
            <button className="dropdown-link logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="fa__icon" />
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
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

          {role === 0 && (
            <div className="cart" onClick={handleCartClick}>
              {t("yourCart")}
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="fa__icon cart-icon"
              />
            </div>
          )}

          {role === "Customer" && (
            <div className="cart" onClick={handleCartClick}>
              {t("yourCart")}
              <Badge
                count={cartItemsRedux.length}
                overflowCount={9}
                offset={[5, -10]}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="fa__icon cart-icon"
                />
              </Badge>
            </div>
          )}

          {!isLoggedIn ? (
            <Link to="/login" className="register__sign__in">
              {t("registerSignIn")}
              <FontAwesomeIcon icon={faUser} className="fa__icon" />
            </Link>
          ) : role === "Manager" || role === "Staff" ? (
            renderDashboardButton()
          ) : (
            <div
              className="register__sign__in"
              onClick={toggleUserDropdown}
              ref={userDropdownRef}
            >
              {userData.fullName}
              <img
                src="https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
                alt="User"
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "8px",
                  borderRadius: "50px",
                }}
              />
              {isUserDropdownOpen && (
                <div className="user-dropdown">
                  <Link
                    to={`/user-dashboard/${userData.userId}`}
                    className="dropdown-item"
                  >
                    <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                    {t("myAccount")}
                  </Link>
                  <div onClick={handleLogout} className="dropdown-item">
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="dropdown-icon"
                    />
                    {t("logout")}
                  </div>
                </div>
              )}
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
                    <Link to="/batch-filter">{t("fishSellByBatch")}</Link>
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
            <li className="dropdown">
              <Link to="/consignment">
                <FontAwesomeIcon icon={faHandHoldingUsd} className="fa__icon" />
                {t("consignment")}
                <ul className="dropdown-menu">
                  <li className="menu-item">
                    <Link to="/consignment/care">{t("consignmentCare")}</Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/consignment/sell">{t("consignmentSale")}</Link>
                  </li>
                </ul>
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
