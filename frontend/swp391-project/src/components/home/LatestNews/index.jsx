import { useState } from "react";
import { Link } from "react-router-dom";
import Picture from "../../../images/picture-3.png";
import "./index.scss";

const LatestNews = () => {
  const newsItems = [
    {
      image: Picture,
      title: "News 1",
      summary: "Summary of news 1",
      link: "/news/1",
    },
    {
      image: Picture,
      title: "News 2",
      summary: "Summary of news 2",
      link: "/news/2",
    },
    {
      image: Picture,
      title: "News 3",
      summary: "Summary of news 3",
      link: "/news/3",
    },
    {
      image: Picture,
      title: "News 4",
      summary: "Summary of news 4",
      link: "/news/4",
    },
    {
      image: Picture,
      title: "News 5",
      summary: "Summary of news 5",
      link: "/news/5",
    },
    {
      image: Picture,
      title: "News 6",
      summary: "Summary of news 6",
      link: "/news/6",
    },
  ];

  const itemsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState("");

  const nextNews = () => {
    setFade("fade__out"); // Start fade-out effect
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + itemsPerPage < newsItems.length
          ? prevIndex + itemsPerPage
          : 0
      );
      setFade("fade__in"); // Start fade-in effect
    }, 300); // Duration of the fade-out animation
  };

  const prevNews = () => {
    setFade("fade__out"); // Start fade-out effect
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex - itemsPerPage >= 0
          ? prevIndex - itemsPerPage
          : Math.floor(newsItems.length / itemsPerPage) * itemsPerPage
      );
      setFade("fade__in"); // Start fade-in effect
    }, 300); // Duration of the fade-out animation
  };

  return (
    <section className="latest__news">
      <h2>Latest News</h2>
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
