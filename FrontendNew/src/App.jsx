import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/doctor-dashboard" element={<Home />} />
      <Route path="/admin-dashboard" element={<Home />} />
      <Route path="/patient-dashboard" element={<Home />} />
    </Routes>
  );
};

export default App;
