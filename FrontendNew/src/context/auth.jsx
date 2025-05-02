import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    role: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = auth?.token; //store jwt token in Authorization by default

  useEffect(() => {
    const data = Cookies.get("auth");
    console.log("data: ",data);
    if (data) {
      const parsedData = JSON.parse(data);
      console.log("parsedData",parsedData);
      setAuth({
        role: parsedData.role,
        token: parsedData.token,
        user:parsedData.user,
      });
    }
    // else{
    //   navigate('/login',{replace:true});
    // }
  }, []);

  const login = (jwtToken, userRole,userData) => {
    const authData = {
      role: userRole,
      token: jwtToken,
      user: userData,
    };
    setAuth(authData);
    Cookies.set("auth", JSON.stringify(authData), { expires: 1 }); //cookie expires in 1 day
  };

  const logout = () => {
    setAuth({
      role: null,
      token: "",
      user:null,
    });
    Cookies.remove("auth"); // Remove token from cookies
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
