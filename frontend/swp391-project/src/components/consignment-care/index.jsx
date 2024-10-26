// src/components/ConsignmentCare.js
import React from "react";
import { useNavigate } from "react-router-dom";

function ConsignmentCare() {
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate("/consignment/care")}>Consignment for care</li>
  );
}

export default ConsignmentCare;
