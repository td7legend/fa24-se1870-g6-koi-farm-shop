import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "./index.scss";
import errorImage from "../../images/error-404.png"; // Import hình ảnh

function ErrorPage() {
  return (
    <div className="error__page">
      <img src={errorImage} alt="Error 404" className="error__image" />{" "}
      <div className="error__content">
        <h1 className="error__title">Oops! Page Not Found</h1>
        <p className="error__message">
          The resource requested could not be found on this server!
        </p>
        <Link to="/" className="error__button">
          {" "}
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
