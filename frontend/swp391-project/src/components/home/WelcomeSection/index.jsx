import Picture1 from "../../../images/picture-3.png";
import Picture2 from "../../../images/picture-1.png";
import "./index.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
function WelcomSestion() {
  return (
    <section className="welcome__section">
      <div className="welcome__content">
        <Swiper
          spaceBetween={100} // Khoảng cách giữa các slide
          slidesPerView={1} // Số lượng slide hiển thị mỗi lần
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }} // Hiển thị các nút điều hướng
          navigation // Hiển thị nút trái phải điều hướng
          modules={[Autoplay, Pagination, Navigation]}
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

export default WelcomSestion;
