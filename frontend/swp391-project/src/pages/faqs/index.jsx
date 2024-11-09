import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Button, Col, Row } from "antd";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./index.scss";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function FAQsPage() {
  const { t } = useTranslation();
  const faqData = [
    {
      question: t("faqData.question1"),
      answer: t("faqData.answer1"),
    },
    {
      question: t("faqData.question2"),
      answer: t("faqData.answer2"),
    },
    {
      question: t("faqData.question3"),
      answer: t("faqData.answer3"),
    },
    {
      question: t("faqData.question4"),
      answer: t("faqData.answer4"),
    },
    {
      question: t("faqData.question5"),
      answer: t("faqData.answer5"),
    },
    {
      question: t("faqData.question6"),
      answer: t("faqData.answer6"),
    },
    {
      question: t("faqData.question7"),
      answer: t("faqData.answer7"),
    },
    {
      question: t("faqData.question8"),
      answer: t("faqData.answer8"),
    },
    {
      question: t("faqData.question9"),
      answer: t("faqData.answer9"),
    },
    {
      question: t("faqData.question10"),
      answer: t("faqData.answer10"),
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
              <Breadcrumb.Item className="breadcrumb-page">
                {t("frequentlyAskedQuestions")}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="faqs-container">
        <h1 className="faqs-title">
          Golden Koi - {t("frequentlyAskedQuestions")}
        </h1>

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
            <h2>{t("needMoreInformation")}</h2>
            <Link to="/shopping-guide">
              <Button type="primary">{t("viewShoppingGuide")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQsPage;
