import { Breadcrumb, Col, Row } from "antd";
import "./index.scss";
function AboutUs() {
  return (
    <div>
      <Row>
        <Col span={24}>
          <div className="breadcrumb-container">
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item>About Us</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Col>
      </Row>

      <div className="about-us-container">
        <div className="about-us-form">
          <div className="introduction">
            <h2>Introduce</h2>
            <p>
              Welcome to Golden Koi Farm, where we bring you high quality Koi
              fish and dedicated care services. With many years of experience in
              the field of Koi breeding and trading, we are proud to be a
              trusted destination for Koi enthusiasts nationwide. Golden Koi
              hopes to spread the love for Koi fish to all those who have, are
              and are about to play Koi fish. After more than 10 years of
              construction and development, Golden Koi has defined the main
              business areas to realize its mission: supplying Japanese Koi
              fish, designing and constructing Koi fish ponds, distributing Koi
              fish food, and trading in materials and equipment for Koi fish
              ponds.
            </p>
          </div>
          <br />
          <figure className="introduce-image">
            <img src="src/images/background-koi-introduce-2.jpg" alt="" />
            <figcaption>Koi Fish Pond Area</figcaption>
          </figure>
          <div className="development-history">
            <h3>Development history of Golden Koi</h3>
            <p>
              Golden Koi Farm has had a proud development journey since its
              establishment, affirming its position in the field of Koi farming
              and trading. Below are the important milestones in our development
              process:
              <br />
              - 2010: Humble beginnings Golden Koi Farm was established in 2010
              with a small area in the suburbs. Initially, the farm only
              specialized in raising common Koi fish to serve the local
              ornamental fish farming needs. Despite the small scale, we
              determined our mission from the beginning to bring healthy and
              quality Koi fish to customers.
              <br />
              - 2012: Expanding scale after two years of operation, thanks to
              the trust of customers and the Koi-loving community, we decided to
              expand the farming area, invest in modern water filtration systems
              and start importing high-end Koi fish from Japan. This stage marks
              an important step in bringing the quality of Koi fish to a new
              level.
              <br />
              - 2015: Building a professional care and consignment system
              Realizing the increasing demand of customers for Koi fish care,
              Golden Koi Farm officially launched the Koi fish care and
              consignment service. This is an important step, helping us become
              a place where customers trust to care for and raise fish during
              holidays or busy times, while also supporting the sale of fish to
              those who raise fish for business.
              <br />
              - 2018: Developing e-commerce In order to meet the needs of
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
            <h3>Future Vision</h3>
            <p>
              - With a history of strong development and a commitment to
              continuous innovation, Golden Koi Farm aims to become a leading
              unit not only domestically but also internationally. We always
              maintain our core values of providing quality products, dedicated
              services and continue to develop sustainably with the Koi-loving
              community.
            </p>
          </div>
          <br />
          <figure className="introduce-image">
            <img src="src/images/background-koi-introduce.webp" alt="" />
            <figcaption>Koi Fish - Meaningful Feng Shui Symbol</figcaption>
          </figure>
          <div className="development-goals">
            <h3>Development Goals</h3>
            <p>
              -Golden Koi Farm is constantly striving to reach new heights in
              providing quality products and services to the Koi fish lover
              community. With the orientation of sustainable development and
              long-term commitment to customers, we have set specific goals as
              follows:
              <br />- Expanding production and farming scale: We aim to expand
              the farm area and modern farming system, creating the best living
              environment for Koi fish, thereby meeting the growing demand of
              the domestic and international markets.
              <br />- Developing professional care and consulting services: Not
              only stopping at selling fish, we want to become a trusted partner
              in caring for Koi fish and consulting on farming techniques and
              fish pond maintenance. Our team of experts will be trained and
              continuously updated with knowledge to provide the most
              professional service.
              <br />- Improving Koi quality and diversifying products: Golden
              Koi Farm is committed to continuously improving the quality of Koi
              fish in terms of species, color and shape. We will also search for
              and develop many new and unique Koi varieties to bring rich and
              unique choices to customers.
              <br />- Strengthening the online sales system: In the digital age,
              we aim to strongly develop the e-commerce platform, allowing
              customers to easily access Golden Koi Farm products and services
              anytime, anywhere. Online transactions will be optimized for speed
              and safety.
            </p>
          </div>
          <br />
          <figure className="introduce-image">
            <img src="src/images/background-koi-introduce-3.webp" alt="" />
            <figcaption>Koi Fish - Meaningful Feng Shui Symbol</figcaption>
          </figure>
          <div className="quality-commitment">
            <h3>Quality Commitment</h3>
            <p>
              Golden Koi Farm always focuses on the living environment and
              quality of fish care. We use modern water filtration systems,
              standard nutrition and strict control processes to ensure that the
              fish are always healthy and meet the highest standards when they
              reach customers.
              <br />- Why choose Golden Koi Farm? Reputable origin: We import
              directly from leading farms in Japan. Dedicated care: A team of
              experts with many years of experience, ensuring absolute
              satisfaction for customers. Reasonable price: We are committed to
              providing Koi fish at competitive prices along with thoughtful
              after-sales service. Come to Golden Koi Farm to experience
              professional service and join us in building the perfect living
              space for classy Koi fish!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
