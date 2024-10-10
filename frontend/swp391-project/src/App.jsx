import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Consignment from "./pages/consignment";
import Layout from "./components/layout/layout";
import HomePage from "./pages/home";
import AllFishPage from "./pages/all-fish";
import BreedFishPage from "./pages/breed";
import ProductDetail from "./pages/product-detail";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
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
        // Page for Japanese Koi
        // Page for F1 Koi
        // Page for Vietnamese Koi
      ],
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
