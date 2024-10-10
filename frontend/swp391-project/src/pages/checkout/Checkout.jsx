import React, { useState } from "react";
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
} from "antd";

const Checkout = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Platinum Tosai",
      price: 800000,
      quantity: 1,
      image:
        "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
    },
    {
      id: 2,
      name: "Red Capsicum",
      price: 2500000,
      quantity: 2,
      image:
        "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
    },
  ]);

  const [user, setUser] = useState({
    id: 1,
    firstName: "Haha",
    lastName: "Quang Duy",
    phoneNumber: "0941460781",
    address: "Vinhomes Grand Park",
    ward: "Long Thạnh Mỹ",
    district: "Thủ Đức",
    city: "Ho Chi Minh City",
    email: "example@email.com",
  });

  const [paymentMethod, setPaymentMethod] = useState("VnPay");

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
          <Image src={record.image} alt={text} width={50} />
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
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    setUser(values);
    setIsModalVisible(false);
  };

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
            <p>
              Address: {user.address}, {user.ward}, {user.district}, {user.city}
            </p>
            <p>Email: {user.email}</p>
          </div>
          <Button type="primary" onClick={showModal}>
            Edit Billing Information
          </Button>
          <Modal
            title="Edit Billing Information"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              name="checkout"
              onFinish={onFinish}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                      { required: true, message: "Please input your address!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="District"
                    name="district"
                    rules={[
                      {
                        required: true,
                        message: "Please input your district!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Ward"
                    name="ward"
                    rules={[
                      { required: true, message: "Please input your ward!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[
                      { required: true, message: "Please input your city!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Order Notes (Optional)" name="orderNotes">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
        <Col span={12}>
          <h2>Order Summary</h2>
          <Table
            columns={columns}
            dataSource={cart}
            pagination={false}
            footer={() => (
              <div>
                <p>
                  <strong>Total Price:</strong> {totalPrice.toLocaleString()}{" "}
                  VND
                </p>
              </div>
            )}
          />
          <h2>Payment Method</h2>
          <Radio.Group
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Radio value="VnPay">VnPay</Radio>
            <Radio value="bankTransfer">Bank Transfer</Radio>
          </Radio.Group>
          <div style={{ marginTop: "20px" }}>
            <Button type="primary" onClick={showModal}>
              Place Order
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
