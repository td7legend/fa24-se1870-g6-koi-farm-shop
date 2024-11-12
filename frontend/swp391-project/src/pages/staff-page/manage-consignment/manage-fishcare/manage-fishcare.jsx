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
  Breadcrumb,
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "./manage-fishcare.scss";

const { Title } = Typography;
const { TextArea } = Input;

const FishCareManagement = () => {
  const [fishCares, setFishCares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFishCare, setSelectedFishCare] = useState({});
  // const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [viewHistoryModalVisible, setViewHistoryModalVisible] = useState(false);
  const [fishCareHistory, setFishCareHistory] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchFishCares();
  }, []);

  const fetchFishCares = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get("https://localhost:44366/api/FishCare", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFishCares(
        response.data
          .map((care) => ({
            ...care,
            key: care.fishCareId,
          }))
          .sort((a, b) => b.fishCareId - a.fishCareId)
      );
    } catch (error) {
      console.error("Error fetching fish cares:", error);
      message.error("Failed to fetch fish care data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFishCareHistory = async (fishCareId) => {
    try {
      const response = await axios.get(
        `https://localhost:44366/api/FishCare/${fishCareId}/history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFishCareHistory(response.data);
    } catch (error) {
      console.error("Error fetching fish care history:", error);
      message.error("Failed to fetch fish care history");
    }
  };

  const handleViewHistory = async (record) => {
    setSelectedFishCare(record);
    await fetchFishCareHistory(record.fishCareId);
    setViewHistoryModalVisible(true);
  };

  const handleUpdateStatusDetails = async (values) => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      await axios.post(
        `https://localhost:44366/api/FishCare/${selectedFishCare.fishCareId}/add-history`,
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
      title: "Consignment ID",
      dataIndex: "consignmentId",
      key: "consignmentId",
    },
    {
      title: "Fish Type",
      dataIndex: "fishType",
      key: "fishType",
    },
    {
      title: "Health Status",
      dataIndex: "standardCareDetails",
      key: "standardCareDetails",
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
      title: "Care Details",
      dataIndex: "standardCareDetails",
      key: "standardCareDetails",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button className="button" onClick={() => handleViewHistory(record)}>
            View History
          </Button>
          <Button
            className="button-main"
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
    <div className="staff-fishcare-management">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>

          <Breadcrumb.Item>Staff</Breadcrumb.Item>

          <Breadcrumb.Item>Consignment Management</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="manage-fishcare-container">
        <Card>
          <Title level={2}>Fish Care Management</Title>

          <Table
            dataSource={fishCares}
            columns={columns}
            rowKey="fishCareId"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="fishcare-management-table"
          />
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        title={`Fish Care #${selectedFishCare?.fishCareId} History`}
        open={viewHistoryModalVisible}
        onCancel={() => setViewHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        {fishCareHistory.length > 0 ? (
          <Table
            dataSource={fishCareHistory}
            columns={[
              {
                title: "ID",
                dataIndex: "fishCareHistoryId",
                key: "fishCareHistoryId",
              },
              {
                title: "Health Status",
                dataIndex: "healthStatus",
                key: "healthStatus",
              },
              {
                title: "Care Details",
                dataIndex: "careDetails",
                key: "careDetails",
              },
              {
                title: "Care Date",
                dataIndex: "careDate",
                key: "careDate",
                render: (date) => {
                  const careDate = new Date(date);
                  return careDate.toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  });
                },
              },
            ]}
            rowKey="fishCareHistoryId"
          />
        ) : (
          <div>No history available for this fish care.</div>
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
            <Button className="button-main" htmlType="submit" block>
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FishCareManagement;
