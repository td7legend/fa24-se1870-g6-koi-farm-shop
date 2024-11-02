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
import "./index.scss";
import { useSelector } from "react-redux";
import config from "../../../config/config";
const { Title } = Typography;

const StaffOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${config.API_ROOT}orders`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });

      const processedOrders = response.data
        .map((order) => ({
          ...order,
          key: order.orderId,
        }))
        .sort((a, b) => b.orderId - a.orderId);

      setOrders(processedOrders);
    } catch (error) {
      // console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${config.API_ROOT}orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });
      setSelectedOrder(response.data);
      setIsModalVisible(true);
    } catch (error) {
      // console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details.");
    }
  };

  const awardLoyaltyPoints = async (order) => {
    try {
      await axios.post(
        `${config.API_ROOT}LoyaltyPoint/award?customerId=${order.customerId}&orderAmount=${order.totalAmount}`,
        null, // no body needed
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
          },
        }
      );
      message.success("Loyalty points awarded successfully");
    } catch (error) {
      // console.error("Error awarding loyalty points:", error);
      message.warning(
        "Failed to award loyalty points, but order was completed"
      );
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${config.API_ROOT}orders/${orderId}/status`,
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
            "Content-Type": "application/json",
          },
        }
      );

      // If the order is being completed, award loyalty points
      if (newStatus === 4) {
        const order = orders.find((o) => o.orderId === orderId);
        if (order) {
          await awardLoyaltyPoints(order);
        }
      }

      fetchOrders();
      if (selectedOrder?.orderId === orderId) {
        fetchOrderDetails(orderId);
      }

      message.success(`Order status updated successfully`);
    } catch (error) {
      // console.error("Error updating order status:", error);
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
          {record.status !== 2 && record.status !== 4 && (
            <Button
              type="primary"
              onClick={() => updateOrderStatus(record.orderId, 4)}
              style={{ backgroundColor: "#52c41a" }}
            >
              Complete
            </Button>
          )}
          {record.status === 1 && (
            <Button
              type="primary"
              danger
              onClick={() => updateOrderStatus(record.orderId, 2)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const OrderDetailsModal = () => (
    <Modal
      title={`Order Details #${selectedOrder?.orderId}`}
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsModalVisible(false)}>
          Close
        </Button>,
        selectedOrder?.status === 1 && (
          <Button
            key="cancel"
            type="primary"
            danger
            onClick={() => updateOrderStatus(selectedOrder.orderId, 2)}
          >
            Cancel Order
          </Button>
        ),
        selectedOrder?.status === 1 && (
          <Button
            key="ship"
            type="primary"
            onClick={() => updateOrderStatus(selectedOrder.orderId, 3)}
            style={{ backgroundColor: "#1890ff" }}
          >
            Start Shipping
          </Button>
        ),
        selectedOrder?.status === 3 && (
          <Button
            key="complete"
            type="primary"
            onClick={() => updateOrderStatus(selectedOrder.orderId, 4)}
            style={{ backgroundColor: "#52c41a" }}
          >
            Complete Order
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

      <div className="manage-order-container">
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
      </div>

      <OrderDetailsModal />
      <ToastContainer />
    </div>
  );
};

export default StaffOrderManagement;
