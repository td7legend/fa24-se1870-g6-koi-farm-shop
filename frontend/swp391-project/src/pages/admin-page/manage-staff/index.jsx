import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  message,
  Breadcrumb,
  Button,
  Modal,
  Card,
  Form,
  Input,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import config from "../../../config/config";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";

const { Title } = Typography;

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_ROOT}auth/staffs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const staffsWithKeys = response.data.map((staff) => ({
        ...staff,
        key: staff.id || staff._id,
      }));

      setStaffs(staffsWithKeys);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleAdd = async (values) => {
    try {
      if (!validateEmail(values.email)) {
        toast.error("Email không hợp lệ");
        return;
      }

      if (!validatePassword(values.password)) {
        toast.error(
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt"
        );
        return;
      }

      if (values.password !== values.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }

      if (!validatePhone(values.phoneNumber)) {
        toast.error("Số điện thoại phải có 10 chữ số");
        return;
      }

      const staffData = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        role: "Staff",
      };

      await axios.post(`${config.API_ROOT}auth/staff`, staffData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      message.success("Thêm nhân viên thành công");
      setIsModalVisible(false);
      form.resetFields();
      fetchStaffs();
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      message.error("Không thể thêm nhân viên. Vui lòng thử lại.");
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];

  const AddStaffModal = () => (
    <Modal
      title="Thêm nhân viên mới"
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (!validatePassword(value)) {
                  return Promise.reject(
                    "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu xác nhận không khớp!");
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#bbab6f" }}
            >
              Thêm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="admin-staff-management">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý nhân viên</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card className="card">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>Quản lý nhân viên</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            style={{ backgroundColor: "#bbab6f" }}
          >
            Thêm nhân viên mới
          </Button>
        </div>

        <Table
          className="staff-management-table"
          columns={columns}
          dataSource={staffs}
          loading={loading}
          pagination={{
            total: staffs.length,
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
        />
      </Card>

      <AddStaffModal />
      <ToastContainer />
    </div>
  );
};

export default StaffManagement;
