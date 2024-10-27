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
  Form,
  Input,
  InputNumber,
  Descriptions,
} from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.scss";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import config from "../../../config/config";
const { Title } = Typography;

const ConsignmentManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [careModalVisible, setCareModalVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const { token } = useSelector((state) => state.auth);
  const [careForm] = Form.useForm();
  const [saleForm] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const calculateTotalPrice = (price, qty) => {
    return price * qty;
  };
  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${config.API_ROOT}Consignment/customer/1`,
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
      message.error(t("failedToFetchConsignmentData"));
    } finally {
      setLoading(false);
    }
  };

  const handleCareConfirm = async (values) => {
    try {
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        navigate("/login");
        return;
      }

      // Update consignment status and care fee
      await axios.post(
        `${config.API_ROOT}Consignment/${selectedConsignment.consignmentId}/receive-care?careFee=${values.careFee}`,
        null, // no body needed
        { headers: { Authorization: `Bearer ${token ?? null}` } }
      );

      // Add fish care record
      await axios.post(
        `${config.API_ROOT}FishCare`,
        {
          fishCareId: 0,
          fishType: values.fishType,
          consignmentId: selectedConsignment.consignmentId,
          healthStatus: values.healthStatus,
          careDetails: values.careDetails,
        },
        { headers: { Authorization: `Bearer ${token ?? null}` } }
      );

      message.success(t("careConsignmentConfirmedSuccessfully"));
      setCareModalVisible(false);
      careForm.resetFields();
      await fetchConsignments();
    } catch (error) {
      console.error("Error confirming care:", error);
      message.error(t("failedToConfirmCareConsignment"));
    }
  };

  const handleOpenSaleModal = (record) => {
    setSelectedConsignment(record);
    const consignmentLine = record.consignmentLines[0]; // Assuming first line
    setUnitPrice(0); // Reset unit price
    setQuantity(consignmentLine.quantity); // Set quantity from consignment line

    saleForm.setFieldsValue({
      fishType: consignmentLine.fishType,
      quantity: consignmentLine.quantity,
      imageUrl: consignmentLine.imageUrl,
      // Other fields set to default/empty
      gender: 0,
      age: 0,
      size: 0,
      class: "",
      fishTypeId: 0,
      foodRequirement: 0,
      overallRating: 0,
    });

    setSaleModalVisible(true);
  };

  // Modify the handleSaleConfirm function
  const handleSaleConfirm = async (values) => {
    try {
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        navigate("/login");
        return;
      }

      const totalPrice = calculateTotalPrice(values.unitPrice, values.quantity);

      await axios.put(
        `${config.API_ROOT}Consignment/${selectedConsignment.consignmentId}/update-sale?agreePrice=${values.agreePrice}`,
        [
          // Changed to array directly
          {
            consignmentLineId:
              selectedConsignment.consignmentLines[0].consignmentLineId,
            unitPrice: values.unitPrice,
            quantity: selectedConsignment.consignmentLines[0].quantity,
            totalPrice: totalPrice,
          },
        ],
        { headers: { Authorization: `Bearer ${token ?? null}` } }
      );

      // Add fish to database
      await axios.post(
        `${config.API_ROOT}fishs`,
        {
          name: values.fishType,
          gender: values.gender,
          age: values.age,
          size: values.size,
          class: values.class,
          consignmentLineId:
            selectedConsignment.consignmentLines[0].consignmentLineId,
          foodRequirement: values.foodRequirement,
          overallRating: values.overallRating,
          price: values.sellingPrice,
          batch: true,
          fishTypeId: values.fishTypeId,
          quantity: values.quantity,
          imageUrl: selectedConsignment.consignmentLines[0].imageUrl,
          description: values.description,
        },
        { headers: { Authorization: `Bearer ${token ?? null}` } }
      );

      message.success(t("saleConsignmentConfirmedSuccessfully"));
      setSaleModalVisible(false);
      saleForm.resetFields();
      await fetchConsignments();
    } catch (error) {
      console.error("Error confirming sale:", error);
      message.error(t("failedToConfirmSaleConsignment"));
    }
  };

  const getStatusTag = (status) => {
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

  const updateStatus = async (record, newStatus) => {
    try {
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        navigate("/login");
        return;
      }

      await axios.put(
        `${config.API_ROOT}Consignment/${record.consignmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
            "Content-Type": "application/json",
          },
        }
      );

      const statusMessages = {
        1: t("consignmentIsNowUnderReview"),
        2: t("consignmentConfirmedSuccessfully"),
        7: t("consignmentHasBeenCancelled"), // Add this line
      };

      message.success(
        statusMessages[newStatus] || t("statusUpdatedSuccessfully")
      );
      await fetchConsignments();
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(t("failedToUpdateStatus"));
    }
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
        <Tag color={type === 0 ? "blue" : "green"}>
          {type === 0 ? "Care" : "Sale"}
        </Tag>
      ),
    },
    {
      title: t("startDate"),
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("endDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: t("priceCareFee"),
      key: "price",
      render: (_, record) =>
        record.type === 0 ? record.careFee : record.agreedPrice,
    },
    {
      title: t("actions"),
      key: "actions",
      width: 250,
      render: (_, record) => {
        const showReviewButton = record.status === 0;
        const showConfirmButton = record.status === 1;
        const showReceiveButton = record.status === 2;
        const showCancelButton = record.status === 0 || record.status === 1; // Can cancel when Pending or Under Review

        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedConsignment(record);
                setDetailModalVisible(true);
              }}
            >
              {t("details")}
            </Button>

            {showCancelButton && (
              <Button danger onClick={() => updateStatus(record, 7)}>
                {t("cancel")}
              </Button>
            )}

            {showReviewButton && (
              <Button type="primary" onClick={() => updateStatus(record, 1)}>
                {t("review")}
              </Button>
            )}

            {showConfirmButton && (
              <Button type="primary" onClick={() => updateStatus(record, 2)}>
                {t("confirm")}
              </Button>
            )}

            {showReceiveButton && (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedConsignment(record);
                  if (record.type === 0) {
                    setCareModalVisible(true);
                  } else {
                    handleOpenSaleModal(record);
                  }
                }}
              >
                {record.type === 0 ? t("receiveCare") : t("receiveSale")}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="consignment-management">
      <Card>
        <Title level={2}>{t("consignmentManagement")}</Title>
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
        title={`${t("consignment")} #${selectedConsignment?.consignmentId} ${t(
          "details"
        )}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
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
                {new Date(selectedConsignment.startDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label={t("endDate")}>
                {new Date(selectedConsignment.endDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label={t("priceCareFee")}>
                {selectedConsignment.type === 0
                  ? selectedConsignment.careFee
                  : selectedConsignment.agreedPrice}
              </Descriptions.Item>
              <Descriptions.Item label={t("customerId")}>
                {selectedConsignment.customerId}
              </Descriptions.Item>
              <Descriptions.Item label={t("note")} span={2}>
                {selectedConsignment.note}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 24 }}>
              {t("consignmentLines")}
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
                },
                {
                  title: t("images"),
                  dataIndex: "imageUrl",
                  key: "imageUrl",
                  render: (url) =>
                    url ? (
                      <img src={url} alt="Fish" style={{ maxWidth: 100 }} />
                    ) : (
                      t("noImage")
                    ),
                },
              ]}
            />
          </>
        )}
      </Modal>

      {/* Care Confirmation Modal */}
      <Modal
        title="Confirm Care Consignment"
        open={careModalVisible}
        onCancel={() => setCareModalVisible(false)}
        footer={null}
      >
        <Form form={careForm} layout="vertical" onFinish={handleCareConfirm}>
          <Form.Item
            name="fishType"
            label={t("fishType")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="healthStatus"
            label={t("healthStatus")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="careDetails"
            label={t("careDetails")}
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="careFee"
            label={t("careFee")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("confirmCare")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Sale Confirmation Modal */}
      <Modal
        title={t("confirmSaleConsignment")}
        open={saleModalVisible}
        onCancel={() => setSaleModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={saleForm} layout="vertical" onFinish={handleSaleConfirm}>
          {/* Read-only fields */}
          <Form.Item name="fishType" label={t("fishType")}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="quantity" label={t("quantity")}>
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item name="imageUrl" label={t("imageUrl")}>
            <Input disabled />
          </Form.Item>

          {/* Editable fields */}
          <Form.Item
            name="gender"
            label={t("gender")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="age" label={t("age")} rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="size" label={t("size")} rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="class"
            label={t("class")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fishTypeId"
            label={t("fishTypeId")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="foodRequirement"
            label={t("foodRequirement")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="overallRating"
            label={t("overallRating")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Price related fields */}
          <Form.Item
            name="unitPrice"
            label={t("unitPrice")}
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              onChange={(value) => {
                setUnitPrice(value);
                const total = calculateTotalPrice(value, quantity);
                saleForm.setFieldValue("totalPrice", total);
              }}
            />
          </Form.Item>
          <Form.Item name="totalPrice" label={t("totalPrice")}>
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item
            name="agreePrice"
            label={t("agreePrice")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="sellingPrice"
            label={t("sellingPrice")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("description")}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("confirmSale")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsignmentManagement;
