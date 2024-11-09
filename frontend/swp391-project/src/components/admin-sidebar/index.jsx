import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFish,
  faList,
  faSignOutAlt,
  faShoppingCart,
  faRightFromBracket,
  faTruck,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../images/logo.png";
import { DashboardOutlined, TeamOutlined } from "@ant-design/icons";
import { logout } from "../../store/actions/authActions";
import { useTranslation } from "react-i18next";
import "./index.scss";

const AdminSidebar = ({ onHover }) => {
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
    Modal.confirm({
      title: t("confirmLogout"),
      icon: <FontAwesomeIcon icon={faRightFromBracket} />,
      content: t("logoutConfirmMessage"),
      okText: t("logout"),
      cancelText: t("cancel"),
      onOk() {
        dispatch(logout());
        navigate("/");
      },
      okButtonProps: {
        className: "admin-logout-confirm-button",
      },
    });
  };

  return (
    <div
      className={`admin-sidebar ${isHovered ? "admin-expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="admin-sidebar__logo">
        <h2>
          {isHovered ? (
            "Admin Dashboard"
          ) : (
            <img src={logo} alt="Golden Koi" className="Logo" />
          )}
        </h2>
      </div>
      <aside className="admin-sidebar__nav">
        <ul className="admin-sidebar__menu">
          <li>
            <NavLink to="/admin-dashboard/dashboard" activeClassName="active">
              <DashboardOutlined className="admin-icon" />
              <span className="admin-label">{t("dashboard")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/staff-management"
              activeClassName="active"
            >
              <TeamOutlined className="admin-icon" />
              <span className="admin-label">{t("staffManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/fish-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faFish} className="admin-icon" />
              <span className="admin-label">{t("fishManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/fishtype-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faList} className="admin-icon" />
              <span className="admin-label">{t("fishtypeManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/consignment-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faTruck} className="admin-icon" />
              <span className="admin-label">{t("consignmentManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/fishcare-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faNotesMedical} className="admin-icon" />
              <span className="admin-label">{t("fishCareManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/order-management"
              activeClassName="active"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="admin-icon" />
              <span className="admin-label">{t("orderManagement")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className={({ isActive }) => (isActive ? "" : undefined)}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="admin-icon" />
              <span className="admin-label">{t("logout")}</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default AdminSidebar;
