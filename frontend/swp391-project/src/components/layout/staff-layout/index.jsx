import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../sidebar";
import "./index.scss";

function StaffLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="staff__layout">
      <Sidebar onHover={setIsSidebarOpen} />
      <div
        className="main__content"
        style={{
          marginLeft: isSidebarOpen ? "310px" : "80px",
          backgroundColor: isSidebarOpen ? "#fff7e6" : "#faf3e6", // Soft color change on hover
        }}
      >
        <div className="content-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StaffLayout;
