// src/pages/ConsignmentCarePage.js
import React from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import careImage from "../../images/consignment-care.png";

function ConsignmentCarePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="consignment-care-page">
      <div className="background-overlay">
        <div className="care-info">
          <div className="image-container">
            <img
              src={careImage}
              alt={t("imageAltText")}
              className="content-image"
            />
          </div>
          <div className="text-content">
            <h1>{t("consignmentCareTitle")}</h1>
            <p>{t("consignmentCareDescription")}</p>

            <h2>{t("processTitle")}</h2>
            <div className="care-process">
              <div className="process-step">
                <h3>{t("step1Title")}</h3>
                <p>{t("step1Description")}</p>
              </div>
              <div className="process-step">
                <h3>{t("step2Title")}</h3>
                <p>{t("step2Description")}</p>
              </div>
              <div className="process-step">
                <h3>{t("step3Title")}</h3>
                <p>{t("step3Description")}</p>
              </div>
            </div>

            <h2>{t("benefitsTitle")}</h2>
            <ul className="care-benefits">
              <li>{t("benefit1")}</li>
              <li>{t("benefit2")}</li>
              <li>{t("benefit3")}</li>
            </ul>
            <Button
              className="consignment-care-link"
              onClick={() => navigate("/consignment/care")}
              style={{
                marginTop: "10px",
                background: "#bbab6f",
                borderRadius: "15px",
                color: "#fff",
                height: "33px",
                textAlign: "center",
              }}
            >
              {t("consignmentForCare")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsignmentCarePage;
