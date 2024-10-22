import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../sidebar";

function StaffLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="staff__layout">
      <Sidebar />
      <div className="main__content">
        <Outlet />
      </div>
    </div>
  );
}

export default StaffLayout;
