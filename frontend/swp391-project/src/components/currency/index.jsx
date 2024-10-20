import React from "react";

// CurrencyFormatter component
const CurrencyFormatter = ({ amount }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return <span>{formatCurrency(amount)}</span>;
};

export default CurrencyFormatter;
