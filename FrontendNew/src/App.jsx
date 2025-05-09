import React from "react";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Register";
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SuperAdminMain from "./pages/superAdmin/SuperAdminMain";
import AdminMain from "./pages/admin/AdminMain";
import UserMain from "./pages/user/UserMain";
import Otp from "./pages/auth/Otp";
import { AuthProvider } from "./context/auth";
import PendingPage from "./components/general/PendingPage";
import Unauthorized from "./components/general/Unauthorized";

const App = () => {
  // const router = createBrowserRouter([
  //   path: "/",

  //   {
  //     path: "/",
  //     element: <Home />,
  //   },
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/signup",
  //     element: <Signup />,
  //   },
  //   {
  //     path: "/otp",
  //     element: <Otp />,
  //   },
  //   {
  //     path: "/superadmin/*",
  //     element: <SuperAdminMain />,
  //   },
  //   {
  //     path: "/admin/*",
  //     element: <AdminMain />,
  //   },
  //   {
  //     path: "/user/*",
  //     element: <UserMain />,
  //   },
  // ]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: (
        <AuthProvider>
          <Login />
        </AuthProvider>
      ),
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/otp",
      element: <Otp />,
    },
    {
      path: "/superadmin/*",
      element: (
        <AuthProvider>
          <SuperAdminMain />
        </AuthProvider>
      ),
    },
    {
      path: "/admin/*",
      element: (
        <AuthProvider>
          <AdminMain />
        </AuthProvider>
      ),
    },
    {
      path: "/user/*",
      element: (
        <AuthProvider>
          <UserMain />
        </AuthProvider>
      ),
    },
    {
      path: "/unauthorized",
      element: (
        <AuthProvider>
          <Unauthorized />
        </AuthProvider>
      ),
    },
    {
      path: "/pending",
      element: <PendingPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
