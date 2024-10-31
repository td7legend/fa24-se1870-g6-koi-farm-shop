import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Consignment from "./pages/consignment/consignment-page";
import ConsignmentCare from "./pages/consignment/consignment-care";
import ConsignmentSell from "./pages/consignment/consignment-sell";
import UserLayout from "./components/layout/user-layout";
import StaffLayout from "./components/layout/staff-layout";
import HomePage from "./pages/home";
import AllFishPage from "./pages/all-fish";
import BreedFishPage from "./pages/breed";
import ProductDetail from "./pages/product-detail";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import LoginSuccess from "./pages/Login/LoginSuccess";
import ErrorPage from "./components/error";
import Contact from "./pages/contact";
import AboutUs from "./pages/about-us";
import FAQsPage from "./pages/faqs";
import PolicyPage from "./pages/policy";
import ShoppingGuidePage from "./pages/shopping-guide";
import UserSetting from "./pages/user-page/user-setting";
import OrderDetailsPage from "./pages/user-page/order-detail";
import OrderHistoryPage from "./pages/user-page/order-history";
import UserDashboard from "./pages/user-page/user-dashboard";
import PaymentSuccess from "./pages/checkout/success";
import BatchFishFilter from "./components/BatchFishFilter";
import ConsignmentHistory from "./pages/user-page/consignment-history";
import StaffOrderManagement from "./pages/staff-page/manage-order";
import StaffFishManagement from "./pages/staff-page/manage-fish";
import StaffFishTypeManagement from "./pages/staff-page/manage-fishtype";
import LoyaltyPointHistory from "./pages/user-page/loyaltypoint-history";
import "react-toastify/dist/ReactToastify.css";
import ConsignmentManagement from "./pages/staff-page/manage-consignment";
import FishCareManagement from "./pages/staff-page/manage-consignment/manage-fishcare/manage-fishcare";
import AdminLayout from "./components/layout/admin-layout";
import StaffManagement from "./pages/admin-page/manage-staff";
import Blog1 from "./components/blogs/Blog1";
import Blog2 from "./components/blogs/Blog2";
import Blog3 from "./components/blogs/Blog3";
import BlogPage from "./pages/Blog-page";
// import AdminDashboard from "./pages/admin-page/admin-dashboard";

function App() {
  const { role } = useSelector((state) => state.auth);

  // Routes mặc định
  const defaultRoutePaths = useMemo(
    () => (
      <>
        <Route index element={<HomePage />} />
        <Route path="fish-page" element={<AllFishPage />} />
        <Route path="breed/:breedName" element={<BreedFishPage />} />
        <Route path="fish/:id" element={<ProductDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="faqs-page" element={<FAQsPage />} />
        <Route path="policy-page" element={<PolicyPage />} />
        <Route path="shopping-guide" element={<ShoppingGuidePage />} />
        <Route path="batch-filter" element={<BatchFishFilter />} />
        <Route path="/blog1" element={<Blog1 />} />
        <Route path="/blog2" element={<Blog2 />} />
        <Route path="/blog3" element={<Blog3 />} />
        <Route path="/blog-page" element={<BlogPage />} />
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
      <ToastContainer />
    </Router>
  );
}

export default App;
