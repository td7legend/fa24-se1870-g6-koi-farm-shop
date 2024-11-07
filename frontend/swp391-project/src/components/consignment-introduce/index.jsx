import React from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";

function ConsignmentIntroduce() {
  const { t } = useTranslation();

  return (
    <div className="consignment-background">
      <div className="background-overlay">
        <div className="consignment-container">
          <h1 className="consignment-title">{t("ourConsignmentServices")}</h1>
          <p className="consignment-intro">{t("welcomeMessage")}</p>

          <div className="consignment-columns">
            <div className="consignment-column">
              <h2>{t("consignmentForSale")}</h2>
              <div className="service-card">
                <h3>{t("step1ContactUs")}</h3>
                <p>{t("step1ContactUs")}</p>
              </div>
              <div className="service-card">
                <h3>{t("step2EvaluationAndPricing")}</h3>
                <p>{t("step2EvaluationAndPricing")}</p>
              </div>
              <div className="service-card">
                <h3>{t("step3DisplayAndSale")}</h3>
                <p>{t("step3DisplayAndSale")}</p>
              </div>
            </div>

            <div className="consignment-column">
              <h2>{t("consignmentForCare")}</h2>
              <div className="service-card">
                <h3>{t("step1CareContactUs")}</h3>
                <p>{t("step1CareContactUs")}</p>
              </div>
              <div className="service-card">
                <h3>{t("step2CareAssessmentAndAgreement")}</h3>
                <p>{t("step2CareAssessmentAndAgreement")}</p>
              </div>
              <div className="service-card">
                <h3>{t("step3CareAndMaintenance")}</h3>
                <p>{t("step3CareAndMaintenance")}</p>
              </div>
            </div>
          </div>

          <div className="consignment-benefits">
            <h2>{t("serviceBenefits")}</h2>
            <ul>
              <li>{t("benefits1")}</li>
              <li>{t("benefits2")}</li>
              <li>{t("benefits3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsignmentIntroduce;
