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
            <p>
              Welcome to our shopping guide! To get started, simply browse our
              categories or use the search bar to find specific koi fish. Once
              you find the fish you love, click on the product for more details.
            </p>
            <p>
              Add your selected items to the cart, and when you are ready,
              proceed to checkout to complete your order. Don’t forget to check
              your cart before confirming your purchase.
            </p>
          </div>

          <div className="section">
            <h3>{t("paymentMethods")}</h3>
            <p>
              We accept various payment methods to ensure a smooth shopping
              experience. You can pay using:
            </p>
            <ul>
              <li>Credit/Debit Card</li>
              <li>PayPal</li>
              <li>Bank Transfer</li>
            </ul>
            <p>
              Choose the method that works best for you at checkout. All
              payments are processed securely to protect your information.
            </p>
          </div>

          <div className="section">
            <h3>{t("shippingInformation")}</h3>
            <p>
              We offer fast and reliable shipping options to ensure your koi
              fish arrive safely and promptly. Shipping rates are calculated at
              checkout based on your location.
            </p>
            <p>
              Please allow 3-7 business days for delivery, depending on your
              location. You can track your order through the link in your
              confirmation email.
            </p>
          </div>

          <div className="section">
            <h3>{t("returnPolicy")}</h3>
            <p>
              If you are not satisfied with your purchase, we accept returns
              within 30 days. Ensure the product is in its original condition
              and packaging.
            </p>
            <p>
              To start a return, contact our customer service with your order
              details. We will guide you through the process.
            </p>
          </div>

          <div className="section">
            <h3>{t("orderTracking")}</h3>
            <p>
              After placing an order, you will receive a tracking link in your
              confirmation email. Use this link to monitor your order status.
            </p>
            <p>
              If you need further assistance with tracking, please contact our
              support team.
            </p>
          </div>

          <div className="section">
            <h3>{t("customerSupport")}</h3>
            <p>
              If you have any questions or need assistance, please reach out to
              our customer support team. We are here to help!
            </p>
            <p>
              Email:{" "}
              <Link
                to="mailto:goldenkoi.vn@gmail.com"
                style={{ color: "#bbab6f", textDecoration: "none" }}
              >
                goldenkoi.vn@gmail.com
              </Link>
            </p>
            <p>
              Phone:{" "}
              <Link
                to="tel:+1234567890"
                style={{ color: "#bbab6f", textDecoration: "none" }}
              >
                +123 456 7890
              </Link>
            </p>
            <p>
              You can also visit our{" "}
              <Link
                to="/faqs-page"
                style={{ color: "#bbab6f", textDecoration: "none" }}
              >
                FAQ page
              </Link>{" "}
              for more information about common questions and concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingGuidePage;
