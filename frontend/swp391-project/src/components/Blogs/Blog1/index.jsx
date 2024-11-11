import React from "react";
import "./styles.scss";
import BlogSidebar from "../../common/BlogSidebar";
import CompanyInfo from "../../common/CompanyInfo";
import { Breadcrumb } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const Blog1 = () => {
  const navigate = useNavigate();
  // Khai báo sidebarData
  const sidebarData = {
    relatedNews: [
      {
        id: 1,
        image:
          "https://sieuthicakoi.vn/storage/io/sl/ioslz0a75kxf2ixl09f0cbvpqrcz_danh-gia-ca-koi-asagi-chat-luong.webp",
        title: "How to Care for Koi Fish in Winter",
        excerpt:
          "Essential tips for maintaining your koi pond during the cold winter months...",
        link: "#",
      },
      {
        id: 2,
        image:
          "https://sieuthicakoi.vn/storage/3v/xc/3vxc4xutz1nat7t6gkpcq388fazf_danh-gia-ca-koi-asagi-chat-luong-1.webp",
        title: "Best Foods for Koi Growth",
        excerpt:
          "Discover the optimal diet for healthy and vibrant koi fish...",
        link: "#",
      },
      {
        id: 3,
        image:
          "https://sieuthicakoi.vn/storage/vm/lg/vmlg86zaemsy5omht2qkkizz8ra3_danh-gia-ca-koi-asagi-chat-luong-2.webp",
        title: "Common Koi Diseases and Treatments",
        excerpt:
          "Learn to identify and treat common health issues in koi fish...",
        link: "#",
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
        // Xử lý form submit
        console.log("Form submitted");
      },
    },
  };

  return (
    <div className="blog1">
      <div className="breadcrumb-container">
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog-page">{t("blog")}</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-page">
            What Makes a Beautiful, Quality Doitsu Koi Fish?
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="blog-container">
        <div className="blog-flex-container">
          {/* Main Content */}
          <div className="blog-main-content">
            <h1>What Makes a Beautiful, Quality Doitsu Koi Fish?</h1>

            <div className="blog-author-info">
              <div className="author">
                <i className="fas fa-user"></i>
                <span>Author: Thành Danh</span>
              </div>
              <div className="date">
                <i className="fas fa-calendar-alt"></i>
                <span>Created date: 31/10/2024</span>
              </div>
            </div>

            <img
              src="https://sieuthicakoi.vn/storage/3l/5t/3l5tbbzposykbmji64iugx6pvtpr_danh-gia-ca-koi-doitsu-chat-luong.webp"
              alt="Doitsu Koi Fish"
            />

            <p className="introduction">
              Not everyone knows how to own quality Doitsu koi fish. This
              article will share tips to help you choose the most satisfying
              Doitsu Koi, adding elegance and class to your koi pond.
            </p>

            {/* Table of Contents */}
            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#part1">
                    1. Standards for evaluating quality and healthy Doitsu koi
                    fish
                  </a>
                  <ul>
                    <li>
                      <a href="#part1-1">
                        1.1 Evaluating quality Doitsu koi fish by shape
                      </a>
                    </li>
                    <li>
                      <a href="#part1-2">1.2 Judging by swimming form</a>
                    </li>
                    <li>
                      <a href="#part1-3">1.3 Judging by color</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#part2">
                    2. Things to note when choosing to buy beautiful, quality
                    Doitsu koi fish
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="content-section">
              <h3 id="part1">
                1. Standards for evaluating quality and healthy Doitsu koi fish
              </h3>

              <div className="subsection">
                <h4 id="part1-1">
                  1.1 Evaluating quality Doitsu koi fish by shape
                </h4>
                <img
                  src="https://sieuthicakoi.vn/storage/uk/70/uk70j1cb69fufzp6rd23mi1s20v6_danh-gia-ca-koi-doitsu-chat-luong-1.webp"
                  alt="How to evaluate the quality of a Doitsu Koi through its shape"
                />
                <p>
                  Japanese Doitsu Koi is known for its distinctive beauty and
                  unique shape with few or no scales. To evaluate a quality
                  Doitsu koi fish, breeders usually pay attention to these shape
                  characteristics:
                </p>
                <ul>
                  <li>
                    The shape of the Doitsu koi must have balance and harmony.
                  </li>
                  <li>
                    The fish body should be slim and long, creating a harmonious
                    and regular feeling from front to back.
                  </li>
                  <li>
                    The back of the Doitsu koi needs to be flat and wide,
                    creating a foundation for the development of rare large
                    scales.
                  </li>
                  <li>
                    The tail should be large and fully developed, with a flat
                    bottom and smoothly curved top.
                  </li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="part1-2">1.2 Judging by swimming form</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/8l/5a/8l5airdcmdr7jvy4bmws5xz3wmd8_danh-gia-ca-koi-doitsu-chat-luong-2.webp"
                  alt="Judging the quality of Doitsu Koi based on their swimming form"
                />
                <p>
                  The criteria for evaluating quality and healthy Doitsu koi
                  fish are also determined through their swimming style:
                </p>
                <ul>
                  <li>
                    Doitsu Koi's swimming form should show grace and power, with
                    a perfect balance between the body parts.
                  </li>
                  <li>
                    The fish should move flexibly and energetically in the
                    water, showing precision in every movement.
                  </li>
                  <li>
                    Doitsu Koi's swimming form should be even and smooth,
                    without unnecessary jerking or shaking.
                  </li>
                  <li>
                    In particular, the head should be raised slightly higher
                    than the body to create a harmonious balance.
                  </li>
                </ul>
              </div>

              <div className="subsection">
                <h4 id="part1-3">1.3 Judging by color</h4>
                <img
                  src="https://sieuthicakoi.vn/storage/5q/tm/5qtmy5xkni1cbt4aoliu3kejaemw_danh-gia-ca-koi-doitsu-chat-luong-3.webp"
                  alt="Colors of high quality Doitsu Koi"
                />
                <p>
                  Japanese Doitsu Koi is one of the koi lines admired for its
                  unique beauty, mainly based on its outstanding colors:
                </p>
                <ul>
                  <li>
                    The characteristic of beautiful Doitsu koi is that the back
                    has no coloration phenomenon, with transparent blue scales
                    from head to tail.
                  </li>
                  <li>
                    The distinct division of the body into two colors, with a
                    white head and back, is a special highlight of this fish.
                  </li>
                  <li>
                    The head and underside of Doitsu Koi are often orange-red,
                    red or orange-yellow in colour, creating a striking contrast
                    to the rest of the fish's body.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 2 - Updated */}
            <div className="content-section">
              <h3 id="part2">
                2. Things to note when choosing to buy beautiful, quality Doitsu
                koi fish
              </h3>
              <img
                src="https://sieuthicakoi.vn/storage/j9/7o/j97owd3pi28s3bfb2gptqng1x5u3_danh-gia-ca-koi-doitsu-chat-luong-4.webp"
                alt="Things to note when choosing Doitsu koi fish"
              />
              <p className="section-description">
                When choosing to buy Doitsu koi fish, one of the most popular
                koi fish because of its characteristic color patterns, you need
                to pay attention to the following important factors to be able
                to evaluate beautiful Doitsu koi fish:
              </p>
              <ul className="important-notes">
                <li>
                  Check the shape of the fish. The ideal Doitsu koi has a long,
                  slightly flattened and plump body, with a straight tail that
                  is not curved. The body should be blue with light blue or sky
                  blue markings that blend harmoniously with the dark blue on
                  the back.
                </li>
                <li>
                  In addition, you should pay attention to the quality of the
                  fish's color. The Doitsu's blue color should be clear, bright,
                  and free of signs of fading. The shape and color scheme of the
                  fish itself should also be harmonious and balanced, without
                  any unwanted dark spots or discoloration. In particular,
                  carefully check the belly and underside of the fish to ensure
                  there are no signs of disease or damage.
                </li>
              </ul>
            </div>

            {/* Company Info Section */}
            <CompanyInfo />
          </div>

          {/* Sidebar */}
          <BlogSidebar {...sidebarData} />
        </div>
      </div>
    </div>
  );
};

export default Blog1;
