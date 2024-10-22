import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  message,
  Breadcrumb,
  Tag,
  Button,
  Modal,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  faHome,
  faClipboardList,
  faTag,
  faShoppingCart,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
const { Title } = Typography;
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../../store/actions/authActions";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
const config = {
  API_ROOT: "https://localhost:44366/api",
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${config.API_ROOT}/orders/order-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const processedOrders = response.data.map((order) => ({
        ...order,
        key: order.orderId,
      }));

      console.log("Processed orders:", processedOrders); // For debugging

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "TOTAL",
      dataIndex: "totalAmount",
      key: "total",
      render: (total) =>
        (total || 0).toLocaleString("vi-VN", {
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
    setShowConfirmation(false);
    navigate("/");
  };

  return (
    <div className="user-history-container">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Account</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">History</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="layout-container">
        <aside className="settings-sider">
          <ul className="settings-menu">
            <li onClick={() => navigate("/user-dashboard/:id")}>
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </li>
            <li className="active">
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
        <div style={{ maxWidth: 1200 }}></div>

        <div className="order-history-container">
          <Card className="card">
            <Title level={3}>Order History</Title>
            <Table
              className="order-history-table"
              columns={columns}
              dataSource={orders}
              loading={loading}
              pagination={{
                total: orders.length,
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
              }}
            />
          </Card>
        </div>
      </div>

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
            style={{ backgroundColor: "#C0C0C0", color: "black" }}
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

export default OrderHistoryPage;
