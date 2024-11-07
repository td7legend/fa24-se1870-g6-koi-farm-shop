import { useState } from "react";
import { Link } from "react-router-dom";
import Picture from "../../../images/picture-3.png";
import "./index.scss";
import { useTranslation } from "react-i18next";

const LatestNews = () => {
  const newsItems = [
    {
      image:
        "https://sieuthicakoi.vn/storage/3l/5t/3l5tbbzposykbmji64iugx6pvtpr_danh-gia-ca-koi-doitsu-chat-luong.webp",
      title: "What Makes a Beautiful, Quality Doitsu Koi Fish?",
      summary: "Not everyone knows how to own quality Doitsu koi fish...",
      link: "/blog1",
    },
    {
      image:
        "https://sieuthicakoi.vn/storage/io/sl/ioslz0a75kxf2ixl09f0cbvpqrcz_danh-gia-ca-koi-asagi-chat-luong.webp",
      title: "Complete Guide to Asagi Koi: Characteristics and Care Tips",
      summary:
        "Asagi Koi, known for their distinctive blue scales and red belly, are among the most traditional and respected varieties in the Koi world...",
      link: "/blog2",
    },
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_sakai.jpg?alt=media&token=e99dad21-90f8-40ba-9011-6501d4703c5f",
      title: "Sakai Fish Farm: Legacy of Excellence in Koi Breeding",
      summary:
        "Discover the history and breeding techniques of one of Japan's most prestigious koi farms...",
      link: "/blogs/sakai-farm",
    },
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fwater-testing.jpg?alt=media&token=fe5d096a-fce0-4ed9-84ba-3a09ca188a18",
      title: "Essential Water Quality Parameters for Koi Ponds",
      summary:
        "Understanding and maintaining optimal water conditions for healthy koi...",
      link: "/blogs/water-quality",
    },
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FseasonKoiCare.jpg?alt=media&token=348e2818-db81-4988-b234-f4c5aee6157e",
      title: "Seasonal Koi Care: Year-Round Maintenance Guide",
      summary:
        "A comprehensive guide to caring for your koi throughout all seasons...",
      link: "/blogs/seasonal-care",
    },
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FkoiFeeding_nutrition.jpg?alt=media&token=ed9a2f1a-2787-4d2e-876f-3650c7a7a077",
      title: "Koi Nutrition: Complete Feeding Guide",
      summary:
        "Learn about proper koi nutrition and feeding schedules for optimal health...",
      link: "/blogs/koi-nutrition",
    },
  ];
  const { t } = useTranslation();
  const itemsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState("");

  const nextNews = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsPerPage < newsItems.length
          ? prevIndex + itemsPerPage
          : 0
      );
      setFade("fade__in");
    }, 300);
  };

  const prevNews = () => {
    setFade("fade__out");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsPerPage >= 0
          ? prevIndex - itemsPerPage
          : Math.floor((newsItems.length - 1) / itemsPerPage) * itemsPerPage
      );
      setFade("fade__in");
    }, 300);
  };

  return (
    <section className="latest__news">
      <h2>{t("latestNews")}</h2>
      <div className="news__grid">
        <button className="nav__button left" onClick={prevNews}>
          &lt;
        </button>
        <div className={`news__display ${fade}`}>
          {newsItems
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((news, index) => (
              <Link to={news.link} key={index} className="news__card">
                <img
                  src={news.image}
                  alt={news.title}
                  className="news__image"
                />
                <div className="news__content">
                  <h3>{news.title}</h3>
                  <p>{news.summary}</p>
                </div>
              </Link>
            ))}
        </div>
        <button className="nav__button right" onClick={nextNews}>
          &gt;
        </button>
      </div>
    </section>
  );
};

export default LatestNews;
