import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    role: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = auth?.token; //store jwt token in Authorization by default

  useEffect(() => {
    const data = Cookies.get("auth");
    if (data) {
      const parsedData = JSON.parse(data);
      setAuth({
        role: parsedData.role,
        token: parsedData.token,
      });
    }
  }, []);

  const login = (jwtToken, userRole) => {
    setAuth({
      role: userRole,
      token: jwtToken,
    });
    Cookies.set("auth", JSON.stringify(auth), { expires: 1 }); //cookie expires in 1 day
  };

  const logout = () => {
    setAuth({
      role: null,
      token: "",
    });
    Cookies.remove("jwtToken"); // Remove token from cookies
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
