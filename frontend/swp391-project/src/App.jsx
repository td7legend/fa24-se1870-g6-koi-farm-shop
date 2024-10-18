import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Consignment from "./pages/consignment";
import Layout from "./components/layout/layout";
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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/products", element: <AllFishPage /> },
        { path: "/breed/:breedName", element: <BreedFishPage /> },
        { path: "/products/:id", element: <ProductDetail /> },
        { path: "/breed/:id", element: <ProductDetail /> },
        { path: "/consignment", element: <Consignment /> },
        { path: "/cart", element: <Cart /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/checkout/success", element: <PaymentSuccess /> },
        { path: "/user-setting/:id", element: <UserSetting /> },
        { path: "/user-dashboard/:id", element: <UserDashboard /> },
        { path: "/order-history", element: <OrderHistoryPage /> },
        { path: "/order-details", element: <OrderDetailsPage /> },
        { path: "/error-page", element: <ErrorPage /> },
        { path: "/contact", element: <Contact /> },
        { path: "/about-us", element: <AboutUs /> },
        { path: "/faqs-page", element: <FAQsPage /> },
        { path: "/policy-page", element: <PolicyPage /> },
        { path: "/shopping-guide", element: <ShoppingGuidePage /> },
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
  ]);
  useEffect(() => {
    // Đảm bảo sự kiện lắng nghe chỉ được thêm một lần khi component mount
    return () => window.removeEventListener("message", () => {});
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
