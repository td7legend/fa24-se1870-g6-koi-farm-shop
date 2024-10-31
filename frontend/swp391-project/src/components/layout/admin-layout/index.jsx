import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../../admin-sidebar";
import "./index.scss";

function AdminLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="admin__layout">
      <AdminSidebar onHover={setIsSidebarOpen} />
      <div
        className="main__content"
        style={{ marginLeft: isSidebarOpen ? "310px" : "80px" }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
