import React from "react";
import "./index.scss";
import { Breadcrumb, Button, Col, Row } from "antd";

function PolicyPage() {
  return (
    <div>
      <Row>
        <Col span={24}>
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item>Policy</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="policy-page">
        <h1>Our Policies</h1>

        <div className="section">
          <h3>General Information</h3>
          <p>
            We are committed to providing accurate and transparent information
            about our products. All products are carefully selected from the
            most reputable and quality suppliers.
          </p>
          <p>
            If you have any questions regarding our products or services, please
            contact our customer service team via email or phone.
          </p>
        </div>

        <div className="section">
          <h3>Returns and Exchanges</h3>
          <p>
            We accept returns and exchanges within 30 days of purchase. To be
            eligible for a return, the product must be in its original
            condition, unused, and in its original packaging.
          </p>
          <p>
            To initiate a return or exchange, please contact us and provide your
            order information. We will guide you through the necessary steps to
            complete the process.
          </p>
        </div>

        <div className="section">
          <h3>Privacy Policy</h3>
          <p>
            We are committed to protecting your personal information. All
            information you provide will be encrypted and used solely for
            processing your orders or enhancing your experience on our website.
          </p>
        </div>

        <div className="section">
          <h3>Contact Us</h3>
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
  );
}

export default PolicyPage;
