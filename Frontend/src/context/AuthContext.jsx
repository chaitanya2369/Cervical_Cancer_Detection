import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

// Create the context
const AuthContext = createContext();

// Provider component to manage the auth state
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    role: null,
  });

  // Check for token on initial load and update authData
  useEffect(() => {
    const token = Cookies.get("jwtToken"); // Get token from cookies
    if (token) {
      try {
        const decoded = parseJwt(token);
        setAuthData({
          token,
          role: decoded.role, // Ensure the 'role' is part of your token's payload
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Handle login - save token in cookies
  const login = (token) => {
    try {
      const decoded = parseJwt(token); // Decode JWT token safely
      setAuthData({
        token,
        role: decoded.role, // Ensure the 'role' is part of your token's payload
      });
      Cookies.set("jwtToken", token, { expires: 7 }); // Set token in cookies with a 7-day expiry
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  // Handle logout - remove token from cookies
  const logout = () => {
    setAuthData({
      token: null,
      role: null,
    });
    Cookies.remove("jwtToken"); // Remove token from cookies
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to safely decode JWT
const parseJwt = (token) => {
  const base64Url = token.split('.')[1]; // Get the payload part
  if (!base64Url) throw new Error("Invalid JWT token format");
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL-safe to standard base64
  const decoded = atob(base64); // Decode base64
  return JSON.parse(decoded); // Parse the JSON
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
