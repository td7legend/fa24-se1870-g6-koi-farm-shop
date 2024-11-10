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
  InputNumber,
  Select,
  Space,
  Upload,
  Image,
  Descriptions,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import { PlusOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/upload/upload";
import "./index.scss";
import { useSelector } from "react-redux";
import config from "../../../config/config";
const { Title } = Typography;
const { Option } = Select;
import ExcelFishImport from "./excel-fish-import";

const StaffFishManagement = () => {
  const [fishes, setFishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState(null);
  const [quantityForm] = Form.useForm();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchFishes();
  }, []);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const fetchFishes = async () => {
    try {
      setLoading(true);

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${config.API_ROOT}fishs`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });

      setFishes(
        response.data
          .map((fish) => ({
            ...fish,
            key: fish.fishId,
          }))
          .sort((a, b) => b.fishId - a.fishId)
      );
    } catch (error) {
      console.error("Error fetching fishes:", error);
      message.error("Failed to fetch fish data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    try {
      const existingFish = fishes.find(
        (fish) => fish.name.toLowerCase() === values.name.toLowerCase()
      );

      if (existingFish) {
        message.error("A fish with this name already exists!");
        return;
      }
      let imageUrl = "";

      // Handle image upload if there's a file
      if (values.image && values.image.length > 0) {
        const fileObj = values.image[0].originFileObj;
        if (fileObj) {
          imageUrl = await uploadFile(fileObj);
        }
      }

      // Construct the fish data according to the API schema
      const fishData = {
        name: values.name,
        gender: parseInt(values.gender),
        age: parseInt(values.age),
        size: parseInt(values.size),
        class: values.class,
        foodRequirement: parseInt(values.foodRequirement),
        overallRating: "0",
        price: parseInt(values.price),
        batch: values.batch === true || values.batch === "true",
        fishTypeId: parseInt(values.fishTypeId),
        description: values.description,
        quantity: parseInt(values.quantity),
        imageUrl: imageUrl,
      };

      console.log(fishData);

      await axios.post(`${config.API_ROOT}fishs`, fishData, {
        headers: {
          Authorization: `Bearer ${token ?? null}`,
          "Content-Type": "application/json",
        },
      });

      message.success("Fish added successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchFishes();
    } catch (error) {
      console.error("Error saving fish:", error);
      message.error("Failed to save fish data. Please try again.");
    }
  };

  const handleDelete = async (fishId) => {
    try {
      await axios.delete(`${config.API_ROOT}fishs/${fishId}`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });
      message.success("Fish deleted successfully");
      fetchFishes();
    } catch (error) {
      console.error("Error deleting fish:", error);
      message.error("Failed to delete fish. Please try again.");
    }
  };

  const showDetails = (fish) => {
    setSelectedFish(fish);
    setIsDetailsModalVisible(true);
  };

  const showQuantityModal = (fish) => {
    setSelectedFish(fish);
    quantityForm.setFieldsValue({ quantity: fish.quantity });
    setIsQuantityModalVisible(true);
  };

  const handleQuantityUpdate = async (values) => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      await axios.patch(
        `${config.API_ROOT}fishs/${selectedFish.fishId}/quantity?quantity=${values.quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token ?? null}`,
          },
        }
      );

      message.success("Quantity updated successfully");
      setIsQuantityModalVisible(false);
      quantityForm.resetFields();
      fetchFishes();
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Failed to update quantity. Please try again.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "fishId",
      key: "fishId",
      render: (id) => `#${id}`,
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) =>
        imageUrl ? (
          <Image
            src={imageUrl}
            alt="Fish"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : (
          "No image"
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Rating",
      dataIndex: "overallRating",
      key: "overallRating",
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "batch",
      render: (batch) => (batch ? "True" : "False"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            style={{ color: "#D4B57E" }}
          >
            Details
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showQuantityModal(record)}
            style={{ backgroundColor: "#52c41a" }}
          >
            Update Quantity
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(record.fishId)}
            style={{ backgroundColor: "#ff4d4f" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const AddFishModal = () => (
    <Modal
      title="Add New Fish"
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAdd}
        initialValues={{
          gender: 0,
          age: 0,
          size: 0,
          foodRequirement: 0,
          overallRating: 0,
          fishTypeId: 0,
          quantity: 0,
          batch: true,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter fish name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="class"
          label="Class"
          rules={[{ required: true, message: "Please enter fish class" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (VND)"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Select>
            <Option value={0}>Male</Option>
            <Option value={1}>Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Please enter age" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="size"
          label="Size"
          rules={[{ required: true, message: "Please enter size" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="foodRequirement"
          label="Food Requirement"
          rules={[{ required: true, message: "Please enter food requirement" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        {/* <Form.Item
          name="overallRating"
          label="Overall Rating"
          rules={[{ required: true, message: "Please enter rating" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} max={5} />
        </Form.Item> */}

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="fishTypeId"
          label="Fish Type ID"
          rules={[{ required: true, message: "Please enter fish type ID" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="batch"
          label="Batch"
          rules={[{ required: true, message: "Please select batch status" }]}
        >
          <Select>
            <Option value={true}>True</Option>
            <Option value={false}>False</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description" // Fixed typo in the field name from "desciption"
          label="Description"
          rules={[{ required: true, message: "Please enter fish description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="image"
          label="Fish Image"
          rules={[{ required: true, message: "Please upload fish image" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            onPreview={handlePreview}
            beforeUpload={() => false}
          >
            {form.getFieldValue("image")?.length >= 1 ? null : uploadButton}
          </Upload>
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

  const FishDetailsModal = () => (
    <Modal
      title="Fish Details"
      open={isDetailsModalVisible}
      onCancel={() => setIsDetailsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsDetailsModalVisible(false)}>
          Close
        </Button>,
      ]}
      width={700}
    >
      {selectedFish && (
        <>
          {selectedFish.imageUrl && (
            <div style={{ marginBottom: 20, textAlign: "center" }}>
              <Image
                src={selectedFish.imageUrl}
                alt={selectedFish.name}
                style={{ maxHeight: 300 }}
              />
            </div>
          )}
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name">
              {selectedFish.name}
            </Descriptions.Item>
            <Descriptions.Item label="Class">
              {selectedFish.class}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {selectedFish.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {selectedFish.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {selectedFish.gender === 0 ? "Male" : "Female"}
            </Descriptions.Item>
            <Descriptions.Item label="Age">
              {selectedFish.age}
            </Descriptions.Item>
            <Descriptions.Item label="Size">
              {selectedFish.size}
            </Descriptions.Item>
            <Descriptions.Item label="Food Requirement">
              {selectedFish.foodRequirement}
            </Descriptions.Item>
            <Descriptions.Item label="Overall Rating">
              {selectedFish.overallRating}
            </Descriptions.Item>
            <Descriptions.Item label="Fish Type ID">
              {selectedFish.fishTypeId}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );

  const UpdateQuantityModal = () => (
    <Modal
      title="Update Quantity"
      open={isQuantityModalVisible}
      onCancel={() => {
        setIsQuantityModalVisible(false);
        quantityForm.resetFields();
      }}
      footer={null}
    >
      <Form
        form={quantityForm}
        layout="vertical"
        onFinish={handleQuantityUpdate}
      >
        <Form.Item
          name="quantity"
          label="New Quantity"
          rules={[
            { required: true, message: "Please enter new quantity" },
            {
              type: "number",
              min: 0,
              message: "Quantity must be greater than or equal to 0",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item>
          <Space className="w-full justify-end">
            <Button
              onClick={() => {
                setIsQuantityModalVisible(false);
                quantityForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#52c41a" }}
            >
              Update
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const filteredFishes = fishes.filter((fish) => {
    const matchesSearch = fish.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBatch = batchFilter === null || fish.batch === batchFilter;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="staff-fish-management">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Staff</Breadcrumb.Item>
          <Breadcrumb.Item>Fish Management</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="manage-fish-container">
        <Card className="card">
          <div className="flex justify-between items-center mb-4">
            <Title level={3}>Fish Management</Title>
            <Space>
              <Input.Search
                placeholder="Search by name"
                allowClear
                style={{ width: 200 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                style={{ width: 120 }}
                placeholder="Batch Filter"
                allowClear
                value={batchFilter}
                onChange={(value) => setBatchFilter(value)}
              >
                <Option value={true}>Batch True</Option>
                <Option value={false}>Batch False</Option>
              </Select>
              <ExcelFishImport
                onUploadSuccess={fetchFishes}
                token={token}
                config={config}
                fishes={fishes}
              />
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                style={{ backgroundColor: "#bbab6f" }}
              >
                Add New Fish
              </Button>
            </Space>
          </div>

          <Table
            className="fish-management-table"
            columns={columns}
            dataSource={filteredFishes}
            loading={loading}
            pagination={{
              total: filteredFishes.length,
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: false,
            }}
          />
        </Card>
      </div>
      <AddFishModal />
      <FishDetailsModal />
      <UpdateQuantityModal />

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image alt="preview" src={previewImage} />
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default StaffFishManagement;
