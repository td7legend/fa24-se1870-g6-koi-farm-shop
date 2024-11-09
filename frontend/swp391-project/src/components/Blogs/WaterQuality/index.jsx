import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";

const WaterQuality = () => {
  const sidebarData = {
    relatedNews: [
      {
        id: 1,
        image:
          "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FSpringCare.jpg?alt=media&token=b0deaed1-bc5f-4b0e-a499-f300b2a8f327",
        title: "Seasonal Koi Care: Year-Round Maintenance Guide",
        excerpt:
          "A comprehensive guide to caring for your koi throughout all seasons...",
        link: "/blogs/seasonal-care",
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
          "data:image/jpeg;base64,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",
        title: "Essential Pond Maintenance Tips",
        excerpt:
          "Keep your koi pond in perfect condition with these maintenance tips...",
        link: "/blogs/pond-maintenance",
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
    <div className="blog-water-quality">
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Essential Water Quality Parameters for Koi Ponds</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Trùm Mafia - Quang Khoa</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 19/03/2024</span>
              </div>
            </div>

            <img
              src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fwater-testing.jpg?alt=media&token=fe5d096a-fce0-4ed9-84ba-3a09ca188a18"
              alt="Testing Koi Pond Water Quality"
              className="featured-image"
            />

            <p className="introduction">
              Maintaining proper water quality is crucial for the health and
              vitality of your koi fish. Understanding and monitoring essential
              water parameters can mean the difference between thriving koi and
              stressed, unhealthy fish. This comprehensive guide will help you
              master the fundamentals of koi pond water quality management.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#key-parameters">1. Key Water Quality Parameters</a>
                  <ul>
                    <li>
                      <a href="#ph-levels">1.1 pH Levels</a>
                    </li>
                    <li>
                      <a href="#ammonia">1.2 Ammonia</a>
                    </li>
                    <li>
                      <a href="#nitrites">1.3 Nitrites and Nitrates</a>
                    </li>
                    <li>
                      <a href="#kh-gh">1.4 KH and GH</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#testing">2. Water Testing Methods</a>
                  <ul>
                    <li>
                      <a href="#test-kits">2.1 Types of Test Kits</a>
                    </li>
                    <li>
                      <a href="#frequency">2.2 Testing Frequency</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#maintenance">3. Maintenance Practices</a>
                  <ul>
                    <li>
                      <a href="#filtration">3.1 Filtration Systems</a>
                    </li>
                    <li>
                      <a href="#water-changes">3.2 Water Changes</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#problems">4. Common Problems and Solutions</a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="key-parameters">1. Key Water Quality Parameters</h3>

              <div className="subsection">
                <h4 id="ph-levels">1.1 pH Levels</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fph-testing.jpg?alt=media&token=0045dd2b-f8eb-4106-8634-2d7913144c35"
                  alt="pH Testing in Koi Pond"
                  className="section-image"
                />
                <div className="parameter-box">
                  <div className="optimal-range">
                    <span className="label">Optimal Range:</span>
                    <span className="value">7.0 - 8.4</span>
                  </div>
                  <p>
                    The pH level is crucial for koi health and affects many
                    biological processes. Maintaining stable pH is often more
                    important than achieving a perfect number.
                  </p>
                </div>
                <ul className="effects-list">
                  <li>
                    <strong>Too Low (Acidic):</strong> Stress, damaged gills,
                    reduced immune system
                  </li>
                  <li>
                    <strong>Too High (Alkaline):</strong> Ammonia toxicity,
                    reduced growth, skin irritation
                  </li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="ammonia">1.2 Ammonia</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fammonia-testing.jpg?alt=media&token=98bdd7ea-5970-4234-a4af-2edad0bb1ee2"
                  alt="Ammonia Testing"
                  className="section-image"
                />
                <div className="parameter-box danger">
                  <div className="optimal-range">
                    <span className="label">Target Level:</span>
                    <span className="value">0 ppm</span>
                  </div>
                  <p>
                    Ammonia is highly toxic to koi and should always be
                    maintained at 0 ppm. Even small amounts can cause serious
                    health issues.
                  </p>
                </div>
                <div className="warning-box">
                  <h5>Warning Signs of Ammonia Problems:</h5>
                  <ul>
                    <li>Fish gasping at the surface</li>
                    <li>Red or inflamed gills</li>
                    <li>Lethargy and loss of appetite</li>
                    <li>Staying near water returns or air stones</li>
                  </ul>
                </div>
              </div>

              <div className="subsection">
                <h4 id="nitrites">1.3 Nitrites and Nitrates</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fnitrate-testing.jpg?alt=media&token=96507fd6-1608-4e4b-820d-b2f0512822f9"
                  alt="Nitrate Testing"
                  className="section-image"
                />
                <div className="parameter-box">
                  <div className="optimal-range">
                    <span className="label">Nitrite Target:</span>
                    <span className="value">0 ppm</span>
                  </div>
                  <div className="optimal-range">
                    <span className="label">Nitrate Safe Range:</span>
                    <span className="value">&lt; 40 ppm</span>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h4 id="kh-gh">1.4 KH and GH</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fhardness-testing.jpg?alt=media&token=dd3dc0b8-dbc7-48b0-8ec5-cbdf80c3039b"
                  alt="Water Hardness Testing"
                  className="section-image"
                />
                <div className="parameter-box">
                  <div className="optimal-range">
                    <span className="label">KH (Carbonate Hardness):</span>
                    <span className="value">125-150 ppm</span>
                  </div>
                  <div className="optimal-range">
                    <span className="label">GH (General Hardness):</span>
                    <span className="value">150-300 ppm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="testing">2. Water Testing Methods</h3>

              <div className="subsection">
                <h4 id="test-kits">2.1 Types of Test Kits</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Ftest-kits-comparison.jpg?alt=media&token=0d92255a-23d6-45c7-905e-3862210b013e"
                  alt="Different Types of Water Test Kits"
                  className="section-image"
                />
                <div className="testing-methods-grid">
                  <div className="test-kit-box">
                    <h5>Liquid Test Kits</h5>
                    <ul>
                      <li>Most accurate results</li>
                      <li>Cost-effective long term</li>
                      <li>Requires careful measurement</li>
                      <li>Multiple parameters per kit</li>
                    </ul>
                  </div>
                  <div className="test-kit-box">
                    <h5>Test Strips</h5>
                    <ul>
                      <li>Quick and convenient</li>
                      <li>Less accurate than liquid tests</li>
                      <li>Good for daily monitoring</li>
                      <li>Multiple parameters per strip</li>
                    </ul>
                  </div>
                  <div className="test-kit-box">
                    <h5>Digital Meters</h5>
                    <ul>
                      <li>Instant readings</li>
                      <li>Higher initial cost</li>
                      <li>Requires calibration</li>
                      <li>Specific to one parameter</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h4 id="frequency">2.2 Testing Frequency</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Ftesting-schedule.jpg?alt=media&token=84cc2c90-ffa8-46b1-b9e7-54f6d9249fbc"
                  alt="Water Testing Schedule"
                  className="section-image"
                />
                <div className="schedule-box">
                  <h5>Recommended Testing Schedule</h5>
                  <table>
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Frequency</th>
                        <th>Critical Times</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>pH</td>
                        <td>2-3 times per week</td>
                        <td>After rain, medication</td>
                      </tr>
                      <tr>
                        <td>Ammonia</td>
                        <td>2 times per week</td>
                        <td>After feeding changes, new fish</td>
                      </tr>
                      <tr>
                        <td>Nitrites</td>
                        <td>Weekly</td>
                        <td>During cycling, high bioload</td>
                      </tr>
                      <tr>
                        <td>KH/GH</td>
                        <td>Monthly</td>
                        <td>Season changes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="maintenance">3. Maintenance Practices</h3>

              <div className="subsection">
                <h4 id="filtration">3.1 Filtration Systems</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Ffiltration-system.jpg?alt=media&token=e3c7d802-e404-45c3-bfe1-49a954e91ef8"
                  alt="Koi Pond Filtration System"
                  className="section-image"
                />
                <div className="filtration-grid">
                  <div className="filter-type">
                    <h5>Mechanical Filtration</h5>
                    <p>Removes physical debris and particles</p>
                    <ul>
                      <li>Screen/Net filters</li>
                      <li>Foam filters</li>
                      <li>Vortex chambers</li>
                    </ul>
                  </div>
                  <div className="filter-type">
                    <h5>Biological Filtration</h5>
                    <p>Processes harmful compounds</p>
                    <ul>
                      <li>Moving bed filters</li>
                      <li>Static bed media</li>
                      <li>Trickle towers</li>
                    </ul>
                  </div>
                  <div className="filter-type">
                    <h5>Chemical Filtration</h5>
                    <p>Removes dissolved pollutants</p>
                    <ul>
                      <li>Activated carbon</li>
                      <li>Zeolite</li>
                      <li>Phosphate removers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="subsection">
                <h4 id="water-changes">3.2 Water Changes</h4>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FWater%20Changes.jpg?alt=media&token=486c4b47-bfd0-4f32-8139-537c84ce81c4"
                  alt="Performing Water Change"
                  className="section-image"
                />
                <div className="water-change-guide">
                  <h5>Water Change Protocol</h5>
                  <div className="protocol-steps">
                    <div className="step">
                      <span className="step-number">1</span>
                      <p>Test water parameters before change</p>
                    </div>
                    <div className="step">
                      <span className="step-number">2</span>
                      <p>Remove 10-15% water weekly</p>
                    </div>
                    <div className="step">
                      <span className="step-number">3</span>
                      <p>Treat new water with conditioner</p>
                    </div>
                    <div className="step">
                      <span className="step-number">4</span>
                      <p>Match temperature within 2°C</p>
                    </div>
                    <div className="step">
                      <span className="step-number">5</span>
                      <p>Add slowly to avoid stress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3 id="problems">4. Common Problems and Solutions</h3>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fwater-problems.jpg?alt=media&token=2914bc5e-a089-438a-80ab-61a09a68d5e5"
                alt="Common Water Quality Problems"
                className="section-image"
              />
              <div className="problems-grid">
                <div className="problem-box">
                  <h5>Green Water</h5>
                  <p>Algae bloom due to excess nutrients</p>
                  <div className="solution">
                    <strong>Solutions:</strong>
                    <ul>
                      <li>UV sterilizer installation</li>
                      <li>Reduce feeding</li>
                      <li>Add more plants</li>
                      <li>Regular water changes</li>
                    </ul>
                  </div>
                </div>
                <div className="problem-box">
                  <h5>pH Crashes</h5>
                  <p>Sudden drop in pH levels</p>
                  <div className="solution">
                    <strong>Solutions:</strong>
                    <ul>
                      <li>Add KH buffer</li>
                      <li>Check filtration</li>
                      <li>Partial water change</li>
                      <li>Monitor regularly</li>
                    </ul>
                  </div>
                </div>
                <div className="problem-box">
                  <h5>Ammonia Spikes</h5>
                  <p>Sudden increase in ammonia levels</p>
                  <div className="solution">
                    <strong>Solutions:</strong>
                    <ul>
                      <li>Immediate water change</li>
                      <li>Add beneficial bacteria</li>
                      <li>Reduce feeding</li>
                      <li>Check filter function</li>
                    </ul>
                  </div>
                </div>
                <div className="problem-box">
                  <h5>Low Oxygen</h5>
                  <p>Insufficient dissolved oxygen</p>
                  <div className="solution">
                    <strong>Solutions:</strong>
                    <ul>
                      <li>Add air stones</li>
                      <li>Increase surface agitation</li>
                      <li>Remove excess debris</li>
                      <li>Check water temperature</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3>Conclusion</h3>
              <div className="conclusion-box">
                <p>
                  Maintaining proper water quality is an ongoing process that
                  requires regular monitoring and adjustment. By understanding
                  these key parameters and following proper maintenance
                  procedures, you can create an optimal environment for your koi
                  to thrive.
                </p>
                <div className="key-points">
                  <h5>Remember:</h5>
                  <ul>
                    <li>Test water parameters regularly</li>
                    <li>Maintain consistent maintenance schedule</li>
                    <li>Address problems promptly</li>
                    <li>Keep detailed records</li>
                    <li>Prevention is better than cure</li>
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

export default WaterQuality;
