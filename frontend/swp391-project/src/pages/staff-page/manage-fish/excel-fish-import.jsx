import React from "react";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const ExcelFishImport = ({ onUploadSuccess, token, config }) => {
  const processFile = async (file) => {
    try {
      // First convert Excel to CSV if it's an Excel file
      let csvData;
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        const reader = new FileReader();
        const fileData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsArrayBuffer(file);
        });

        const workbook = XLSX.read(fileData, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        csvData = XLSX.utils.sheet_to_csv(firstSheet);
      } else {
        // If it's already a CSV, read it directly
        csvData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
      }

      // Parse CSV data with proper configuration
      const parseResult = await new Promise((resolve) => {
        Papa.parse(csvData, {
          header: true,
          delimiter: ",", // explicitly set delimiter
          skipEmptyLines: true,
          complete: (results) => resolve(results),
          error: (error) => {
            console.error("Parsing error:", error);
            message.error("Error parsing file");
          },
        });
      });

      if (parseResult.errors.length > 0) {
        console.error("Parse errors:", parseResult.errors);
        message.error("Error parsing file: " + parseResult.errors[0].message);
        return;
      }

      const processedData = parseResult.data.map((row) => ({
        name: row.name?.trim() || "",
        gender: parseInt(row.gender) || 0,
        age: parseInt(row.age) || 0,
        size: parseInt(row.size) || 0,
        class: row.class?.trim() || "",
        foodRequirement: parseInt(row.foodRequirement) || 0,
        overallRating: "0",
        price: parseInt(row.price) || 0,
        batch: true,
        fishTypeId: parseInt(row.fishTypeId) || 0,
        description: row.description?.trim() || "",
        quantity: parseInt(row.quantity) || 0,
        imageUrl: row.imageUrl?.trim() || "",
      }));

      let successCount = 0;
      let errorCount = 0;

      for (const fishData of processedData) {
        try {
          // Validate required fields
          if (!fishData.name || !fishData.class) {
            console.error("Missing required fields:", fishData);
            errorCount++;
            continue;
          }

          const response = await fetch(`${config.API_ROOT}fishs`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fishData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          successCount++;
        } catch (error) {
          console.error("Error adding fish:", error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        message.success(`Successfully added ${successCount} fish records`);
        if (onUploadSuccess) onUploadSuccess();
      }
      if (errorCount > 0) {
        message.error(`Failed to add ${errorCount} fish records`);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      message.error("Failed to process file. Please check the format.");
    }
  };

  const beforeUpload = (file) => {
    const isCSV = file.type === "text/csv";
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isCSV && !isExcel) {
      message.error("Please upload a CSV or Excel file!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must be smaller than 5MB!");
      return false;
    }

    processFile(file);
    return false;
  };

  return (
    <Upload
      accept=".csv,.xlsx,.xls"
      showUploadList={false}
      beforeUpload={beforeUpload}
    >
      <Button
        icon={<UploadOutlined />}
        style={{ backgroundColor: "#bbab6f" }}
        type="primary"
      >
        Import Fish from Excel
      </Button>
    </Upload>
  );
};

export default ExcelFishImport;
