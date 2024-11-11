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
  Select,
  Empty,
  Breadcrumb,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CurrencyFormatter from "../../../components/currency";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
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
  const [fishCareData, setFishCareData] = useState([]);
  const [loadingFishCare, setLoadingFishCare] = useState(false);
  const [careForm] = Form.useForm();
  const [saleForm] = Form.useForm();
  const [typeFilter, setTypeFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://localhost:44366/api/Consignment/get-all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConsignments(
        response.data
          .map((consignment) => ({
            ...consignment,
            key: consignment.consignmentId,
          }))
          .sort((a, b) => b.consignmentId - a.consignmentId)
      );
    } catch (error) {
      console.error("Error fetching consignments:", error);
      message.error("Failed to fetch consignment data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFishCareData = async (consignmentId) => {
    try {
      setLoadingFishCare(true);
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`https://localhost:44366/api/FishCare`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter fish care data and add consignment details
      const filteredData = response.data
        .filter((care) => care.consignmentId === consignmentId)
        .map((care) => ({
          ...care,
          consignment: selectedConsignment, // Add the consignment data to each fish care record
        }));

      setFishCareData(filteredData);
    } catch (error) {
      console.error("Error fetching fish care data:", error);
      message.error("Failed to fetch fish care details");
    } finally {
      setLoadingFishCare(false);
    }
  };

  const updateTotalPrices = (fishDetails, form) => {
    // Calculate sum of all total prices
    const totalSum = fishDetails.reduce((sum, fish) => {
      return sum + (fish.totalPrice || 0);
    }, 0);

    // Update agree price
    form.setFieldValue("agreePrice", totalSum);
  };

  const getFilteredConsignments = () => {
    return consignments.filter((consignment) => {
      const matchesType =
        typeFilter === null || consignment.type === typeFilter;
      const matchesStatus =
        statusFilter === null || consignment.status === statusFilter;
      return matchesType && matchesStatus;
    });
  };

  const FilterSection = () => (
    <Space style={{ marginBottom: 16 }}>
      <Select
        style={{ width: 200 }}
        placeholder="Filter by Type"
        onChange={(value) => setTypeFilter(value)}
        value={typeFilter}
      >
        <Select.Option value={0}>Care</Select.Option>
        <Select.Option value={1}>Sale</Select.Option>
      </Select>

      <Select
        style={{ width: 200 }}
        placeholder="Filter by Status"
        onChange={(value) => setStatusFilter(value)}
        value={statusFilter}
      >
        <Select.Option value={0}>Pending</Select.Option>
        <Select.Option value={1}>Under Review</Select.Option>
        <Select.Option value={2}>Confirmed</Select.Option>
        <Select.Option value={3}>Listed For Sale</Select.Option>
        <Select.Option value={4}>Sold</Select.Option>
        <Select.Option value={5}>Under Care</Select.Option>
        <Select.Option value={6}>Care Completed</Select.Option>
        <Select.Option value={7}>Cancelled</Select.Option>
      </Select>
      <Button
        onClick={() => {
          setTypeFilter(null);
          setStatusFilter(null);
        }}
      >
        Reset Filters
      </Button>
    </Space>
  );

  const handleCareConfirm = async (values) => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      // First update consignment with care fee
      await axios.post(
        `https://localhost:44366/api/Consignment/${selectedConsignment.consignmentId}/receive-care?careFee=${values.careFee}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Then create fish care records for each fish
      const fishCarePromises = values.fishCares.map((fishCare) =>
        axios.post(
          "https://localhost:44366/api/FishCare",
          {
            fishCareId: 0,
            fishType: fishCare.fishType,
            consignmentId: selectedConsignment.consignmentId,
            // consignmentLineId: fishCare.consignmentLineId,
            standardCareDetails: fishCare.healthStatus,
            standardHealthStatus: fishCare.careDetails,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(fishCarePromises);

      message.success("Care consignment confirmed successfully");
      setCareModalVisible(false);
      careForm.resetFields();
      await fetchConsignments();
    } catch (error) {
      console.error("Error confirming care:", error);
      message.error("Failed to confirm care consignment");
    }
  };

  const handleCloseCareModal = () => {
    careForm.resetFields(); // Reset the care form
    setCareModalVisible(false);
    setSelectedConsignment(null);
  };

  const handleCloseSaleModal = () => {
    saleForm.resetFields(); // Reset the sale form
    setSaleModalVisible(false);
    setSelectedConsignment(null);
    setUnitPrice(0);
    setQuantity(0);
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
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      // Update consignment sale details
      await axios.put(
        `https://localhost:44366/api/Consignment/${selectedConsignment.consignmentId}/update-sale?agreePrice=${values.agreePrice}`,
        values.fishDetails.map((fish) => ({
          consignmentLineId: fish.consignmentLineId,
          unitPrice: fish.unitPrice,
          quantity: fish.quantity,
          totalPrice: fish.totalPrice,
        })),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add fish to database
      const fishPromises = values.fishDetails.map((fish) =>
        axios.post(
          "https://localhost:44366/api/fishs",
          {
            name: fish.fishType,
            gender: fish.gender,
            age: fish.age,
            size: fish.size,
            class: fish.class,
            consignmentLineId: fish.consignmentLineId,
            foodRequirement: fish.foodRequirement,
            overallRating: 5,
            price: fish.sellingPrice,
            batch: true,
            fishTypeId: fish.fishTypeId,
            quantity: fish.quantity,
            imageUrl: fish.imageUrl,
            description: fish.description,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(fishPromises);

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
      render: (_, record) => (
        <CurrencyFormatter
          amount={record.type === 0 ? record.careFee : record.agreedPrice}
        />
      ),
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
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedConsignment(record);
                if (record.type === 0) {
                  fetchFishCareData(record.consignmentId);
                }
                setDetailModalVisible(true);
              }}
              style={{ color: "#D4B57E" }}
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
                onClick={() => {
                  setSelectedConsignment(record);
                  if (record.type === 0) {
                    setCareModalVisible(true);
                  } else {
                    handleOpenSaleModal(record);
                  }
                }}
                className="button-main"
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
    <div className="staff-consignment-management">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Staff</Breadcrumb.Item>
          <Breadcrumb.Item>Consignment Management</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="manage-consignment-container">
        <Card className="card">
          <Title level={2}>Consignment Management</Title>
          <FilterSection />
          <Table
            dataSource={getFilteredConsignments()}
            columns={columns}
            rowKey="consignmentId"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="consignment-management-table"
          />
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal
        title={
          <span style={{ fontSize: "25px", fontWeight: "bold" }}>
            Consignment #{selectedConsignment?.consignmentId} Details
          </span>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setFishCareData([]); // Clear fish care data when closing modal
        }}
        footer={null}
        width={800}
      >
        {selectedConsignment && (
          <>
            <Descriptions bordered column={1}>
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
              <Descriptions.Item
                label={
                  selectedConsignment.type === 0 ? "Care Fee" : "Agreed Price"
                }
              >
                <CurrencyFormatter
                  amount={
                    selectedConsignment.type === 0
                      ? selectedConsignment.careFee
                      : selectedConsignment.agreedPrice
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="Customer ID">
                {selectedConsignment.customerId}
              </Descriptions.Item>
              <Descriptions.Item label="Note" span={2}>
                {selectedConsignment.note}
              </Descriptions.Item>
            </Descriptions>

            {selectedConsignment.type === 0 ? (
              // Show Fish Care Data for Care type
              <>
                <Title level={4} style={{ marginTop: 24 }}>
                  Fish Care Details
                </Title>
                {[0, 1, 2].includes(selectedConsignment.status) ? (
                  // Show initial consignment details for pending, under review, and confirmed status
                  <Table
                    dataSource={selectedConsignment.consignmentLines}
                    rowKey="consignmentLineId"
                    pagination={false}
                    columns={[
                      {
                        title: "Image",
                        dataIndex: "imageUrl",
                        key: "image",
                        width: 150,
                        render: (imageUrl) =>
                          imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="Fish"
                              style={{
                                width: 120,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                              onClick={() => window.open(imageUrl, "_blank")}
                            />
                          ) : (
                            "No image"
                          ),
                      },
                      {
                        title: "Fish Type",
                        dataIndex: "fishType",
                        key: "fishType",
                        width: 120,
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                        width: 100,
                      },
                      {
                        title: "Certificate",
                        dataIndex: "certificationUrl",
                        key: "certificate",
                        render: (url) =>
                          url ? (
                            <Button
                              type="link"
                              onClick={() => window.open(url, "_blank")}
                            >
                              View Certificate
                            </Button>
                          ) : (
                            "No certificate"
                          ),
                      },
                    ]}
                  />
                ) : (
                  // Show fish care records for other statuses
                  <>
                    <Table
                      dataSource={fishCareData}
                      rowKey="fishCareId"
                      pagination={false}
                      loading={loadingFishCare}
                      columns={[
                        {
                          title: "Image",
                          dataIndex: "fishType",
                          key: "image",
                          width: 150,
                          render: (fishType) => {
                            const consignmentLine =
                              selectedConsignment.consignmentLines.find(
                                (line) => line.fishType === fishType
                              );
                            return consignmentLine?.imageUrl ? (
                              <img
                                src={consignmentLine.imageUrl}
                                alt={fishType}
                                style={{
                                  width: 120,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  window.open(
                                    consignmentLine.imageUrl,
                                    "_blank"
                                  )
                                }
                              />
                            ) : (
                              "No image"
                            );
                          },
                        },
                        {
                          title: "Fish Type",
                          dataIndex: "fishType",
                          key: "fishType",
                          width: 120,
                        },
                        {
                          title: "Health Status",
                          dataIndex: "standardHealthStatus",
                          key: "healthStatus",
                          width: 120,
                          render: (status) => {
                            const statusColors = {
                              Good: "green",
                              Bad: "red",
                              Normal: "orange",
                            };
                            return (
                              <Tag color={statusColors[status] || "default"}>
                                {status}
                              </Tag>
                            );
                          },
                        },
                        {
                          title: "Care Details",
                          dataIndex: "standardCareDetails",
                          key: "careDetails",
                          ellipsis: true,
                        },
                      ]}
                    />
                    {fishCareData.length === 0 && !loadingFishCare && (
                      <Empty description="No fish care records found" />
                    )}
                  </>
                )}
              </>
            ) : (
              // Show Consignment Lines for Sale type
              <>
                <Title level={4} style={{ marginTop: 24 }}>
                  Fish Details
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
                      title: "Unit Price",
                      dataIndex: "unitPrice",
                      key: "unitPrice",
                      render: (price) => <CurrencyFormatter amount={price} />,
                    },
                    {
                      title: "Total Price",
                      dataIndex: "totalPrice",
                      key: "totalPrice",
                      render: (price) => <CurrencyFormatter amount={price} />,
                    },
                    {
                      title: "Images",
                      dataIndex: "imageUrl",
                      key: "imageUrl",
                      render: (url) =>
                        url ? (
                          <img
                            src={url}
                            alt="Fish"
                            style={{ maxWidth: 100, cursor: "pointer" }}
                            onClick={() => window.open(url, "_blank")}
                          />
                        ) : (
                          "No image"
                        ),
                    },
                  ]}
                />
              </>
            )}
          </>
        )}
      </Modal>

      {/* Care Confirmation Modal */}
      <Modal
        title="Confirm Care Consignment"
        open={careModalVisible}
        onCancel={handleCloseCareModal}
        footer={null}
        width={800}
      >
        <Form form={careForm} layout="vertical" onFinish={handleCareConfirm}>
          {selectedConsignment?.consignmentLines.map((line, index) => (
            <div key={line.consignmentLineId} style={{ marginBottom: 24 }}>
              <Title level={5}>
                Fish {index + 1}: {line.fishType}
              </Title>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <img
                  src={line.imageUrl}
                  alt={line.fishType}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <div style={{ flex: 1 }}>
                  <p>
                    <strong>Quantity:</strong> {line.quantity}
                  </p>
                  <Form.Item
                    name={["fishCares", index, "fishType"]}
                    hidden
                    initialValue={line.fishType}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["fishCares", index, "consignmentLineId"]}
                    hidden
                    initialValue={line.consignmentLineId}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["fishCares", index, "healthStatus"]}
                    label="Health Status"
                    rules={[
                      {
                        required: true,
                        message: `Please input health status for ${line.fishType}`,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["fishCares", index, "careDetails"]}
                    label="Care Details"
                    rules={[
                      {
                        required: true,
                        message: `Please input care details for ${line.fishType}`,
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </div>
              </div>
            </div>
          ))}
          <Form.Item
            name="careFee"
            label="Total Care Fee"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="button-main"
            >
              Confirm Care
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Sale Confirmation Modal */}
      <Modal
        title={
          <span style={{ fontSize: "25px", fontWeight: "bold" }}>
            Confirm Sale Consignment
          </span>
        }
        open={saleModalVisible}
        onCancel={handleCloseSaleModal}
        footer={null}
        width={800}
      >
        <Form form={saleForm} layout="vertical" onFinish={handleSaleConfirm}>
          {selectedConsignment?.consignmentLines.map((line, index) => (
            <div
              key={line.consignmentLineId}
              style={{
                marginBottom: 24,
                padding: 16,
                border: "1px solid #f0f0f0",
                borderRadius: 8,
              }}
            >
              <Title level={5}>
                Fish {index + 1}: {line.fishType}
              </Title>
              <div style={{ display: "flex", gap: "16px", marginBottom: 16 }}>
                <div style={{ width: 200 }}>
                  <img
                    src={line.imageUrl}
                    alt={line.fishType}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  {/* Hidden fields for line reference */}
                  <Form.Item
                    name={["fishDetails", index, "consignmentLineId"]}
                    hidden
                    initialValue={line.consignmentLineId}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["fishDetails", index, "fishType"]}
                    hidden
                    initialValue={line.fishType}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["fishDetails", index, "imageUrl"]}
                    hidden
                    initialValue={line.imageUrl}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={["fishDetails", index, "quantity"]}
                    hidden
                    initialValue={line.quantity}
                  >
                    <InputNumber />
                  </Form.Item>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <Form.Item
                      name={["fishDetails", index, "unitPrice"]}
                      label="Unit Price"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        onChange={(value) => {
                          const totalPrice = value * line.quantity;
                          saleForm.setFieldValue(
                            ["fishDetails", index, "totalPrice"],
                            totalPrice
                          );

                          // Get all current fish details
                          const allFishDetails =
                            saleForm.getFieldValue("fishDetails");
                          allFishDetails[index].totalPrice = totalPrice;

                          // Update agree price
                          updateTotalPrices(allFishDetails, saleForm);
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name={["fishDetails", index, "totalPrice"]}
                      label="Total Price"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        disabled
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name={["fishDetails", index, "sellingPrice"]}
                    label="Selling Price"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <Form.Item
                      name={["fishDetails", index, "gender"]}
                      label="Gender"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: "100%" }}>
                        <Select.Option value={0}>Male</Select.Option>
                        <Select.Option value={1}>Female</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name={["fishDetails", index, "age"]}
                      label="Age"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <Form.Item
                      name={["fishDetails", index, "size"]}
                      label="Size"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                      name={["fishDetails", index, "fishTypeId"]}
                      label="Fish Type ID"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name={["fishDetails", index, "class"]}
                    label="Class"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name={["fishDetails", index, "foodRequirement"]}
                    label="Food Requirement"
                    rules={[{ required: true }]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    name={["fishDetails", index, "description"]}
                    label="Description"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </div>
              </div>
            </div>
          ))}

          <Form.Item name="agreePrice" label="Agreed Price">
            <InputNumber
              style={{ width: "100%" }}
              disabled
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item>
            <Button className="button-main" htmlType="submit" block>
              Confirm Sale
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsignmentManagement;
