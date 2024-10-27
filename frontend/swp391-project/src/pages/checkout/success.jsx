import React, { useEffect } from "react";
import { Result, Typography, Card, Descriptions, Button } from "antd";
import { CheckCircleFilled, HomeFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./success.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/actions/cartAction";
import { useTranslation } from "react-i18next";
const { Title, Paragraph } = Typography;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId, totalAmount } = location.state || {};
  const { cartItemsRedux } = useSelector((state) => state.cart);
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(clearCart());
  }, []);
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
          subTitle={
            <Paragraph>
              {t("thankYouForYourPurchaseYourOrderHasBeenConfirmed")}
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
              {t("returnToHome")}
            </Button>,
            <Button
              className="button"
              key="home"
              size="large"
              icon={<HomeFilled />}
              onClick={() => navigate("/order-details", { state: { orderId } })}
            >
              {t("viewOrderDetails")}
            </Button>,
          ]}
        >
          <Descriptions title={t("orderInformation")} bordered column={1}>
            <Descriptions.Item label={t("orderId")}>
              {orderId || t("notAvailable")}
            </Descriptions.Item>
            <Descriptions.Item label={t("totalAmount")}>
              {totalAmount
                ? `${totalAmount.toLocaleString()} VND`
                : t("informationNotAvailable")}
            </Descriptions.Item>
          </Descriptions>
        </Result>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
