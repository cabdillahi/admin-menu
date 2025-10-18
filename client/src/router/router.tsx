import DashboardLayout from "@/components/dashboard/dash-layout/dashboard-layout";
import SignIn from "@/pages/auth/sign-in";
import Category from "@/pages/dashboard/category/category";
import Customer from "@/pages/dashboard/customer/Customer";
import DashboardMain from "@/pages/dashboard/dashboard-main";
import Foods from "@/pages/dashboard/food/food";
import User from "@/pages/dashboard/user/user";
import Home from "@/pages/home/home";
import { createBrowserRouter, Outlet } from "react-router-dom";

const Router = () => {
  return <Outlet />;
};

export default Router;
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Router />,
    children: [
      { index: true, element: <Home /> },
      { path: "auth/sign-in", element: <SignIn /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "main",
        element: <DashboardMain />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "food",
        element: <Foods />,
      },
      {
        path: "customer",
        element: <Customer />,
      },
      {
        path: "user",
        element: <User />,
      },
    ],
  },
]);
