import React, { useState } from "react";
import {
  Result,
  Typography,
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  DatePicker,
  Input,
  message,
} from "antd";
import { CheckCircleFilled, HomeFilled, HeartFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./success.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import config from "../../config/config";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state || {};
  const [consignmentModal, setConsignmentModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);
  const handleConsignmentCare = async (values) => {
    try {
      setLoading(true);

      if (!token) {
        message.error(t("pleaseLoginFirst"));
        return;
      }

      // First, get order details
      const orderResponse = await axios.get(
        `${config.API_ROOT}orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token ?? null}` },
        }
      );

      const orderData = orderResponse.data;

      // Create consignment request data
      const consignmentData = {
        careFee: 0,
        customerId: orderData.customerId,
        note: values.note,
        consignmentLines: orderData.orderLines.map((line) => ({
          fishType: line.fishName,
          quantity: line.quantity,
          imageUrl: line.imageUrl,
          certificationUrl: line.imageUrl, // Using same URL for certification
        })),
        startDate: orderData.orderDate,
        endDate: values.endDate,
      };

      // Create consignment
      await axios.post(`${config.API_ROOT}Consignment/care`, consignmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(t("careConsignmentCreatedSuccessfully"));
      setConsignmentModal(false);
      form.resetFields();

      // Navigate to consignment history
      navigate("/consignment-history");
    } catch (error) {
      console.error("Error creating consignment:", error);
      message.error(t("failedToCreateConsignment"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="success-container">
      <Card
        className="card"
        style={{
          maxWidth: 800,
          margin: "40px auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Result
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          title={<Title level={2}>{t("paymentSuccessful")}</Title>}
          subTitle={<Paragraph>{t("thankYouForYourPurchase")}</Paragraph>}
          extra={[
            <Button
              className="button"
              key="home"
              size="large"
              icon={<HomeFilled />}
              onClick={() => navigate("/")}
            >
              {t("returnToHome")}
            </Button>,
            <Button
              className="button"
              key="orderDetails"
              size="large"
              icon={<HomeFilled />}
              onClick={() => navigate("/order-details", { state: { orderId } })}
            >
              {t("viewOrderDetails")}
            </Button>,
            <Button
              className="button"
              key="consignmentCare"
              size="large"
              icon={<HeartFilled />}
              onClick={() => setConsignmentModal(true)}
            >
              {t("consignmentForCare")}
            </Button>,
          ]}
        >
          <Descriptions title={t("orderInformation")} bordered column={1}>
            <Descriptions.Item label={t("orderID")}>
              {orderId || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label={t("totalAmount")}>
              {totalAmount
                ? `${totalAmount.toLocaleString()} VND`
                : t("informationNotAvailable")}
            </Descriptions.Item>
          </Descriptions>
        </Result>
      </Card>

      {/* Consignment Modal */}
      <Modal
        title={t("createCareConsignment")}
        open={consignmentModal}
        onCancel={() => {
          setConsignmentModal(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleConsignmentCare}>
          <Form.Item
            name="endDate"
            label={t("endDate")}
            rules={[{ required: true, message: t("pleaseSelectEndDate") }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) => {
                return current && current.valueOf() < Date.now();
              }}
            />
          </Form.Item>

          <Form.Item
            name="note"
            label={t("note")}
            rules={[{ required: true, message: t("pleaseEnterNote") }]}
          >
            <TextArea
              rows={4}
              placeholder={t("enterCareInstructionsOrSpecialRequirements")}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {t("createConsignment")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentSuccess;
