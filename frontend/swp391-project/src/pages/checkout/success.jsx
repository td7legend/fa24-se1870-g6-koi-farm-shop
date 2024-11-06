import React, { useState, useEffect } from "react";
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
  Tag,
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
  const { orderId, totalAmount, customerId } = location.state || {};
  const [consignmentModal, setConsignmentModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);
  const [awardedPoints, setAwardedPoints] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePlusPoint = async () => {
    try {
      const storedPointsData = localStorage.getItem(
        `points_awarded_${orderId}`
      );
      if (storedPointsData || pointsAwarded || isProcessing) {
        console.log("Points already awarded or processing, skipping...");
        return;
      }

      localStorage.setItem(`points_processing_${orderId}`, "true");
      setIsProcessing(true);

      if (!token || !customerId || !totalAmount) {
        console.log("Missing required info:", {
          token: !!token,
          customerId,
          totalAmount,
        });
        message.error(t("missingRequiredInformation"));
        return;
      }

      console.log("Calling award points API...");
      const response = await axios.post(
        `${config.API_ROOT}LoyaltyPoint/award?customerId=${customerId}&orderAmount=${totalAmount}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const earnedPoints =
          response.data.points || Math.floor(totalAmount / 100000);
        setAwardedPoints(earnedPoints);
        setPointsAwarded(true);

        localStorage.setItem(
          `points_awarded_${orderId}`,
          JSON.stringify({
            awarded: true,
            points: earnedPoints,
          })
        );

        message.success(
          t("youHaveEarned", {
            points: earnedPoints,
            amount: (earnedPoints * 1000).toLocaleString(),
          })
        );
      }
    } catch (error) {
      console.error("Error awarding points:", error);
      message.error(t("failedToAwardPoints"));
    } finally {
      setIsProcessing(false);
      localStorage.removeItem(`points_processing_${orderId}`);
    }
  };

  useEffect(() => {
    const storedPointsData = localStorage.getItem(`points_awarded_${orderId}`);
    const isCurrentlyProcessing = localStorage.getItem(
      `points_processing_${orderId}`
    );

    if (storedPointsData) {
      const { points } = JSON.parse(storedPointsData);
      setPointsAwarded(true);
      setAwardedPoints(points);
    } else if (
      token &&
      customerId &&
      totalAmount &&
      !pointsAwarded &&
      !isProcessing &&
      !isCurrentlyProcessing
    ) {
      handlePlusPoint();
    }
  }, [token, customerId, totalAmount, pointsAwarded, isProcessing]);

  useEffect(() => {
    return () => {
      setTimeout(() => {
        localStorage.removeItem(`points_awarded_${orderId}`);
      }, 24 * 60 * 60 * 1000);
    };
  }, [orderId]);

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
            {awardedPoints > 0 && (
              <Descriptions.Item label={t("loyaltyPointsEarned")}>
                <Tag color="green">
                  +{awardedPoints} {t("points")} (
                  {(awardedPoints * 1000).toLocaleString()} VND)
                  {pointsAwarded && <span> • {t("alreadyAwarded")}</span>}
                </Tag>
              </Descriptions.Item>
            )}
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
