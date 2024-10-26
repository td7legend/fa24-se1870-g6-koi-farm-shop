import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Modal,
  message,
  Space,
  Typography,
  Form,
  Input,
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;
const { TextArea } = Input;

const FishCareManagement = () => {
  const [fishCares, setFishCares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFishCare, setSelectedFishCare] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFishCares();
  }, []);

  const fetchFishCares = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get("https://localhost:44366/api/FishCare", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFishCares(
        response.data.map((care) => ({
          ...care,
          key: care.fishCareId,
        }))
      );
    } catch (error) {
      console.error("Error fetching fish cares:", error);
      message.error("Failed to fetch fish care data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusDetails = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      await axios.patch(
        `https://localhost:44366/api/FishCare/${selectedFishCare.fishCareId}/status-details`,
        {
          healthStatus: values.healthStatus,
          careDetails: values.careDetails,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Fish care status updated successfully");
      setUpdateModalVisible(false);
      form.resetFields();
      await fetchFishCares();
    } catch (error) {
      console.error("Error updating fish care status:", error);
      message.error("Failed to update fish care status");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "fishCareId",
      key: "fishCareId",
      width: 80,
    },
    {
      title: "Fish Type",
      dataIndex: "fishType",
      key: "fishType",
    },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (status) => (
        <Tag
          color={
            status === "Healthy"
              ? "green"
              : status === "Sick"
              ? "red"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Consignment ID",
      dataIndex: "consignmentId",
      key: "consignmentId",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedFishCare(record);
              setDetailModalVisible(true);
            }}
          >
            Details
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedFishCare(record);
              form.setFieldsValue({
                healthStatus: record.healthStatus,
                careDetails: record.careDetails,
              });
              setUpdateModalVisible(true);
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Fish Care Management</Title>
        <Table
          dataSource={fishCares}
          columns={columns}
          rowKey="fishCareId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Fish Care #${selectedFishCare?.fishCareId} Details`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedFishCare && (
          <div>
            <p>
              <strong>Fish Type:</strong> {selectedFishCare.fishType}
            </p>
            <p>
              <strong>Health Status:</strong> {selectedFishCare.healthStatus}
            </p>
            <p>
              <strong>Care Details:</strong> {selectedFishCare.careDetails}
            </p>
            <p>
              <strong>Consignment ID:</strong> {selectedFishCare.consignmentId}
            </p>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Fish Care Status"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateStatusDetails}
        >
          <Form.Item
            name="healthStatus"
            label="Health Status"
            rules={[
              { required: true, message: "Please input the health status!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="careDetails"
            label="Care Details"
            rules={[
              { required: true, message: "Please input the care details!" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FishCareManagement;
