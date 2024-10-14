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

const Checkout = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("VnPay");
  const [loading, setLoading] = useState(true);

  // Demo data
  const demoUser = {
    id: 1,
    fullName: "Tran Quang Duy",
    phoneNumber: "0941460781",
    email: "example@email.com",
    address: "123 Main St, Ward 1, District 1, Ho Chi Minh City",
  };

  const demoCart = {
    orderId: 1001,
    status: 0,
    totalAmount: 5800000,
    totalTax: 0,
    totalDiscount: 0,
    customerId: 1,
    orderLines: [
      {
        fishId: 1,
        fishName: "Platinum Tosai",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 1,
        unitPrice: 800000,
        totalPrice: 800000,
      },
      {
        fishId: 2,
        fishName: "Red Capsicum",
        imageUrl:
          "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        quantity: 2,
        unitPrice: 2500000,
        totalPrice: 5000000,
      },
    ],
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Simulating API call delay
    setTimeout(() => {
      setUser(demoUser);
      setCart(demoCart);
      setLoading(false);
    }, 1000);

    // Commented out API calls
    // try {
    //   const userData = await axios.get('YOUR_API_ENDPOINT/user');
    //   const cartData = await axios.get('YOUR_API_ENDPOINT/orders');
    //   const activeCart = cartData.data.find(order => order.status === 0);
    //   setUser(userData.data);
    //   setCart(activeCart || null);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   message.error("Failed to fetch data");
    // } finally {
    //   setLoading(false);
    // }
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
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toLocaleString()} VND`,
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
    const orderData = {
      ...cart,
      paymentMethod,
      shippingAddress: user.address,
    };

    // Simulating API call
    setTimeout(() => {
      console.log("Order placed:", orderData);
      message.success(`Order placed successfully. Order ID: ${cart.orderId}`);
    }, 1000);

    // Commented out API call
    // try {
    //   const response = await axios.post('YOUR_API_ENDPOINT/orders', orderData);
    //   if (response.data.success) {
    //     message.success(`Order placed successfully. Order ID: ${response.data.orderId}`);
    //   } else {
    //     message.error("Failed to place order. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error placing order:", error);
    //   message.error("An error occurred. Please try again.");
    // }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!user || !cart) {
    return <div>No active cart found.</div>;
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
            <p>Phone Number: {user.phoneNumber}</p>
            <p>Email: {user.email}</p>
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
                    <strong>{cart.totalAmount.toLocaleString()} VND</strong>
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
              <Radio value="bankTransfer">Bank Transfer</Radio>
            </Radio.Group>
            <Button type="primary" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        title="Edit Address"
        centered
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="address" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Address"
            name="address"
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
