import React, { useState, useEffect } from "react";
import { Table, Typography, Space, message, Breadcrumb, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Title } = Typography;
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
const config = {
  API_ROOT: "https://localhost:44366/api",
};

const OrderStatus = {
  Paid: 1,
  Cancelled: 2,
  Shipping: 3,
  Completed: 4,
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No authentication token found. Please log in.");
        return;
      }

      const response = await axios.get(
        `${config.API_ROOT}/orders/order-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allOrders = response.data;
      const filteredOrders = allOrders.filter(
        (order) => order.status !== OrderStatus.InCart
      );
      const processedOrders = filteredOrders.map((order) => ({
        ...order,
        key: order.orderId,
        totalPrice: order.totalAmount,
        orderLines: order.orderLines || [],
      }));

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response && error.response.status === 401) {
        message.error("Unauthorized access. Please log in again.");
      } else {
        message.error("Failed to fetch orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      [OrderStatus.Paid]: { color: "green", text: "Paid" },
      [OrderStatus.Cancelled]: { color: "red", text: "Cancelled" },
      [OrderStatus.Shipping]: { color: "blue", text: "Shipping" },
      [OrderStatus.Completed]: { color: "purple", text: "Completed" },
    };

    const { color, text } = statusConfig[status] || {
      color: "default",
      text: "Unknown",
    };
    return <Tag color={color}>{text}</Tag>;
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
      dataIndex: "totalPrice",
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
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/user-dashboard/:id">
            User Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item>Order History</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Title level={2}>Order History</Title>
        <div className="order-history-container">
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
        </div>
      </Space>
    </div>
  );
};

export default OrderHistoryPage;
