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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/authActions";
import config from "../../../config/config";
import { useTranslation } from "react-i18next";
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
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error(t("noAuthToken"));
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${config.API_ROOT}Consignment/customer/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token ?? null}` },
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
      message.error(t("failedFetchConsignmentHistory"));
    } finally {
      setLoading(false);
    }
  };

  const fetchFishCareData = async (consignmentId) => {
    try {
      setLoadingFishCare(true);
      if (!token) {
        toast.error(t("noAuthToken"));
        navigate("/login");
        return;
      }

      const response = await axios.get(`${config.API_ROOT}FishCare`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });

      // Filter fish care data for the selected consignment
      const filteredData = response.data.filter(
        (care) => care.consignmentId === consignmentId
      );
      setFishCareData(filteredData);
    } catch (error) {
      console.error("Error fetching fish care data:", error);
      message.error(t("failedFetchFishCareDetails"));
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
      0: { color: "warning", text: t("pending") },
      1: { color: "processing", text: t("underReview") },
      2: { color: "success", text: t("confirmed") },
      3: { color: "blue", text: t("listedForSale") },
      4: { color: "purple", text: t("sold") },
      5: { color: "cyan", text: t("underCare") },
      6: { color: "green", text: t("careCompleted") },
      7: { color: "red", text: t("cancelled") },
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
      title: t("type"),
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
      title: t("startDate"),
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => formatDate(date),
    },
    {
      title: t("endDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => formatDate(date),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status, record) => getStatusTag(status, record.type),
    },
    {
      title: t("price"),
      key: "price",
      render: (_, record) => {
        const price = record.type === 0 ? record.careFee : record.agreedPrice;
        return `$${price?.toFixed(2) || "0.00"}`;
      },
    },
    {
      title: t("actions"),
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          {t("details")}
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
            {t("consignmentHistory")}
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
            <li onClick={() => navigate("/promotion")}>
              <FontAwesomeIcon icon={faTag} /> {t("promotion")}
            </li>
            <li onClick={() => navigate("/cart")}>
              <FontAwesomeIcon icon={faShoppingCart} /> {t("shoppingCart")}
            </li>
            <li onClick={() => navigate("/user-setting/:id")}>
              <FontAwesomeIcon icon={faCog} /> {t("setting")}
            </li>
            <li className="active">
              <FontAwesomeIcon icon={faHandHoldingUsd} />
              {t("consignmentHistory")}
            </li>
            <li onClick={confirmLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> {t("logout")}
            </li>
          </ul>
        </aside>
        <div style={{ maxWidth: 1200 }}></div>
        <div className="cosignment-history-container">
          <div style={{ padding: 24 }}>
            <Card>
              <Title level={2}>{t("consignmentHistory")}</Title>
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
              title={`${t("consignment")} #${
                selectedConsignment?.consignmentId
              } ${t("details")}`}
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
                    <Descriptions.Item label={t("type")}>
                      {selectedConsignment.type === 0 ? t("care") : t("sale")}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("status")}>
                      {getStatusTag(selectedConsignment.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("startDate")}>
                      {formatDate(selectedConsignment.startDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("endDate")}>
                      {formatDate(selectedConsignment.endDate)}
                    </Descriptions.Item>
                    {selectedConsignment.type === 0 ? (
                      <Descriptions.Item label={t("careFee")}>
                        ${selectedConsignment.careFee?.toFixed(2) || "0.00"}
                      </Descriptions.Item>
                    ) : (
                      <Descriptions.Item label={t("agreedPrice")}>
                        ${selectedConsignment.agreedPrice?.toFixed(2) || "0.00"}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label={t("note")} span={2}>
                      {selectedConsignment.note}
                    </Descriptions.Item>
                  </Descriptions>

                  {selectedConsignment.type === 0 ? (
                    // Show Fish Care Data for Care type
                    <>
                      <Title level={4} style={{ marginTop: 24 }}>
                        {t("fishCareDetails")}
                      </Title>
                      <Table
                        dataSource={fishCareData}
                        rowKey="fishCareId"
                        pagination={false}
                        loading={loadingFishCare}
                        columns={[
                          {
                            title: t("fishType"),
                            dataIndex: "fishType",
                            key: "fishType",
                          },
                          {
                            title: t("healthStatus"),
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
                            title: t("careDetails"),
                            dataIndex: "careDetails",
                            key: "careDetails",
                            ellipsis: true,
                          },
                        ]}
                      />
                      {fishCareData.length === 0 && !loadingFishCare && (
                        <Empty description={t("noFishCareRecordsFound")} />
                      )}
                    </>
                  ) : (
                    // Show Fish Details for Sale type
                    <>
                      <Title level={4} style={{ marginTop: 24 }}>
                        {t("fishDetails")}
                      </Title>
                      <Table
                        dataSource={selectedConsignment.consignmentLines}
                        rowKey="consignmentLineId"
                        pagination={false}
                        columns={[
                          {
                            title: t("fishType"),
                            dataIndex: "fishType",
                            key: "fishType",
                          },
                          {
                            title: t("quantity"),
                            dataIndex: "quantity",
                            key: "quantity",
                          },
                          {
                            title: t("totalPrice"),
                            dataIndex: "totalPrice",
                            key: "totalPrice",
                            render: (price) =>
                              `$${price?.toFixed(2) || "0.00"}`,
                          },
                          {
                            title: t("unitPrice"),
                            dataIndex: "unitPrice",
                            key: "unitPrice",
                            render: (price) =>
                              `$${price?.toFixed(2) || "0.00"}`,
                          },
                          {
                            title: t("images"),
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
                                t("noImage")
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
              title={t("confirmLogout")}
              visible={showConfirmation}
              onOk={handleLogout}
              onCancel={() => setShowConfirmation(false)}
              okText={t("logout")}
              cancelText={t("cancel")}
              footer={[
                <Button
                  key="back"
                  onClick={() => setShowConfirmation(false)}
                  style={{ backgroundColor: "#C0C0C0", color: "black" }}
                >
                  {t("cancel")}
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={handleLogout}
                  style={{ backgroundColor: "#bbab6f", color: "white" }}
                >
                  {t("confirm")}
                </Button>,
              ]}
            >
              <p>{t("confirmLogoutMessage")}</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentHistory;
