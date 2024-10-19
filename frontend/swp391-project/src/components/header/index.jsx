import { useEffect, useState } from "react"; // Import useState hook
import "./index.scss"; // Import the SCSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faGlobe,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons"; // Import the necessary icons
import { Link, useNavigate } from "react-router-dom"; // Import Link component from React Router
import logo from "../../images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AES, enc } from "crypto-js";
import config from "../../config/config";
import axios from "axios";
import { logout } from "../../store/actions/authActions";
const Header = () => {
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [language, setLanguage] = useState("English"); // State for language
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token, role } = useSelector((state) => state.auth); // Thêm role vào useSelector
  const decryptedToken = token
    ? AES.decrypt(token, config.SECRET_KEY).toString(enc.Utf8)
    : null;
  const decryptedRole = role
    ? parseInt(AES.decrypt(role, config.SECRET_KEY).toString(enc.Utf8))
    : 0;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      console.log("decryptedToken", decryptedToken);
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
    };
    decryptedToken && fetchUser();
  }, [decryptedToken, dispatch, navigate]);
  console.log("userData", userData);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      // Thay đổi giá trị này tùy thuộc vào khi nào bạn muốn gắn nav
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

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Function to handle language selection
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage); // Update language state
    setIsDropdownOpen(false); // Close the dropdown after selection
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
          <div className="search__input__container">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search__icon"
            />
            <input type="text" placeholder="Search" />
          </div>
          <button type="button">Search</button>
        </div>

        {/* User Options */}
        <div className="user__options">
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
          <Link to="/cart" className="cart">
            <FontAwesomeIcon icon={faShoppingCart} className="fa__icon" /> Your
            Cart
          </Link>
          <div className="language" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faGlobe} className="fa__icon" /> {language}
          </div>

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
                Product
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
