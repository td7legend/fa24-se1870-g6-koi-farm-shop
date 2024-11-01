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
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import { useSelector } from "react-redux";
import config from "../../../config/config";
const { Title } = Typography;

const FishTypeManagement = () => {
  const [fishTypes, setFishTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    fetchFishTypes();
  }, []);

  const fetchFishTypes = async () => {
    try {
      setLoading(true);

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${config.API_ROOT}fishtypes`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });

      setFishTypes(
        response.data
          .map((type) => ({
            ...type,
            key: type.fishTypeId,
          }))
          .sort((a, b) => b.fishTypeId - a.fishTypeId)
      );
    } catch (error) {
      console.error("Error fetching fish types:", error);
      message.error("Failed to fetch fish type data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const fishTypeData = {
        name: values.name,
        description: values.description,
      };

      await axios.post(`${config.API_ROOT}fishtypes`, fishTypeData, {
        headers: {
          Authorization: `Bearer ${token ?? null}`,
          "Content-Type": "application/json",
        },
      });

      message.success("Fish type added successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchFishTypes();
    } catch (error) {
      console.error("Error saving fish type:", error);
      message.error("Failed to save fish type. Please try again.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "fishTypeId",
      key: "fishTypeId",
      render: (id) => `#${id}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const AddFishTypeModal = () => (
    <Modal
      title="Add New Fish Type"
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleAdd}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter fish type name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#bbab6f" }}
            >
              Add
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="staff-fish-type-management">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Staff</Breadcrumb.Item>
          <Breadcrumb.Item>Fish Type Management</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="fish-type-container">
        <Card className="card">
          <div className="flex justify-between items-center mb-4">
            <Title level={3}>Fish Type Management</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{ backgroundColor: "#bbab6f" }}
            >
              Add New Fish Type
            </Button>
          </div>

          <Table
            className="fish-type-table"
            columns={columns}
            dataSource={fishTypes}
            loading={loading}
            pagination={{
              total: fishTypes.length,
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: false,
            }}
          />
        </Card>
      </div>

      <AddFishTypeModal />
      <ToastContainer />
    </div>
  );
};

export default FishTypeManagement;
