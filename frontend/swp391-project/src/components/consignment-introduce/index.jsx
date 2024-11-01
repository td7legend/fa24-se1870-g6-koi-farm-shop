import React from "react";
import "./index.scss";

function ConsignmentIntroduce() {
  return (
    <div className="consignment-background">
      <div className="background-overlay">
        <div className="consignment-container">
          <h1 className="consignment-title">Our Consignment Services</h1>
          <p className="consignment-intro">
            Welcome! We offer options for consignment sale and care to suit your
            needs.
          </p>

          <div className="consignment-columns">
            <div className="consignment-column">
              <h2>Consignment for Sale</h2>
              <div className="service-card">
                <h3>Step 1: Contact Us</h3>
                <p>
                  Provide details about the item you wish to consign for sale.
                </p>
              </div>
              <div className="service-card">
                <h3>Step 2: Evaluation and Pricing</h3>
                <p>We evaluate and price your item with transparency.</p>
              </div>
              <div className="service-card">
                <h3>Step 3: Display and Sale</h3>
                <p>Your item is displayed and sold through our platform.</p>
              </div>
            </div>

            <div className="consignment-column">
              <h2>Consignment for Care</h2>
              <div className="service-card">
                <h3>Step 1: Contact Us</h3>
                <p>Tell us about the item you'd like us to care for.</p>
              </div>
              <div className="service-card">
                <h3>Step 2: Assessment and Agreement</h3>
                <p>We inspect the item and discuss care terms with you.</p>
              </div>
              <div className="service-card">
                <h3>Step 3: Care and Maintenance</h3>
                <p>We provide dedicated care per our agreement.</p>
              </div>
            </div>
          </div>

          <div className="consignment-benefits">
            <h2>Service Benefits</h2>
            <ul>
              <li>Save time and effort</li>
              <li>Transparent, trustworthy process</li>
              <li>Access to a wider customer base</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsignmentIntroduce;
