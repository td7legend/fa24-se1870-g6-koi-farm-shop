import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Radio,
  Row,
  Col,
  Image,
  Breadcrumb,
  Modal,
  message,
  Spin,
  InputNumber,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { AES, enc } from "crypto-js";
import config from "../../config/config";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import LoadingKoi from "../../components/loading";
import { clearCart } from "../../store/actions/cartAction";

const Checkout = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("VnPay");
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, token, role } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
    console.log("user", user);
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      if (!isLoggedIn) {
        message.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const [userResponse, cartResponse, fishesResponse] = await Promise.all([
        axios.get(`${config.API_ROOT}customers/my-info`, {
          headers: { Authorization: `Bearer ${token ?? null}` },
        }),
        axios.get(`${config.API_ROOT}cart`, {
          headers: { Authorization: `Bearer ${token ?? null}` },
        }),
        axios.get(`${config.API_ROOT}fishs`),
      ]);

      setUser(userResponse.data);
      setCart(cartResponse.data[0]);
      setFishes(fishesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFishPrice = (fishId) => {
    const fish = fishes.find((f) => f.fishId === fishId);
    return fish ? fish.price : 0;
  };

  const calculateItemTotal = (item) => {
    const price = getFishPrice(item.fishId);
    return price * item.quantity;
  };

  const calculateTotalPrice = () => {
    if (!cart || !cart.orderLines) return 0;
    return cart.orderLines.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const calculateFinalPrice = () => {
    const totalPrice = calculateTotalPrice();
    const pointsValueInVND = pointsToRedeem * 1000; // Convert points to VND
    return Math.max(0, totalPrice - pointsValueInVND);
  };

  const columns = [
    {
      title: "Fish",
      dataIndex: "fishName",
      key: "fishName",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            textTransform: "none",
          }}
        >
          <Image src={record.imageUrl} alt={text} width={50} />
          <span style={{ marginLeft: 10 }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) =>
        `${getFishPrice(record.fishId).toLocaleString()} VND`,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        `${calculateItemTotal(record).toLocaleString()} VND`,
    },
  ];

  const showModal = () => {
    form.setFieldsValue({ address: user.address });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    setUser({ ...user, address: values.address });
    setIsModalVisible(false);
  };

  const processVnPayPayment = async () => {
    try {
      const paymentData = {
        orderType: "01",
        amount: calculateFinalPrice(),
        orderDescription: `Payment for Order`,
        name: "",
      };
      console.log(paymentData);
      const response = await axios.post(
        `${config.API_ROOT}payments`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token ?? null}` },
        }
      );

      if (response.data && response.data.paymentUrl) {
        openPaymentPopup(response.data.paymentUrl);
      } else {
        throw new Error("Invalid payment URL received");
      }
    } catch (error) {
      console.error("Error processing VnPay payment:", error);
      message.error("Failed to process payment. Please try again.");
    }
  };

  const openPaymentPopup = (url) => {
    const popup = window.open(url, "VnPay Payment", "width=800,height=600");

    if (!popup) {
      console.error("Cannot open popup. Please allow popups.");
      return;
    }

    const checkPaymentStatus = setInterval(() => {
      try {
        if (popup.location.href.includes("localhost:5173/payment")) {
          clearInterval(checkPaymentStatus);

          const paymentStatus = popup.location.href.includes("/payment/True");
          if (paymentStatus) {
            handlePaymentSuccess();
            popup.close();
          } else {
            message.error("Payment was not successful. Please try again.");
          }
        }
      } catch (error) {
        // Handle cross-origin error
      }

      if (popup.closed) {
        clearInterval(checkPaymentStatus);
        console.log("Popup has been closed.");
      }
    }, 500);
  };

  const handlePaymentSuccess = async () => {
    try {
      message.success("Payment successful");
      if (pointsToRedeem > 0) {
        await axios.post(
          `${config.API_ROOT}LoyaltyPoint/redeem?customerId=${user.customerId}&pointsToRedeem=${pointsToRedeem}`,
          null,
          {
            headers: { Authorization: `Bearer ${token ?? null}` },
          }
        );
      }
      await completeOrder();
    } catch (error) {
      console.error("Error completing order:", error);
      message.error(
        "Payment was successful but failed to complete the order. Please contact support."
      );
    }
  };

  const completeOrder = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const orderData = {
        orderId: cart.orderId,
        status: 1,
        totalAmount: calculateTotalPrice(),
        totalTax: 0,
        totalDiscount: pointsToRedeem * 1000,
        orderDate: new Date().toISOString(),
        address: user.address,
        customerId: user.id,
        orderLines: cart.orderLines.map((item) => ({
          fishId: item.fishId,
          fishName: item.fishName,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unitPrice: getFishPrice(item.fishId),
          totalPrice: calculateItemTotal(item),
        })),
      };

      const response = await axios.post(
        `${config.API_ROOT}orders/pay`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token ?? null}` },
        }
      );

      if (response.data === "Payment processed successfully.") {
        message.success(`Order placed successfully. Order ID: ${cart.orderId}`);
        navigate("/checkout/success", {
          state: {
            orderId: cart.orderId,
            totalAmount: calculateFinalPrice(),
            customerId: user.customerId,
          },
        });
        dispatch(clearCart());
      } else {
        throw new Error("Failed to complete order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      message.error("Failed to complete the order. Please contact support.");
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "VnPay") {
      processVnPayPayment();
    } else {
      message.warning("Please select a valid payment method.");
    }
  };

  if (loading) {
    return <LoadingKoi />;
  }

  if (!user || !cart || fishes.length === 0) {
    return (
      <div className="no-cart-message">
        No active cart found or user information unavailable
      </div>
    );
  }

  const fullName = user.fullName ? String(user.fullName) : "Unknown User";

  console.log(typeof user.fullName);
  console.log(user.fullName);

  return (
    <div className="checkout-page">
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb" separator=">">
            <Breadcrumb.Item href="/">
              <FontAwesomeIcon icon={faHome} className="icon" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Fish List</Breadcrumb.Item>
            <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
            <Breadcrumb.Item className="breadcrumb-page">
              Check Out
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="check-out-container">
        <Row className="check-out-form">
          <Col className="form-left">
            <h2>Order Summary</h2>
            {user?.pointAvailable > 0 && (
              <div
                className="points-section"
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <p style={{ margin: 0, color: "#bbab6f" }}>
                  Available Points: {user.pointAvailable}
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Points to redeem:</span>
                  <InputNumber
                    min={0}
                    max={user?.pointAvailable}
                    value={pointsToRedeem}
                    onChange={(value) => setPointsToRedeem(value || 0)}
                    style={{
                      width: "100px",
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(187, 171, 111, 0.1)",
                    }}
                  />
                </div>
                {pointsToRedeem > 0 && (
                  <span>(-{(pointsToRedeem * 1000).toLocaleString()} VND)</span>
                )}
              </div>
            )}
            <Table
              className="table"
              columns={columns}
              dataSource={cart.orderLines}
              pagination={false}
              rowKey={(record) => record.fishId}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong style={{ float: "right" }}>Sub Total:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>
                        {calculateTotalPrice().toLocaleString()} VND
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  {pointsToRedeem > 0 && (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <strong style={{ float: "right" }}>
                          Points redemption:
                        </strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <strong>
                          -{(pointsToRedeem * 1000).toLocaleString()} VND
                        </strong>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong style={{ float: "right" }}>Final Total:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>
                        {calculateFinalPrice().toLocaleString()} VND
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
            <div
              className="payment-container"
              style={{ marginTop: "20px", textAlign: "right" }}
            >
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{ marginRight: "20px" }}
              >
                <Radio value="VnPay">
                  <img src="src/images/vn-pay.png" alt="" width={50} />
                </Radio>
                <Radio value="bankTransfer" disabled>
                  Bank Transfer
                </Radio>
                <Button
                  className="button-main"
                  onClick={handlePlaceOrder}
                  style={{ borderRadius: "15px" }}
                >
                  Place Order
                </Button>
              </Radio.Group>
            </div>
          </Col>
          <Col className="form-right">
            <div style={{ padding: "20px" }}>
              <h2>Billing Information</h2>
              <div className="information-item">
                <p className="item-tittle ">Name:</p>
                <p>{fullName}</p>
              </div>
              <div className="information-item">
                <p className="item-tittle ">Phone Number:</p>
                <p>{user.phoneNumber || "Not provided"}</p>
              </div>
              <div className="information-item">
                <p className="item-tittle ">Email:</p>
                <p>{user.email || "Not provided"}</p>
              </div>
              <div className="information-item">
                <p className="item-tittle ">Address:</p>
                <p> {user.address}</p>
              </div>
              <Button
                className="button"
                onClick={showModal}
                style={{ borderRadius: "15px", marginTop: "5px" }}
              >
                Edit Address
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title="Edit Address"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="address" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please Input Your Address" }]}
          >
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Checkout;
