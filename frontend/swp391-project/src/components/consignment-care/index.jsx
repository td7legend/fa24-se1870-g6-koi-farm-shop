// src/components/ConsignmentCare.js
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ConsignmentCare() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate("/consignment/care")}>
      {t("consignmentForCare")}
    </li>
  );
}

export default ConsignmentCare;
