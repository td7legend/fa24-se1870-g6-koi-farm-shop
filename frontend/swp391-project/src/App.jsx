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
import UserForm from "./pages/user_Dasboard";
import LoginSuccess from "./pages/Login/LoginSuccess";
import OrderHistoryPage from "./pages/user_Dasboard/order_history";
import OrderDetailsPage from "./pages/user_Dasboard/order_detail";
import ErrorPage from "./components/error";
import { useEffect } from "react";
import Contact from "./pages/contact";
import AboutUs from "./pages/about-us";
import FAQsPage from "./pages/faqs";
import PolicyPage from "./pages/policy";
import ShoppingGuidePage from "./pages/shopping-guide";
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
        { path: "/user_info/:id", element: <UserForm /> },
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
