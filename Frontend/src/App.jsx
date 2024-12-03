import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import AdminHome from "./pages/admin/AdminHome";
import UserHome from "./pages/user/UserHome";
import TrainerHome from "./pages/trainer/TrainerHome";
import Patients from "./pages/user/Patients";
import ViewPatient from "./pages/user/ViewPatient";
import ViewUsers from "./pages/admin/ViewUsers";
import AuthLayout from "./components/AuthLayout";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import OtpPage from "./pages/OtpPage";
import TrainModel from "./pages/trainer/TrainModel";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import AdminDashboard from "./pages/admin/AdminDashboard";

const getRole = () => {
  return "user"; // Temporary for routing, replace with actual logic
};

// const renderHome = () => {
//   const role = getRole();
//   if (role === "admin") {
//     return <AdminHome />;
//   } else if (role === "user") {
//     return <UserHome />;
//   } else if (role === "trainer") {
//     return <TrainerHome />;
//   } else return <SignInForm />;
// };

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <SignInForm />,
        },
      ],
    },
    {
      path: "/signup",
      element: <AuthLayout />,
      children: [
        {
          path: "/signup",
          element: <SignUpForm />,
        },
      ],
    },
    {
      path: "/otp",
      element: <AuthLayout />,
      children: [
        {
          path: "/otp",
          element: <OtpPage />,
        },
      ],
    },
    {
      path: "/admin/dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/user/dashboard",
      element: <UserHome />,
    },
    {
      path: "/trainer/dashboard",
      element: <TrainerHome />,
    },
    {
      path: "/trainer/trainmodel",
      element: <TrainModel />,
    },
    {
      path: "/patients",
      element: <Patients />,
    },
    {
      path: "/user/viewpatient",
      element: <ViewPatient />,
    },
    {
      path: "/users",
      element: <ViewUsers />,
    },
  ]);

  return (
    <AuthProvider> {/* Wrap the router with AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
