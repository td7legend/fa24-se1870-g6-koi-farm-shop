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

import StaffOrderManagement from "./pages/staff-page/manage-order";
import StaffFishManagement from "./pages/staff-page/manage-fish";
import StaffFishTypeManagement from "./pages/staff-page/manage-fishtype";
import ConsignmentView from "./pages/user-page/consignment-history";

import "react-toastify/dist/ReactToastify.css";

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
        { path: "/consignment-history", element: <ConsignmentView /> },
        { path: "/contact", element: <Contact /> },
        { path: "/about-us", element: <AboutUs /> },
        { path: "/faqs-page", element: <FAQsPage /> },
        { path: "/policy-page", element: <PolicyPage /> },
        { path: "/shopping-guide", element: <ShoppingGuidePage /> },
        { path: "/batch-fish", element: <BatchFishFilter /> },

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
