import React, { useState, useEffect } from "react";
import { Table, Typography, Space, message, Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

// Demo data
const demoOrders = [
  {
    orderId: 1001,
    status: 1,
    totalAmount: 1350000,
    totalTax: 135000,
    totalDiscount: 0,
    customerId: 1,
    orderLines: [
      {
        fishId: 1,
        fishName: "Koi Carp",
        imageUrl: "/api/placeholder/80/80",
        quantity: 2,
        unitPrice: 500000,
        totalPrice: 1000000,
      },
      {
        fishId: 2,
        fishName: "Goldfish",
        imageUrl: "/api/placeholder/80/80",
        quantity: 1,
        unitPrice: 350000,
        totalPrice: 350000,
      },
    ],
  },
  {
    orderId: 1002,
    status: 2,
    totalAmount: 2800000,
    totalTax: 280000,
    totalDiscount: 100000,
    customerId: 2,
    orderLines: [
      {
        fishId: 3,
        fishName: "Arowana",
        imageUrl: "/api/placeholder/80/80",
        quantity: 1,
        unitPrice: 2800000,
        totalPrice: 2800000,
      },
    ],
  },
  {
    orderId: 1003,
    status: 3,
    totalAmount: 750000,
    totalTax: 75000,
    totalDiscount: 50000,
    customerId: 1,
    orderLines: [
      {
        fishId: 4,
        fishName: "Guppy",
        imageUrl: "/api/placeholder/80/80",
        quantity: 5,
        unitPrice: 150000,
        totalPrice: 750000,
      },
    ],
  },
];

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulating API call
        // const response = await axios.get('YOUR_API_ENDPOINT_HERE');
        // const filteredOrders = response.data.filter(order => order.status !== 0);
        const filteredOrders = demoOrders.filter((order) => order.status !== 0);
        const processedOrders = filteredOrders.map((order) => ({
          ...order,
          key: order.orderId,
          totalPrice: order.orderLines.reduce(
            (sum, line) => sum + line.totalPrice,
            0
          ),
        }));
        setOrders(processedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { title: "ORDER ID", dataIndex: "orderId", key: "orderId" },
    {
      title: "DATE",
      dataIndex: "orderId",
      key: "date",
      render: (orderId) => new Date(orderId * 1000).toLocaleDateString(), // Simulating date from orderId
    },
    {
      title: "TOTAL",
      dataIndex: "totalPrice",
      key: "total",
      render: (total, record) =>
        `${total.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })} (${record.orderLines.length} Products)`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        ["Processing", "Shipping", "Delivered"][status - 1] || "Unknown",
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
