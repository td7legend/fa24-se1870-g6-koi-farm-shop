import { Form, Image, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.scss";
import uploadFile from "../../utils/upload/upload";

function Consignment() {
  // const [fishType, setFishType] = useState("");
  // const [healthStatus, setHealthStatus] = useState("");

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  // const [fileList, setFileList] = useState([]);

  const [fileListFishImage, setFileListFishImage] = useState([]);
  const [fileListFishCertificate, setFileListFishCertificate] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = (type, { fileList: newFileList }) => {
    if (type === "fish_image") {
      setFileListFishImage(newFileList);
    } else if (type === "fish_certificate") {
      setFileListFishCertificate(newFileList);
    }
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
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [formVariable] = useForm();
  const validateDates = () => {
    const currentDate = new Date();
    const from = new Date(fromDate);
    const to = new Date(toDate);
    try {
      if (fromDate && toDate) {
        if (from > to) {
          toast.error("From Date can be latter than To Date");
          return false;
        }
        if (from >= currentDate || to >= currentDate) {
          toast.success("Submit successfully");
          return true;
        } else {
          toast.error("From Date or To Date can't be in the past");
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
      if (validateDates()) {
        console.log(values);

        // console.log(values.fish_image.file.originFileObj);
        // console.log(values.fish_certificate.file.originFileObj);

        const url_image = await uploadFile(
          values.fish_image.file.originFileObj
        );
        values.fish_image = url_image;

        if (values.fish_certificate && values.fish_certificate.file) {
          const url_certificate = await uploadFile(
            values.fish_certificate.file.originFileObj
          );
          values.fish_certificate = url_certificate;
        } else {
          values.fish_certificate = "";
        }
        if (!values.note) {
          values.note = "";
        }

        console.log(values);

        const response = await axios.post(
          "https://66f66f33436827ced9771d87.mockapi.io/KoiFish",
          values
        );
        setDataSource([...dataSource, values]);
        formVariable.resetFields();
        setFileListFishImage([]);
        setFileListFishCertificate([]);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="consignment">
      <div className="consignment__wrapper">
        <h2>Consignment Information</h2>
        <div className="consignment__form">
          <Form
            className="form"
            labelCol={{ span: 24 }}
            form={formVariable}
            onFinish={handleSubmit}
          >
            <div className="form__input">
              <Form.Item
                label="Fish Type"
                name="fish_type"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the information before submit!",
                  },
                ]}
              >
                <Input type="text" placeholder="Name" />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the information before submit!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Quantity must be greater than 0!")
                      );
                    },
                  }),
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="From Date"
                name="from_date"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the information before submit!",
                  },
                ]}
              >
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="To Date"
                name="to_date"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the information before submit!",
                  },
                ]}
              >
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <button type="submit">Submit</button>
              </Form.Item>
            </div>
            <div className="form__image">
              <Form.Item
                label="Fish Image"
                name="fish_image"
                rules={[
                  {
                    required: true,
                    message: "Please fill in the information before submit!",
                  },
                ]}
              >
                <Upload
                  re
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileListFishImage}
                  onPreview={handlePreview}
                  onChange={(info) => handleChange("fish_image", info)}
                >
                  {fileListFishImage.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label="Fish Certificate" name="fish_certificate">
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileListFishCertificate}
                  onPreview={handlePreview}
                  onChange={(info) => handleChange("fish_certificate", info)}
                >
                  {fileListFishCertificate.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label="Note" name="note">
                <Input.TextArea
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  autoSize={{
                    length: 50,
                    minRows: 5,
                    maxRows: 5,
                  }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>

        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
    </div>
  );
}

export default Consignment;
