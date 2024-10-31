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
  faHandHoldingUsd,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
const { Title } = Typography;
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../../store/actions/authActions";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../config/config";
import { useTranslation } from "react-i18next";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error(t("noAuthenticationTokenFound"));
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${config.API_ROOT}orders/order-history`,
        {
          headers: { Authorization: `Bearer ${token ?? null}` },
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
      message.error(t("failedFetchOrders"));
    } finally {
      setLoading(false);
    }
  };

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
      render: (date) => formatDate(date),
    },
    {
      title: t("totalAmount"),
      dataIndex: "totalAmount",
      key: "total",
      render: (total) =>
        (total || 0).toLocaleString("vi-VN", {
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
          <Breadcrumb.Item>{t("account")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            {t("history")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="layout-container">
        <aside className="settings-sider">
          <ul className="settings-menu">
            <li onClick={() => navigate("/user-dashboard/:id")}>
              <FontAwesomeIcon icon={faHome} /> {t("dashboard")}
            </li>
            <li className="active">
              <FontAwesomeIcon icon={faClipboardList} /> {t("orderHistory")}
            </li>
            <li onClick={() => navigate("/loyaltypoint-history")}>
              <FontAwesomeIcon icon={faTrophy} /> {t("loyaltyPoint")}
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

        <div className="order-history-container">
          <Card className="card">
            <Title level={3}>{t("orderHistory")}</Title>
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
        title={t("confirmLogout")}
        visible={showConfirmation}
        onOk={handleLogout}
        onCancel={() => setShowConfirmation(false)}
        okText={t("logout")}
        cancelText={t("cancel")}
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
            {t("confirm")}
          </Button>,
        ]}
      >
        <p>{t("confirmLogoutMessage")}</p>
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
