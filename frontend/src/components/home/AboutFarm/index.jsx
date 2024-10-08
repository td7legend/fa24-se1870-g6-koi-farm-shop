import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "./index.scss";
import Picture1 from "../../../images/picture-3.png";
import Picture2 from "../../../images/picture-1.png";

const AboutFarm = () => {
  const images = [
    { src: Picture1, alt: "Farm Image 1", link: "/about-farm/1" },
    { src: Picture2, alt: "Farm Image 2", link: "/about-farm/2" },
    { src: Picture1, alt: "Farm Image 3", link: "/about-farm/3" },
  ];

  return (
    <section className="about__farm">
      <h2>About Our Farm</h2>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Link to={image.link} className="farm__image">
              <img src={image.src} alt={image.alt} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AboutFarm;
