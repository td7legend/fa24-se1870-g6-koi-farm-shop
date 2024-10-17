import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Avatar,
  Upload,
  Card,
  Typography,
  Space,
  Spin,
  Table,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import uploadFile from "../../../utils/upload/upload";

const { Title, Text } = Typography;
const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg";

const UserDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingField, setEditingField] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [isModifiedImage, setIsModifiedImage] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information?userID=${id}`
        );
        if (response.data.length > 0) {
          const userInfo = response.data[0];
          setUser(userInfo);
          form.setFieldsValue(userInfo);
          setPreviewImage(userInfo.avatar_path || DEFAULT_AVATAR);

          setOrderHistory([
            {
              orderId: 1001,
              status: 1,
              totalAmount: 1350000,
              totalTax: 135000,
              totalDiscount: 0,
              customerId: 1,
              orderLines: [
                {
                  fishId: 1,
                  fishName: "Koi Carp",
                  imageUrl:
                    "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
                  quantity: 2,
                  unitPrice: 500000,
                  totalPrice: 1000000,
                },
                {
                  fishId: 2,
                  fishName: "Goldfish",
                  imageUrl:
                    "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
                  quantity: 1,
                  unitPrice: 350000,
                  totalPrice: 350000,
                },
              ],
            },
            {
              orderId: 1002,
              status: 2,
              totalAmount: 2800000,
              totalTax: 280000,
              totalDiscount: 100000,
              customerId: 2,
              orderLines: [
                {
                  fishId: 3,
                  fishName: "Arowana",
                  imageUrl:
                    "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
                  quantity: 1,
                  unitPrice: 2800000,
                  totalPrice: 2800000,
                },
              ],
            },
            {
              orderId: 1003,
              status: 3,
              totalAmount: 750000,
              totalTax: 75000,
              totalDiscount: 50000,
              customerId: 1,
              orderLines: [
                {
                  fishId: 4,
                  fishName: "Guppy",
                  imageUrl:
                    "https://d2e07cbkdk0gwy.cloudfront.net/wp-content/uploads/2013/07/page/Yamatonishiki_03.18.2024-scaled.jpg",
                  quantity: 5,
                  unitPrice: 150000,
                  totalPrice: 750000,
                },
              ],
            },
          ]);
        }
      } catch (error) {
        message.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form]);

  const handleEditClick = (field) => {
    setEditingField(field);
    setInputValue(user[field] || "");
  };

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidPhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSaveClick = (field) => {
    if (inputValue.trim() === "") {
      message.error("Please enter a value before saving.");
      return;
    }

    if (field === "email" && !isValidEmail(inputValue)) {
      message.error("Please enter a valid email address.");
      return;
    }

    if (field === "phone" && !isValidPhoneNumber(inputValue)) {
      message.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setUser({ ...user, [field]: inputValue });
    setEditingField(null);
    setIsModified(true);
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setInputValue("");
  };

  const handleAvatarChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const preview = await getBase64(file);
      setPreviewImage(preview);
      setIsModifiedImage(true);
    } else {
      setPreviewImage(user.avatar_path || DEFAULT_AVATAR);
      setIsModifiedImage(false);
    }
  };

  const onFinish = async () => {
    Modal.confirm({
      title: "Confirm Changes",
      content: "Are you sure you want to save these changes?",
      onOk: async () => {
        try {
          setLoading(true);
          if (isModifiedImage && fileList.length > 0) {
            const file = fileList[0].originFileObj;
            const url = await uploadFile(file);
            user.avatar_path = url;
          }
          await axios.put(
            `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information/${user.id}`,
            user
          );
          message.success("User information updated successfully!");
          setIsModified(false);
          setIsModifiedImage(false);
          setPreviewImage(user.avatar_path || DEFAULT_AVATAR);
        } catch (error) {
          message.error("Failed to update user information");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const renderField = (label, field, editable = true) => (
    <Form.Item label={<Text strong>{label}</Text>} style={{ marginBottom: 24 }}>
      {editingField === field ? (
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: "calc(100% - 96px)" }}
          />
          <Button
            icon={<SaveOutlined />}
            onClick={() => handleSaveClick(field)}
            type="primary"
          >
            Save
          </Button>
          <Button icon={<CloseOutlined />} onClick={handleCancelClick}>
            Cancel
          </Button>
        </Space.Compact>
      ) : (
        <Space>
          <Text>{user[field]}</Text>
          {editable && (
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditClick(field)}
              type="link"
            >
              Edit
            </Button>
          )}
        </Space>
      )}
    </Form.Item>
  );

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => `#${orderId}`,
    },
    { title: "DATE", dataIndex: "date", key: "date" },
    {
      title: "TOTAL",
      dataIndex: "totalAmount",
      key: "total",
      render: (total, record) =>
        `${total.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })} (${record.orderLines.length} Products)`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        ["Processing", "Shipping", "Completed"][status - 1] || "Unknown",
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() =>
            navigate("/order-details", { state: { orderId: record.orderId } })
          }
          style={{ color: "#D4B57E" }}
        >
          View Details
        </a>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item>User Dashboard</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card style={{ marginBottom: 24 }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
              User Profile
            </Title>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                src={previewImage || DEFAULT_AVATAR}
                size={128}
                icon={<UserOutlined />}
              />
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                <Button icon={<PlusOutlined />} size="small" shape="circle" />
              </Upload>
            </div>

            {renderField("Full Name", "fullName")}
            {renderField("Address", "address")}
            {renderField("Email", "email")}
            {renderField("Phone", "phone")}
            {renderField("Total Points", "totalPoints", false)}
            {renderField("Points Available", "pointAvailable", false)}
            {renderField("Points Used", "pointUsed", false)}

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!(isModified || isModifiedImage)}
                block
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          <Title level={3}>Recent Order History</Title>
          <Table
            columns={columns}
            dataSource={orderHistory}
            pagination={false}
            rowKey="orderId"
          />
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Link to="/order-history" style={{ color: "#D4B57E" }}>
              View All Orders
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
