import {
  Breadcrumb,
  Form,
  Image,
  Input,
  Upload,
  Button,
  Modal,
  InputNumber,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import uploadFile from "../../../utils/upload/upload";

const config = {
  API_ROOT: "https://localhost:44366/api",
};

function ConsignmentSell() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formVariable] = useForm();
  const [showDateFields, setShowDateFields] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
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
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      if (!customerId) {
        toast.error("Customer information not available");
        return;
      }

      const { startDate, endDate, note, agreedPrice, fish } = values;

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
        agreedPrice: parseFloat(agreedPrice || 0),
        customerId: customerId,
        note: note || "",
        consignmentLines: consignmentLines,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      };

      // Send request to API
      await axios.post(`${config.API_ROOT}/Consignment/sale`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Consignment sale created successfully");
      formVariable.resetFields();
      setShowDateFields(false);
    } catch (error) {
      console.error("Error submitting consignment sale:", error);
      toast.error("Failed to submit consignment sale");
    }
  };

  return (
    <div className="consignment-sell-page">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/consignment">Consignment</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">Sell</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="consignment">
        <div className="consignment__wrapper">
          <h2>Consignment Sell Information</h2>
          <div className="consignment__form">
            <Form
              className="form"
              labelCol={{ span: 24 }}
              form={formVariable}
              onFinish={handleSubmit}
            >
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
                  <Form.Item
                    label="Agreed Price"
                    name="agreedPrice"
                    rules={[
                      { required: true, message: "Please enter agreed price" },
                    ]}
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
                  <Form.Item label="Note" name="note">
                    <Input.TextArea placeholder="Enter note" />
                  </Form.Item>
                </>
              )}

              <Form.List name="fish">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className="fish-item">
                        <h3>Fish {index + 1}</h3>
                        <Form.Item
                          {...field}
                          label="Fish Type"
                          name={[field.name, "fish_type"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter fish type",
                            },
                          ]}
                        >
                          <Input placeholder="Fish Type" />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          label="Quantity"
                          name={[field.name, "quantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter quantity",
                            },
                            {
                              validator: (_, value) =>
                                value > 0
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(
                                        "Quantity must be greater than 0!"
                                      )
                                    ),
                            },
                          ]}
                        >
                          <InputNumber style={{ width: "100%" }} min={1} />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          label="Fish Image"
                          name={[field.name, "fish_image"]}
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
                          >
                            {field.fish_image?.length >= 1
                              ? null
                              : uploadButton}
                          </Upload>
                        </Form.Item>

                        <Form.Item
                          {...field}
                          label="Fish Certificate"
                          name={[field.name, "fish_certificate"]}
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
                            {field.fish_certificate?.length >= 1
                              ? null
                              : uploadButton}
                          </Upload>
                        </Form.Item>

                        <Button
                          icon={<MinusCircleOutlined />}
                          onClick={() => {
                            remove(field.name);
                            if (fields.length === 1) {
                              setShowDateFields(false);
                            }
                          }}
                          type="dashed"
                          style={{ marginBottom: 20 }}
                        >
                          Remove Fish
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                        setShowDateFields(true);
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Fish
                    </Button>
                  </>
                )}
              </Form.List>

              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>

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

export default ConsignmentSell;
