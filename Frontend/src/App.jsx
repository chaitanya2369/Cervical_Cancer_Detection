import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminHome from "./pages/admin/AdminHome";
import UserHome from "./pages/user/UserHome";
import TrainerHome from "./pages/trainer/TrainerHome";
import Patients from "./pages/user/Patients";
import ViewPatient from "./pages/user/ViewPatient";
import ViewUsers from "./pages/admin/ViewUsers";

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
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/home",
      element: renderHome(),
    },
    {
      path: "/patients",
      element: <Patients />,
    },
    {
      path: "/patient/:slug",
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
