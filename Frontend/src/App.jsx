import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminHome from "./pages/admin/AdminHome";
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

const getRole = () => {
  return "user";
};

const getPermission = () => {
  //1->has permission to view patient, 2-> send pics for training
  return 1;
};

const renderHome = () => {
  const role = getRole();
  if (role == "admin") {
    return <AdminHome />;
  } else if (role == "user") {
    return <UserHome />;
  } else if (role == "trainer") {
    return <TrainerHome />;
  } else return <Login />;
};

function App() {
  const permission = getPermission();
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
      path: "/home",
      element: renderHome(),
    },
    {//just for temporary purpose should be changed later
      path: "/home/trainer",
      element: <TrainerHome/>,
    },
    {//just for temporary purpose should be changed later
      path: "/trainer/trainmodel",
      element: <TrainModel/>,
    },
    {
      path: "/patients",
      element: <Patients />,
    },
    {
      // path: "/patient/:slug",
      path: "/viewpatient",
      element: <ViewPatient />,
    },
    {
      path: "/users",
      element: <ViewUsers />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
