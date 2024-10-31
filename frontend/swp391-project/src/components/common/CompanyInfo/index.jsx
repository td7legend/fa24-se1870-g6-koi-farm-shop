import React from "react";
import "./styles.scss";

const CompanyInfo = ({ companyName = "Golden Koi" }) => {
  return (
    <div className="company-info">
      <h3 id="part3">
        {companyName} - A reputable supplier of imported Japanese Koi fish at
        good prices
      </h3>
      <div className="company-description">
        <span>
          {companyName} is a unit specializing in providing imported Japanese
          Koi fish with a reputation that has been affirmed in the market.
        </span>
        <span>
          With a commitment to providing quality products and reasonable prices,{" "}
          {companyName} is not only the ideal choice for Koi fish lovers but
          also a reliable partner of dealers and professional aquarium
          designers.
        </span>
        <span>
          Koi fish including quality Doitsu koi fish at {companyName} are
          imported directly from reputable farms in Japan, ensuring origin and
          quality.
        </span>
        <span>
          Our team of experienced experts always select the most beautiful,
          bright and healthy fish to meet the diverse needs of customers.
        </span>
        <span>
          In particular, we always commit to the most competitive prices on the
          market, ensuring everyone has the opportunity to access beautiful
          Japanese Koi fish without worrying about the price.
        </span>
        <span>
          Come to {companyName} to experience the difference and top quality
          service in the field of Japanese Koi fish in Vietnam. We believe that
          you will not regret choosing us as a reliable partner for your fish
          farming hobby.
        </span>
      </div>
    </div>
  );
};

export default CompanyInfo;
