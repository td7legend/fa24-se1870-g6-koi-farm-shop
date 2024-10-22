import { Breadcrumb, Form, Image, Input, Upload, Button, Modal } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import uploadFile from "../../../utils/upload/upload";

function ConsignmentSell() {
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [dataSource, setDataSource] = useState([]);
  const [formVariable] = useForm();
  const [showDateFields, setShowDateFields] = useState(false); // State để quản lý việc hiển thị các trường date và note

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
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const validateDates = (fromDate, toDate) => {
    const currentDate = new Date();
    const from = new Date(fromDate);
    const to = new Date(toDate);
    try {
      if (fromDate && toDate) {
        if (from > to) {
          toast.error("From Date can't be later than To Date");
          return false;
        }
        if (from >= currentDate || to >= currentDate) {
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

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleSubmit = async (values) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const { from_date, to_date } = values;
      formVariable.resetFields();
      setShowDateFields(false);
      toast.success("Submit successfully");

      if (validateDates(from_date, to_date)) {
        const fishList = values.fish || [];
        const allFish = fishList.map(async (fish) => {
          const fishImage = await uploadFile(
            fish.fish_image.file.originFileObj
          );
          const fishCertificate = fish.fish_certificate
            ? await uploadFile(fish.fish_certificate.file.originFileObj)
            : "";

          // Xử lý desired_price và note cho từng con cá
          const desiredPrice = fish.desired_price || ""; // Trả về rỗng nếu không nhập
          const fishNote = fish.note || ""; // Trả về rỗng nếu không nhập

          return {
            ...fish,
            fish_image: fishImage,
            fish_certificate: fishCertificate,
            from_date,
            to_date,
            note: fishNote,
            desired_price: desiredPrice,
          };
        });

        const finalFishData = await Promise.all(allFish);

        for (let fish of finalFishData) {
          await axios.post(
            "https://66f66f33436827ced9771d87.mockapi.io/consignment-sell",
            fish
          );
        }

        setDataSource([...dataSource, ...finalFishData]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/consignment">Consignment</Breadcrumb.Item>
          <Breadcrumb.Item>Sell</Breadcrumb.Item>
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
              {showDateFields && ( // Chỉ hiển thị các trường này khi showDateFields là true
                <>
                  <Form.Item
                    label="From Date"
                    name="from_date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                  <Form.Item
                    label="To Date"
                    name="to_date"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                  <Form.Item label="Note" name="note">
                    <Input.TextArea></Input.TextArea>
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
                          fieldKey={[field.fieldKey, "fish_type"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter fish type",
                            },
                          ]}
                        >
                          <Input type="text" placeholder="Fish Type" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="Quantity"
                          name={[field.name, "quantity"]}
                          fieldKey={[field.fieldKey, "quantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter quantity",
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
                          <Input type="number" placeholder="Quantity" />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          label="Desired Price"
                          name={[field.name, "desired_price"]}
                          fieldKey={[field.fieldKey, "desired_price"]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter desired price"
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="Fish Image"
                          name={[field.name, "fish_image"]}
                          fieldKey={[field.fieldKey, "fish_image"]}
                          rules={[
                            {
                              required: true,
                              message: "Please upload fish image",
                            },
                          ]}
                        >
                          <Upload
                            listType="picture-card"
                            onPreview={handlePreview}
                            onChange={(info) => {
                              const updatedFishList = [...fields];
                              updatedFishList[index] = {
                                ...updatedFishList[index],
                                fish_image: info.fileList,
                              };
                              fields[index].fish_image = info.fileList;
                            }}
                          >
                            {fields[field.name].fish_image?.length >= 1
                              ? null
                              : uploadButton}
                          </Upload>
                        </Form.Item>
                        <Form.Item
                          {...field}
                          label="Fish Certificate"
                          name={[field.name, "fish_certificate"]}
                          fieldKey={[field.fieldKey, "fish_certificate"]}
                        >
                          <Upload
                            listType="picture-card"
                            onPreview={handlePreview}
                            onChange={(info) => {
                              const updatedFishList = [...fields];
                              updatedFishList[index] = {
                                ...updatedFishList[index],
                                fish_certificate: info.fileList,
                              };
                              fields[index].fish_certificate = info.fileList;
                            }}
                          >
                            {fields[field.name].fish_certificate?.length >= 1
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
                      style={{ marginBottom: 20 }}
                    >
                      Add Fish
                    </Button>
                  </>
                )}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <Modal
        visible={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
}

export default ConsignmentSell;
