import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    user: null,
    role: null,
    token: "",
  });
  const [loading, setLoading] = useState(true);

  axios.defaults.headers.common["Authorization"] = auth?.token; //store jwt token in Authorization by default

  useEffect(() => {
    const data = Cookies.get("auth");
    console.log("data: ", data);
    if (data) {
      const parsedData = JSON.parse(data);
      console.log("parsedData", parsedData);
      setAuth({
        role: parsedData.role,
        token: parsedData.token,
        user: parsedData.user,
      });
    } else {
      navigate("/login", { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  const updateCookies = (authData) => {
    Cookies.set("auth", JSON.stringify(authData), { expires: 1 });
  };

  const login = (jwtToken, userRole, userData) => {
    const authData = {
      role: userRole,
      token: jwtToken,
      user: userData,
    };
    setAuth(authData);
    updateCookies(authData);
  };

  const logout = () => {
    console.log("Logout function called");
    setAuth({
      role: null,
      token: "",
      user: null,
    });
    Cookies.remove("auth"); // Remove auth cookie
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, logout, loading, updateCookies }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
