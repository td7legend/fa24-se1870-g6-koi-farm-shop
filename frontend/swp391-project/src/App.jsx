import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
import { useEffect } from "react";
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
// import AdminDashboard from "./pages/admin-page/admin-dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/fish-page", element: <AllFishPage /> },
        { path: "/breed/:breedName", element: <BreedFishPage /> },
        { path: "/fish/:id", element: <ProductDetail /> },
        { path: "/breed/:id", element: <ProductDetail /> },
        { path: "/consignment", element: <Consignment /> },
        { path: "/consignment/care", element: <ConsignmentCare /> },
        { path: "/consignment/sell", element: <ConsignmentSell /> },
        { path: "/cart", element: <Cart /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/checkout/success", element: <PaymentSuccess /> },
        { path: "/user-setting/:id", element: <UserSetting /> },
        { path: "/user-dashboard/:id", element: <UserDashboard /> },
        { path: "/order-history", element: <OrderHistoryPage /> },
        { path: "/order-details", element: <OrderDetailsPage /> },
        { path: "/consignment-history", element: <ConsignmentHistory /> },
        { path: "/contact", element: <Contact /> },
        { path: "/about-us", element: <AboutUs /> },
        { path: "/faqs-page", element: <FAQsPage /> },
        { path: "/policy-page", element: <PolicyPage /> },
        { path: "/shopping-guide", element: <ShoppingGuidePage /> },
        { path: "/batch-fish", element: <BatchFishFilter /> },
        { path: "/loyaltypoint-history", element: <LoyaltyPointHistory /> },

        { path: "*", element: <ErrorPage /> },
      ],
    },
    {
      path: "/LoginSuccess/:token",
      element: <LoginSuccess />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/staff-dashboard",
      element: <StaffLayout />,
      children: [
        { path: "order-management", element: <StaffOrderManagement /> },
        { path: "fish-management", element: <StaffFishManagement /> },
        { path: "fishtype-management", element: <StaffFishTypeManagement /> },
        { path: "consignment-management", element: <ConsignmentManagement /> },
        { path: "fish-care-management", element: <FishCareManagement /> },
      ],
    },
    {
      path: "/admin-dashboard",
      element: <AdminLayout />,
      children: [
        // { path: "", element: <AdminDashboard /> },
        { path: "staff-management", element: <StaffManagement /> },
        { path: "fish-management", element: <StaffFishManagement /> },
        { path: "fishtype-management", element: <StaffFishTypeManagement /> },
        { path: "order-management", element: <StaffOrderManagement /> },
        { path: "consignment-management", element: <ConsignmentManagement /> },
      ],
    },
  ]);

  useEffect(() => {
    return () => window.removeEventListener("message", () => {});
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
