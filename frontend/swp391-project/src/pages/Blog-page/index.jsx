import React, { useState } from "react";
import { Tabs, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const BlogPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3; // Số blog hiển thị trên mỗi trang

  const koiBreedBlogs = [
    {
      id: 1,
      title: "What Makes a Beautiful, Quality Doitsu Koi Fish?",
      image:
        "https://sieuthicakoi.vn/storage/3l/5t/3l5tbbzposykbmji64iugx6pvtpr_danh-gia-ca-koi-doitsu-chat-luong.webp",
      excerpt: "Not everyone knows how to own quality Doitsu koi fish...",
      date: "31/10/2024",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "8 min read",
      link: "/blog1",
    },
    {
      id: 2,
      title: "Complete Guide to Asagi Koi: Characteristics and Care Tips",
      image:
        "https://sieuthicakoi.vn/storage/io/sl/ioslz0a75kxf2ixl09f0cbvpqrcz_danh-gia-ca-koi-asagi-chat-luong.webp",
      excerpt:
        "Asagi Koi, known for their distinctive blue scales and red belly, are among the most traditional and respected varieties in the Koi world...",
      date: "2024-03-14",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "10 min read",
      link: "/blog2",
    },
    {
      id: 3,
      title: "Karashi Koi: The Golden Beauty of Japanese Koi",
      image:
        "https://sieuthicakoi.vn/storage/ia/hv/iahv995o127ouyvnkamup8th5n6b_danh-gia-ca-koi-karashi-chat-luong.webp",
      excerpt:
        "Karashi Koi, with their stunning golden-yellow coloration, represent one of the most beautiful varieties in the Koi world...",
      date: "2024-03-13",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "9 min read",
      link: "/blog3",
    },
  ];

  // Thêm vào mảng blogs cho tab Review Japanese Koi Farm
  const koiFarmBlogs = [
    {
      id: 1,
      title: "Sakai Fish Farm: Legacy of Excellence in Koi Breeding",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_sakai.jpg?alt=media&token=e99dad21-90f8-40ba-9011-6501d4703c5f",
      excerpt:
        "Discover the history and breeding techniques of one of Japan's most prestigious koi farms...",
      date: "2024-03-20",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "12 min read",
      link: "/blogs/sakai-farm",
    },
    {
      id: 2,
      title: "Dainichi Koi Farm: Masters of Koi Development",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fintro_dainichi.jpg?alt=media&token=fe5b9ed0-8968-413c-9fa1-791c188da283",
      excerpt:
        "Explore how Dainichi Koi Farm has revolutionized koi breeding with their innovative techniques...",
      date: "2024-03-18",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "10 min read",
      link: "/blogs/dainichi-farm",
    },
    {
      id: 3,
      title: "Momotaro Koi Farm: The Art of Modern Koi Breeding",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fglixq8w7k2zho2n28td0w6teatob_Review_Momotaro_Koi_Farm.webp?alt=media&token=fcd4d1ef-b64f-4557-89c7-43ad1f0517f1",
      excerpt:
        "Learn about the cutting-edge breeding methods at Momotaro Koi Farm...",
      date: "2024-03-15",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "11 min read",
      link: "/blogs/momotaro-farm",
    },
  ];

  // Thêm vào mảng blogs cho tab Knowledges Care for Fish Koi
  const koiCareBlogs = [
    {
      id: 1,
      title: "Essential Water Quality Parameters for Koi Ponds",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2Fwater-testing.jpg?alt=media&token=fe5d096a-fce0-4ed9-84ba-3a09ca188a18",
      excerpt:
        "Understanding and maintaining optimal water conditions for healthy koi...",
      date: "2024-03-19",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "9 min read",
      link: "/blogs/water-quality",
    },
    {
      id: 2,
      title: "Seasonal Koi Care: Year-Round Maintenance Guide",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FseasonKoiCare.jpg?alt=media&token=348e2818-db81-4988-b234-f4c5aee6157e",
      excerpt:
        "A comprehensive guide to caring for your koi throughout all seasons...",
      date: "2024-03-17",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "15 min read",
      link: "/blogs/seasonal-care",
    },
    {
      id: 3,
      title: "Koi Nutrition: Complete Feeding Guide",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koifarmmanagement.appspot.com/o/blog_image%2FkoiFeeding_nutrition.jpg?alt=media&token=ed9a2f1a-2787-4d2e-876f-3650c7a7a077",
      excerpt:
        "Learn about proper koi nutrition and feeding schedules for optimal health...",
      date: "2024-03-16",
      author: "Trùm Mafia - Quang Khoa",
      readTime: "13 min read",
      link: "/blogs/koi-nutrition",
    },
  ];

  // Tính toán blogs cho trang hiện tại
  const indexOfLastBlog = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - ITEMS_PER_PAGE;
  const currentBlogs = koiBreedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const items = [
    {
      key: "1",
      label: "Tìm hiểu về các giống cá Koi",
      children: (
        <div className="blog-list">
          {currentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="blog-card"
              onClick={() => navigate(blog.link)}
            >
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="blog-meta">
                  <span>
                    <i className="fas fa-user"></i> {blog.author}
                  </span>
                  <span>
                    <i className="fas fa-calendar-alt"></i> {blog.date}
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> {blog.readTime}
                  </span>
                </p>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <button className="read-more">Đọc thêm →</button>
              </div>
            </div>
          ))}
          {koiBreedBlogs.length > ITEMS_PER_PAGE && (
            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={koiBreedBlogs.length}
                pageSize={ITEMS_PER_PAGE}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false} // Ẩn option thay đổi số items/trang
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Review Japanese Koi Farm",
      children: (
        <div className="blog-list">
          {koiFarmBlogs.map((blog) => (
            <div
              key={blog.id}
              className="blog-card"
              onClick={() => navigate(blog.link)}
            >
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="blog-meta">
                  <span>
                    <i className="fas fa-user"></i> {blog.author}
                  </span>
                  <span>
                    <i className="fas fa-calendar-alt"></i> {blog.date}
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> {blog.readTime}
                  </span>
                </p>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <button className="read-more">Đọc thêm →</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: "Knowledges Care for Fish Koi",
      children: (
        <div className="blog-list">
          {koiCareBlogs.map((blog) => (
            <div
              key={blog.id}
              className="blog-card"
              onClick={() => navigate(blog.link)}
            >
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="blog-meta">
                  <span>
                    <i className="fas fa-user"></i> {blog.author}
                  </span>
                  <span>
                    <i className="fas fa-calendar-alt"></i> {blog.date}
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> {blog.readTime}
                  </span>
                </p>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <button className="read-more">Đọc thêm →</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1>Blog</h1>
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(key) => {
            setCurrentTab(key);
            setCurrentPage(1); // Reset về trang 1 khi chuyển tab
          }}
        />
      </div>
    </div>
  );
};

export default BlogPage;
