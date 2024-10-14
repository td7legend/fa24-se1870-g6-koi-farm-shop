import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import uploadFile from "../../utils/upload/upload";

const { Title, Text } = Typography;
const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg";

const UserForm = () => {
  const { id } = useParams();
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

          // Mock data for order history
          setOrderHistory([
            {
              key: "738",
              id: "#738",
              date: "8 Sep, 2020",
              total: "$135.00 (5 Products)",
              status: "Processing",
            },
            {
              key: "703",
              id: "#703",
              date: "24 May, 2020",
              total: "$25.00 (1 Product)",
              status: "on the way",
            },
            {
              key: "130",
              id: "#130",
              date: "22 Oct, 2020",
              total: "$250.00 (4 Products)",
              status: "Completed",
            },
            {
              key: "561",
              id: "#561",
              date: "1 Feb, 2020",
              total: "$35.00 (1 Product)",
              status: "Completed",
            },
            {
              key: "536",
              id: "#536",
              date: "21 Sep, 2020",
              total: "$578.00 (13 Products)",
              status: "Completed",
            },
            {
              key: "492",
              id: "#492",
              date: "22 Oct, 2020",
              total: "$345.00 (7 Products)",
              status: "Completed",
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

  const handleSaveClick = (field) => {
    if (inputValue.trim() === "") {
      message.error("Please enter a value before saving.");
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
    { title: "ORDER ID", dataIndex: "id", key: "id" },
    { title: "DATE", dataIndex: "date", key: "date" },
    { title: "TOTAL", dataIndex: "total", key: "total" },
    { title: "STATUS", dataIndex: "status", key: "status" },
    {
      title: "ACTION",
      key: "action",
      render: () => <a href="#">View Details</a>,
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              style={{ marginTop: 16 }}
            >
              <Button icon={<PlusOutlined />}>Change Avatar</Button>
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
        <Table columns={columns} dataSource={orderHistory} pagination={false} />
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <a href="/order-history">View All</a>
        </div>
      </Card>
    </div>
  );
};

export default UserForm;
