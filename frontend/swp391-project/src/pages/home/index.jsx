import { useEffect, useRef, useState } from "react";
import WelcomeSection from "../../components/home/WelcomeSection";
import RecentlyAdded from "../../components/home/RecentlyAdded"; // Fixed spelling
import LatestNews from "../../components/home/LatestNews";
import PopularProduct from "../../components/home/PopularProduct";
import AboutFarm from "../../components/home/AboutFarm";
import ImageFrame from "../../components/home/ImageFrame";
import "./index.scss";

const Home = () => {
  const [isVisible, setIsVisible] = useState({
    welcome: false,
    demo1: false, // Đổi tên cho dễ quản lý
    recentlyAdded: false,
    demo2: false, // Đổi tên cho dễ quản lý
    latestNews: false,
    demo3: false, // Đổi tên cho dễ quản lý
    popularProduct: false,
    demo4: false, // Đổi tên cho dễ quản lý
    aboutFarm: false,
  });

  const sectionsRef = useRef({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger when 10% of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.component]: true, // Set to true when in view
          }));
        } else {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.component]: false, // Set to false when out of view
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

      {/* Phần demo đầu tiên */}
      <div
        ref={(el) => (sectionsRef.current.demo1 = el)}
        data-component="demo1"
        className={`component ${isVisible.demo1 ? "animate" : "hidden"}`}
      >
        <div className="demo">
          <div className="content"></div>
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

      {/* Phần demo thứ hai */}
      <div
        ref={(el) => (sectionsRef.current.demo2 = el)}
        data-component="demo2"
        className={`component ${isVisible.demo2 ? "animate" : "hidden"}`}
      >
        <div className="demo">
          <div className="content"></div>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRef.current.latestNews = el)}
        data-component="latestNews"
        className={`component ${isVisible.latestNews ? "animate" : "hidden"}`}
      >
        <LatestNews />
      </div>

      {/* Phần demo thứ ba */}
      <div
        ref={(el) => (sectionsRef.current.demo3 = el)}
        data-component="demo3"
        className={`component ${isVisible.demo3 ? "animate" : "hidden"}`}
      >
        <div className="demo">
          <div className="content"></div>
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

      {/* Phần demo thứ tư */}
      <div
        ref={(el) => (sectionsRef.current.demo4 = el)}
        data-component="demo4"
        className={`component ${isVisible.demo4 ? "animate" : "hidden"}`}
      >
        <div className="demo">
          <div className="content"></div>
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
