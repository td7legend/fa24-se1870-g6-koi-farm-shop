import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Modal,
  message,
  Space,
  Typography,
  Descriptions,
  Badge,
  Empty,
  Breadcrumb,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faTag,
  faShoppingCart,
  faCog,
  faSignOutAlt,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/actions/authActions";
const { Title } = Typography;

const ConsignmentHistory = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [fishCareData, setFishCareData] = useState([]);
  const [loadingFishCare, setLoadingFishCare] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const customerId = 1;
  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `https://localhost:44366/api/Consignment/customer/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConsignments(
        response.data.map((consignment) => ({
          ...consignment,
          key: consignment.consignmentId,
        }))
      );
    } catch (error) {
      console.error("Error fetching consignments:", error);
      message.error("Failed to fetch consignment history");
    } finally {
      setLoading(false);
    }
  };

  const fetchFishCareData = async (consignmentId) => {
    try {
      setLoadingFishCare(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`https://localhost:44366/api/FishCare`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter fish care data for the selected consignment
      const filteredData = response.data.filter(
        (care) => care.consignmentId === consignmentId
      );
      setFishCareData(filteredData);
    } catch (error) {
      console.error("Error fetching fish care data:", error);
      message.error("Failed to fetch fish care details");
    } finally {
      setLoadingFishCare(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedConsignment(record);
    if (record.type === 0) {
      // If it's a care consignment
      fetchFishCareData(record.consignmentId);
    }
    setDetailModalVisible(true);
  };

  const getStatusTag = (status, type) => {
    const statusConfig = {
      0: { color: "warning", text: "Pending" },
      1: { color: "processing", text: "Under Review" },
      2: { color: "success", text: "Confirmed" },
      3: { color: "blue", text: "Listed For Sale" },
      4: { color: "purple", text: "Sold" },
      5: { color: "cyan", text: "Under Care" },
      6: { color: "green", text: "Care Completed" },
      7: { color: "red", text: "Cancelled" },
    };

    return (
      <Tag color={statusConfig[status]?.color || "default"}>
        {statusConfig[status]?.text || "Unknown"}
      </Tag>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "consignmentId",
      key: "consignmentId",
      width: 80,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Badge
          color={type === 0 ? "blue" : "green"}
          text={type === 0 ? "Care" : "Sale"}
        />
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => formatDate(date),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => getStatusTag(status, record.type),
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => {
        const price = record.type === 0 ? record.careFee : record.agreedPrice;
        return `$${price?.toFixed(2) || "0.00"}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Details
        </Button>
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
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/user_info/user">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item href="/consigment-history">
            Consignment History
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="layout-container">
        <aside className="settings-sider">
          <ul className="settings-menu">
            <li onClick={() => navigate("/user-dashboard/:id")}>
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </li>
            <li onClick={() => navigate("/order-history")}>
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
            <li className="active">
              <FontAwesomeIcon icon={faHandHoldingUsd} />
              Consignment History
            </li>
            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </aside>
        <div style={{ maxWidth: 1200 }}></div>
        <div className="cosignment-history-container">
          <div style={{ padding: 24 }}>
            <Card>
              <Title level={2}>My Consignment History</Title>
              <Table
                dataSource={consignments}
                columns={columns}
                rowKey="consignmentId"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>

            {/* Detail Modal */}
            <Modal
              title={`Consignment #${selectedConsignment?.consignmentId} Details`}
              open={detailModalVisible}
              onCancel={() => {
                setDetailModalVisible(false);
                setFishCareData([]); // Clear fish care data when closing modal
              }}
              footer={null}
              width={800}
            >
              {selectedConsignment && (
                <>
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Type">
                      {selectedConsignment.type === 0 ? "Care" : "Sale"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      {getStatusTag(selectedConsignment.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Date">
                      {formatDate(selectedConsignment.startDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Date">
                      {formatDate(selectedConsignment.endDate)}
                    </Descriptions.Item>
                    {selectedConsignment.type === 0 ? (
                      <Descriptions.Item label="Care Fee">
                        ${selectedConsignment.careFee?.toFixed(2) || "0.00"}
                      </Descriptions.Item>
                    ) : (
                      <Descriptions.Item label="Agreed Price">
                        ${selectedConsignment.agreedPrice?.toFixed(2) || "0.00"}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Note" span={2}>
                      {selectedConsignment.note}
                    </Descriptions.Item>
                  </Descriptions>

                  {selectedConsignment.type === 0 ? (
                    // Show Fish Care Data for Care type
                    <>
                      <Title level={4} style={{ marginTop: 24 }}>
                        Fish Care Details
                      </Title>
                      <Table
                        dataSource={fishCareData}
                        rowKey="fishCareId"
                        pagination={false}
                        loading={loadingFishCare}
                        columns={[
                          {
                            title: "Fish Type",
                            dataIndex: "fishType",
                            key: "fishType",
                          },
                          {
                            title: "Health Status",
                            dataIndex: "healthStatus",
                            key: "healthStatus",
                            render: (status) => {
                              const statusColors = {
                                Good: "green",
                                Bad: "red",
                                Normal: "orange",
                              };
                              return (
                                <Tag color={statusColors[status] || "default"}>
                                  {status}
                                </Tag>
                              );
                            },
                          },
                          {
                            title: "Care Details",
                            dataIndex: "careDetails",
                            key: "careDetails",
                            ellipsis: true,
                          },
                        ]}
                      />
                      {fishCareData.length === 0 && !loadingFishCare && (
                        <Empty description="No fish care records found" />
                      )}
                    </>
                  ) : (
                    // Show Fish Details for Sale type
                    <>
                      <Title level={4} style={{ marginTop: 24 }}>
                        Fish Details
                      </Title>
                      <Table
                        dataSource={selectedConsignment.consignmentLines}
                        rowKey="consignmentLineId"
                        pagination={false}
                        columns={[
                          {
                            title: "Fish Type",
                            dataIndex: "fishType",
                            key: "fishType",
                          },
                          {
                            title: "Quantity",
                            dataIndex: "quantity",
                            key: "quantity",
                          },
                          {
                            title: "Total Price",
                            dataIndex: "totalPrice",
                            key: "totalPrice",
                            render: (price) =>
                              `$${price?.toFixed(2) || "0.00"}`,
                          },
                          {
                            title: "Unit Price",
                            dataIndex: "unitPrice",
                            key: "unitPrice",
                            render: (price) =>
                              `$${price?.toFixed(2) || "0.00"}`,
                          },
                          {
                            title: "Images",
                            dataIndex: "imageUrl",
                            key: "imageUrl",
                            render: (url) =>
                              url ? (
                                <img
                                  src={url}
                                  alt="Fish"
                                  style={{ maxWidth: 100, cursor: "pointer" }}
                                  onClick={() => window.open(url, "_blank")}
                                />
                              ) : (
                                "No image"
                              ),
                          },
                        ]}
                      />
                    </>
                  )}
                </>
              )}
            </Modal>

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
        </div>
      </div>
    </div>
  );
};

export default ConsignmentHistory;
