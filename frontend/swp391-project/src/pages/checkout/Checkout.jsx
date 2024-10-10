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
} from "antd";

// Simulated API functions
const getUser = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        firstName: "Tran",
        lastName: "Quang Duy",
        phoneNumber: "0941460781",
        email: "example@email.com",
        address: "123 Main St, Ward 1, District 1, Ho Chi Minh City",
      });
    }, 500);
  });
};

const getCart = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Platinum Tosai",
          price: 800000,
          quantity: 1,
          status: 0,
          image:
            "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        },
        {
          id: 2,
          name: "Red Capsicum",
          price: 2500000,
          quantity: 2,
          status: 0,
          image:
            "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
        },
      ]);
    }, 500);
  });
};

const placeOrder = (orderData) => {
  // Simulating a POST API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Order placed:", orderData);
      resolve({
        success: true,
        message: "Order placed successfully",
        orderId: Math.floor(Math.random() * 1000000),
      });
    }, 1000);
  });
};

const Checkout = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("VnPay");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      const cartData = await getCart();
      setUser(userData);
      setAddress(userData.address);
      setCart(cartData.filter((item) => item.status === 0));
    };
    fetchData();
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const columns = [
    {
      title: "Fish",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record.image && <Image src={record.image} alt={text} width={50} />}
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
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
  ];

  const showModal = () => {
    form.setFieldsValue({ address });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    setAddress(values.address);
    setIsModalVisible(false);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      orderId: Math.floor(Math.random() * 1000000),
      address,
      totalPrice,
      paymentMethod,
    };

    try {
      const result = await placeOrder(orderData);
      if (result.success) {
        message.success(`${result.message}. Order ID: ${result.orderId}`);
      } else {
        message.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  if (!user || cart.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Col span={24}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Product List</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Col>
      <Row gutter={16}>
        <Col span={12}>
          <h2>Billing Information</h2>
          <div>
            <p>
              Name: {user.firstName} {user.lastName}
            </p>
            <p>Phone Number: {user.phoneNumber}</p>
            <p>Email: {user.email}</p>
            <p>Address: {address}</p>
          </div>
          <Button type="primary" onClick={showModal}>
            Edit Address
          </Button>
        </Col>
        <Col span={12}>
          <h2>Order Summary</h2>
          <Table
            columns={columns}
            dataSource={cart}
            pagination={false}
            rowKey={(record) => record.id}
            summary={() => (
              <Table.Summary>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong style={{ float: "right" }}>Total Price:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>{totalPrice.toLocaleString()} VND</strong>
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
