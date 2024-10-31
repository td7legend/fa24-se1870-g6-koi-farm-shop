import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { defaultSidebarData } from "../../../data/sidebarData";

const Blog2 = () => {
  const sidebarData = {
    ...defaultSidebarData,
    relatedNews: [
      {
        id: 1,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPG0ngAs00rjFOJy2VY6gg8urXii8KZkzHsQ&s",
        title: "Understanding Asagi Koi Patterns",
        excerpt:
          "Learn about the unique patterns and characteristics of Asagi Koi...",
        link: "#",
      },
      {
        id: 2,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSfQ-0Zx15HXLzgQIcclV5nrhhrbZsj_FGuA&s",
        title: "Asagi Koi Care Guide",
        excerpt: "Essential tips for maintaining healthy Asagi Koi fish...",
        link: "#",
      },
      {
        id: 3,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrT5YPdFcItoIEj-RvVs3i9PxEwsj0p59BmQ&s",
        title: "History of Asagi Koi Breeding",
        excerpt:
          "Discover the fascinating history of Asagi Koi breeding in Japan...",
        link: "#",
      },
    ],
  };

  return (
    <div className="blog2">
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Complete Guide to Asagi Koi: Characteristics and Care Tips</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Trùm Mafia - Quang Khoa</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 31/10/2024</span>
              </div>
            </div>

            <img
              src="https://sieuthicakoi.vn/storage/io/sl/ioslz0a75kxf2ixl09f0cbvpqrcz_danh-gia-ca-koi-asagi-chat-luong.webp"
              alt="Asagi Koi Fish"
            />

            <p className="introduction">
              Asagi Koi, known for their distinctive blue scales and red belly,
              are among the most traditional and respected varieties in the Koi
              world. This guide will help you understand their unique
              characteristics and how to properly care for them.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#part1">
                    1. Understanding Asagi Koi Characteristics
                  </a>
                  <ul>
                    <li>
                      <a href="#part1-1">1.1 Color Patterns and Scales</a>
                    </li>
                    <li>
                      <a href="#part1-2">1.2 Body Shape and Structure</a>
                    </li>
                    <li>
                      <a href="#part1-3">1.3 Quality Indicators</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#part2">
                    2. Essential Care Guidelines for Asagi Koi
                  </a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="part1">1. Understanding Asagi Koi Characteristics</h3>

              <div className="subsection">
                <h4 id="part1-1">1.1 Color Patterns and Scales</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/vm/lg/vmlg86zaemsy5omht2qkkizz8ra3_danh-gia-ca-koi-asagi-chat-luong-2.webp"
                  alt="Asagi Koi Color Patterns"
                />
                <p>
                  Asagi Koi are characterized by their distinctive blue scales
                  and red (hi) markings:
                </p>
                <ul>
                  <li>
                    The blue scales should be uniform and create a net-like
                    pattern
                  </li>
                  <li>
                    Red markings typically appear on the sides, cheeks, and
                    belly
                  </li>
                  <li>
                    The head should be light and free from strong markings
                  </li>
                  <li>Scale alignment is crucial for quality assessment</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="part1-2">1.2 Body Shape and Structure</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/wl/vi/wlvizxf8q4h0fjc5pg21dko138t0_danh-gia-ca-koi-asagi-chat-luong-3.webp"
                  alt="Asagi Koi Body Structure"
                />
                <p>The ideal body shape of an Asagi Koi includes:</p>
                <ul>
                  <li>A well-proportioned, torpedo-shaped body</li>
                  <li>Smooth transitions between body segments</li>
                  <li>Strong, broad shoulders</li>
                  <li>A balanced and graceful appearance</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="part1-3">1.3 Quality Indicators</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/4s/kq/4skq9v39efcepto5lj9sqt7wpufo_danh-gia-ca-koi-asagi-chat-luong-4.webp"
                  alt="Asagi Koi Quality Features"
                />
                <p>Key indicators of a high-quality Asagi Koi:</p>
                <ul>
                  <li>
                    Consistent blue scaling without breaks or irregularities
                  </li>
                  <li>Clean, symmetrical red patterns</li>
                  <li>Sharp color transitions</li>
                  <li>Good skin quality and luster</li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3 id="part2">2. Essential Care Guidelines for Asagi Koi</h3>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG51daXEoVaLF3gwdZ3RjZvp0dfpzwkw9Gxw&s"
                alt="Asagi Koi Care"
              />
              <p className="section-description">
                Proper care is essential for maintaining the beauty and health
                of Asagi Koi:
              </p>
              <ul className="important-notes">
                <li>
                  Maintain stable water parameters with regular testing and
                  filtration
                </li>
                <li>
                  Provide a balanced diet rich in color-enhancing ingredients
                </li>
                <li>
                  Ensure adequate pond depth and space for proper development
                </li>
                <li>Regular health monitoring and preventive care</li>
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

export default Blog2;
