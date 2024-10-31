// src/components/ConsignmentSell.js
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ConsignmentSell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate("/consignment/sell")}>
      {t("consignmentForSell")}
    </li>
  );
}

export default ConsignmentSell;
