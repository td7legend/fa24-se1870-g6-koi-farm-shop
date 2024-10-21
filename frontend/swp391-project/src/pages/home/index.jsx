import { useEffect, useRef, useState } from "react";
import WelcomeSection from "../../components/home/WelcomeSection";
import RecentlyAdded from "../../components/home/RecentlyAdded";
import LatestNews from "../../components/home/LatestNews";
import PopularProduct from "../../components/home/PopularProduct";
import AboutFarm from "../../components/home/AboutFarm";
import "./index.scss";

const Home = () => {
  const [isVisible, setIsVisible] = useState({
    welcome: false,
    ogon: false,
    ochiba: false,
    kohaku: false,
    kujaku: false,
    recentlyAdded: false,
    latestNews: false,
    popularProduct: false,
    aboutFarm: false,
  });

  const sectionsRef = useRef({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.component]: true,
          }));
        } else {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.component]: false,
          }));
        }
      });
    }, observerOptions);

    Object.keys(sectionsRef.current).forEach((key) => {
      observer.observe(sectionsRef.current[key]);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home">
      <div
        ref={(el) => (sectionsRef.current.welcome = el)}
        data-component="welcome"
        className={`component ${isVisible.welcome ? "animate" : "hidden"}`}
      >
        <WelcomeSection />
      </div>

      {/* Section 1: Ogon */}
      <div
        ref={(el) => (sectionsRef.current.ogon = el)}
        data-component="ogon"
        className={`component ogon ${isVisible.ogon ? "animate" : "hidden"}`}
      >
        <div className="demo">
          <div className="content" style={{ textAlign: "right" }}>
            <h2>Ogon Koi Fish</h2>
            <p>
              The Ogon koi fish is known for its stunning golden color and shiny
              appearance. This variety symbolizes prosperity and is a favorite
              among koi enthusiasts.
            </p>
          </div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/OeuhPo4AgkI"
            title="Ogon Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRef.current.recentlyAdded = el)}
        data-component="recentlyAdded"
        className={`component ${
          isVisible.recentlyAdded ? "animate" : "hidden"
        }`}
      >
        <RecentlyAdded />
      </div>

      {/* Section 2: Ochiba */}
      <div
        ref={(el) => (sectionsRef.current.ochiba = el)}
        data-component="ochiba"
        className={`component ochiba ${
          isVisible.ochiba ? "animate" : "hidden"
        }`}
      >
        <div className="demo">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/rVFfO95KxRk"
            title="Ochiba Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="content">
            <h2>Ochiba Koi Fish</h2>
            <p>
              The Ochiba koi fish is appreciated for its unique blue-gray body
              with orange patterns. It's a beautiful addition to any pond.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRef.current.latestNews = el)}
        data-component="latestNews"
        className={`component ${isVisible.latestNews ? "animate" : "hidden"}`}
      >
        <LatestNews />
      </div>

      {/* Section 3: Kohaku */}
      <div
        ref={(el) => (sectionsRef.current.kohaku = el)}
        data-component="kohaku"
        className={`component kohaku ${
          isVisible.kohaku ? "animate" : "hidden"
        }`}
      >
        <div className="demo">
          <div className="content" style={{ textAlign: "right" }}>
            <h2>Kohaku Koi Fish</h2>
            <p>
              The Kohaku is one of the most popular koi varieties, known for its
              striking red and white coloration. It represents luck and
              prosperity.
            </p>
          </div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/TjEWSEm6MI4"
            title="Kohaku Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRef.current.popularProduct = el)}
        data-component="popularProduct"
        className={`component ${
          isVisible.popularProduct ? "animate" : "hidden"
        }`}
      >
        <PopularProduct />
      </div>

      {/* Section 4: Kujaku */}
      <div
        ref={(el) => (sectionsRef.current.kujaku = el)}
        data-component="kujaku"
        className={`component kujaku ${
          isVisible.kujaku ? "animate" : "hidden"
        }`}
      >
        <div className="demo">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/ySxJcBmKvsM"
            title="Kujaku Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="content">
            <h2>Kujaku Koi Fish</h2>
            <p>
              The Kujaku is known for its stunning patterns and colors, making
              it a striking presence in any koi pond.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRef.current.aboutFarm = el)}
        data-component="aboutFarm"
        className={`component ${isVisible.aboutFarm ? "animate" : "hidden"}`}
      >
        <AboutFarm />
      </div>
    </div>
  );
};

export default Home;
