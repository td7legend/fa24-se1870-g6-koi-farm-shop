import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Layout } from "antd";

const { Title } = Typography;
const { Content } = Layout;

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // Gọi API ở đây, xóa data mẫu ở dưới
      const mockOrders = [
        {
          key: "3933",
          id: "#3933",
          date: "4 April, 2021",
          total: "$135.00 (5 Products)",
          status: "Processing",
        },
        {
          key: "5045",
          id: "#5045",
          date: "27 Mar, 2021",
          total: "$25.00 (1 Product)",
          status: "on the way",
        },
        {
          key: "5028",
          id: "#5028",
          date: "20 Mar, 2021",
          total: "$250.00 (4 Products)",
          status: "Completed",
        },
        {
          key: "4600",
          id: "#4600",
          date: "19 Mar, 2021",
          total: "$35.00 (1 Products)",
          status: "Completed",
        },
        {
          key: "4152",
          id: "#4152",
          date: "18 Mar, 2021",
          total: "$578.00 (13 Products)",
          status: "Completed",
        },
        {
          key: "8811",
          id: "#8811",
          date: "10 Mar, 2021",
          total: "$345.00 (7 Products)",
          status: "Completed",
        },
        {
          key: "3536",
          id: "#3536",
          date: "5 Mar, 2021",
          total: "$560.00 (2 Products)",
          status: "Completed",
        },
        {
          key: "1374",
          id: "#1374",
          date: "27 Feb, 2021",
          total: "$560.00 (2 Products)",
          status: "Completed",
        },
        {
          key: "7791",
          id: "#7791",
          date: "25 Feb, 2021",
          total: "$560.00 (2 Products)",
          status: "Completed",
        },
        {
          key: "4846",
          id: "#4846",
          date: "24 Feb, 2021",
          total: "$23.00 (1 Products)",
          status: "Completed",
        },
        {
          key: "5948",
          id: "#5948",
          date: "20 Feb, 2021",
          total: "$23.00 (1 Products)",
          status: "Completed",
        },
        {
          key: "1577",
          id: "#1577",
          date: "12 Oct, 2020",
          total: "$23.00 (1 Products)",
          status: "Completed",
        },
      ];
      setOrders(mockOrders); //thay response ở đây
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const columns = [
    { title: "ORDER ID", dataIndex: "id", key: "id" },
    { title: "DATE", dataIndex: "date", key: "date" },
    { title: "TOTAL", dataIndex: "total", key: "total" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    {
      title: "ACTION",
      key: "action",
      render: () => (
        <a href="/order-details" style={{ color: "#D4B57E" }}>
          View Details
        </a>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Content
        style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <Card>
          <Title level={3}>Order History</Title>
          <Table
            columns={columns}
            dataSource={orders}
            loading={loading}
            pagination={{
              total: orders.length,
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total) => `Total ${total} orders`,
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default OrderHistoryPage;
