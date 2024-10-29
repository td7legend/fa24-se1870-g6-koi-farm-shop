import { Outlet, useLocation } from "react-router-dom";
import Header from "../../header";
import Footer from "../../footer";
import { useEffect } from "react";
// import BreadcrumbUser from "../../breadcrumb-user/index.scss";
import "../../breadcrumb-user/index.scss";
function Layout() {
  const { pathname } = useLocation(); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, [pathname]); 

  return (
    <div>
      <Header />
      {/* <BreadcrumbUser /> */}
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
