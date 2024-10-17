import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  Card,
  Typography,
  Spin,
  Breadcrumb,
  Layout,
  Menu,
  Row,
  Col,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import uploadFile from "../../../utils/upload/upload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const UserSetting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  // Sử dụng các Form riêng biệt cho từng phần
  const [accountForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

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
          accountForm.setFieldsValue(userInfo);
          addressForm.setFieldsValue(userInfo);
          setPreviewImage(userInfo.avatar_path || DEFAULT_AVATAR);
        }
      } catch (error) {
        toast.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, accountForm, addressForm]);

  const handleAvatarChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      try {
        const preview = await getBase64(file);
        setPreviewImage(preview);
      } catch (error) {
        toast.error("Failed to preview avatar");
      }
    } else {
      setPreviewImage(user.avatar_path || DEFAULT_AVATAR);
    }
  };

  const handleUploadAvatar = async () => {
    if (fileList.length === 0) return null;
    const file = fileList[0].originFileObj;
    try {
      const url = await uploadFile(file);
      return url;
    } catch (error) {
      toast.error("Failed to upload avatar");
      throw error;
    }
  };

  const saveAccountInfo = async () => {
    try {
      const values = await accountForm.validateFields();
      setLoading(true);

      let avatarUrl = user.avatar_path;
      if (fileList.length > 0) {
        avatarUrl = await handleUploadAvatar();
      }

      const updatedUser = {
        ...user,
        ...values,
        avatar_path: avatarUrl,
      };

      await axios.put(
        `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information/${user.id}`,
        updatedUser
      );

      // Cập nhật trạng thái user trong component mà không cần reload trang
      setUser(updatedUser);
      toast.success("Account Info updated successfully!");

      // Sau khi cập nhật xong, xóa fileList
      setFileList([]);
    } catch (error) {
      toast.error(`Failed to update Account Info: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveAddressInfo = async () => {
    try {
      const values = await addressForm.validateFields();
      setLoading(true);

      const updatedUser = {
        ...user,
        ...values,
      };

      await axios.put(
        `https://66ffa8eb4da5bd2375516c72.mockapi.io/User_Information/${user.id}`,
        updatedUser
      );
      setUser(updatedUser);
      toast.success("Address Info updated successfully!");
    } catch (error) {
      toast.error(`Failed to update Address Info: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const savePasswordInfo = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);

      // Thêm logic thay đổi mật khẩu tại backend

      toast.success("Password updated successfully!");
      passwordForm.resetFields();
    } catch (error) {
      toast.error(`Failed to update Password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    formInstance,
    label,
    field,
    rules,
    type = "text",
    readOnly = false
  ) => (
    <Form.Item
      form={formInstance}
      label={<Text strong>{label}</Text>}
      style={{ marginBottom: 24 }}
      name={field}
      rules={rules}
      hasFeedback
    >
      {type === "password" ? (
        <Input.Password readOnly={readOnly} />
      ) : (
        <Input readOnly={readOnly} />
      )}
    </Form.Item>
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["setting"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="dashboard" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="orderHistory"
            onClick={() => navigate("/orderhistory")}
          >
            Order History
          </Menu.Item>
          <Menu.Item key="promotion" onClick={() => navigate("/promotion")}>
            Promotion
          </Menu.Item>
          <Menu.Item
            key="shoppingCart"
            onClick={() => navigate("/shoppingcart")}
          >
            Shopping Cart
          </Menu.Item>
          <Menu.Item key="setting">Setting</Menu.Item>
          <Menu.Item key="logout" onClick={() => navigate("/logout")}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "0 24px 24px" }}>
        <div className="breadcrumb-container">
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Product List</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          {/* Account Settings Section */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Account Settings</Title>
            <Form form={accountForm} layout="vertical">
              <Row>
                <Col span={18}>
                  {renderField(accountForm, "Full Name", "fullName", [
                    { required: true, message: "Full name is required" },
                    {
                      min: 3,
                      message: "Full name must be at least 3 characters long",
                    },
                  ])}
                  {renderField(accountForm, "Email", "email", [
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email" },
                  ])}
                  {renderField(accountForm, "Phone", "phone", [
                    { required: true, message: "Phone number is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Phone must be 10 digits",
                    },
                  ])}
                  {/* Read-only Points Fields */}
                  {renderField(
                    accountForm,
                    "Total Points",
                    "totalPoints",
                    [],
                    "text",
                    true
                  )}
                  {renderField(
                    accountForm,
                    "Points Available",
                    "pointAvailable",
                    [],
                    "text",
                    true
                  )}
                  {renderField(
                    accountForm,
                    "Points Used",
                    "pointUsed",
                    [],
                    "text",
                    true
                  )}
                </Col>
                <Col span={6} style={{ textAlign: "center" }}>
                  <Avatar
                    src={previewImage || DEFAULT_AVATAR}
                    size={128}
                    icon={<UserOutlined />}
                  />
                  <Upload
                    fileList={fileList}
                    onChange={handleAvatarChange}
                    beforeUpload={() => false} // Prevent auto-upload
                    showUploadList={false} // Hide the default upload preview list
                  >
                    <Button icon={<PlusOutlined />}>Change Image</Button>{" "}
                    {/* Button only */}
                  </Upload>
                </Col>
              </Row>

              <Button type="primary" onClick={saveAccountInfo}>
                Save Change
              </Button>
            </Form>
          </Card>

          {/* Address Section */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Address</Title>
            <Form form={addressForm} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  {renderField(addressForm, "Address", "address", [
                    { required: true, message: "Address is required" },
                  ])}
                </Col>
                <Col span={12}>
                  {renderField(addressForm, "Ward", "ward", [
                    { required: true, message: "Ward is required" },
                  ])}
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  {renderField(addressForm, "District", "district", [
                    { required: true, message: "District is required" },
                  ])}
                </Col>
                <Col span={12}>
                  {renderField(addressForm, "City", "city", [
                    { required: true, message: "City is required" },
                  ])}
                </Col>
              </Row>
              <Button type="primary" onClick={saveAddressInfo}>
                Save Change
              </Button>
            </Form>
          </Card>

          {/* Change Password Section */}
          <Card>
            <Title level={4}>Change Password</Title>
            <Form form={passwordForm} layout="vertical">
              {renderField(
                passwordForm,
                "Current Password",
                "currentPassword",
                [
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ],
                "password"
              )}
              {renderField(
                passwordForm,
                "New Password",
                "newPassword",
                [
                  { required: true, message: "Please enter a new password" },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                    message:
                      "Password must include at least 8 characters, 1 uppercase letter, 1 number, and 1 special character",
                  },
                ],
                "password"
              )}
              {renderField(
                passwordForm,
                "Confirm New Password",
                "confirmNewPassword",
                [
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ],
                "password"
              )}
              <Button type="primary" onClick={savePasswordInfo}>
                Change Password
              </Button>
            </Form>
          </Card>
        </Content>
      </Layout>
      <ToastContainer />
    </Layout>
  );
};

export default UserSetting;
