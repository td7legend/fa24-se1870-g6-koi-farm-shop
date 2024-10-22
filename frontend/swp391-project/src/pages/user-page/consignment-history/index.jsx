import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Breadcrumb,
  Card,
  Descriptions,
  Image,
  Tag,
  Spin,
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const config = {
  API_ROOT: "https://localhost:44366/api",
};

function ConsignmentView() {
  const [consignment, setConsignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsignmentData();
  }, []);

  const fetchConsignmentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${config.API_ROOT}/Consignment/customer/1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Ensure numeric values have defaults
      const processedData = {
        ...response.data,
        careFee: response.data.careFee || 0,
        agreedPrice: response.data.agreedPrice || 0,
        consignmentLines: (response.data.consignmentLines || []).map(
          (line) => ({
            ...line,
            totalPrice: line.totalPrice || 0,
            quantity: line.quantity || 0,
          })
        ),
      };

      setConsignment(processedData);
    } catch (error) {
      console.error("Error fetching consignment data:", error);
      toast.error("Failed to fetch consignment information");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const getStatusTag = (status) => {
    const statusMap = {
      0: { color: "blue", text: "Pending" },
      1: { color: "green", text: "Approved" },
      2: { color: "red", text: "Rejected" },
      3: { color: "orange", text: "In Progress" },
      4: { color: "purple", text: "Completed" },
    };

    const statusInfo = statusMap[status] || {
      color: "default",
      text: "Unknown",
    };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const getTypeTag = (type) => {
    const typeMap = {
      0: { color: "cyan", text: "Sale" },
      1: { color: "geekblue", text: "Care" },
    };

    const typeInfo = typeMap[type] || { color: "default", text: "Unknown" };
    return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
  };

  const columns = [
    {
      title: "Fish Type",
      dataIndex: "fishType",
      key: "fishType",
      render: (text) => text || "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (value) => value || 0,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) =>
        url ? (
          <Image
            src={url}
            alt="Fish"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          "No image"
        ),
    },
    {
      title: "Certificate",
      dataIndex: "certificationUrl",
      key: "certificationUrl",
      render: (url) =>
        url ? (
          <Image
            src={url}
            alt="Certificate"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          "No certificate"
        ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!consignment) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Empty description="No consignment data found" />
      </div>
    );
  }

  return (
    <div className="consignment-view">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Consignment</Breadcrumb.Item>
          <Breadcrumb.Item>View Details</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card className="card">
        <Title level={3}>
          Consignment Details #{consignment.consignmentId || "N/A"}
        </Title>

        <Descriptions bordered column={2} layout="vertical">
          <Descriptions.Item label="Status">
            {getStatusTag(consignment.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {getTypeTag(consignment.type)}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {consignment.startDate
              ? new Date(consignment.startDate).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {consignment.endDate
              ? new Date(consignment.endDate).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Care Fee">
            {formatCurrency(consignment.careFee)}
          </Descriptions.Item>
          <Descriptions.Item label="Agreed Price">
            {formatCurrency(consignment.agreedPrice)}
          </Descriptions.Item>
          {consignment.note && (
            <Descriptions.Item label="Note" span={2}>
              {consignment.note}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div style={{ marginTop: "24px" }}>
          <Title level={4}>Consignment Items</Title>
          <Table
            columns={columns}
            dataSource={consignment.consignmentLines.map((line) => ({
              ...line,
              key: line.consignmentLineId || Math.random(),
            }))}
            pagination={false}
          />
        </div>
      </Card>

      <ToastContainer />
    </div>
  );
}

export default ConsignmentView;
