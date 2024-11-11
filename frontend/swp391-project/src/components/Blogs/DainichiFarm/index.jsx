import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";

const DainichiFarm = () => {
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
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fglixq8w7k2zho2n28td0w6teatob_Review_Momotaro_Koi_Farm.webp?alt=media&token=fcd4d1ef-b64f-4557-89c7-43ad1f0517f1",
        title: "Momotaro Koi Farm: The Art of Modern Koi Breeding",
        excerpt:
          "Learn about the cutting-edge breeding methods at Momotaro Koi Farm...",
        link: "/blogs/momotaro-farm",
      },
      {
        id: 3,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fkoitenchque.jpg?alt=media&token=a21557bb-876a-498b-bf62-7d510ae1b2f1",
        title: "Innovation in Koi Breeding Techniques",
        excerpt:
          "Exploring the latest advancements in koi breeding technology...",
        link: "/blogs/innovation-koi",
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
    <div className="blog-dainichi-farm">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog-page">{t("blog")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Dainichi Koi Farm: Masters of Koi Development
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Dainichi Koi Farm: Masters of Koi Development</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Quang Khoa</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 18/03/2024</span>
              </div>
            </div>

            <img
              src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_dainichi.jpg?alt=media&token=fe5b9ed0-8968-413c-9fa1-791c188da283"
              alt="Dainichi Koi Farm Overview"
            />

            <p className="introduction">
              Dainichi Koi Farm, located in Niigata Prefecture, Japan, has
              earned its reputation as one of the world's premier koi breeding
              facilities. Known for their innovative breeding techniques and
              exceptional Showa and Sanke varieties, Dainichi has consistently
              pushed the boundaries of koi development for over half a century.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#specialization">
                    1. Dainichi's Specialization and Expertise
                  </a>
                  <ul>
                    <li>
                      <a href="#showa">1.1 The Famous Dainichi Showa</a>
                    </li>
                    <li>
                      <a href="#sanke">1.2 Excellence in Sanke Breeding</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#breeding-program">2. Advanced Breeding Program</a>
                  <ul>
                    <li>
                      <a href="#techniques">2.1 Unique Breeding Techniques</a>
                    </li>
                    <li>
                      <a href="#quality-control">
                        2.2 Quality Control Measures
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#global-impact">
                    3. Global Impact and Future Developments
                  </a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="specialization">
                1. Dainichi's Specialization and Expertise
              </h3>

              <div className="subsection">
                <h4 id="showa">1.1 The Famous Dainichi Showa</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fshowa_dainichi.jpg?alt=media&token=4f68243d-4fd5-4418-9ddc-3a6ee7fb06e2"
                  alt="Dainichi Showa Koi"
                />
                <p>
                  Dainichi Koi Farm is particularly renowned for their Showa
                  variety, which has set the standard for excellence in the koi
                  industry. Their Showa koi are characterized by:
                </p>
                <ul>
                  <li>
                    Deep, rich black (sumi) that develops early and maintains
                    its quality
                  </li>
                  <li>Precise pattern placement and balance between colors</li>
                  <li>
                    Strong, healthy body confirmation that supports optimal
                    pattern development
                  </li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="sanke">1.2 Excellence in Sanke Breeding</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fsanke_dainichi.jpg?alt=media&token=ac7e296f-35fb-471f-8f63-11d39ddf6c83"
                  alt="Dainichi Sanke Koi"
                />
                <p>
                  The farm's Sanke bloodline is equally impressive, featuring:
                </p>
                <ul>
                  <li>
                    Brilliant white (shiroji) that forms the perfect canvas
                  </li>
                  <li>
                    Vibrant red (hi) patterns that maintain their intensity
                  </li>
                  <li>
                    Well-placed black markings that complement the overall
                    design
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3 id="breeding-program">2. Advanced Breeding Program</h3>

              <div className="subsection">
                <h4 id="techniques">2.1 Unique Breeding Techniques</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FdanichiBreedingtenichal.jpg?alt=media&token=1a5dd516-2967-438b-b461-49d290895ad1"
                  alt="Dainichi breeding facilities"
                />
                <p>
                  Dainichi's success is built on their innovative breeding
                  techniques:
                </p>
                <ul>
                  <li>
                    Specialized mud ponds designed for optimal growth and color
                    development
                  </li>
                  <li>
                    Carefully controlled water parameters that promote healthy
                    development
                  </li>
                  <li>
                    Strategic parent selection based on multi-generational
                    tracking
                  </li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="quality-control">2.2 Quality Control Measures</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FqualityControl_dainichi.jpg?alt=media&token=fe17646c-f160-45f1-b86f-40a907f00dd8"
                  alt="Quality control process"
                />
                <p>
                  The farm maintains strict quality control standards throughout
                  the breeding process:
                </p>
                <ul>
                  <li>Regular health monitoring and documentation</li>
                  <li>Rigorous selection criteria for breeding stock</li>
                  <li>Comprehensive tracking system for genetic lineage</li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3 id="global-impact">
                3. Global Impact and Future Developments
              </h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fdainichi_futureVison.jpg?alt=media&token=f4ab165c-cdc3-4488-ab04-8255699e3702"
                alt="Dainichi's international presence"
              />
              <p>
                Dainichi Koi Farm continues to influence the global koi industry
                through:
              </p>
              <ul>
                <li>International partnerships with premier koi dealers</li>
                <li>Educational programs for aspiring koi breeders</li>
                <li>Research and development of new breeding techniques</li>
                <li>Commitment to sustainable breeding practices</li>
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

export default DainichiFarm;
