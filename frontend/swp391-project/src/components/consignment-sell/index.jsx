// src/components/ConsignmentSell.js
import React from "react";
import { useNavigate } from "react-router-dom";

function ConsignmentSell() {
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate("/consignment/sell")}>Consignment for sell</li>
  );
}

export default ConsignmentSell;
