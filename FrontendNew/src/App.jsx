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

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
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
      element: <SuperAdminMain />,
    },
    {
      path: "/admin/*",
      element: <AdminMain />,
    },
    {
      path: "/user/*",
      element: <UserMain />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
