import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";

const SakaiFarm = () => {
  const sidebarData = {
    relatedNews: [
      {
        id: 1,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_dainichi.jpg?alt=media&token=fe5b9ed0-8968-413c-9fa1-791c188da283",
        title: "Dainichi Koi Farm: Masters of Koi Development",
        excerpt:
          "Explore how Dainichi Koi Farm has revolutionized koi breeding with their innovative techniques...",
        link: "/blogs/dainichi-farm",
      },
      {
        id: 2,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fglixq8w7k2zho2n28td0w6teatob_Review_Momotaro_Koi_Farm.webp?alt=media&token=fcd4d1ef-b64f-4557-89c7-43ad1f0517f1",
        title: "Momotaro Koi Farm: The Art of Modern Koi Breeding",
        excerpt:
          "Learn about the cutting-edge breeding methods at Momotaro Koi Farm...",
        link: "/blogs/momotaro-farm",
      },
      {
        id: 3,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fmarusaka.jpg?alt=media&token=b548590b-1947-467a-875a-00f7473f1bcf",
        title: "Marusaka Koi Farm: Tradition Meets Innovation",
        excerpt:
          "Discover how Marusaka Koi Farm maintains traditional breeding methods while embracing modern techniques...",
        link: "/blogs/marusaka-farm",
      },
    ],
    contactInfo: {
      phone: "123-456-7890",
      email: "contact@example.com",
      address: "123 Street Name, City, Country",
      social: {
        facebook: "#",
        instagram: "#",
        twitter: "#",
      },
    },
    quickContact: {
      onSubmit: (e) => {
        e.preventDefault();
        console.log("Form submitted");
      },
    },
  };

  return (
    <div className="blog-sakai-farm">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog-page">{t("blog")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Sakai Fish Farm: Legacy of Excellence in Koi Breeding
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Sakai Fish Farm: Legacy of Excellence in Koi Breeding</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Quang Vinh</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 20/03/2024</span>
              </div>
            </div>

            <img
              src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_sakai.jpg?alt=media&token=e99dad21-90f8-40ba-9011-6501d4703c5f"
              alt="Sakai Fish Farm Overview"
            />

            <p className="introduction">
              Sakai Fish Farm, established in 1917, stands as one of Japan's
              most prestigious and historically significant koi breeding
              facilities. Located in Hiroshima Prefecture, this farm has been
              instrumental in shaping the modern koi industry and continues to
              set the standard for excellence in koi breeding.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#history">
                    1. History and Heritage of Sakai Fish Farm
                  </a>
                  <ul>
                    <li>
                      <a href="#founding">1.1 The Founding Years</a>
                    </li>
                    <li>
                      <a href="#development">1.2 Development and Growth</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#breeding-techniques">
                    2. Breeding Techniques and Innovation
                  </a>
                  <ul>
                    <li>
                      <a href="#selective-breeding">
                        2.1 Selective Breeding Program
                      </a>
                    </li>
                    <li>
                      <a href="#facilities">2.2 State-of-the-Art Facilities</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#achievements">
                    3. Notable Achievements and Recognition
                  </a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="history">1. History and Heritage of Sakai Fish Farm</h3>

              <div className="subsection">
                <h4 id="founding">1.1 The Founding Years</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FHistory_sakai.jpg?alt=media&token=f46ba8a5-d865-4c82-b037-a88d5be8bb41"
                  alt="Historical photo of Sakai Fish Farm"
                />
                <p>
                  The story of Sakai Fish Farm began in 1917 when Minoru Sakai
                  established the facility with a vision to create the world's
                  finest koi. His dedication to quality and innovation laid the
                  foundation for what would become one of Japan's most respected
                  koi breeding establishments.
                </p>
                <ul>
                  <li>Early focus on Kohaku variety development</li>
                  <li>
                    Implementation of traditional Japanese breeding techniques
                  </li>
                  <li>Establishment of strict quality control standards</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="development">1.2 Development and Growth</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FGrowth_sakai.jpg?alt=media&token=04f24505-2604-4738-a2a1-4a108e70c35e"
                  alt="Modern Sakai Fish Farm facilities"
                />
                <p>
                  Through the decades, Sakai Fish Farm has continuously evolved,
                  incorporating modern technology while maintaining traditional
                  breeding principles. The farm's commitment to excellence has
                  resulted in numerous breakthrough achievements in koi
                  development.
                </p>
              </div>
            </div>

            <div className="content-section">
              <h3 id="breeding-techniques">
                2. Breeding Techniques and Innovation
              </h3>

              <div className="subsection">
                <h4 id="selective-breeding">2.1 Selective Breeding Program</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fbreeding_sakai.jpg?alt=media&token=cd367c32-e36e-461a-9730-c98a57d86ea5"
                  alt="Selective breeding process at Sakai Farm"
                />
                <p>
                  Sakai Fish Farm's selective breeding program is renowned for
                  its precision and attention to detail. The farm employs a
                  sophisticated system of genetic tracking and careful parent
                  selection to produce koi of exceptional quality.
                </p>
                <ul>
                  <li>Advanced genetic mapping techniques</li>
                  <li>Careful documentation of bloodlines</li>
                  <li>Strict selection criteria for breeding pairs</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="facilities">2.2 State-of-the-Art Facilities</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Ffacilities_sakai.jpg?alt=media&token=f3228ddb-26a3-471f-8445-b38c8823b6f9"
                  alt="Modern facilities at Sakai Farm"
                />
                <p>
                  The farm's facilities represent the perfect blend of
                  traditional wisdom and modern technology. Each pond is
                  carefully designed to provide optimal conditions for koi
                  development.
                </p>
              </div>
            </div>

            <div className="content-section">
              <h3 id="achievements">3. Notable Achievements and Recognition</h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fsakai_achievement.jpg?alt=media&token=6175859c-acdf-43d3-8b01-f5b7eaab14b7"
                alt="Awards and recognition"
              />
              <p>
                Throughout its history, Sakai Fish Farm has achieved numerous
                milestones and received multiple awards for their contributions
                to koi breeding:
              </p>
              <ul>
                <li>
                  Multiple Grand Champion awards at the All Japan Koi Show
                </li>
                <li>Development of several new koi varieties</li>
                <li>
                  Recognition for conservation efforts and sustainable breeding
                  practices
                </li>
              </ul>
            </div>

            <CompanyInfo />
          </div>

          <BlogSidebar {...sidebarData} />
        </div>
      </div>
    </div>
  );
};

export default SakaiFarm;
