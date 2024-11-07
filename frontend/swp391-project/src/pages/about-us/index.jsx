import { Breadcrumb, Col, Row } from "antd";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function AboutUs() {
  const { t } = useTranslation();
  return (
    <div className="about-us-page">
      <Row>
        <Col span={24}>
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb" separator=">">
              <Breadcrumb.Item href="/">
                <FontAwesomeIcon icon={faHome} className="icon" />
              </Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumb-page">
                {t("aboutUs")}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="about-us-container">
        <div className="about-us-form">
          <div className="section introduction">
            <h2>{t("introduce")}</h2>
            <p>{t("aboutUsIntroductionText")}</p>
          </div>

          <figure className="introduce-image">
            <img
              src="src/images/background-koi-introduce-4.webp"
              alt="Koi Fish Pond Area"
            />
            <figcaption>{t("koiFishPondArea")}</figcaption>
          </figure>

          <div className="section development-history">
            <h3>{t("developmentHistory")}</h3>
            <p>
              {t("developmentHistoryDescription1")}
              <br /> {t("developmentHistoryDescription2")}
              <br /> {t("developmentHistoryDescription3")}
              <br /> {t("developmentHistoryDescription4")}
              <br /> {t("developmentHistoryDescription5")}
              <br /> {t("developmentHistoryDescription6")}
            </p>
            <br />
            <h3>{t("futureVision")}</h3>
            <p>{t("futureVisionDescription")}</p>
          </div>

          <div className="section core-values">
            <h3>{t("coreValues")}</h3>
            <p>
              {t("coreValuesP")}
              <ul>
                <li>{t("coreValuesLi1")}</li>
                <li>{t("coreValuesLi2")}</li>
                <li>{t("coreValuesLi3")}</li>
                <li>{t("coreValuesLi4")}</li>
              </ul>
            </p>
          </div>

          <div className="section customer-benefits">
            <h3>{t("whyChooseUs")}</h3>
            <p>
              {t("whyChooseUsP")}
              <ul>
                <li>{t("whyChooseUsLi1")}</li>
                <li>{t("whyChooseUsLi2")}</li>
                <li>{t("whyChooseUsLi3")}</li>
                <li>{t("whyChooseUsLi4")}</li>
              </ul>
            </p>
          </div>

          <figure>
            <img
              src="src/images/background-koi-introduce-3.webp"
              alt="Golden Koi Farm"
            />
            <figcaption>Golden Koi Farm</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
