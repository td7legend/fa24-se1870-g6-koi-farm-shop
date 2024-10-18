import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { Breadcrumb, Button, Col, Row } from "antd";
function ShoppingGuidePage() {
  return (
    <div>
      <Row>
        <Col span={24}>
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item>Shopping Guide</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="shopping-guide-page">
        <h1>Shopping Guide</h1>

        <div className="section">
          <h3>How to Shop</h3>
          <p>
            Welcome to our shopping guide! To get started, simply browse our
            categories or use the search bar to find specific koi fish. Once you
            find the fish you love, click on the product for more details.
          </p>
          <p>
            Add your selected items to the cart, and when you are ready, proceed
            to checkout to complete your order. Don’t forget to check your cart
            before confirming your purchase.
          </p>
        </div>

        <div className="section">
          <h3>Payment Methods</h3>
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
            Choose the method that works best for you at checkout. All payments
            are processed securely to protect your information.
          </p>
        </div>

        <div className="section">
          <h3>Shipping Information</h3>
          <p>
            We offer fast and reliable shipping options to ensure your koi fish
            arrive safely and promptly. Shipping rates are calculated at
            checkout based on your location.
          </p>
          <p>
            Please allow 3-7 business days for delivery, depending on your
            location. You can track your order through the link in your
            confirmation email.
          </p>
        </div>

        <div className="section">
          <h3>Customer Support</h3>
          <p>
            If you have any questions or need assistance, please reach out to
            our customer support team. We are here to help!
          </p>
          <p>
            Email:{" "}
            <Link to="mailto:goldenkoi.vn@gmail.com">
              goldenkoi.vn@gmail.com
            </Link>
          </p>
          <p>
            Phone: <Link to="tel:+1234567890">+123 456 7890</Link>
          </p>
          <p>
            You can also visit our <Link to="/faqs-page">FAQ page</Link> for
            more information about common questions and concerns.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShoppingGuidePage;
