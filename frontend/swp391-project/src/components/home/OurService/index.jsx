import "./index.scss";
import { Link } from "react-router-dom";

const OurService = () => {
  return (
    <section className="our__service">
      <h2>OUR SERVICE</h2>
      <div className="service__content">
        <Link
          to="/consignment/care"
          className="service__box service__box--care"
        >
          <h3>Consignment Care</h3>
          <p>
            Our Consignment Care service ensures your Koi fish are healthy and
            well-maintained. We offer:
          </p>
          <ul>
            <li>Regular health checks and disease prevention</li>
            <li>Customized care plans for your fish</li>
            <li>High-quality feeding and water maintenance</li>
          </ul>
          <p className="learn-more">Learn More →</p>
        </Link>

        <Link
          to="/consignment/sell"
          className="service__box service__box--sell"
        >
          <h3>Consignment Sell</h3>
          <p>
            Our Consignment Sell service connects you with trusted buyers. Key
            features include:
          </p>
          <ul>
            <li>Comprehensive market analysis for fair pricing</li>
            <li>Wide network of dedicated Koi fish buyers</li>
            <li>Seamless transaction and logistics support</li>
          </ul>
          <p className="learn-more">Learn More →</p>
        </Link>
      </div>
    </section>
  );
};

export default OurService;
