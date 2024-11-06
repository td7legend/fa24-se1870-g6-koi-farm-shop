import { Link } from "react-router-dom";
import "./index.scss";
import { Breadcrumb, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function ShoppingGuidePage() {
  const { t } = useTranslation();
  return (
    <div className="shopping-guide-page">
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
              <Breadcrumb.Item>{t("shoppingGuide")}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="shopping-guide-container">
        <h1>{t("shoppingGuide")}</h1>

        <div className="guide-content">
          <div className="section">
            <h3>{t("howToShop")}</h3>
            <p>{t("howToShopContent1")}</p>
            <p>{t("howToShopContent2")}</p>
          </div>

          <div className="section">
            <h3>{t("paymentMethods")}</h3>
            <p>{t("paymentMethodsContent1")}</p>
            <ul>
              <li>{t("creditDebitCard")}</li>
              <li>{t("paypal")}</li>
              <li>{t("bankTransfer")}</li>
            </ul>
            <p>{t("paymentMethodsContent2")}</p>
          </div>

          <div className="section">
            <h3>{t("shippingInformation")}</h3>
            <p>{t("shippingInfoContent1")}</p>
            <p>{t("shippingInfoContent2")}</p>
          </div>

          <div className="section">
            <h3>{t("returnPolicy")}</h3>
            <p>{t("returnPolicyContent1")}</p>
            <p>{t("returnPolicyContent2")}</p>
          </div>

          <div className="section">
            <h3>{t("orderTracking")}</h3>
            <p>{t("orderTrackingContent1")}</p>
            <p>{t("orderTrackingContent2")}</p>
          </div>

          <div className="section">
            <h3>{t("customerSupport")}</h3>
            <p>{t("customerSupportContent")}</p>
            <p>
              {t("email")}
              {": "}
              <Link
                to="mailto:goldenkoi.vn@gmail.com"
                style={{ color: "#bbab6f", textDecoration: "none" }}
              >
                goldenkoi.vn@gmail.com
              </Link>
            </p>
            <p>
              {t("phone")}
              {": "}
              <Link
                to="tel:+1234567890"
                style={{ color: "#bbab6f", textDecoration: "none" }}
              >
                +123 456 7890
              </Link>
            </p>
            <p>
              {t("faqLink")}{" "}
              <Link
                to="/faqs-page"
                style={{ color: "#bbab6f", textDecoration: "none" }}
              >
                {t("faqPage")}
              </Link>{" "}
              {t("faqLinkEnd")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingGuidePage;
