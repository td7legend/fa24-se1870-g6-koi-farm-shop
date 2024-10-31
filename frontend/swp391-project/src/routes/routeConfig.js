import AboutUs from "../pages/about-us";
import StaffManagement from "../pages/admin-page/manage-staff";
import AllFishPage from "../pages/all-fish";
import Cart from "../pages/cart";
import Checkout from "../pages/checkout";
import Contact from "../pages/contact";
import HomePage from "../pages/home";
import ForgotPassword from "../pages/Login/ForgotPassword";
import LoginPage from "../pages/Login/Login";
import ConsignmentManagement from "../pages/staff-page/manage-consignment";
import FishCareManagement from "../pages/staff-page/manage-consignment/manage-fishcare/manage-fishcare";
import StaffFishManagement from "../pages/staff-page/manage-fish";
import StaffOrderManagement from "../pages/staff-page/manage-order";
import ConsignmentHistory from "../pages/user-page/consignment-history";
import OrderHistoryPage from "../pages/user-page/order-history";
import UserDashboard from "../pages/user-page/user-dashboard";
// ... import các components khác ...

export const ROLES = {
  GUEST: 0,
  CUSTOMER: 1,
  STAFF: 2,
  MANAGER: 3,
};

export const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/contact", element: <Contact /> },
  { path: "/fish-page", element: <AllFishPage /> },
];

export const customerRoutes = [
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/user-dashboard/:id", element: <UserDashboard /> },
  { path: "/order-history", element: <OrderHistoryPage /> },
  { path: "/consignment-history", element: <ConsignmentHistory /> },
];

export const staffRoutes = [
  {
    path: "/staff-dashboard/order-management",
    element: <StaffOrderManagement />,
  },
  {
    path: "/staff-dashboard/fish-management",
    element: <StaffFishManagement />,
  },
  {
    path: "/staff-dashboard/fish-care-management",
    element: <FishCareManagement />,
  },
];

export const managerRoutes = [
  { path: "/admin-dashboard/staff-management", element: <StaffManagement /> },
  {
    path: "/admin-dashboard/fishtype-management",
    element: <StaffFishManagement />,
  },
  {
    path: "/admin-dashboard/consignment-management",
    element: <ConsignmentManagement />,
  },
];
