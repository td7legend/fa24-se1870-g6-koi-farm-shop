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

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state || {};
  const [consignmentModal, setConsignmentModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleConsignmentCare = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        return;
      }

      // First, get order details
      const orderResponse = await axios.get(
        `https://localhost:44366/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
      await axios.post(
        "https://localhost:44366/api/Consignment/care",
        consignmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Care consignment created successfully");
      setConsignmentModal(false);
      form.resetFields();

      // Navigate to consignment history
      navigate("/consignment-history");
    } catch (error) {
      console.error("Error creating consignment:", error);
      message.error("Failed to create consignment");
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
          title={<Title level={2}>Payment Successful!</Title>}
          subTitle={
            <Paragraph>
              Thank you for your purchase. Your order has been confirmed.
            </Paragraph>
          }
          extra={[
            <Button
              className="button"
              key="home"
              size="large"
              icon={<HomeFilled />}
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>,
            <Button
              className="button"
              key="orderDetails"
              size="large"
              icon={<HomeFilled />}
              onClick={() => navigate("/order-details", { state: { orderId } })}
            >
              View order details
            </Button>,
            <Button
              className="button"
              key="consignmentCare"
              type="primary"
              size="large"
              icon={<HeartFilled />}
              onClick={() => setConsignmentModal(true)}
              style={{
                backgroundColor: "#ff4d4f",
                borderColor: "#ff4d4f",
              }}
            >
              Consignment for Care
            </Button>,
          ]}
        >
          <Descriptions title="Order Information" bordered column={1}>
            <Descriptions.Item label="Order ID">
              {orderId || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              {totalAmount
                ? `${totalAmount.toLocaleString()} VND`
                : "Information not available"}
            </Descriptions.Item>
          </Descriptions>
        </Result>
      </Card>

      {/* Consignment Modal */}
      <Modal
        title="Create Care Consignment"
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
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
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
            label="Note"
            rules={[{ required: true, message: "Please enter note" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter care instructions or special requirements"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create Consignment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentSuccess;
