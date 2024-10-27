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
              <Breadcrumb.Item>{t("policy")}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="policy-container">
        <h1>{t("ourPolicies")}</h1>

        <div className="policy-content">
          <div className="section">
            <h3>{t("generalInformation")}</h3>
            <p>
              We are committed to providing accurate and transparent information
              about our products. All products are carefully selected from the
              most reputable and quality suppliers.
            </p>
            <p>
              If you have any questions regarding our products or services,
              please contact our customer service team via email or phone.
            </p>
          </div>

          <div className="section">
            <h3>{t("returnsAndExchanges")}</h3>
            <p>
              We accept returns and exchanges within 30 days of purchase. To be
              eligible for a return, the product must be in its original
              condition, unused, and in its original packaging.
            </p>
            <p>
              To initiate a return or exchange, please contact us and provide
              your order information. We will guide you through the necessary
              steps to complete the process.
            </p>
          </div>

          <div className="section">
            <h3>{t("privacyPolicy")}</h3>
            <p>
              We are committed to protecting your personal information. All
              information you provide will be encrypted and used solely for
              processing your orders or enhancing your experience on our
              website.
            </p>
          </div>

          <div className="section">
            <h3>{t("consignmentPolicy")}</h3>
            <p>
              At Golden Koi, we offer consignment services for customers looking
              to sell their Koi fish through our farm. Our team ensures that all
              Koi fish consigned to us are kept in optimal health during their
              stay.
            </p>
            <p>
              To consign your fish, please contact our team with detailed
              information about your Koi. We will provide a valuation and the
              necessary steps for consignment.
            </p>
            <p>
              For more information on consignment, please contact us via email
              or phone.
            </p>
          </div>

          {/* Contact Us section always centered */}
          <div className="section contact-us">
            <h3>{t("contactUs")}</h3>
            <p>
              If you have any questions about our policies, please contact us:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:info@goldenkoi.com">goldenkoi.vn@gmail.com</a>
            </p>
            <p>
              Phone: <a href="tel:+1234567890">+123 456 7890</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyPage;
