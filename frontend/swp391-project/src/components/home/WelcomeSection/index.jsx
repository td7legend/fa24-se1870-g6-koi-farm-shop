import Picture1 from "../../../images/background.png";
import Picture2 from "../../../images/background-1.png";
import Picture3 from "../../../images/background-2.png";
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

function WelcomeSection() {
  return (
    <section className="welcome__section">
      <div className="welcome__content">
        <div className="mySwiper">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Autoplay]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img src={Picture1} alt="Koi Fish 1" className="welcome__image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Picture2} alt="Koi Fish 2" className="welcome__image" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={Picture3} alt="Koi Fish 3" className="welcome__image" />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="welcome__text">
          <h1>Welcome to Golden Koi</h1>
          <p>
            Golden Koi is a trusted source for premium koi fish, renowned for
            their health and elegance. They carefully select and nurture each
            fish to ensure the highest quality. Whether you are a beginner or a
            seasoned koi enthusiast, Golden Koi can help create a tranquil pond
            that brings peace and serenity to your space. Visit them today to
            explore their captivating world and bring harmony to your home or
            garden.
          </p>
        </div>

        <div className="welcome__additional-info">
          <ul>
            <li>
              <FontAwesomeIcon icon={faFish} className="icon" /> Premium Quality
              Koi Fish
            </li>
            <li>
              <FontAwesomeIcon icon={faWater} className="icon" /> Expertly
              Selected and Nurtured
            </li>
            <li>
              <FontAwesomeIcon icon={faSeedling} className="icon" /> Tranquil
              Pond Solutions
            </li>
            <li>
              <FontAwesomeIcon icon={faHandshake} className="icon" /> Visit Us
              for Exclusive Offers
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
