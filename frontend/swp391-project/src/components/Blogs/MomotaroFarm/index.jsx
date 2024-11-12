import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";

const MomotaroFarm = () => {
  const sidebarData = {
    relatedNews: [
      {
        id: 1,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_sakai.jpg?alt=media&token=e99dad21-90f8-40ba-9011-6501d4703c5f",
        title: "Sakai Fish Farm: Legacy of Excellence in Koi Breeding",
        excerpt:
          "Discover the history and breeding techniques of one of Japan's most prestigious koi farms...",
        link: "/blogs/sakai-farm",
      },
      {
        id: 2,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_dainichi.jpg?alt=media&token=fe5b9ed0-8968-413c-9fa1-791c188da283",
        title: "Dainichi Koi Farm: Masters of Koi Development",
        excerpt:
          "Explore how Dainichi Koi Farm has revolutionized koi breeding...",
        link: "/blogs/dainichi-farm",
      },
      {
        id: 3,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FmodernBreeding.jpg?alt=media&token=bb8de8f4-6084-405a-a5de-d4e2107444d1",
        title: "Modern Koi Breeding Technologies",
        excerpt: "The latest innovations in koi breeding and development...",
        link: "/blogs/modern-breeding",
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
    <div className="blog-momotaro-farm">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog-page">{t("blog")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Momotaro Koi Farm: The Art of Modern Koi Breeding
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Momotaro Koi Farm: The Art of Modern Koi Breeding</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Thành Danh</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 15/03/2024</span>
              </div>
            </div>

            <img
              src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fmzqdtn3wjrljp5cvjw053ewu3m4p_Review_Momotaro_Koi_Farm_research_facilities.webp?alt=media&token=28db933b-28cf-4d53-ad61-12b2fd5aec0f"
              alt="Momotaro Koi Farm Overview"
              className="featured-image"
            />

            <p className="introduction">
              Momotaro Koi Farm, established in the heart of Niigata Prefecture,
              has revolutionized the koi industry through its innovative
              breeding techniques and commitment to excellence. Known for their
              exceptional Gosanke varieties and groundbreaking research in koi
              genetics, Momotaro continues to shape the future of koi breeding.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#innovation">1. Innovation in Koi Breeding</a>
                  <ul>
                    <li>
                      <a href="#technology">
                        1.1 Modern Technology Integration
                      </a>
                    </li>
                    <li>
                      <a href="#research">1.2 Genetic Research Program</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#varieties">2. Signature Varieties</a>
                  <ul>
                    <li>
                      <a href="#gosanke">2.1 The Momotaro Gosanke Line</a>
                    </li>
                    <li>
                      <a href="#unique">2.2 Unique Developments</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#facilities">3. State-of-the-Art Facilities</a>
                </li>
                <li>
                  <a href="#future">4. Vision for the Future</a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="innovation">1. Innovation in Koi Breeding</h3>

              <div className="subsection">
                <h4 id="technology">1.1 Modern Technology Integration</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fbchkd5g08w1d3yskyyyl4j7w46yo_Review_Momotaro_Koi_Farm_mModernTechnologyIntegration.webp?alt=media&token=cc81935f-36c0-4a29-8567-1d8bdde3392a"
                  alt="Momotaro's Advanced Technology"
                  className="section-image"
                />
                <p>
                  Momotaro Koi Farm leads the industry in technological
                  integration:
                </p>
                <ul>
                  <li>
                    Advanced water quality monitoring systems with real-time
                    data analysis
                  </li>
                  <li>
                    Automated feeding systems calibrated for optimal growth
                  </li>
                  <li>Climate-controlled indoor breeding facilities</li>
                  <li>
                    Digital tracking of genetic lineages and breeding outcomes
                  </li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="research">1.2 Genetic Research Program</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fmzqdtn3wjrljp5cvjw053ewu3m4p_Review_Momotaro_Koi_Farm_research_facilities.webp?alt=media&token=28db933b-28cf-4d53-ad61-12b2fd5aec0f"
                  alt="Genetic Research Facilities"
                  className="section-image"
                />
                <p>
                  The farm's genetic research program has achieved significant
                  breakthroughs:
                </p>
                <ul>
                  <li>
                    Identification of key genes responsible for color
                    development
                  </li>
                  <li>Development of new techniques for pattern prediction</li>
                  <li>
                    Creation of more resilient bloodlines through selective
                    breeding
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3 id="varieties">2. Signature Varieties</h3>

              <div className="subsection">
                <h4 id="gosanke">2.1 The Momotaro Gosanke Line</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fmomotaro_gosanke.jpg?alt=media&token=87c27266-5584-44c0-9e5d-02525fcc22c2"
                  alt="Momotaro Gosanke Varieties"
                  className="section-image"
                />
                <p>Momotaro's Gosanke varieties are renowned for their:</p>
                <ul>
                  <li>Exceptional pattern definition and balance</li>
                  <li>Superior color quality and stability</li>
                  <li>Strong body conformation and health characteristics</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="unique">2.2 Unique Developments</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fmomotaro_UniqueDevelepment.jpg?alt=media&token=70c21952-ea3a-442c-92c3-0aa0eebd0c81"
                  alt="Unique Momotaro Varieties"
                  className="section-image"
                />
                <p>Recent developments include:</p>
                <ul>
                  <li>New metallic variants with enhanced luster</li>
                  <li>Improved Shiro Utsuri with deeper black coloration</li>
                  <li>
                    Experimental crosses producing novel pattern combinations
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3 id="facilities">3. State-of-the-Art Facilities</h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fmomotoro_facilities.jpg?alt=media&token=97580fd5-e8bc-4cba-ad7b-c2efbc5abf34"
                alt="Momotaro's Modern Facilities"
                className="section-image"
              />
              <p>
                The farm's facilities represent the pinnacle of modern koi
                breeding:
              </p>
              <ul>
                <li>Indoor breeding houses with controlled environments</li>
                <li>Specialized quarantine and treatment areas</li>
                <li>Advanced filtration and water management systems</li>
                <li>Research laboratories for genetic studies</li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="future">4. Vision for the Future</h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FfutureVison_momotoro.jpg?alt=media&token=0594d08a-5bf4-4007-a78c-f33c4e203249"
                alt="Future of Momotaro Koi Farm"
                className="section-image"
              />
              <p>Momotaro Koi Farm's vision for the future includes:</p>
              <ul>
                <li>Expansion of genetic research capabilities</li>
                <li>Development of new sustainable breeding practices</li>
                <li>
                  International collaboration with leading research institutions
                </li>
                <li>Educational programs for next-generation koi breeders</li>
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

export default MomotaroFarm;
