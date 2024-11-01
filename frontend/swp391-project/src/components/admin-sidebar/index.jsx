import { useState } from "react";
import { Menu, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish, faList } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { logout } from "../../store/actions/authActions";
import "./index.scss";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const AdminSidebar = ({ onHover }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
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
      icon: <ExclamationCircleOutlined />,
      content: t("logoutConfirmMessage"),
      okText: t("logout"),
      cancelText: t("cancel"),
      onOk() {
        dispatch(logout());
        navigate("/login");
      },
      okButtonProps: {
        className: "logout-confirm-button",
      },
    });
  };

  return (
    <div
      className={`admin-sidebar ${isHovered ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="logo">{isHovered ? "Admin Dashboard" : "AD"}</div>
      <Menu
        theme="dark"
        mode="inline"
        className="sidebar-menu"
        defaultSelectedKeys={["1"]}
      >
        <Menu.Item
          key="1"
          icon={<DashboardOutlined />}
          onClick={() => navigate("/admin-dashboard")}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<TeamOutlined />}
          onClick={() => navigate("/admin-dashboard/staff-management")}
        >
          Quản lý nhân viên
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<FontAwesomeIcon icon={faFish} />}
          onClick={() => navigate("/admin-dashboard/fish-management")}
        >
          Quản lý cá
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<FontAwesomeIcon icon={faList} />}
          onClick={() => navigate("/admin-dashboard/fishtype-management")}
        >
          Quản lý loại cá
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<ShoppingCartOutlined />}
          onClick={() => navigate("/admin-dashboard/order-management")}
        >
          Quản lý đơn hàng
        </Menu.Item>
        <Menu.Item
          key="6"
          icon={<FileTextOutlined />}
          onClick={() => navigate("/admin-dashboard/consignment-management")}
        >
          Quản lý ký gửi
        </Menu.Item>
        <Menu.Item key="7" icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AdminSidebar;
