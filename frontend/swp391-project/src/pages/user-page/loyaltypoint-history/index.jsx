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
} from "antd";
import { HomeOutlined, UserOutlined, HistoryOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config/config";

const { Title } = Typography;
const { Content } = Layout;

const LoyaltyPointHistory = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();

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
      // Sort by ID in descending order
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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Content style={{ padding: "0 50px" }}>
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%", marginTop: 24 }}
        >
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/user_info/user">
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item>Loyalty Points History</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title level={3}>
                <HistoryOutlined /> Loyalty Points History
              </Title>

              <Table
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
            </Space>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default LoyaltyPointHistory;
