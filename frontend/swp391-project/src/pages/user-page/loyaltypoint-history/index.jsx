import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Breadcrumb,
  Spin,
  message,
  Layout,
  Space,
  Button,
  Modal,
} from "antd";
import { HomeOutlined, UserOutlined, HistoryOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCog,
  faHandHoldingUsd,
  faHome,
  faShoppingCart,
  faSignOutAlt,
  faTag,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/actions/authActions";
import "./index.scss";
import LoadingKoi from "../../../components/loading";

const { Title } = Typography;
const { Content } = Layout;

const LoyaltyPointHistory = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.API_ROOT}LoyaltyPoint/history`,
        {
          headers: { Authorization: `Bearer ${token ?? null}` },
        }
      );
      const sortedHistory = response.data.sort(
        (a, b) => b.loyaltyPointId - a.loyaltyPointId
      );
      setHistory(sortedHistory);
    } catch (error) {
      console.error("Error fetching loyalty point history:", error);
      message.error(t("failedToFetchLoyaltyPointHistory"));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "loyaltyPointId",
      key: "loyaltyPointId",
      render: (id) => <Typography.Text>#{id}</Typography.Text>,
    },
    {
      title: "Date",
      dataIndex: "awardedDate",
      key: "awardedDate",
      render: (date) => <Typography.Text>{formatDate(date)}</Typography.Text>,
    },
    {
      title: "Points",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Typography.Text type={amount > 0 ? "success" : "danger"} strong>
          {amount > 0 ? "+" : ""}
          {amount}
        </Typography.Text>
      ),
    },
  ];

  if (loading) {
    return <LoadingKoi />;
  }
  const confirmLogout = () => {
    setShowConfirmation(true);
  };
  const handleLogout = () => {
    dispatch(logout());
    setShowConfirmation(false);
    setTimeout(() => navigate("/"));
  };
  return (
    <div className="user-history-container">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/user-dashboard/:id">
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Loyalty Points History
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="layout-container">
        <aside className="settings-sider">
          <ul className="settings-menu">
            <li onClick={() => navigate("/user-dashboard/:id")}>
              <FontAwesomeIcon icon={faHome} /> {t("dashboard")}
            </li>
            <li onClick={() => navigate("/order-history")}>
              <FontAwesomeIcon icon={faClipboardList} /> {t("orderHistory")}
            </li>
            <li
              className="active"
              onClick={() => navigate("/loyaltypoint-history")}
            >
              <FontAwesomeIcon icon={faTrophy} /> {t("loyaltyPoint")}
            </li>
            <li onClick={() => navigate("/cart")}>
              <FontAwesomeIcon icon={faShoppingCart} /> {t("shoppingCart")}
            </li>
            <li onClick={() => navigate("/user-setting/:id")}>
              <FontAwesomeIcon icon={faCog} /> {t("setting")}
            </li>
            <li onClick={() => navigate("/consignment-history")}>
              <FontAwesomeIcon icon={faHandHoldingUsd} />
              {t("consignment")}
            </li>
            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
            </li>
          </ul>
        </aside>
        <div style={{ maxWidth: 1200 }}></div>
        <div className="loyaltypoint-history-container">
          <div>
            <Card style={{ background: "transparent" }}>
              <Title level={3}>Loyalty Points History</Title>

              <Table
                className="loyaltypoint-history-table"
                columns={columns}
                dataSource={history}
                rowKey="loyaltyPointId"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                }}
                bordered
                size="middle"
              />
            </Card>
          </div>
        </div>
      </div>

      {/* <Layout style={{ minHeight: "100vh", background: "transparent" }}>
        <Content style={{ padding: "0 50px" }}>
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", marginTop: 24 }}
          ></Space>
        </Content>
      </Layout> */}

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

export default LoyaltyPointHistory;
