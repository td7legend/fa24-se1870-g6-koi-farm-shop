import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./index.scss";
import sellImage from "../../images/consignment-sale.png";

function ConsignmentSellPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="consignment-sell-page">
      <div className="background-overlay">
        <div className="sell-info">
          <div className="text-content">
            <h1>{t("consignmentSellTitle")}</h1>
            <p>{t("consignmentSellDescription")}</p>

            <h2>{t("processTitle")}</h2>
            <div className="sell-process">
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
            <ul className="sell-benefits">
              <li>{t("saleBenefit1")}</li>
              <li>{t("saleBenefit2")}</li>
              <li>{t("saleBenefit3")}</li>
            </ul>
            <Button
              className="consignment-sell-link"
              onClick={() => navigate("/consignment/sell")}
              style={{
                marginTop: "10px",
                background: "#bbab6f",
                borderRadius: "15px",
                color: "#fff",
                height: "33px",
                textAlign: "center",
              }}
            >
              {t("consignmentForSale")}
            </Button>
          </div>

          <div className="image-container">
            <img
              src={sellImage}
              alt={t("imageAltSaleText")}
              className="content-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsignmentSellPage;
