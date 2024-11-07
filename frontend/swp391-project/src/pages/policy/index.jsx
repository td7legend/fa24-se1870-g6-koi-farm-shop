import "./index.scss";
import { Breadcrumb, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function PolicyPage() {
  const { t } = useTranslation();
  return (
    <div className="policy-page">
      <Row>
        <Col span={24}>
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb" separator=">">
              <Breadcrumb.Item href="/">
                <FontAwesomeIcon
                  icon={faHome}
                  className="icon"
                ></FontAwesomeIcon>
              </Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumb-page">
                {t("policy")}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="policy-container">
        <h1>{t("ourPolicies")}</h1>

        <div className="policy-content">
          <div className="section">
            <h3>{t("generalInformation")}</h3>
            <p>{t("generalInformationText")}</p>
            <p>{t("generalInformationContact")}</p>
          </div>

          <div className="section">
            <h3>{t("returnsAndExchanges")}</h3>
            <p>{t("returnsAndExchangesText")}</p>
            <p>{t("returnsAndExchangesSteps")}</p>
          </div>

          <div className="section">
            <h3>{t("privacyPolicy")}</h3>
            <p>{t("privacyPolicyText")}</p>
          </div>

          <div className="section">
            <h3>{t("consignmentPolicy")}</h3>
            <p>{t("consignmentPolicyText")}</p>
            <p>{t("consignmentPolicySteps")}</p>
            <p>{t("consignmentPolicyContact")}</p>
          </div>

          {/* Contact Us section always centered */}
          <div className="section contact-us">
            <h3>{t("contactUs")}</h3>
            <p>{t("contactUsText")}</p>
            <p>
              {t("email")}:{" "}
              <a href="mailto:info@goldenkoi.com">goldenkoi.vn@gmail.com</a>
            </p>
            <p>
              {t("phone")}: <a href="tel:+1234567890">+123 456 7890</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyPage;
