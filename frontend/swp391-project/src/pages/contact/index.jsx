import { Breadcrumb, Button, Col, Form, Input, Row } from "antd";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "antd/es/form/Form";

function Contact() {
  return (
    <div>
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
              <Breadcrumb.Item>Contact</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="contact-container">
        <div className="contact-information">
          <div className="contact-information-left">
            <p className="information-item">
              <FontAwesomeIcon icon={faLocationDot} className="icon" />
              Lô E2a-7, Đường D1, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
            </p>
            <p className="information-item">
              <FontAwesomeIcon icon={faPhone} className="icon" />
              Hotline: 024xxx.xxx.xxx
            </p>
            <p className="information-item">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              Email: goldenkoi.vn@gmail.com
            </p>
          </div>
          <div className="line"></div>
          <div className="contact-information-right">
            <div className="information-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.609941530484!2d106.80730807451795!3d10.841132857997918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1729146539832!5m2!1svi!2s"
                width={650}
                height={400}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
