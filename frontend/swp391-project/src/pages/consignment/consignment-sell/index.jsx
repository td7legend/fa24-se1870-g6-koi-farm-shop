<<<<<<< HEAD
import { Breadcrumb, Form, Image, Input, Upload, Button, Modal } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
=======
import {
  Breadcrumb,
  Form,
  Image,
  Input,
  Upload,
  Button,
  Modal,
  InputNumber,
  Table,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
>>>>>>> main
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import uploadFile from "../../../utils/upload/upload";
<<<<<<< HEAD

function ConsignmentSell() {
=======
import config from "../../../config/config";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function ConsignmentSell() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formVariable] = useForm();
  const [showDateFields, setShowDateFields] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        return;
      }

      const response = await axios.get(`${config.API_ROOT}customers/my-info`, {
        headers: { Authorization: `Bearer ${token ?? null}` },
      });

      setCustomerId(response.data.customerId);
    } catch (error) {
      console.error("Error fetching customer info:", error);
      // xài tạm mốt xóa
      toast.error(t("failedToFetchCustomerInformation"));
    }
  };

>>>>>>> main
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

<<<<<<< HEAD
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [dataSource, setDataSource] = useState([]);
  const [formVariable] = useForm();
  const [showDateFields, setShowDateFields] = useState(false); // State để quản lý việc hiển thị các trường date và note

=======
>>>>>>> main
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
<<<<<<< HEAD
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
=======
      <div style={{ marginTop: 8 }}>{t("upload")}</div>
    </button>
  );

  const validateDates = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    try {
      if (startDate && endDate) {
        if (start > end) {
          toast.error(t("startDateCanNotBeLaterThanEndDate"));
          return false;
        }
        if (start >= currentDate || end >= currentDate) {
          return true;
        } else {
          toast.error(t("startDateOrEndDateCanNotBeInThePast"));
>>>>>>> main
          return false;
        }
      }
      return true;
    } catch (error) {
<<<<<<< HEAD
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
=======
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!token) {
        toast.error(t("noAuthenticationTokenFoundPleaseLogIn"));
        return;
      }

      if (!customerId) {
        toast.error(t("customerInformationNotAvailable"));
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
              toast.error(t("failedToUploadFishImage"));
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
              toast.error(t("failedToUploadCertificate"));
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
        toast.error(t("failedToUploadSomeImages"));
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
      await axios.post(`${config.API_ROOT}Consignment/sale`, requestBody, {
        headers: {
          Authorization: `Bearer ${token ?? null}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(t("consignmentSaleCreatedSuccessfully"));
      formVariable.resetFields();
      // setShowDateFields(false);
    } catch (error) {
      console.error("Error submitting consignment sale:", error);
      toast.error(t("failedToSubmitConsignmentSale"));
>>>>>>> main
    }
  };

  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
<<<<<<< HEAD
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/consignment">Consignment</Breadcrumb.Item>
          <Breadcrumb.Item>Sell</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="consignment">
        <div className="consignment__wrapper">
          <h2>Consignment Sell Information</h2>
=======
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/consignment">
            {t("consignment")}
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            {t("sell")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="consignment-sale">
        <div className="consignment__wrapper">
          <h2>{t("consignmentSaleInformation")}</h2>
>>>>>>> main
          <div className="consignment__form">
            <Form
              className="form"
              labelCol={{ span: 24 }}
              form={formVariable}
              onFinish={handleSubmit}
            >
<<<<<<< HEAD
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
=======
              <div className="form-left">
                {!showTable ? (
                  <div className="add-fish-center">
                    <Button
                      onClick={() => {
                        setShowTable(true);
                        setShowDateFields(true);
                        add();
                      }}
                      icon={<PlusOutlined />}
                    >
                      {t("openForm")}
                    </Button>
                  </div>
                ) : (
                  <Form.List name="fish">
                    {(fields, { add, remove }) => (
                      <>
                        <Table
                          dataSource={fields}
                          pagination={false}
                          rowKey="key"
                          columns={[
                            {
                              title: t("fishType"),
                              key: "fish_type",
                              render: (_, field, index) => (
                                <Form.Item
                                  {...field}
                                  name={[field.name, "fish_type"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("pleaseEnterFishType"),
                                    },
                                  ]}
                                  style={{ margin: 0 }}
                                >
                                  <Input placeholder={t("fishType")} />
                                </Form.Item>
                              ),
                            },
                            {
                              title: t("quantity"),
                              key: "quantity",
                              render: (_, field, index) => (
                                <Form.Item
                                  {...field}
                                  name={[field.name, "quantity"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("pleaseEnterQuantity"),
                                    },
                                    {
                                      validator: (_, value) =>
                                        value > 0
                                          ? Promise.resolve()
                                          : Promise.reject(),
                                    },
                                  ]}
                                  style={{ margin: 0 }}
                                >
                                  <Input
                                    type="number"
                                    placeholder={t("quantity")}
                                    min={1}
                                  />
                                </Form.Item>
                              ),
                            },
                            {
                              title: t("fishImage"),
                              key: "fish_image",
                              render: (_, field, index) => (
                                <Form.Item
                                  {...field}
                                  name={[field.name, "fish_image"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("pleaseUploadFishImage"),
                                    },
                                  ]}
                                  valuePropName="fileList"
                                  getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                      return e;
                                    }
                                    return e?.fileList;
                                  }}
                                  style={{ margin: 0 }}
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
                              ),
                            },
                            {
                              title: t("fishCertificate"),
                              key: "fish_certificate",
                              render: (_, field, index) => (
                                <Form.Item
                                  {...field}
                                  name={[field.name, "fish_certificate"]}
                                  valuePropName="fileList"
                                  getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                      return e;
                                    }
                                    return e?.fileList;
                                  }}
                                  style={{ margin: 0 }}
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
                              ),
                            },
                            {
                              title: t("actions"),
                              key: "actions",
                              render: (_, field, index) => (
                                <Button
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => {
                                    remove(field.name);
                                    if (fields.length === 1) {
                                      setShowTable(false);
                                      setShowDateFields(false);
                                      formVariable.resetFields();
                                    }
                                  }}
                                  danger
                                >
                                  {t("removeFish")}
                                </Button>
                              ),
                            },
                          ]}
                        />
                        <div className="table-buttons">
                          <Button
                            onClick={() => {
                              add();
                              setShowDateFields(true);
                            }}
                            icon={<PlusOutlined />}
                            style={{ marginTop: 20 }}
                          >
                            {t("addFish")}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowTable(false);
                              setShowDateFields(false);
                              formVariable.resetFields();
                            }}
                            style={{ marginTop: 20, marginLeft: 10 }}
                            danger
                          >
                            {t("close")}
                          </Button>
                        </div>
                      </>
                    )}
                  </Form.List>
                )}
              </div>
              <div className="form-right">
                {showDateFields && (
                  <>
                    <Form.Item
                      label={t("startDate")}
                      name="startDate"
                      rules={[
                        { required: true, message: "Please select start date" },
                      ]}
                    >
                      <Input type="date" />
                    </Form.Item>
                    <Form.Item
                      label={t("endDate")}
                      name="endDate"
                      rules={[
                        { required: true, message: "Please select end date" },
                      ]}
                    >
                      <Input type="date" />
                    </Form.Item>
                    <Form.Item
                      label={t("agreedPrice")}
                      name="agreedPrice"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseEnterAgreedPrice"),
                        },
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
                    <Form.Item label={t("note")} name="note">
                      <Input.TextArea placeholder={t("enterNote")} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                      {t("submit")}
                    </Button>
                  </>
                )}
              </div>
>>>>>>> main
            </Form>
          </div>
        </div>
      </div>

      <Modal
<<<<<<< HEAD
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
=======
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image alt="preview" src={previewImage} />
>>>>>>> main
      </Modal>
    </div>
  );
}

export default ConsignmentSell;
