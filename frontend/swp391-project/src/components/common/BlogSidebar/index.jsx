import React from "react";
import "./styles.scss";

const BlogSidebar = ({ relatedNews, contactInfo, quickContact }) => {
  return (
    <div className="blog-sidebar">
      {/* Related News */}
      <div className="sidebar-box related-news">
        <h3>Related News</h3>
        {relatedNews.map((news) => (
          <div key={news.id} className="news-item">
            <img src={news.image} alt={news.title} />
            <h4>
              <a href={news.link}>{news.title}</a>
            </h4>
            <p>{news.excerpt}</p>
          </div>
        ))}
        <div className="view-all">
          <a href="#">View All News →</a>
        </div>
      </div>

      {/* Contact Info */}
      <div className="sidebar-box contact-info">
        <h3>Contact Information</h3>
        <div className="info-item">
          <div className="label">Phone:</div>
          <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
        </div>
        <div className="info-item">
          <div className="label">Email:</div>
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
        </div>
        <div className="info-item">
          <div className="label">Address:</div>
          <p>{contactInfo.address}</p>
        </div>
        <div className="social-media">
          <div className="label">Follow Us:</div>
          <div className="social-links">
            {Object.entries(contactInfo.social).map(([platform, link]) => (
              <a key={platform} href={link}>
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Contact Form */}
      <div className="sidebar-box quick-contact">
        <h3>Quick Contact</h3>
        <form onSubmit={quickContact.onSubmit}>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default BlogSidebar;
