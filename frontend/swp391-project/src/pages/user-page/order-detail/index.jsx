import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Table,
  Image,
  Button,
  Spin,
  Breadcrumb,
  message,
} from "antd";
import { ArrowLeftOutlined, FilePdfOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
const { Title, Text } = Typography;
const { Step } = Steps;
import "./index.scss";
import { useSelector } from "react-redux";
import config from "../../../config/config";
import { useTranslation } from "react-i18next";
import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingKoi from "../../../components/loading";

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderId = location.state?.orderId;
        if (!orderId) {
          toast.error(t("orderIdNotProvided"));
          navigate("/order-history");
          return;
        }

        if (!token) {
          toast.error(t("noAuthToken"));
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${config.API_ROOT}orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token ?? null}` },
          }
        );

        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error(t("failedFetchOrderDetails"));
        navigate("/order-history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate]);

  if (loading) return <LoadingKoi />;
  if (!order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // Will return format: DD/MM/YYYY
  };

  const getOrderSteps = (status) => {
    // Handle cancelled status specially
    if (status === 2) {
      return (
        <Steps current={1} status="error" style={{ margin: "24px 0" }}>
          <Step className="step" title={t("paid")} />
          <Step className="step" title={t("cancelled")} />
        </Steps>
      );
    }

    // For normal flow (status 1, 3, or 4)
    const currentStep = status === 4 ? 2 : status === 3 ? 1 : 0;

    return (
      <Steps current={currentStep} style={{ margin: "24px 0" }}>
        <Step className="step" title={t("paid")} />
        <Step className="step" title={t("shipping")} />
        <Step className="step" title={t("completed")} />
      </Steps>
    );
  };

  const handleExportInvoice = async () => {
    try {
      setExporting(true);
      const response = await axios.get(
        `${config.API_ROOT}orders/export-invoice/${order.orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
            Accept: "*/*",
          },
          responseType: "blob", // Important for downloading files
        }
      );

      // Create a blob from the PDF content
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.orderId}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(t("invoiceExportSuccess"));
    } catch (error) {
      console.error("Error exporting invoice:", error);
      toast.error(t("failedToExportInvoice"));
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    {
      title: t("fish"),
      dataIndex: "fishName",
      key: "fish",
      render: (fishName, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={record.imageUrl || "/api/placeholder/80/80"}
            alt={fishName || "Fish"}
            width={80}
            height={80}
            style={{ marginRight: 16 }}
          />
          {fishName || "Unknown Fish"}
        </div>
      ),
    },
    {
      title: t("price"),
      dataIndex: "unitPrice",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    { title: t("quantity"), dataIndex: "quantity", key: "quantity" },
    {
      title: t("subtotal"),
      dataIndex: "totalPrice",
      key: "subtotal",
      render: (price) =>
        price.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  ];

  return (
    <div className="order-detail-page">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/user-dashboard/:id">
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/order-history">
            {t("orderHistory")}
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            {t("orderDetail")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="layout-container">
        <div className="order-detail-container">
          <Card className="card" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/order-history")}
              style={{ marginBottom: 16, color: "bbab6f" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              {t("backToList")}
            </Button>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleExportInvoice}
              loading={exporting}
              style={{
                backgroundColor: "#bbab6f",
                borderColor: "#bbab6f",
              }}
            >
              {t("exportInvoice")}
            </Button>
            <Title level={3}>
              {t("orderDetail")} • {formatDate(order.orderDate)} •{" "}
              {order.orderLines.length} {t("fish")}
            </Title>

            <Row gutter={24}>
              <Col span={16}>
                <Card className="card" title="ORDER SUMMARY" bordered={false}>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("orderId")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>#{order.orderId}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("status")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {["Paid", "Cancelled", "Shipping", "Completed"][
                          order.status - 1
                        ] || "Unknown"}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("totalAmount")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {order.totalAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("totalTax")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {order.totalTax.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("totalDiscount")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {order.totalDiscount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Text strong>{t("Final Amount")}:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {(
                          order.totalAmount +
                          order.totalTax -
                          order.totalDiscount
                        ).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {getOrderSteps(order.status)}

            <Table
              className="table"
              columns={columns}
              dataSource={order.orderLines}
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
