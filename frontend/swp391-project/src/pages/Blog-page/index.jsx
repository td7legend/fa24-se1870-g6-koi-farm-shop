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
      link: "/blogs/doitsu-koi",
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
        <div className="coming-soon">
          <h2>Nội dung đang được cập nhật...</h2>
          <p>
            Vui lòng quay lại sau để xem những đánh giá chi tiết về các trang
            trại cá Koi Nhật Bản.
          </p>
        </div>
      ),
    },
    {
      key: "3",
      label: "Knowledges Care for Fish Koi",
      children: (
        <div className="coming-soon">
          <h2>Nội dung đang được cập nhật...</h2>
          <p>
            Chúng tôi sẽ sớm chia sẻ những kiến thức chăm sóc cá Koi chi tiết.
          </p>
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
