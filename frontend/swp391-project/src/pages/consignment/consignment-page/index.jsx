import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
function Consignment() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon"></FontAwesomeIcon>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Consignment
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
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
        </div>
      </div>
    </div>
  );
}

export default Consignment;
