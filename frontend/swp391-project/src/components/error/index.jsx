import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import "./index.scss";
import errorImage from "../../images/error-404.png"; // Import hình ảnh
import { useTranslation } from "react-i18next";

function ErrorPage() {
  const { t } = useTranslation();
  return (
    <div className="error__page">
      <img src={errorImage} alt="Error 404" className="error__image" />{" "}
      <div className="error__content">
        <h1 className="error__title">{t("oopsPageNotFound")}</h1>
        <p className="error__message">
          {t("theResourceRequestedCouldNotBeFoundOnThisServer")}
        </p>
        <Link to="/" className="error__button">
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
