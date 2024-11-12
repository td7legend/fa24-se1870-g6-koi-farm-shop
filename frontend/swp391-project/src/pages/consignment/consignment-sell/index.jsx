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
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./index.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import uploadFile from "../../../utils/upload/upload";
import config from "../../../config/config";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ConsignmentSell() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formVariable] = useForm();
  const [showDateFields, setShowDateFields] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
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
      <div style={{ marginTop: 8 }}>{t("upload")}</div>
    </button>
  );

  const validateDates = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
      if (startDate && endDate) {
        // Kiểm tra ngày bắt đầu phải trước hoặc bằng ngày kết thúc
        if (start > end) {
          toast.error(t("startDateCanNotBeLaterThanEndDate"));
          return false;
        } else if (start < currentDate || end < currentDate) {
          toast.error(t("startDateOrEndDateCanNotBeInThePast"));
          return false;
        }
        if (start >= currentDate || end >= currentDate) {
          // Tính sự khác biệt giữa hai ngày (tính theo ngày)
          const differenceInDays = Math.floor(
            (end - start) / (1000 * 60 * 60 * 24)
          );
          if (differenceInDays === 30 || differenceInDays > 30) {
            return true; // Hợp lệ nếu đúng 30 ngày
          } else {
            toast.error(t("endDateMustBeAtLeast30DaysAfterStartDate")); // Thông báo lỗi nếu khác 30 ngày
            return false;
          }
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
      formVariable.setFieldsValue({ fish: [{}] });
      setTimeout(() => {
        navigate("/consignment-history");
      }, 1000);
      // setShowDateFields(false);
    } catch (error) {
      console.error("Error submitting consignment sale:", error);
      toast.error(t("failedToSubmitConsignmentSale"));
    }
  };

  return (
    <div className="consignment-sale-page-form">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
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
          <div className="consignment__form">
            <Form
              className="form"
              labelCol={{ span: 24 }}
              form={formVariable}
              onFinish={handleSubmit}
            >
              <div className="form-left">
                {!showTable ? (
                  <div className="add-fish-center">
                    <Button
                      onClick={() => {
                        setShowTable(true);
                        setShowDateFields(true);
                        formVariable.setFieldsValue({ fish: [{}] });
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
                              title: t("fishName"),
                              key: "fish_type",
                              render: (_, field, index) => (
                                <Form.Item
                                  {...field}
                                  name={[field.name, "fish_type"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("pleaseEnterFishName"),
                                    },
                                  ]}
                                  style={{ margin: 0 }}
                                >
                                  <Input placeholder={t("fishName")} />
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
                      label={t("expectedPrice")}
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
