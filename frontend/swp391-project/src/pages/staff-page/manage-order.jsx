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
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faHome, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";

const { Title } = Typography;

const config = {
  API_ROOT: "https://localhost:44366/api",
};

const StaffOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

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

      const response = await axios.get(`${config.API_ROOT}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const processedOrders = response.data.map((order) => ({
        ...order,
        key: order.orderId,
      }));

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.API_ROOT}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details.");
    }
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === 1 ? 3 : 4;

      await axios.patch(
        `${config.API_ROOT}/orders/${orderId}/status`,
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Order status updated successfully");
      fetchOrders();
      if (selectedOrder?.orderId === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        message.error(`Failed to update order status: ${errorMessages}`);
      } else {
        message.error("Failed to update order status.");
      }
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="gold">Paid</Tag>;
      case 2:
        return <Tag color="red">Cancelled</Tag>;
      case 3:
        return <Tag color="green">Shipping</Tag>;
      case 4:
        return <Tag color="green">Completed</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const getStatusActionButton = (status, orderId) => {
    if (status === 4) return null;

    return (
      <Button
        type="primary"
        onClick={() => updateOrderStatus(orderId, status)}
        style={{ backgroundColor: "#bbab6f" }}
      >
        {status === 1 ? "Start Shipping" : "Mark Complete"}
      </Button>
    );
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
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => fetchOrderDetails(record.orderId)}
            style={{ color: "#D4B57E" }}
          >
            View Details
          </Button>
          {getStatusActionButton(record.status, record.orderId)}
        </Space>
      ),
    },
  ];

  const OrderDetailsModal = () => (
    <Modal
      title={`Order Details #${selectedOrder?.orderId}`}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsModalVisible(false)}>
          Close
        </Button>,
        selectedOrder?.status !== 4 && (
          <Button
            key="update"
            type="primary"
            onClick={() =>
              updateOrderStatus(selectedOrder.orderId, selectedOrder.status)
            }
            style={{ backgroundColor: "#bbab6f" }}
          >
            {selectedOrder?.status === 1 ? "Start Shipping" : "Mark Complete"}
          </Button>
        ),
      ].filter(Boolean)}
      width={800}
    >
      {selectedOrder && (
        <div>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(selectedOrder.orderDate).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {getStatusTag(selectedOrder.status)}
          </p>
          <p>
            <strong>Total Amount:</strong>{" "}
            {selectedOrder.totalAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>

          <Title level={5}>Order Items</Title>
          <Table
            dataSource={selectedOrder.orderLines}
            columns={[
              {
                title: "Item",
                dataIndex: "fishName",
                key: "fishName",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                title: "Unit Price",
                dataIndex: "unitPrice",
                key: "unitPrice",
                render: (price) =>
                  price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }),
              },
              {
                title: "Total Price",
                dataIndex: "totalPrice",
                key: "totalPrice",
                render: (price) =>
                  price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }),
              },
            ]}
            pagination={false}
          />
        </div>
      )}
    </Modal>
  );

  return (
    <div className="staff-order-management">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Staff</Breadcrumb.Item>
          <Breadcrumb.Item>Order Management</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card className="card">
        <Title level={3}>Order Management</Title>
        <Table
          className="order-management-table"
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

      <OrderDetailsModal />
      <ToastContainer />
    </div>
  );
};

export default StaffOrderManagement;
