import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";

const KoiNutrition = () => {
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
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FseasonKoiCare.jpg?alt=media&token=348e2818-db81-4988-b234-f4c5aee6157e",
        title: "Seasonal Koi Care: Year-Round Maintenance Guide",
        excerpt:
          "A comprehensive guide to caring for your koi throughout all seasons...",
        link: "/blogs/seasonal-care",
      },
      {
        id: 3,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fsummer-feeding.jpg?alt=media&token=f31710bc-ed5e-4c25-854d-f20e50f6c191",
        title: "Health Monitoring for Koi Fish",
        excerpt: "Learn how to monitor and maintain your koi's health...",
        link: "/blogs/health-monitoring",
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
    <div className="blog-koi-nutrition">
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Koi Nutrition: Complete Feeding Guide</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Trùm Mafia - Quang Khoa</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 16/03/2024</span>
              </div>
            </div>

            <img
              src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FkoiFeeding_nutrition.jpg?alt=media&token=ed9a2f1a-2787-4d2e-876f-3650c7a7a077"
              alt="Koi Feeding Guide"
              className="featured-image"
            />

            <p className="introduction">
              Proper nutrition is fundamental to raising healthy, vibrant koi.
              Understanding the nutritional needs of your koi and implementing
              an appropriate feeding strategy is crucial for their growth, color
              development, and overall health. This comprehensive guide will
              help you master the art of koi nutrition.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#basics">1. Nutritional Basics</a>
                  <ul>
                    <li>
                      <a href="#nutrients">1.1 Essential Nutrients</a>
                    </li>
                    <li>
                      <a href="#types">1.2 Types of Koi Food</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#feeding">2. Feeding Practices</a>
                  <ul>
                    <li>
                      <a href="#schedule">2.1 Feeding Schedule</a>
                    </li>
                    <li>
                      <a href="#amounts">2.2 Proper Amounts</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#supplements">3. Supplements and Treats</a>
                </li>
                <li>
                  <a href="#mistakes">4. Common Feeding Mistakes</a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="basics">1. Nutritional Basics</h3>

              <div className="subsection">
                <h4 id="nutrients">1.1 Essential Nutrients</h4>
                <div className="nutrient-box">
                  <div className="nutrient-grid">
                    <div className="nutrient-item protein">
                      <h5>Protein</h5>
                      <span className="percentage">32-38%</span>
                      <p>Essential for growth and muscle development</p>
                    </div>
                    <div className="nutrient-item fats">
                      <h5>Fats</h5>
                      <span className="percentage">3-7%</span>
                      <p>Energy source and vitamin carrier</p>
                    </div>
                    <div className="nutrient-item carbs">
                      <h5>Carbohydrates</h5>
                      <span className="percentage">30-40%</span>
                      <p>Energy and digestive health</p>
                    </div>
                    <div className="nutrient-item vitamins">
                      <h5>Vitamins & Minerals</h5>
                      <span className="percentage">1-2%</span>
                      <p>Essential for overall health</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h4 id="types">1.2 Types of Koi Food</h4>
                <div className="food-types-container">
                  <div className="food-type">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FtypeofkoiFood.jpg?alt=media&token=2e46fd1e-64c1-4f4a-98c1-bb835a99716a"
                      alt="Staple Koi Food"
                    />
                    <h5>Staple Food</h5>
                    <ul>
                      <li>Daily nutrition</li>
                      <li>Balanced formula</li>
                      <li>Year-round use</li>
                    </ul>
                  </div>
                  <div className="food-type">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FGrowhKoiFoood.jpg?alt=media&token=10ba7003-e218-4795-bca5-dab45adf7fa9"
                      alt="Growth Food"
                    />
                    <h5>Growth Food</h5>
                    <ul>
                      <li>High protein content</li>
                      <li>Premium ingredients</li>
                      <li>Seasonal use</li>
                    </ul>
                  </div>
                  <div className="food-type">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FcolorKoiFood.jpg?alt=media&token=dbcefc0b-630e-417d-94a0-0f068fa1a581"
                      alt="Color Enhancement Food"
                    />
                    <h5>Color Food</h5>
                    <ul>
                      <li>Color enhancing</li>
                      <li>Spirulina enriched</li>
                      <li>Special occasions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="feeding">2. Feeding Practices</h3>

              <div className="subsection">
                <h4 id="schedule">2.1 Feeding Schedule</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Ffeeding-schedule.jpg?alt=media&token=ed5477b2-1caa-47a0-b44f-5ebdc4fa27bb"
                  alt="Koi Feeding Schedule"
                  className="section-image"
                />
                <div className="schedule-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Temperature</th>
                        <th>Frequency</th>
                        <th>Food Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Below 10°C</td>
                        <td>No feeding</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>10-15°C</td>
                        <td>1x daily</td>
                        <td>Wheat germ</td>
                      </tr>
                      <tr>
                        <td>15-20°C</td>
                        <td>2x daily</td>
                        <td>Staple food</td>
                      </tr>
                      <tr>
                        <td>20-25°C</td>
                        <td>3-4x daily</td>
                        <td>Growth/Color</td>
                      </tr>
                      <tr>
                        <td>Above 25°C</td>
                        <td>2-3x daily</td>
                        <td>Easy digest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="subsection">
                <h4 id="amounts">2.2 Proper Amounts</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Ffeeding-amounts.jpg?alt=media&token=d332018a-6479-4d43-958c-6d66d5bd075e"
                  alt="Proper Feeding Amounts"
                  className="section-image"
                />
                <div className="feeding-tips">
                  <div className="tip-card">
                    <h5>The 5-Minute Rule</h5>
                    <p>
                      Feed only what your koi can consume within 5 minutes.
                      Remove any uneaten food after this time.
                    </p>
                  </div>
                  <div className="tip-card">
                    <h5>Body Weight Calculation</h5>
                    <p>
                      Feed 1-2% of total koi body weight per day during peak
                      season.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="supplements">3. Supplements and Treats</h3>

              <div className="subsection">
                <h4 id="supplements-types">3.1 Types of Supplements</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fkoi-supplements.jpg?alt=media&token=5b2120ca-e35f-4fae-93a5-7465cae5e87e"
                  alt="Koi Supplements"
                  className="section-image"
                />
                <div className="supplements-grid">
                  <div className="supplement-item">
                    <h5>Immune Boosters</h5>
                    <ul>
                      <li>Vitamin C supplements</li>
                      <li>Beta-glucans</li>
                      <li>Garlic-based supplements</li>
                    </ul>
                  </div>
                  <div className="supplement-item">
                    <h5>Color Enhancers</h5>
                    <ul>
                      <li>Spirulina</li>
                      <li>Astaxanthin</li>
                      <li>Carotenoid supplements</li>
                    </ul>
                  </div>
                  <div className="supplement-item">
                    <h5>Health Boosters</h5>
                    <ul>
                      <li>Probiotics</li>
                      <li>Mineral supplements</li>
                      <li>Essential oils</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h4 id="treats">3.2 Natural Treats</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fkoi-treats.jpg?alt=media&token=3992c033-a59d-4be1-a40c-d089b258c9f4"
                  alt="Natural Koi Treats"
                  className="section-image"
                />
                <div className="treats-box">
                  <h5>Recommended Natural Treats</h5>
                  <div className="treats-grid">
                    <div className="treat-item">
                      <span className="treat-name">Silkworm Pupae</span>
                      <span className="frequency">1-2 times per week</span>
                    </div>
                    <div className="treat-item">
                      <span className="treat-name">Daphnia</span>
                      <span className="frequency">2-3 times per week</span>
                    </div>
                    <div className="treat-item">
                      <span className="treat-name">Orange Segments</span>
                      <span className="frequency">Once per week</span>
                    </div>
                    <div className="treat-item">
                      <span className="treat-name">Lettuce Leaves</span>
                      <span className="frequency">2-3 times per week</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="mistakes">4. Common Feeding Mistakes</h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FCommon%20Feeding%20Mistakes.jpg?alt=media&token=311d3857-9f9e-47b6-b40f-407ae7522f52"
                alt="Common Feeding Mistakes"
                className="section-image"
              />
              <div className="mistakes-container">
                <div className="mistake-box">
                  <h5>Overfeeding</h5>
                  <p>Can lead to poor water quality and health issues</p>
                  <div className="solution">
                    <strong>Solution:</strong> Follow the 5-minute rule and
                    measure portions
                  </div>
                </div>
                <div className="mistake-box">
                  <h5>Wrong Food Type</h5>
                  <p>
                    Using inappropriate food for the season or water temperature
                  </p>
                  <div className="solution">
                    <strong>Solution:</strong> Match food type to water
                    temperature and season
                  </div>
                </div>
                <div className="mistake-box">
                  <h5>Poor Storage</h5>
                  <p>Improper storage leading to nutrient degradation</p>
                  <div className="solution">
                    <strong>Solution:</strong> Store in cool, dry place and use
                    within expiration date
                  </div>
                </div>
                <div className="mistake-box">
                  <h5>Inconsistent Schedule</h5>
                  <p>Irregular feeding times causing stress</p>
                  <div className="solution">
                    <strong>Solution:</strong> Establish and maintain a
                    consistent feeding schedule
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="conclusion">5. Conclusion</h3>
              <div className="conclusion-box">
                <p>
                  Proper nutrition is key to raising healthy and beautiful koi.
                  By understanding their nutritional needs, following
                  appropriate feeding schedules, and avoiding common mistakes,
                  you can ensure your koi thrive and display their best colors.
                </p>
                <div className="key-points">
                  <h5>Key Points to Remember</h5>
                  <ul>
                    <li>Match food type to water temperature</li>
                    <li>Follow consistent feeding schedules</li>
                    <li>Use supplements appropriately</li>
                    <li>Monitor feeding behavior</li>
                    <li>Store food properly</li>
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

export default KoiNutrition;
