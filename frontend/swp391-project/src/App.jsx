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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Đảm bảo Layout được sử dụng
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/products", element: <AllFishPage /> }, // Main page for all fish
        { path: "/breed/:breedName", element: <BreedFishPage /> }, // Page for breed
        { path: "/products/:id", element: <ProductDetail /> },
        { path: "/breed/:id", element: <ProductDetail /> },
        { path: "/consignment", element: <Consignment /> },
        { path: "/cart", element: <Cart /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/user_info/:id", element: <UserForm /> },
        // Page for Japanese Koi
        // Page for F1 Koi
        // Page for Vietnamese Koi
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

  return <RouterProvider router={router} />;
}

export default App;
