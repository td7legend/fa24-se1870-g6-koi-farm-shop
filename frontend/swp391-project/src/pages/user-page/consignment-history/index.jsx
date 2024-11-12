import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Modal,
  message,
  Typography,
  Descriptions,
  Badge,
  Empty,
  Breadcrumb,
  Checkbox,
  Alert,
  Space,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faShoppingCart,
  faCog,
  faSignOutAlt,
  faHandHoldingUsd,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/authActions";
const { Title } = Typography;
import "./index.scss";
import { useTranslation } from "react-i18next";
import config from "../../../config/config";

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
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [receiveAgreed, setReceiveAgreed] = useState(false);
  const [processingReceive, setProcessingReceive] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    fetchCustomerInfo();
  }, [token]);

  useEffect(() => {
    if (customerId) {
      fetchConsignments();
    }
  }, [customerId]);

  const formatPrice = (price) => {
    return price
      ? price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "0 VND";
  };

  const fetchCustomerInfo = async () => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://localhost:44366/api/customers/my-info",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCustomerId(response.data.customerId);
    } catch (error) {
      console.error("Error fetching customer info:", error);
      toast.error("Failed to fetch customer information");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchConsignments = async () => {
    try {
      setLoading(true);

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
        response.data
          .map((consignment) => ({
            ...consignment,
            key: consignment.consignmentId,
          }))
          .sort((a, b) => b.consignmentId - a.consignmentId)
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

  const handleReceiveFish = async (consignmentId) => {
    try {
      setProcessingReceive(true);

      const response = await axios.put(
        `${config.API_ROOT}Consignment/${consignmentId}/status`,
        {
          status: 6,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        message.success("Fish received successfully");
        setReceiveModalVisible(false);
        setReceiveAgreed(false);
        setSelectedConsignment(null);
        fetchConsignments();
      }
    } catch (error) {
      console.error("Error receiving fish:", error);
      message.error("Failed to receive fish");
    } finally {
      setProcessingReceive(false);
    }
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
        return formatPrice(price);
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            style={{ color: "#bbab6f" }}
          >
            Details
          </Button>
          {record.type === 0 && record.status === 5 && (
            <Button
              type="primary"
              onClick={() => {
                setSelectedConsignment(record); // Set the selected consignment first
                setReceiveModalVisible(true);
              }}
              style={{ backgroundColor: "#bbab6f" }}
            >
              Receive Fish Back
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Account</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Consignment History
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
            <li onClick={() => navigate("/loyaltypoint-history")}>
              <FontAwesomeIcon icon={faTrophy} /> {t("loyaltyPoint")}
            </li>
            <li onClick={() => navigate("/cart")}>
              <FontAwesomeIcon icon={faShoppingCart} /> {t("shoppingCart")}
            </li>
            <li onClick={() => navigate("/user-setting/:id")}>
              <FontAwesomeIcon icon={faCog} /> {t("setting")}
            </li>
            <li className="active">
              <FontAwesomeIcon icon={faHandHoldingUsd} />
              {t("consignment")}
            </li>
            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
            </li>
          </ul>
        </aside>
        <div style={{ maxWidth: 1200 }}></div>
        <div className="consignment-history-container">
          <div>
            <Card style={{ background: "transparent" }}>
              <Title level={2}>My Consignment History</Title>
              <Table
                className="consignment-history-table"
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
                setFishCareData([]);
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
                        {formatPrice(selectedConsignment.careFee)}
                      </Descriptions.Item>
                    ) : (
                      <Descriptions.Item label="Agreed Price">
                        {formatPrice(selectedConsignment.agreedPrice)}
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
                      {[0, 1, 2].includes(selectedConsignment.status) ? (
                        // Show initial consignment details for pending, under review, and confirmed status
                        <Table
                          dataSource={selectedConsignment.consignmentLines}
                          rowKey="consignmentLineId"
                          pagination={false}
                          columns={[
                            {
                              title: "Image",
                              dataIndex: "imageUrl",
                              key: "image",
                              width: 150,
                              render: (imageUrl) =>
                                imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt="Fish"
                                    style={{
                                      width: 120,
                                      height: 80,
                                      objectFit: "cover",
                                      borderRadius: 4,
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      window.open(imageUrl, "_blank")
                                    }
                                  />
                                ) : (
                                  "No image"
                                ),
                            },
                            {
                              title: "Fish Type",
                              dataIndex: "fishType",
                              key: "fishType",
                              width: 120,
                            },
                            {
                              title: "Quantity",
                              dataIndex: "quantity",
                              key: "quantity",
                              width: 100,
                            },
                            {
                              title: "Certificate",
                              dataIndex: "certificationUrl",
                              key: "certificate",
                              render: (url) =>
                                url ? (
                                  <Button
                                    type="link"
                                    onClick={() => window.open(url, "_blank")}
                                  >
                                    View Certificate
                                  </Button>
                                ) : (
                                  "No certificate"
                                ),
                            },
                          ]}
                        />
                      ) : (
                        // Show fish care records for other statuses
                        <>
                          <Table
                            dataSource={fishCareData}
                            rowKey="fishCareId"
                            pagination={false}
                            loading={loadingFishCare}
                            columns={[
                              {
                                title: "Image",
                                dataIndex: "fishType",
                                key: "image",
                                width: 150,
                                render: (fishType) => {
                                  const consignmentLine =
                                    selectedConsignment.consignmentLines.find(
                                      (line) => line.fishType === fishType
                                    );
                                  return consignmentLine?.imageUrl ? (
                                    <img
                                      src={consignmentLine.imageUrl}
                                      alt={fishType}
                                      style={{
                                        width: 120,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: 4,
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        window.open(
                                          consignmentLine.imageUrl,
                                          "_blank"
                                        )
                                      }
                                    />
                                  ) : (
                                    "No image"
                                  );
                                },
                              },
                              {
                                title: "Fish Type",
                                dataIndex: "fishType",
                                key: "fishType",
                                width: 120,
                              },
                              {
                                title: "Health Status",
                                dataIndex: "standardHealthStatus",
                                key: "healthStatus",
                                width: 120,
                                render: (status) => {
                                  const statusColors = {
                                    Good: "green",
                                    Bad: "red",
                                    Normal: "orange",
                                  };
                                  return (
                                    <Tag
                                      color={statusColors[status] || "default"}
                                    >
                                      {status}
                                    </Tag>
                                  );
                                },
                              },
                              {
                                title: "Care Details",
                                dataIndex: "standardCareDetails",
                                key: "careDetails",
                                ellipsis: true,
                              },
                            ]}
                          />
                          {fishCareData.length === 0 && !loadingFishCare && (
                            <Empty description="No fish care records found" />
                          )}
                        </>
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
                            title: "Unit Price",
                            dataIndex: "unitPrice",
                            key: "unitPrice",
                            render: (price) => formatPrice(price),
                          },
                          {
                            title: "Total Price",
                            dataIndex: "totalPrice",
                            key: "totalPrice",
                            render: (price) => formatPrice(price),
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
                                  style={{
                                    width: 120,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                  }}
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
          </div>
        </div>
      </div>

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
      {selectedConsignment && (
        <Modal
          title={`Receive Fish Back Confirmation - Consignment #${selectedConsignment.consignmentId}`}
          open={receiveModalVisible}
          onCancel={() => {
            setReceiveModalVisible(false);
            setReceiveAgreed(false);
            setSelectedConsignment(null);
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setReceiveModalVisible(false);
                setReceiveAgreed(false);
                setSelectedConsignment(null);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={processingReceive}
              disabled={!receiveAgreed}
              onClick={() =>
                handleReceiveFish(selectedConsignment.consignmentId)
              }
              style={{ backgroundColor: "#bbab6f" }}
            >
              Confirm Receive
            </Button>,
          ]}
        >
          <div style={{ marginBottom: 16 }}>
            <Alert
              message="Important Notice"
              description="By receiving your fish back, you acknowledge that you will not receive any care fee refund."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Checkbox
              checked={receiveAgreed}
              onChange={(e) => setReceiveAgreed(e.target.checked)}
            >
              I understand and agree to these terms
            </Checkbox>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConsignmentHistory;
