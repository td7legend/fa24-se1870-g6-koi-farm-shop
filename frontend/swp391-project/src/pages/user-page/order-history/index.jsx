import React, { useState, useEffect } from "react";
import { Table, Typography, Space, message, Breadcrumb, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const config = {
  API_ROOT: "https://localhost:44366/api",
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No authentication token found. Please log in.");
        // Optionally, redirect to login page
        // navigate('/login');
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
      case 1:
        return <Tag color="green">Paid</Tag>;
      case 2:
        return <Tag color="blue">Shipping</Tag>;
      case 3:
        return <Tag color="purple">Completed</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
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
      render: (total, record) =>
        `${(total || 0).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })} (${record.orderLines?.length || 0} Products)`,
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

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/user_info/user">
            User Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item>Order History</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Order History</Title>
        <Table
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
      </Space>
    </div>
  );
};

export default OrderHistoryPage;
