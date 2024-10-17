import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

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
  ];

  return (
    <div className="faqs-container">
      <h1 className="faqs-title">Golden Koi - Frequently Asked Questions</h1>

      <div className="faq-content">
        <div className="faq-items">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question">
                <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
                {faq.question}
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>

        <div className="faq-form">
          <h2 className="faq-form-title">Have a question? Ask us!</h2>
          <form className="form">
            <label className="form-label" htmlFor="question">
              Your Question
            </label>
            <textarea
              id="question"
              name="question"
              rows="4" // Chiều cao của ô nhập câu hỏi
              placeholder="Type your question here..."
              className="form-input"
            ></textarea>
            <button type="submit" className="form-submit">
              Submit Question
            </button>
          </form>
          <div className="additional-info">
            * Our koi fish are sourced from top breeders, ensuring quality and
            health.
            <br />* Feel free to ask about koi care, tank setup, or any other
            inquiries!
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQsPage;
