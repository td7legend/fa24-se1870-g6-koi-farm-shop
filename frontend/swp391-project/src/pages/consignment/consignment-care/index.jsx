import {
  Breadcrumb,
  Form,
  Image,
  Input,
  Upload,
  Button,
  Modal,
  Table,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import uploadFile from "../../../utils/upload/upload";
import { useNavigate } from "react-router-dom";

const config = {
  API_ROOT: "https://localhost:44366/api",
};

function ConsignmentCare() {
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formVariable] = useForm();
  const [showDateFields, setShowDateFields] = useState(true);
  const [customerId, setCustomerId] = useState(null);
  const [fishData, setFishData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFish, setEditingFish] = useState(null);

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

  const handleAddFish = () => {
    const newFish = {
      id: fishData.length + 1,
      fishType: "",
      quantity: "",
      fish_image: null,
      fish_certificate: null,
    };
    setFishData([...fishData, newFish]);
  };

  const handleEditFish = (record) => {
    setEditingFish(record);
    formVariable.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await formVariable.validateFields([
        "fishType",
        "quantity",
        "fish_image",
        "fish_certificate",
      ]);

      // Convert file to base64 if necessary
      if (values.fish_image && values.fish_image[0].originFileObj) {
        values.fish_image = await getBase64(values.fish_image[0].originFileObj);
      }
      if (values.fish_certificate && values.fish_certificate[0].originFileObj) {
        values.fish_certificate = await getBase64(
          values.fish_certificate[0].originFileObj
        );
      }

      const updatedFishData = fishData.map((fish) =>
        fish.id === editingFish.id ? { ...fish, ...values } : fish
      );
      setFishData(updatedFishData);
      setIsModalOpen(false);
      formVariable.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleRemoveFish = (index) => {
    setFishData((prevData) => prevData.filter((_, i) => i !== index));
    formVariable.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
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
      title: "Fish Image",
      dataIndex: "fish_image",
      key: "fish_image",
      render: (fish_image) =>
        fish_image ? <Image src={fish_image} width={100} /> : "No image",
    },
    {
      title: "Fish Certificate",
      dataIndex: "fish_certificate",
      key: "fish_certificate",
      render: (certificate) =>
        certificate ? (
          <Image src={certificate} width={100} />
        ) : (
          "No certificate"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record, index) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditFish(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveFish(index)}
          >
            Remove
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      const response = await axios.get(`${config.API_ROOT}/customers/my-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomerId(response.data.customerId);
    } catch (error) {
      console.error("Error fetching customer info:", error);
      toast.error("Failed to fetch customer information");
    }
  };

  const validateDates = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    try {
      if (startDate && endDate) {
        if (start > end) {
          toast.error("Start Date can't be later than End Date");
          return false;
        }
        if (start >= currentDate || end >= currentDate) {
          return true;
        } else {
          toast.error("Start Date or End Date can't be in the past");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        return;
      }
      if (!customerId) {
        toast.error("Customer information not available");
        return;
      }

      const { startDate, endDate, note, fish } = values;

      if (!validateDates(startDate, endDate)) {
        return;
      }

      // Process fish items to match API structure
      const consignmentLines = await Promise.all(
        (fish || []).map(async (fishItem) => {
          let imageUrl = "";
          let certificationUrl = "";

          // Process fish image
          if (fishItem.fish_image?.[0]?.originFileObj) {
            try {
              imageUrl = await uploadFile(fishItem.fish_image[0].originFileObj);
            } catch (error) {
              console.error("Error uploading fish image:", error);
              toast.error("Failed to upload fish image");
              return null;
            }
          }

          // Process certificate image
          if (fishItem.fish_certificate?.[0]?.originFileObj) {
            try {
              certificationUrl = await uploadFile(
                fishItem.fish_certificate[0].originFileObj
              );
            } catch (error) {
              console.error("Error uploading certificate:", error);
              toast.error("Failed to upload certificate");
              return null;
            }
          }

          return {
            fishType: fishItem.fish_type,
            quantity: parseInt(fishItem.quantity),
            imageUrl: imageUrl,
            certificationUrl: certificationUrl,
          };
        })
      );

      // Check if any image uploads failed
      if (consignmentLines.includes(null)) {
        toast.error("Failed to upload some images");
        return;
      }

      // Construct the request body according to API schema
      const requestBody = {
        careFee: 0,
        customerId: customerId,
        note: note || "",
        consignmentLines: consignmentLines,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      // Send request to API
      await axios.post(`${config.API_ROOT}/Consignment/care`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Consignment care created successfully");
      formVariable.resetFields();
      setShowDateFields(false);
    } catch (error) {
      console.error("Error submitting consignment care:", error);
      toast.error("Failed to submit consignment care");
    }
  };

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/consignment">Consignment</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">Care</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="consignment-care">
        <div className="consignment__wrapper">
          <h2>Consignment Care Information</h2>
          <div className="consignment__form">
            <Form
              className="form"
              labelCol={{ span: 24 }}
              form={formVariable}
              onFinish={handleSubmit}
            >
              <div className="form-right">
                {showDateFields && (
                  <>
                    <Form.Item
                      label="Start Date"
                      name="startDate"
                      rules={[
                        { required: true, message: "Please select start date" },
                      ]}
                    >
                      <Input type="date" />
                    </Form.Item>
                    <Form.Item
                      label="End Date"
                      name="endDate"
                      rules={[
                        { required: true, message: "Please select end date" },
                      ]}
                    >
                      <Input type="date" />
                    </Form.Item>
                    <Form.Item label="Note" name="note">
                      <Input.TextArea placeholder="Enter note" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </>
                )}
              </div>
            </Form>

            <Table
              dataSource={fishData}
              columns={columns}
              rowKey="id"
              pagination={false}
              style={{ marginTop: 20 }}
            />

            <Button
              onClick={handleAddFish}
              icon={<PlusOutlined />}
              block
              style={{ marginTop: 20 }}
            >
              Add Fish
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title={editingFish ? "Edit Fish Information" : "Add Fish Information"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={formVariable} layout="vertical">
          <Form.Item
            label="Fish Type"
            name="fishType"
            rules={[{ required: true, message: "Please enter fish type" }]}
          >
            <Input placeholder="Fish Type" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: "Please enter quantity" },
              {
                type: "number",
                min: 1,
                message: "Quantity must be greater than 0",
                transform: (value) => Number(value),
              },
            ]}
          >
            <Input type="number" placeholder="Quantity" min={1} />
          </Form.Item>
          <Form.Item
            label="Fish Image"
            name="fish_image"
            rules={[
              {
                required: true,
                message: "Please upload fish image",
              },
            ]}
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
              fileList={formVariable.getFieldValue("fish_image")}
              onChange={(info) =>
                formVariable.setFieldsValue({ fish_image: info.fileList })
              }
            >
              {formVariable.getFieldValue("fish_image")?.length >= 1
                ? null
                : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Fish Certificate"
            name="fish_certificate"
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
              fileList={formVariable.getFieldValue("fish_certificate")}
              onChange={(info) =>
                formVariable.setFieldsValue({ fish_certificate: info.fileList })
              }
            >
              {formVariable.getFieldValue("fish_certificate")?.length >= 1
                ? null
                : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image alt="preview" src={previewImage} />
      </Modal>
    </div>
  );
}

export default ConsignmentCare;
