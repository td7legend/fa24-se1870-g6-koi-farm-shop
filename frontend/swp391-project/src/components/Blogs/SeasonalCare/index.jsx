import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";

const SeasonalCare = () => {
  const sidebarData = {
    relatedNews: [
      {
        id: 1,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fwater-testing.jpg?alt=media&token=fe5d096a-fce0-4ed9-84ba-3a09ca188a18",
        title: "Essential Water Quality Parameters for Koi Ponds",
        excerpt:
          "Understanding and maintaining optimal water conditions for healthy koi...",
        link: "/blogs/water-quality",
      },
      {
        id: 2,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FkoiFeeding_nutrition.jpg?alt=media&token=ed9a2f1a-2787-4d2e-876f-3650c7a7a077",
        title: "Koi Nutrition: Complete Feeding Guide",
        excerpt:
          "Learn about proper koi nutrition and feeding schedules for optimal health...",
        link: "/blogs/koi-nutrition",
      },
      {
        id: 3,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_dainichi.jpg?alt=media&token=fe5b9ed0-8968-413c-9fa1-791c188da283",
        title: "Dainichi Koi Farm: Masters of Koi Development",
        excerpt:
          "Explore the breeding techniques of one of Japan's premier koi farms...",
        link: "/blogs/dainichi-farm",
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
    <div className="blog-seasonal-care">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog-page">{t("blog")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            Seasonal Koi Care: Year-Round Maintenance Guide
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Seasonal Koi Care: Year-Round Maintenance Guide</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Quang Duy</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 19/03/2024</span>
              </div>
            </div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FseasonKoiCare.jpg?alt=media&token=348e2818-db81-4988-b234-f4c5aee6157e"
              alt="Seasonal Koi Care"
              className="featured-image"
            />

            <p className="introduction">
              Proper koi care varies significantly with the changing seasons.
              Understanding and adapting to these seasonal requirements is
              crucial for maintaining healthy, vibrant koi throughout the year.
              This comprehensive guide will walk you through essential care
              practices for each season.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#spring">1. Spring Care (March - May)</a>
                  <ul>
                    <li>
                      <a href="#spring-awakening">1.1 Spring Awakening</a>
                    </li>
                    <li>
                      <a href="#spring-feeding">1.2 Spring Feeding Schedule</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#summer">2. Summer Care (June - August)</a>
                  <ul>
                    <li>
                      <a href="#summer-feeding">2.1 Summer Feeding Routine</a>
                    </li>
                    <li>
                      <a href="#temperature">2.2 Temperature Management</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#autumn">3. Autumn Care (September - November)</a>
                  <ul>
                    <li>
                      <a href="#autumn-prep">3.1 Winter Preparation</a>
                    </li>
                    <li>
                      <a href="#autumn-feeding">
                        3.2 Autumn Feeding Adjustments
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#winter">4. Winter Care (December - February)</a>
                  <ul>
                    <li>
                      <a href="#winter-protection">
                        4.1 Cold Weather Protection
                      </a>
                    </li>
                    <li>
                      <a href="#winter-maintenance">4.2 Winter Maintenance</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="spring">1. Spring Care (March - May)</h3>

              <div className="subsection">
                <h4 id="spring-awakening">1.1 Spring Awakening</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FSpringCare.jpg?alt=media&token=b0deaed1-bc5f-4b0e-a499-f300b2a8f327"
                  alt="Spring Koi Care"
                  className="section-image"
                />
                <div className="season-box spring">
                  <h5>Spring Checklist</h5>
                  <ul>
                    <li>Gradually increase water temperature</li>
                    <li>Check filtration system</li>
                    <li>Monitor water parameters closely</li>
                    <li>Begin light feeding as temperatures rise</li>
                    <li>Inspect koi for winter damage</li>
                  </ul>
                </div>
              </div>

              <div className="subsection">
                <h4 id="spring-feeding">1.2 Spring Feeding Schedule</h4>
                <div className="feeding-guide">
                  <div className="temperature-range">
                    <span>Temperature Range:</span>
                    <span className="temp">12°C - 18°C</span>
                  </div>
                  <ul>
                    <li>Start with wheat germ-based food</li>
                    <li>Feed once per day initially</li>
                    <li>Increase frequency as temperature rises</li>
                    <li>Monitor eating behavior closely</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="summer">2. Summer Care (June - August)</h3>

              <div className="subsection">
                <h4 id="summer-feeding">2.1 Summer Feeding Routine</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fsummer-feeding.jpg?alt=media&token=f31710bc-ed5e-4c25-854d-f20e50f6c191"
                  alt="Summer Feeding Routine"
                  className="section-image"
                />
                <div className="season-box summer">
                  <h5>Summer Feeding Tips</h5>
                  <div className="feeding-guide">
                    <div className="temperature-range">
                      <span>Optimal Temperature:</span>
                      <span className="temp">20°C - 26°C</span>
                    </div>
                    <ul>
                      <li>Feed 3-4 times daily</li>
                      <li>Use high-protein food</li>
                      <li>Monitor for overfeeding</li>
                      <li>Feed early morning and evening</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h4 id="temperature">2.2 Temperature Management</h4>
                <div className="management-tips">
                  <h5>Summer Management Protocol</h5>
                  <ul>
                    <li>Maintain adequate aeration</li>
                    <li>Monitor oxygen levels</li>
                    <li>Provide shade if necessary</li>
                    <li>Regular water testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="autumn">3. Autumn Care (September - November)</h3>

              <div className="subsection">
                <h4 id="autumn-prep">3.1 Winter Preparation</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fautumn-care.jpg?alt=media&token=348e2818-db81-4988-b234-f4c5aee6157e"
                  alt="Autumn Koi Care"
                  className="section-image"
                />
                <div className="season-box autumn">
                  <h5>Autumn Preparation Checklist</h5>
                  <ul>
                    <li>Clean pond thoroughly before winter</li>
                    <li>Check heating equipment</li>
                    <li>Remove fallen leaves regularly</li>
                    <li>Inspect winter protection systems</li>
                  </ul>
                </div>
              </div>

              <div className="subsection">
                <h4 id="autumn-feeding">3.2 Autumn Feeding Adjustments</h4>
                <div className="feeding-guide">
                  <div className="temperature-range">
                    <span>Temperature Range:</span>
                    <span className="temp">10°C - 15°C</span>
                  </div>
                  <ul>
                    <li>Switch to wheat germ-based food</li>
                    <li>Reduce feeding frequency</li>
                    <li>Stop feeding below 10°C</li>
                    <li>Monitor consumption rates</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="winter">4. Winter Care (December - February)</h3>

              <div className="subsection">
                <h4 id="winter-protection">4.1 Cold Weather Protection</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fwinter-care.jpg?alt=media&token=348e2818-db81-4988-b234-f4c5aee6157e"
                  alt="Winter Koi Protection"
                  className="section-image"
                />
                <div className="season-box winter">
                  <h5>Winter Protection Measures</h5>
                  <ul>
                    <li>Maintain minimum depth of 1.5m</li>
                    <li>Use pond heaters if necessary</li>
                    <li>Keep surface partially open</li>
                    <li>Protect from predators</li>
                  </ul>
                </div>
              </div>

              <div className="subsection">
                <h4 id="winter-maintenance">4.2 Winter Maintenance</h4>
                <div className="maintenance-tips">
                  <h5>Winter Maintenance Protocol</h5>
                  <ul>
                    <li>Monitor water temperature</li>
                    <li>Check ice thickness</li>
                    <li>Maintain minimal filtration</li>
                    <li>Remove snow from ice surface</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3>Conclusion</h3>
              <div className="conclusion-box">
                <p>
                  Successful koi keeping requires understanding and adapting to
                  seasonal changes. Each season presents unique challenges and
                  requirements that must be met to maintain healthy koi.
                  Remember that these guidelines are general recommendations and
                  may need to be adjusted based on your specific situation and
                  local climate conditions.
                </p>
                <div className="key-takeaways">
                  <h5>Key Takeaways</h5>
                  <ul>
                    <li>
                      Always monitor water temperature and adjust care
                      accordingly
                    </li>
                    <li>Prepare for seasonal transitions in advance</li>
                    <li>Maintain consistent maintenance routines</li>
                    <li>Pay special attention during critical periods</li>
                    <li>
                      Keep detailed records of seasonal changes and koi behavior
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <CompanyInfo />
          </div>
          <BlogSidebar {...sidebarData} />
        </div>
      </div>
    </div>
  );
};

export default SeasonalCare;
