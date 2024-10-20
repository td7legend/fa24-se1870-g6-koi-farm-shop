import Picture1 from "../../../images/picture-3.png"; // Đảm bảo đường dẫn đúng
import Picture2 from "../../../images/picture-1.png"; // Đảm bảo đường dẫn đúng
import "./index.scss"; // Đảm bảo SCSS được nhập đúng
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Chỉ import Autoplay và Pagination
import "swiper/css";
import "swiper/css/pagination";

function WelcomeSection() {
  return (
    <section className="welcome__section">
      <div className="welcome__content">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={Picture1} alt="Koi Fish 1" className="welcome__image" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Picture2} alt="Koi Fish 2" className="welcome__image" />
          </SwiperSlide>
        </Swiper>

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
      </div>
    </section>
  );
}

export default WelcomeSection;
