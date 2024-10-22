import { useEffect, useState } from "react"; // Import useState hook
import "./index.scss"; // Import the SCSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faGlobe,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AES, enc } from "crypto-js";
import config from "../../config/config";
import axios from "axios";
import { logout } from "../../store/actions/authActions";
import EnhancedSearchBar from "../autosuggest/AutoSuggest";
const Header = () => {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const [fishes, setFishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const decryptedToken = token
    ? AES.decrypt(token, config.SECRET_KEY).toString(enc.Utf8)
    : null;
  const decryptedRole = role
    ? parseInt(AES.decrypt(role, config.SECRET_KEY).toString(enc.Utf8))
    : 0;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${config.API_ROOT}customers/my-info`,
          {
            headers: { Authorization: `Bearer ${decryptedToken ?? null}` },
          }
        );
        console.log("response", response);
        if (response?.data !== null) {
          setUserData(response.data);
        }
      } catch (error) {
        dispatch(logout());
      }
      try {
        const response = await axios.get(`${config.API_ROOT}fishs`);
        setFishes(response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    decryptedToken && fetchUser();
  }, [decryptedToken, dispatch, navigate]);
  console.log("userData", userData);
  const handleScroll = () => {
    if (window.scrollY > 100) {
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

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setIsDropdownOpen(false);
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

          <Link to="/cart" className="cart">
            <FontAwesomeIcon icon={faShoppingCart} className="fa__icon" /> Your
            Cart
          </Link>

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

      {/* Navigation Links - Positioned below the search bar */}
      <div className={`header__menu ${isNavFixed ? "fixed" : ""}`}>
        <nav className="nav__links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="dropdown">
              <Link to="/products">
                Fish
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
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/consignment">Consignment</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

