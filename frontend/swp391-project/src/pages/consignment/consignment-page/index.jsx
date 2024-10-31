import { useNavigate } from "react-router-dom";
import "./index.scss";
<<<<<<< HEAD
function Consignment() {
  const navigate = useNavigate();
  return (
    <div className="consignment-page-container">
      <div>
        <h1>Choose your consignment</h1>
        <ul>
          <li onClick={() => navigate("/consignment/care")}>
            Consignment for care
          </li>
          <li onClick={() => navigate("/consignment/sell")}>
            Consignment for sell
          </li>
        </ul>
=======
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import ConsignmentCare from "../../../components/consignment-care";
import ConsignmentSell from "../../../components/consignment-sell";
import { useTranslation } from "react-i18next";

function Consignment() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            {t("consignment")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="consignment-page-container">
        <div>
          <h1>{t("chooseYourConsignment")}</h1>
          <ul>
            <ConsignmentCare />
            <ConsignmentSell />
          </ul>
        </div>
>>>>>>> main
      </div>
    </div>
  );
}

export default Consignment;
