import { useNavigate } from "react-router-dom";
import "./index.scss";
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
      </div>
    </div>
  );
}

export default Consignment;
