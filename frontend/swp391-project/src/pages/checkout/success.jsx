import React from "react";
import { Result, Typography, Card, Descriptions, Button } from "antd";
import { CheckCircleFilled, HomeFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state || {};

  return (
    <Card
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
            type="primary"
            key="home"
            size="large"
            icon={<HomeFilled />}
            onClick={() => navigate("/")}
          >
            Return to Home
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
  );
};

export default PaymentSuccess;
