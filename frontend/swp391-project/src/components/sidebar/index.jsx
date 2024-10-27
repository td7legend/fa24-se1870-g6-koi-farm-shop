import React from "react";
import { NavLink } from "react-router-dom";
import {
  faFish,
  faList,
  faShoppingCart,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";
import { useTranslation } from "react-i18next";
function Sidebar({ onHover }) {
  const { t } = useTranslation();
  return (
    <div
      className="sidebar"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="sidebar__logo">
        <h2>{t("staffDashboard")}</h2>
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
