import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { defaultSidebarData } from "../../../data/sidebarData";

const Blog3 = () => {
  const sidebarData = {
    ...defaultSidebarData,
    relatedNews: [
      {
        id: 1,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRSQb7ZWwnBvNgqxspixrIR33xrld0BVT19Q&s",
        title: "Karashi Koi Color Development",
        excerpt: "Understanding how Karashi Koi develop their unique colors...",
        link: "#",
      },
      {
        id: 2,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzu8zc9hwmb4j0PLrSZ7hFoYiFmpHoqQX3w&s",
        title: "Feeding Tips for Karashi Koi",
        excerpt: "Best practices for feeding and maintaining Karashi Koi...",
        link: "#",
      },
      {
        id: 3,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0EaISPIg-CSlHqeuGUytPQgKzuLfawH6E2Q&s",
        title: "Karashi Koi Breeding Guide",
        excerpt: "Expert tips for breeding healthy Karashi Koi...",
        link: "#",
      },
    ],
  };

  return (
    <div className="blog3">
      <div className="blog-container">
        <div className="blog-flex-container">
          <div className="blog-main-content">
            <h1>Karashi Koi: The Golden Beauty of Japanese Koi</h1>

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
              src="https://sieuthicakoi.vn/storage/ia/hv/iahv995o127ouyvnkamup8th5n6b_danh-gia-ca-koi-karashi-chat-luong.webp"
              alt="Karashi Koi Fish"
            />

            <p className="introduction">
              Karashi Koi, with their stunning golden-yellow coloration,
              represent one of the most beautiful varieties in the Koi world.
              Learn about their unique characteristics and how to ensure they
              thrive in your pond.
            </p>

            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#part1">
                    1. Karashi Koi Characteristics and Varieties
                  </a>
                  <ul>
                    <li>
                      <a href="#part1-1">1.1 Color Development</a>
                    </li>
                    <li>
                      <a href="#part1-2">1.2 Physical Features</a>
                    </li>
                    <li>
                      <a href="#part1-3">1.3 Quality Standards</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#part2">2. Specialized Care for Karashi Koi</a>
                </li>
              </ul>
            </div>

            <div className="content-section">
              <h3 id="part1">1. Karashi Koi Characteristics and Varieties</h3>

              <div className="subsection">
                <h4 id="part1-1">1.1 Color Development</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/s1/p1/s1p1e3n8ijz3iga93ugg7lpdupj1_danh-gia-ca-koi-karashi-chat-luong-1.webp"
                  alt="Karashi Koi Color Development"
                />
                <p>Understanding Karashi Koi color development:</p>
                <ul>
                  <li>
                    Natural golden-yellow base color that develops with age
                  </li>
                  <li>
                    Color intensity varies with genetics and environmental
                    factors
                  </li>
                  <li>High-quality specimens show deep, rich golden hues</li>
                  <li>Color should be uniform without patches or blemishes</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="part1-2">1.2 Physical Features</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/32/sv/32svggup7hpcleiqgs0p71buxphr_danh-gia-ca-koi-karashi-chat-luong-2.webp"
                  alt="Karashi Koi Physical Features"
                />
                <p>Key physical characteristics of Karashi Koi:</p>
                <ul>
                  <li>Strong, well-proportioned body structure</li>
                  <li>Clean, well-defined scales with good luster</li>
                  <li>Symmetrical body shape with good fin development</li>
                  <li>Head shape should be proportional to body size</li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="part1-3">1.3 Quality Standards</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/5a/zh/5azh7q4pnfwdvbsmbc8ajvj7oe0l_danh-gia-ca-koi-karashi-chat-luong-3.webp"
                  alt="Karashi Koi Quality Standards"
                />
                <p>Quality indicators for Karashi Koi:</p>
                <ul>
                  <li>Even, consistent coloration throughout the body</li>
                  <li>Healthy, vibrant appearance with good skin quality</li>
                  <li>Active swimming behavior and good appetite</li>
                  <li>No visible deformities or health issues</li>
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3 id="part2">2. Specialized Care for Karashi Koi</h3>
              <img
                src="https://sieuthicakoi.vn/storage/nw/v0/nwv0pz1zcimq87b50dx66rvc354f_danh-gia-ca-koi-karashi-chat-luong-4.webp"
                alt="Karashi Koi Care"
              />
              <p className="section-description">
                To maintain the health and beauty of Karashi Koi, consider these
                essential care guidelines:
              </p>
              <ul className="important-notes">
                <li>
                  Feed a high-quality diet rich in carotenoids to enhance and
                  maintain their golden color. Include color-enhancing foods
                  like spirulina and krill in their regular feeding schedule.
                </li>
                <li>
                  Maintain optimal water conditions with regular testing and
                  filtration. Karashi Koi are sensitive to water quality, so
                  maintain proper pH levels (7.0-8.0) and keep ammonia and
                  nitrite at zero.
                </li>
                <li>
                  Provide adequate shade in the pond as excessive sun exposure
                  can fade their beautiful golden coloration. Use floating
                  plants or shade structures to create protected areas.
                </li>
                <li>
                  Implement a regular health monitoring routine, checking for
                  any signs of stress, disease, or color changes. Early
                  detection of problems leads to more successful treatments.
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

export default Blog3;
