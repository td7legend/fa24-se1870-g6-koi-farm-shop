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
            <h1>{t("consignmentCareServices")}</h1>
            <p>{t("consignmentCareDescription")}</p>

            <h2>{t("ourProcess")}</h2>
            <div className="care-process">
              <div className="process-step">
                <h3>{t("step1InitialContact")}</h3>
                <p>{t("step1description")}</p>
              </div>
              <div className="process-step">
                <h3>{t("step2AssessmentAndAgreement")}</h3>
                <p>{t("step2description")}</p>
              </div>
              <div className="process-step">
                <h3>{t("step3OngoingCare")}</h3>
                <p>{t("step3description")}</p>
              </div>
            </div>

            <h2>{t("careBenefits")}</h2>
            <ul className="care-benefits">
              <li>{t("careBenefit1")}</li>
              <li>{t("careBenefit2")}</li>
              <li>{t("careBenefit3")}</li>
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
