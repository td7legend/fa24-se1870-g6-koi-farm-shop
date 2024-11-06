import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Consignment from "./pages/consignment/consignment-page/index.jsx";
import UserLayout from "./components/layout/user-layout/index.jsx";
import StaffLayout from "./components/layout/staff-layout/index.jsx";
import HomePage from "./pages/home/index.jsx";
import AllFishPage from "./pages/all-fish/index.jsx";
import BreedFishPage from "./pages/breed/index.jsx";
import ProductDetail from "./pages/product-detail/index.jsx";
import Cart from "./pages/cart/index.jsx";
import Checkout from "./pages/checkout/index.jsx";
import Login from "./pages/Login/Login/index.jsx";
import ForgotPassword from "./pages/Login/ForgotPassword/index.jsx";
import LoginSuccess from "./pages/Login/LoginSuccess/index.jsx";
import ErrorPage from "./components/error/index.jsx";
import Contact from "./pages/contact/index.jsx";
import AboutUs from "./pages/about-us/index.jsx";
import FAQsPage from "./pages/faqs/index.jsx";
import PolicyPage from "./pages/policy/index.jsx";
import ShoppingGuidePage from "./pages/shopping-guide/index.jsx";
import UserSetting from "./pages/user-page/user-setting/index.jsx";
import OrderDetailsPage from "./pages/user-page/order-detail/index.jsx";
import OrderHistoryPage from "./pages/user-page/order-history/index.jsx";
import UserDashboard from "./pages/user-page/user-dashboard/index.jsx";
import PaymentSuccess from "./pages/checkout/success.jsx";
import BatchFishFilter from "./components/BatchFishFilter/index.jsx";
import ConsignmentHistory from "./pages/user-page/consignment-history/index.jsx";
import StaffOrderManagement from "./pages/staff-page/manage-order/index.jsx";
import StaffFishManagement from "./pages/staff-page/manage-fish/index.jsx";
import StaffFishTypeManagement from "./pages/staff-page/manage-fishtype/index.jsx";
import LoyaltyPointHistory from "./pages/user-page/loyaltypoint-history/index.jsx";
import "react-toastify/dist/ReactToastify.css";
import ConsignmentManagement from "./pages/staff-page/manage-consignment/index.jsx";
import FishCareManagement from "./pages/staff-page/manage-consignment/manage-fishcare/manage-fishcare.jsx";
import AdminLayout from "./components/layout/admin-layout/index.jsx";
import StaffManagement from "./pages/admin-page/manage-staff/index.jsx";
import Blog1 from "./components/Blogs/Blog1/index.jsx";
import Blog2 from "./components/Blogs/Blog2/index.jsx";
import Blog3 from "./components/Blogs/Blog3/index.jsx";
import BlogPage from "./pages/Blog-page/index.jsx";
import AdminDashboard from "./pages/admin-page/dashboard/dashboard.jsx";
import ConsignmentCare from "./pages/consignment/consignment-care/index.jsx";
import ConsignmentSell from "./pages/consignment/consignment-sell/index.jsx";
import ConsignmentFishFilter from "./components/consignmentFishFilter/index.jsx";

function App() {
  const { role } = useSelector((state) => state.auth);

  // Routes mặc định
  const defaultRoutePaths = useMemo(
    () => (
      <>
        <Route index element={<HomePage />} />
        <Route path="fish-page" element={<AllFishPage />} />
        <Route path="breed/:breedId" element={<BreedFishPage />} />
        <Route path="fish/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="faqs-page" element={<FAQsPage />} />
        <Route path="policy-page" element={<PolicyPage />} />
        <Route path="shopping-guide" element={<ShoppingGuidePage />} />
        <Route path="batch-filter" element={<BatchFishFilter />} />
        <Route path="consignment-filter" element={<ConsignmentFishFilter />} />
        <Route path="/blog1" element={<Blog1 />} />
        <Route path="/blog2" element={<Blog2 />} />
        <Route path="/blog3" element={<Blog3 />} />
        <Route path="/blog-page" element={<BlogPage />} />
        <Route path="consignment" element={<Consignment />} />
      </>
    ),
    []
  );

  // Routes của customer để tái sử dụng
  const customerRoutePaths = useMemo(
    () => (
      <>
        <Route path="consignment" element={<Consignment />} />
        <Route path="consignment/care" element={<ConsignmentCare />} />
        <Route path="consignment/sell" element={<ConsignmentSell />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/success" element={<PaymentSuccess />} />
        <Route path="user-setting/:id" element={<UserSetting />} />
        <Route path="user-dashboard/:id" element={<UserDashboard />} />
        <Route path="order-history" element={<OrderHistoryPage />} />
        <Route path="order-details" element={<OrderDetailsPage />} />
        <Route path="consignment-history" element={<ConsignmentHistory />} />
        <Route path="loyaltypoint-history" element={<LoyaltyPointHistory />} />
      </>
    ),
    []
  );

  // Routes cho Staff
  const staffRoutes = useMemo(
    () => (
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {defaultRoutePaths}
          {customerRoutePaths}
        </Route>

        <Route path="/staff-dashboard" element={<StaffLayout />}>
          <Route path="order-management" element={<StaffOrderManagement />} />
          <Route path="fish-management" element={<StaffFishManagement />} />
          <Route
            path="fishtype-management"
            element={<StaffFishTypeManagement />}
          />
          <Route
            path="consignment-management"
            element={<ConsignmentManagement />}
          />
          <Route path="fish-care-management" element={<FishCareManagement />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/LoginSuccess/:token" element={<LoginSuccess />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    ),
    [defaultRoutePaths, customerRoutePaths]
  );

  // Routes cho Manager
  const managerRoutes = useMemo(
    () => (
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {defaultRoutePaths}
          {customerRoutePaths}
        </Route>

        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="fish-management" element={<StaffFishManagement />} />
          <Route
            path="fishtype-management"
            element={<StaffFishTypeManagement />}
          />
          <Route path="order-management" element={<StaffOrderManagement />} />
          <Route
            path="consignment-management"
            element={<ConsignmentManagement />}
          />
          <Route path="fishcare-management" element={<FishCareManagement />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/LoginSuccess/:token" element={<LoginSuccess />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    ),
    [defaultRoutePaths, customerRoutePaths]
  );

  // Routes cho Customer
  const customerRoutes = useMemo(
    () => (
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {defaultRoutePaths}
          {customerRoutePaths}
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/LoginSuccess/:token" element={<LoginSuccess />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    ),
    [defaultRoutePaths, customerRoutePaths]
  );

  // Routes mặc định (chưa đăng nhập)
  const defaultRoutes = useMemo(
    () => (
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {defaultRoutePaths}
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/LoginSuccess/:token" element={<LoginSuccess />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    ),
    [defaultRoutePaths]
  );

  return (
    <Router>
      {role === "Staff"
        ? staffRoutes
        : role === "Manager"
        ? managerRoutes
        : role === "Customer"
        ? customerRoutes
        : defaultRoutes}
      <ToastContainer style={{ zIndex: "99999" }} />
    </Router>
  );
}

export default App;
