import { useEffect, useRef, useState } from "react";
import WelcomeSection from "../../components/home/WelcomeSection";
import RecentlyAdded from "../../components/home/RecentlyAdded";
import LatestNews from "../../components/home/LatestNews";
import PopularProduct from "../../components/home/PopularProduct";
import OurService from "../../components/home/OurService";
import "./index.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
    ourService: false,
  });
  const { t } = useTranslation();
  const sectionsRef = useRef({});
  const videoSources = {
    ogon: "https://www.youtube.com/embed/OeuhPo4AgkI?autoplay=1&mute=1&vq=hd1080",
    ochiba:
      "https://www.youtube.com/embed/rVFfO95KxRk?autoplay=1&mute=1&vq=hd1080",
    kohaku:
      "https://www.youtube.com/embed/TjEWSEm6MI4?autoplay=1&mute=1&vq=hd1080",
    kujaku:
      "https://www.youtube.com/embed/ySxJcBmKvsM?autoplay=1&mute=1&vq=hd1080",
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const componentName = entry.target.dataset.component;

        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [componentName]: true,
          }));
        } else {
          setIsVisible((prev) => ({
            ...prev,
            [componentName]: false,
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
            <h2>Ogon Koi </h2>
            <p>
              {t(
                "theOgonKoiFishIsKnownForItsStunningGoldenColorAndShinyAppearance"
              )}
              {t(
                "thisVarietySymbolizesProsperityAndIsAFavoriteAmongKoiEnthusiasts"
              )}
            </p>
            <Link to="/breed/Ogon" className="view-details">
              {t("viewDetails")} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          <iframe
            key={isVisible.ogon ? videoSources.ogon : null}
            width="560"
            height="500"
            src={isVisible.ogon ? videoSources.ogon : ""}
            title="Ogon Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
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
            key={isVisible.ochiba ? videoSources.ochiba : null}
            width="560"
            height="500"
            src={isVisible.ochiba ? videoSources.ochiba : ""}
            title="Ochiba Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
          ></iframe>
          <div className="content">
            <h2>Ochiba Koi</h2>
            <p>
              {t(
                "theOchibaKoiFishIsAppreciatedForItsUniqueBlueGrayBodyWithOrangePatternsItSABeautifulAdditionToAnyPond"
              )}
            </p>
            <Link to="/breed/Ochiba" className="view-details">
              {t("viewDetails")} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
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
            <h2>Kohaku Koi </h2>
            <p>
              {t(
                "theKohakuIsOneOfTheMostPopularKoiVarietiesKnownForItsStrikingRedAndWhiteColorationItRepresentsLuckAndProsperity"
              )}
            </p>
            <Link to="/breed/Kohaku" className="view-details">
              {t("viewDetails")} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          <iframe
            key={isVisible.kohaku ? videoSources.kohaku : null}
            width="560"
            height="500"
            src={isVisible.kohaku ? videoSources.kohaku : ""}
            title="Kohaku Koi Fish"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
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
            key={isVisible.kujaku ? videoSources.kujaku : null}
            width="560"
            height="500"
            src={isVisible.kujaku ? videoSources.kujaku : ""}
            title="Kujaku Koi "
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="youtube-iframe"
          ></iframe>
          <div className="content">
            <h2>Kujaku Koi </h2>
            <p>
              {t(
                "theKujakuIsKnownForItsStunningPatternsAndColorsMakingItAStrikingPresenceInAnyKoiPond"
              )}
            </p>
            <Link to="/breed/Kujaku" className="view-details">
              {t("viewDetails")} <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRef.current.ourService = el)}
        data-component="ourService"
        className={`component ${isVisible.ourService ? "animate" : "hidden"}`}
      >
        <OurService />
      </div>
    </div>
  );
};

export default Home;
