import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { useTranslation } from "react-i18next";
function Sidebar() {
  const { t } = useTranslation();
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h2>{t("staffDashboard")}</h2>
      </div>
      <nav className="sidebar__nav">
        <ul>
          <li>
            <Link to="/staff-dashboard/order-management">
              {t("orderManagement")}
            </Link>
          </li>
          <li>
            <Link to="/staff-dashboard/fish-management">
              {t("fishManagement")}
            </Link>
          </li>
          <li>
            <Link to="/staff-dashboard/fishtype-management">
              {t("fishTypeManagement")}
            </Link>
          </li>
          <li>
            <Link to="/staff-dashboard/consignment-management">
              {t("consignmentManagement")}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
