import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Switch,
} from "@mui/material";
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
            width: "48px",
            height: "48px",
            textAlign: "center",
            fontSize: "1.25rem",
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
            width: "48px",
            height: "48px",
            textAlign: "center",
            fontSize: "1.25rem",
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

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state || "";

  useEffect(() => {
    if (timeLeft > 0 && resendDisabled) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setResendDisabled(false);
      setTimeLeft(30);
    }
  }, [timeLeft, resendDisabled]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
    setError("");
  };

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      try {
        const response = await fetch(`${apiUrl}/auth/resend-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          setResendDisabled(true);
          setTimeLeft(30);
          setError("OTP resent successfully.");
        } else {
          setError(data.message || "Failed to resend OTP.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        console.error("Resend OTP error:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network and try again.");
      console.error("OTP verification error:", err);
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
              Cervi<span style={{ color: darkMode ? "#eceff1" : "#263238" }}>Scan</span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                color="primary"
              />
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: darkMode ? "text.primary" : "primary.main",
                  color: darkMode ? "text.primary" : "primary.main",
                  "&:hover": {
                    borderColor: darkMode ? "#80deea" : "#00acc1",
                    bgcolor: darkMode ? "rgba(77, 208, 225, 0.1)" : "rgba(38, 198, 218, 0.1)",
                  },
                }}
              >
                Back to login
              </Button>
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
              Verify Your Email
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              Enter the 6-digit code sent to {email || "your email"}.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    inputProps={{ maxLength: 1 }}
                    autoFocus={index === 0}
                    variant="outlined"
                  />
                ))}
              </Box>

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

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
                Verify OTP
              </Button>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Didn’t receive the code?{" "}
                <Button
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  sx={{
                    fontSize: "0.875rem",
                    color: "primary.main",
                    textTransform: "none",
                    p: 0,
                    "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
                    "&.Mui-disabled": { color: "text.secondary", opacity: 0.5 },
                  }}
                >
                  Resend OTP {resendDisabled && `(${timeLeft}s)`}
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
