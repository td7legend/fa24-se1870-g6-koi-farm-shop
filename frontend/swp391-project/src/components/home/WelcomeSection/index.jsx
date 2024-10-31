import Picture1 from "../../../images/background.png";
import Picture2 from "../../../images/background-1.png";
import Picture3 from "../../../images/background-2.png";
import Picture4 from "../../../images/background-3.png";
import "./index.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFish,
  faWater,
  faSeedling,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function WelcomeSection() {
  const { t } = useTranslation();
  return (
    <section className="welcome__section">
      <div className="welcome__content">
        <div className="mySwiper">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Autoplay]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img src={Picture4} alt="Koi Fish 1" className="welcome__image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Picture3} alt="Koi Fish 2" className="welcome__image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Picture2} alt="Koi Fish 3" className="welcome__image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Picture1} alt="Koi Fish 3" className="welcome__image" />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="welcome__text">
          <h1>{t("welcomeToGoldenKoi")}</h1>
          <p>{t("goldenKoiIsATrustedSourceForPremiumKoiFish")}</p>
        </div>

        <div className="welcome__additional-info">
          <ul>
            <li>
              <FontAwesomeIcon icon={faFish} className="icon" />{" "}
              {t("premiumQualityKoiFish")}
            </li>
            <li>
              <FontAwesomeIcon icon={faWater} className="icon" />{" "}
              {t("expertlySelectedAndNurtured")}
            </li>
            <li>
              <FontAwesomeIcon icon={faSeedling} className="icon" />{" "}
              {t("tranquilPondSolutions")}
            </li>
            <li>
              <FontAwesomeIcon icon={faHandshake} className="icon" />{" "}
              {t("visitUsForExclusiveOffers")}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
