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
  InputNumber,
  Descriptions,
} from "antd";
import { EyeOutlined, CheckOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;

const ConsignmentManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [careModalVisible, setCareModalVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [careForm] = Form.useForm();
  const [saleForm] = Form.useForm();
  const navigate = useNavigate();
  const calculateTotalPrice = (price, qty) => {
    return price * qty;
  };
  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://localhost:44366/api/Consignment/customer/1",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConsignments(
        response.data.map((consignment) => ({
          ...consignment,
          key: consignment.consignmentId,
        }))
      );
    } catch (error) {
      console.error("Error fetching consignments:", error);
      message.error("Failed to fetch consignment data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCareConfirm = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      // Update consignment status and care fee
      await axios.post(
        `https://localhost:44366/api/Consignment/${selectedConsignment.consignmentId}/receive-care?careFee=${values.careFee}`,
        null, // no body needed
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add fish care record
      await axios.post(
        "https://localhost:44366/api/FishCare",
        {
          fishCareId: 0,
          fishType: values.fishType,
          consignmentId: selectedConsignment.consignmentId,
          healthStatus: values.healthStatus,
          careDetails: values.careDetails,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Care consignment confirmed successfully");
      setCareModalVisible(false);
      careForm.resetFields();
      await fetchConsignments();
    } catch (error) {
      console.error("Error confirming care:", error);
      message.error("Failed to confirm care consignment");
    }
  };

  const handleOpenSaleModal = (record) => {
    setSelectedConsignment(record);
    const consignmentLine = record.consignmentLines[0]; // Assuming first line
    setUnitPrice(0); // Reset unit price
    setQuantity(consignmentLine.quantity); // Set quantity from consignment line

    saleForm.setFieldsValue({
      fishType: consignmentLine.fishType,
      quantity: consignmentLine.quantity,
      imageUrl: consignmentLine.imageUrl,
      // Other fields set to default/empty
      gender: 0,
      age: 0,
      size: 0,
      class: "",
      fishTypeId: 0,
      foodRequirement: 0,
      overallRating: 0,
    });

    setSaleModalVisible(true);
  };

  // Modify the handleSaleConfirm function
  const handleSaleConfirm = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const totalPrice = calculateTotalPrice(values.unitPrice, values.quantity);

      // Update consignment status and agreed price
      // await axios.post(
      //   `https://localhost:44366/api/Consignment/${selectedConsignment.consignmentId}/receive-sale?agreePrice=${values.agreePrice}`,
      //   null,
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      // Update fish details - Note the changed structure to include array
      // Update fish details
      await axios.put(
        `https://localhost:44366/api/Consignment/${selectedConsignment.consignmentId}/update-sale?agreePrice=${values.agreePrice}`,
        [
          // Changed to array directly
          {
            consignmentLineId:
              selectedConsignment.consignmentLines[0].consignmentLineId,
            unitPrice: values.unitPrice,
            quantity: selectedConsignment.consignmentLines[0].quantity,
            totalPrice: totalPrice,
          },
        ],
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add fish to database
      await axios.post(
        "https://localhost:44366/api/fishs",
        {
          name: values.fishType,
          gender: values.gender,
          age: values.age,
          size: values.size,
          class: values.class,
          consignmentLineId:
            selectedConsignment.consignmentLines[0].consignmentLineId,
          foodRequirement: values.foodRequirement,
          overallRating: values.overallRating,
          price: values.sellingPrice,
          batch: true,
          fishTypeId: values.fishTypeId,
          quantity: values.quantity,
          imageUrl: selectedConsignment.consignmentLines[0].imageUrl,
          description: "bo may mat Git",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Sale consignment confirmed successfully");
      setSaleModalVisible(false);
      saleForm.resetFields();
      await fetchConsignments();
    } catch (error) {
      console.error("Error confirming sale:", error);
      message.error("Failed to confirm sale consignment");
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      0: { color: "warning", text: "Pending" },
      1: { color: "processing", text: "Under Review" },
      2: { color: "success", text: "Confirmed" },
      3: { color: "blue", text: "Listed For Sale" },
      4: { color: "purple", text: "Sold" },
      5: { color: "cyan", text: "Under Care" },
      6: { color: "green", text: "Care Completed" },
      7: { color: "red", text: "Cancelled" },
    };

    return (
      <Tag color={statusConfig[status]?.color || "default"}>
        {statusConfig[status]?.text || "Unknown"}
      </Tag>
    );
  };

  const updateStatus = async (record, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      await axios.put(
        `https://localhost:44366/api/Consignment/${record.consignmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const statusMessages = {
        1: "Consignment is now under review",
        2: "Consignment confirmed successfully",
        7: "Consignment has been cancelled", // Add this line
      };

      message.success(
        statusMessages[newStatus] || "Status updated successfully"
      );
      await fetchConsignments();
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "consignmentId",
      key: "consignmentId",
      width: 80,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color={type === 0 ? "blue" : "green"}>
          {type === 0 ? "Care" : "Sale"}
        </Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Price/CareFee",
      key: "price",
      render: (_, record) =>
        record.type === 0 ? record.careFee : record.agreedPrice,
    },
    {
      title: "Actions",
      key: "actions",
      width: 250,
      render: (_, record) => {
        const showReviewButton = record.status === 0;
        const showConfirmButton = record.status === 1;
        const showReceiveButton = record.status === 2;
        const showCancelButton = record.status === 0 || record.status === 1; // Can cancel when Pending or Under Review

        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedConsignment(record);
                setDetailModalVisible(true);
              }}
            >
              Details
            </Button>

            {showCancelButton && (
              <Button danger onClick={() => updateStatus(record, 7)}>
                Cancel
              </Button>
            )}

            {showReviewButton && (
              <Button type="primary" onClick={() => updateStatus(record, 1)}>
                Review
              </Button>
            )}

            {showConfirmButton && (
              <Button type="primary" onClick={() => updateStatus(record, 2)}>
                Confirm
              </Button>
            )}

            {showReceiveButton && (
              <Button
                type="primary"
                onClick={() => {
                  setSelectedConsignment(record);
                  if (record.type === 0) {
                    setCareModalVisible(true);
                  } else {
                    handleOpenSaleModal(record);
                  }
                }}
              >
                {record.type === 0 ? "Receive Care" : "Receive Sale"}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Consignment Management</Title>
        <Table
          dataSource={consignments}
          columns={columns}
          rowKey="consignmentId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`Consignment #${selectedConsignment?.consignmentId} Details`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedConsignment && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Type">
                {selectedConsignment.type === 0 ? "Care" : "Sale"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedConsignment.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {new Date(selectedConsignment.startDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {new Date(selectedConsignment.endDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {selectedConsignment.type === 0
                  ? selectedConsignment.careFee
                  : selectedConsignment.agreedPrice}
              </Descriptions.Item>
              <Descriptions.Item label="Customer ID">
                {selectedConsignment.customerId}
              </Descriptions.Item>
              <Descriptions.Item label="Note" span={2}>
                {selectedConsignment.note}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 24 }}>
              Consignment Lines
            </Title>
            <Table
              dataSource={selectedConsignment.consignmentLines}
              rowKey="consignmentLineId"
              pagination={false}
              columns={[
                {
                  title: "Fish Type",
                  dataIndex: "fishType",
                  key: "fishType",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Total Price",
                  dataIndex: "totalPrice",
                  key: "totalPrice",
                },
                {
                  title: "Images",
                  dataIndex: "imageUrl",
                  key: "imageUrl",
                  render: (url) =>
                    url ? (
                      <img src={url} alt="Fish" style={{ maxWidth: 100 }} />
                    ) : (
                      "No image"
                    ),
                },
              ]}
            />
          </>
        )}
      </Modal>

      {/* Care Confirmation Modal */}
      <Modal
        title="Confirm Care Consignment"
        open={careModalVisible}
        onCancel={() => setCareModalVisible(false)}
        footer={null}
      >
        <Form form={careForm} layout="vertical" onFinish={handleCareConfirm}>
          <Form.Item
            name="fishType"
            label="Fish Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="healthStatus"
            label="Health Status"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="careDetails"
            label="Care Details"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="careFee"
            label="Care Fee"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Confirm Care
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Sale Confirmation Modal */}
      <Modal
        title="Confirm Sale Consignment"
        open={saleModalVisible}
        onCancel={() => setSaleModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={saleForm} layout="vertical" onFinish={handleSaleConfirm}>
          {/* Read-only fields */}
          <Form.Item name="fishType" label="Fish Type">
            <Input disabled />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity">
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL">
            <Input disabled />
          </Form.Item>

          {/* Editable fields */}
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="size" label="Size" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="class" label="Class" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="fishTypeId"
            label="Fish Type ID"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="foodRequirement"
            label="Food Requirement"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="overallRating"
            label="Overall Rating"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* Price related fields */}
          <Form.Item
            name="unitPrice"
            label="Unit Price"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              onChange={(value) => {
                setUnitPrice(value);
                const total = calculateTotalPrice(value, quantity);
                saleForm.setFieldValue("totalPrice", total);
              }}
            />
          </Form.Item>
          <Form.Item name="totalPrice" label="Total Price">
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item
            name="agreePrice"
            label="Agreed Price"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="sellingPrice"
            label="Selling Price"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Confirm Sale
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsignmentManagement;
