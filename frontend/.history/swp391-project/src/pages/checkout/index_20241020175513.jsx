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
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.scss";
const config = {
  API_ROOT: "https://localhost:44366/api",
};

const Checkout = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("VnPay");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No authentication token found. Please log in.");
        navigate("/login"); // Redirect to login if token is not available
        return;
      }

      const [userResponse, cartResponse, fishesResponse] = await Promise.all([
        axios.get(`${config.API_ROOT}/customers/my-info`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${config.API_ROOT}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${config.API_ROOT}/fishs`),
      ]);

      setUser(userResponse.data);
      setCart(cartResponse.data[0]); // Assuming the API returns an array and we take the first item
      setFishes(fishesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data. Please try again.");
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

  const columns = [
    {
      title: "Fish",
      dataIndex: "fishName",
      key: "fishName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
        amount: calculateTotalPrice(),
        orderDescription: `Payment for Order`,
        name: user.fullName,
      };

      const response = await axios.post(
        `${config.API_ROOT}/payments`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
          } else {
            message.error("Payment was not successful. Please try again.");
          }
          popup.close();
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
      message.success("Payment successful!");
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const orderData = {
        orderId: cart.orderId,
        status: 1, // Assuming 1 means "Paid"
        totalAmount: calculateTotalPrice(),
        totalTax: 0,
        totalDiscount: 0,
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
        `${config.API_ROOT}/orders/pay`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data === "Payment processed successfully.") {
        message.success(`Order placed successfully. Order ID: ${cart.orderId}`);
        navigate("/checkout/success", {
          state: {
            orderId: cart.orderId,
            totalAmount: calculateTotalPrice(),
          },
        });
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
    return <Spin size="large" />;
  }

  if (!user || !cart || fishes.length === 0) {
    return <div>No active cart found or user information unavailable.</div>;
  }

  return (
    <div>
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Fish List</Breadcrumb.Item>
            <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
            <Breadcrumb.Item>Checkout</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <div className="check-out-container">
        <Row className="check-out-form">
          <Col className="form-left">
            <h2>Order Summary</h2>
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
                      <strong style={{ float: "right" }}>Total Price:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>
                        {calculateTotalPrice().toLocaleString()} VND
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
            <div style={{ marginTop: "20px", textAlign: "right" }}>
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
                <Button className="button" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </Radio.Group>
            </div>
          </Col>
          <Col className="form-right">
            <div style={{ padding: "20px", border: "1px solid #f0f0f0" }}>
              <h2>Billing Information</h2>
              <p>Name: {user.fullName}</p>
              <p>Phone Number: {user.phoneNumber || "Not provided"}</p>
              <p>Email: {user.email || "Not provided"}</p>
              <p>Address: {user.address}</p>
              <Button className="button" onClick={showModal}>
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
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Checkout;
