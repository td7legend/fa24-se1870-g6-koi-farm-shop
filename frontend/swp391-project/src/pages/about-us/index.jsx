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
            <p>
              Welcome to Golden Koi Farm, where we bring you high-quality Koi
              fish and dedicated care services. With many years of experience in
              the field of Koi breeding and trading, we are proud to be a
              trusted destination for Koi enthusiasts nationwide. Golden Koi
              hopes to spread the love for Koi fish to all those who have, are,
              and are about to play Koi fish. After more than 10 years of
              construction and development, Golden Koi has defined the main
              business areas to realize its mission: supplying Japanese Koi
              fish, designing and constructing Koi fish ponds, distributing Koi
              fish food, and trading in materials and equipment for Koi fish
              ponds.
            </p>
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
              Golden Koi Farm has had a proud development journey since its
              establishment, affirming its position in the field of Koi farming
              and trading. Below are the important milestones in our development
              process:
              <br />- 2010: Humble beginnings Golden Koi Farm was established in
              2010 with a small area in the suburbs. Initially, the farm only
              specialized in raising common Koi fish to serve the local
              ornamental fish farming needs. Despite the small scale, we
              determined our mission from the beginning to bring healthy and
              quality Koi fish to customers.
              <br />- 2012: Expanding scale after two years of operation, thanks
              to the trust of customers and the Koi-loving community, we decided
              to expand the farming area, invest in modern water filtration
              systems and start importing high-end Koi fish from Japan. This
              stage marks an important step in bringing the quality of Koi fish
              to a new level.
              <br />- 2015: Building a professional care and consignment system
              Realizing the increasing demand of customers for Koi fish care,
              Golden Koi Farm officially launched the Koi fish care and
              consignment service. This is an important step, helping us become
              a place where customers trust to care for and raise fish during
              holidays or busy times, while also supporting the sale of fish to
              those who raise fish for business.
              <br />- 2018: Developing e-commerce In order to meet the needs of
              customers across the country, we have developed an e-commerce
              website, allowing customers to easily view and buy Koi fish
              online. This helps Golden Koi Farm not only serve the local market
              but also expand to other provinces and cities, becoming a familiar
              brand in the Koi fish-playing community.
              <br />- 2020: Strengthening international cooperation In order to
              improve the quality and diversify Koi breeds, Golden Koi Farm
              began to cooperate with large Koi farms in Japan. Thanks to that,
              we can directly import purebred Koi lines with special colors and
              shapes, giving customers more choices.
            </p>
            <br />
            <h3>{t("futureVision")}</h3>
            <p>
              - With a history of strong development and a commitment to
              continuous innovation, Golden Koi Farm aims to become a leading
              enterprise in the field of Koi fish in Vietnam. We strive to bring
              the best products and services to our customers, while actively
              participating in community activities to promote Koi fish culture
              in the country.
            </p>
          </div>

          <div className="section core-values">
            <h3>{t("coreValues")}</h3>
            <p>
              At Golden Koi Farm, our core values are:
              <ul>
                <li>
                  Quality: We ensure the highest standards in our Koi fish.
                </li>
                <li>
                  Trust: We build lasting relationships with our customers.
                </li>
                <li>
                  Innovation: We continually improve our methods and services.
                </li>
                <li>
                  Community: We actively support local communities and
                  initiatives.
                </li>
              </ul>
            </p>
          </div>

          <div className="section customer-benefits">
            <h3>{t("whyChooseUs")}</h3>
            <p>
              Choosing Golden Koi Farm means you are guaranteed:
              <ul>
                <li>Expert advice from our knowledgeable team.</li>
                <li>A wide selection of healthy Koi fish.</li>
                <li>Reliable after-sales service and support.</li>
                <li>Access to exclusive Koi products and accessories.</li>
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
