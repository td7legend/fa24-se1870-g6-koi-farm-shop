import { Outlet, useLocation } from "react-router-dom";
import Header from "../../header";
import Footer from "../../footer";
import { useEffect } from "react";

function Layout() {
  const { pathname } = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu khi pathname thay đổi
  }, [pathname]); // Chạy effect khi pathname thay đổi

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
