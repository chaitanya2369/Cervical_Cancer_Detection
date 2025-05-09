import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../context/auth";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  Link as MuiLink,
  Divider,
  Switch,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal } from "@mui/material/colors";

const apiUrl = import.meta.env.VITE_API_URL;

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: teal[300] },
    background: { default: "#f5f7fa" },
    text: { primary: "#263238", secondary: "#607d8b" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#fff",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4dd0e1" },
    background: { default: "#1e2a38" },
    text: { primary: "#eceff1", secondary: "#b0bec5" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#263544",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#2e3b4e",
          },
          "& .MuiInputLabel-root": {
            color: "#b0bec5",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4b5e77",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#263544",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
  },
});

export default function Login() {
  const { auth, setAuth, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (
          data.role != "super-admin" &&
          (data.user.Status == "pending" || data.user.Status == "unapproved")
        ) {
          navigate("/pending");
        } else {
          login(data.jwtToken, data.role, data.user); //store in auth context
          // Redirect based on role
          if (data.role == "super-admin") {
            navigate("/superadmin/dashboard");
          } else if (data.role == "admin") {
            navigate("/admin/dashboard");
          } else if (data.user) {
            navigate("/user/dashboard");
          }
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network and try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Navbar */}
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: "bold",
                color: darkMode ? "text.primary" : "primary.main",
                textDecoration: "none",
              }}
            >
              Cervi
              <span style={{ color: darkMode ? "#eceff1" : "#263238" }}>
                Scan
              </span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                color="primary"
              />
              <MuiLink
                component={Link}
                to="/signup"
                sx={{
                  fontSize: "0.875rem",
                  color: darkMode ? "text.primary" : "primary.main",
                  textDecoration: "none",
                  fontWeight: "medium",
                  border: "1px solid",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  backgroundColor: darkMode ? "#4b5e77" : "#f5f7fa",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: darkMode ? "#607d8b" : "#e0f7fa",
                    textDecoration: "none",
                  },
                }}
                variant="outlined"
                color="primary"
                size="small"
              >
                Sign Up
              </MuiLink>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              width: { xs: "100%", sm: "400px" },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                mb: 1,
              }}
            >
              Sign In
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              Access your account to continue
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "primary.main" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: "right" }}>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    fontSize: "0.875rem",
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.2,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: darkMode ? "#80deea" : "#00acc1" },
                }}
              >
                Sign In
              </Button>

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <Divider sx={{ my: 2, color: "text.secondary" }}>or</Divider>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Don’t have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/signup"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
