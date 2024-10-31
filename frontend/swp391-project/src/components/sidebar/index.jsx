import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  faFish,
  faList,
  faShoppingCart,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../../store/actions/authActions";
function Sidebar({ onHover }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className={`sidebar ${isHovered ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar__logo">
        {isHovered ? "Staff Dashboard" : "SD"}
        {/* <h2>{t("staffDashboard")}</h2> */}
      </div>
      <aside className="sidebar__nav">
        <ul className="sidebar__menu">
          <li>
            <NavLink
              to="/staff-dashboard/order-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="icon" />
              <span className="label">{t("orderManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff-dashboard/fish-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faFish} className="icon" />
              <span className="label">{t("fishManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff-dashboard/fishtype-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faList} className="icon" />
              <span className="label">{t("fishtypeManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff-dashboard/consignment-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faTruck} className="icon" />
              <span className="label">{t("consignmentManagement")}</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
}

export default Sidebar;
