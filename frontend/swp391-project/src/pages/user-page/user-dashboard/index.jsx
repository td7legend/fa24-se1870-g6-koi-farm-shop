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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/actions/authActions";
import { toast, ToastContainer } from "react-toastify";
import "./index.scss";
const config = {
  API_ROOT: "https://localhost:44366/api",
};

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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get(
          `${config.API_ROOT}/customers/my-info`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userResponse.data);

        const ordersResponse = await axios.get(
          `${config.API_ROOT}/orders/order-history`,
          {
            headers: { Authorization: `Bearer ${token}` },
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
          toast.error("Authentication failed. Please log in again.");
          navigate("/login");
        } else {
          toast.error(
            "An error occurred while fetching data. Please try again later."
          );
        }
      } finally {
        setLoading(false);
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
        return <Tag color="green">Paid</Tag>;
      case "Shipping":
        return <Tag color="blue">Shipping</Tag>;
      case "Completed":
        return <Tag color="purple">Completed</Tag>;
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
      title: "DATE",
      dataIndex: "orderDate",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "TOTAL",
      dataIndex: "totalAmount",
      key: "total",
      render: (total) =>
        total.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() =>
            navigate("/order-details", { state: { orderId: record.orderId } })
          }
          style={{ color: "#D4B57E" }}
        >
          View Details
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
          <Breadcrumb.Item>Account</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            User Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="layout-container">
        <aside className="settings-sider">
          <h4>Navigation</h4>
          <ul className="settings-menu">
            <li className="active">
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </li>
            <li onClick={() => navigate("/order-history")}>
              <FontAwesomeIcon icon={faClipboardList} /> Order History
            </li>
            <li onClick={() => navigate("/promotion")}>
              <FontAwesomeIcon icon={faTag} /> Promotion
            </li>
            <li onClick={() => navigate("/cart")}>
              <FontAwesomeIcon icon={faShoppingCart} /> Shopping Cart
            </li>
            <li onClick={() => navigate("/user-setting/:id")}>
              <FontAwesomeIcon icon={faCog} /> Setting
            </li>

            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </aside>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}></div>
        <Card style={{ marginBottom: 24 }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
            User Profile
          </Title>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar
              src={user.avatar_path || DEFAULT_AVATAR}
              size={128}
              icon={<UserOutlined />}
            />
          </div>

          {renderUserInfo("Full Name", user.fullName)}
          {renderUserInfo("Address", user.address)}
          {renderUserInfo("Email", user.email)}
          {renderUserInfo("Phone", user.phoneNumber)}
          {renderUserInfo("Total Points", user.tier)}
          {renderUserInfo("Points Available", user.pointAvailable)}
          {renderUserInfo("Points Used", user.usedPoint)}
        </Card>

        <Card>
          <Title level={3}>Recent Order History</Title>
          <Table
            columns={columns}
            dataSource={orderHistory}
            pagination={false}
            rowKey="orderId"
          />
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Link to="/order-history" style={{ color: "#D4B57E" }}>
              View All Orders
            </Link>
          </div>
        </Card>
      </div>
      <ToastContainer />

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
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleLogout}
            style={{ backgroundColor: "#bbab6f", color: "white" }}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default UserDashboard;
