import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Button, Col, Row } from "antd";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./index.scss";
import { faHome } from "@fortawesome/free-solid-svg-icons";

function FAQsPage() {
  const faqData = [
    {
      question: "What types of koi fish do you sell?",
      answer:
        "We offer a wide variety of koi fish, including Kohaku, Showa, and Sanke.",
    },
    {
      question: "How do I take care of my koi?",
      answer:
        "Koi fish require a clean pond, proper filtration, and balanced feeding.",
    },
    {
      question: "What is the price range for your koi fish?",
      answer:
        "Prices vary depending on the breed, size, and quality, ranging from $50 to over $1,000.",
    },
    {
      question: "Do you ship koi fish internationally?",
      answer:
        "Yes, we offer international shipping with special care for the health of the fish during transit.",
    },
    {
      question: "Can I visit your farm to select koi in person?",
      answer:
        "Absolutely! We welcome visitors to our farm by appointment to select koi directly.",
    },
    // New questions related to buying and selling
    {
      question: "How can I purchase koi fish from your store?",
      answer:
        "You can purchase koi fish directly from our website or visit our farm by appointment.",
    },
    {
      question: "Do you offer discounts for bulk purchases?",
      answer:
        "Yes, we offer discounts for bulk purchases. Please contact us for more details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods, including credit cards, PayPal, and bank transfers.",
    },
    {
      question: "What is your return policy for koi fish?",
      answer:
        "We have a strict return policy. Please contact us within 24 hours if you have any issues with your purchase.",
    },
    {
      question: "Can I sell my koi fish to you?",
      answer:
        "Yes, we occasionally buy koi fish from breeders. Please reach out to us for more information.",
    },
  ];

  return (
    <div className="faqs-page">
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
              <Breadcrumb.Item>FAQs</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="faqs-container">
        <h1 className="faqs-title">Golden Koi - Frequently Asked Questions</h1>

        <div className="faq-content">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
                {faq.question}
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}

          <div className="shopping-guide-link">
            <h2>Need more information?</h2>
            <Link to="/shopping-guide">
              <Button type="primary">View Shopping Guide</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQsPage;
