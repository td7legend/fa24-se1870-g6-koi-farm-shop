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
import { useNavigate, useLocation } from "react-router-dom";

const config = {
  API_ROOT: "https://localhost:44366/api",
};

const Checkout = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [fishes, setFishes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("VnPay");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");

    if (vnp_ResponseCode && vnp_TxnRef) {
      handleVnPayCallback(searchParams);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No authentication token found. Please log in.");
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

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No authentication token found. Please log in.");
        return;
      }

      if (paymentMethod === "VnPay") {
        await processVnPayPayment();
      } else {
        message.error("Only VnPay is supported at the moment.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error("An error occurred. Please try again.");
    }
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
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error("Invalid payment URL received");
      }
    } catch (error) {
      console.error("Error processing VnPay payment:", error);
      message.error("Failed to process payment. Please try again.");
    }
  };

  // const handleVnPayCallback = async (searchParams) => {
  //   try {
  //     setLoading(true);
  //     const callbackUrl = `${
  //       config.API_ROOT
  //     }/payments/callback?${searchParams.toString()}`;
  //     const response = await axios.get(callbackUrl);
  //     const callbackData = response.data;

  //     console.log("VnPay Callback Data:", callbackData);

  //     if (callbackData.vnPayResponseCode === "00" && callbackData.success) {
  //       await completeOrder(callbackData.orderId);
  //     } else {
  //       message.error("Payment was not successful. Redirecting to home page.");
  //       setTimeout(() => {
  //         navigate("/");
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.error("Error handling VnPay callback:", error);
  //     message.error(
  //       "An error occurred while processing your payment. Please contact support."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const completeOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const orderData = {
        orderId: orderId,
        status: 1,
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

      console.log("Completing order with data:", orderData);

      const response = await axios.post(
        `${config.API_ROOT}/orders/pay`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Order completion response:", response.data);

      if (response.data.success) {
        message.success(`Order placed successfully. Order ID: ${orderId}`);
        navigate("/", { state: { orderId } });
      } else {
        throw new Error("Failed to complete order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      message.error(
        "Payment was received but failed to complete the order. Please contact support."
      );
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
      <Row gutter={16}>
        <Col span={12}>
          <h2>Billing Information</h2>
          <div>
            <p>Name: {user.fullName}</p>
            <p>Phone Number: {user.phoneNumber || "Not provided"}</p>
            <p>Email: {user.email || "Not provided"}</p>
            <p>Address: {user.address}</p>
          </div>
          <Button type="primary" onClick={showModal}>
            Edit Address
          </Button>
        </Col>
        <Col span={12}>
          <h2>Order Summary</h2>
          <Table
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
              <Radio value="VnPay">VnPay</Radio>
              <Radio value="bankTransfer" disabled>
                Bank Transfer
              </Radio>
            </Radio.Group>
            <Button type="primary" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </Col>
      </Row>
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
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Checkout;
