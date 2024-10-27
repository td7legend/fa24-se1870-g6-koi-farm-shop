import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spin,
  Table,
  Breadcrumb,
  Avatar,
  Row,
  Col,
  message,
  Button,
  Modal,
  Tag,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  faHome,
  faClipboardList,
  faTag,
  faShoppingCart,
  faCog,
  faSignOutAlt,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getEmailFromToken, logout } from "../../../store/actions/authActions";
import { toast, ToastContainer } from "react-toastify";
import "./index.scss";
import config from "../../../config/config";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!token) {
        toast.error(t("noAuthenticationTokenFound"));
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get(
          `${config.API_ROOT}customers/my-info`,
          {
            headers: { Authorization: `Bearer ${token ?? null}` },
          }
        );
        setUser(userResponse.data);

        const ordersResponse = await axios.get(
          `${config.API_ROOT}orders/order-history`,
          {
            headers: { Authorization: `Bearer ${token ?? null}` },
          }
        );
        const sortedOrders = ordersResponse.data
          .sort((a, b) => b.orderId - a.orderId)
          .slice(0, 5);
        setOrderHistory(sortedOrders);
        console.log("Raw orders data:", ordersResponse.data); // Debugging log
        console.log("Processed orders:", sortedOrders); // Debugging log
      } catch (error) {
        toast.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
          toast.error(t("authenticationFailed"));
          navigate("/login");
        } else {
          toast.error(t("errorFetchingData"));
        }
      } finally {
        setLoading(false);
      }
      try {
        const email = jwtDecode(token).userId;
        console.log(token);
        user.email = email;
        console.log(email);
      } catch (error) {
        console.log("Error: ", error.message);
      }
    };

    fetchData();
  }, [navigate]);

  const renderUserInfo = (label, value) => (
    <Row style={{ marginBottom: 16 }}>
      <Col span={8}>
        <Text strong>{label}:</Text>
      </Col>
      <Col span={16}>
        <Text>{value}</Text>
      </Col>
    </Row>
  );

  const getStatusTag = (status) => {
    switch (status) {
      case "Paid":
        return <Tag color="green">{t("paid")}</Tag>;
      case "Shipping":
        return <Tag color="blue">{t("shipping")}</Tag>;
      case "Completed":
        return <Tag color="purple">{t("completed")}</Tag>;
      default:
        return <Tag color="default">{status || "Unknown"}</Tag>;
    }
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => `#${orderId}`,
    },
    {
      title: t("date"),
      dataIndex: "orderDate",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("total"),
      dataIndex: "totalAmount",
      key: "total",
      render: (total) =>
        total.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: t("action"),
      key: "action",
      render: (_, record) => (
        <a
          onClick={() =>
            navigate("/order-details", { state: { orderId: record.orderId } })
          }
          style={{ color: "#D4B57E" }}
        >
          {t("viewDetails")}
        </a>
      ),
    },
  ];

  const confirmLogout = () => {
    setShowConfirmation(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowConfirmation(false); // Đóng hộp thoại xác nhận
    navigate("/"); // Điều hướng đến trang đăng nhập
  };

  return (
    <div className="user-dashboard-container">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon
              icon={faHome}
              style={{
                marginRight: "8px",
                verticalAlign: "middle",
                marginBottom: "5px",
              }}
            />
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t("account")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            {t("userDashboard")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-container">
        <aside className="settings-sider">
          <ul className="settings-menu">
            <li className="active">
              <FontAwesomeIcon icon={faHome} /> {t("dashboard")}
            </li>
            <li onClick={() => navigate("/order-history")}>
              <FontAwesomeIcon icon={faClipboardList} /> {t("orderHistory")}
            </li>
            <li onClick={() => navigate("/promotion")}>
              <FontAwesomeIcon icon={faTag} /> {t("promotion")}
            </li>
            <li onClick={() => navigate("/cart")}>
              <FontAwesomeIcon icon={faShoppingCart} /> {t("shoppingCart")}
            </li>
            <li onClick={() => navigate("/user-setting/:id")}>
              <FontAwesomeIcon icon={faCog} /> {t("setting")}
            </li>
            <li onClick={() => navigate("/consignment-history")}>
              <FontAwesomeIcon icon={faHandHoldingUsd} /> {t("consignment")}
            </li>
            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
            </li>
          </ul>
        </aside>
        <div style={{ maxWidth: 1200 }}></div>
        <div className="user-form">
          <div className="user-information">
            <Card style={{ marginBottom: 24 }}>
              {/* <Title
                level={2}
                style={{ textAlign: "center", marginBottom: 24 }}
              >
                User Profile
              </Title> */}

              <Row gutter={16}>
                <Col span={16}>
                  {renderUserInfo("Full Name", user.fullName)}
                  {renderUserInfo("Address", user.address)}
                  {renderUserInfo("Email", user.email)}
                  {renderUserInfo("Phone", user.phoneNumber)}
                  {renderUserInfo("Total Points", user.tier)}
                  {renderUserInfo("Points Available", user.pointAvailable)}
                  {renderUserInfo("Points Used", user.usedPoint)}
                </Col>

                <Col span={8} style={{ textAlign: "center" }}>
                  <Avatar
                    src={user.avatar_path || DEFAULT_AVATAR}
                    size={128}
                    icon={<UserOutlined />}
                  />
                  <p
                    onClick={() => navigate("/user-setting/:id")}
                    style={{ marginTop: "20px" }}
                  >
                    {t("editProfile")}
                  </p>
                </Col>
              </Row>
            </Card>
          </div>

          <div className="recent-order">
            <Card className="card">
              <Title level={3}>{t("recentOrderHistory")}</Title>
              <Table
                columns={columns}
                dataSource={orderHistory}
                pagination={false}
                rowKey="orderId"
              />
              <div style={{ textAlign: "right", marginTop: 16 }}>
                <Link to="/order-history" style={{ color: "#D4B57E" }}>
                  {t("viewAllOrders")}
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        title="Confirm Logout?"
        visible={showConfirmation}
        onOk={handleLogout}
        onCancel={() => setShowConfirmation(false)}
        okText="Log out"
        cancelText="Cancel"
        footer={[
          <Button
            key="back"
            onClick={() => setShowConfirmation(false)}
            style={{ backgroundColor: "red#C0C0C0", color: "black" }}
          >
            {t("cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleLogout}
            style={{ backgroundColor: "#bbab6f", color: "white" }}
          >
            {t("confirm")}
          </Button>,
        ]}
      >
        <p>{t("confirmLogoutMessage")}</p>
      </Modal>
    </div>
  );
};

export default UserDashboard;
