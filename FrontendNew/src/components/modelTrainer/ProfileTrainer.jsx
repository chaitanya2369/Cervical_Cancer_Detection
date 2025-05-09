import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LockIcon from "@mui/icons-material/Lock";
import ImageIcon from "@mui/icons-material/Image";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_URL;

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#49ab9b" },
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
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#fff",
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
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#2e3b4e",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#4b5e77",
        },
      },
    },
  },
});

const Profile = () => {
  const { auth, setAuth, loading, updateCookies } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const [userData, setUserData] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("/images/review1.png");

  // Redirect if user is not logged in and setup initial data
  useEffect(() => {
    if (!auth.user) {
      navigate("/login", { replace: true });
    } else {
      setUserData(auth.user);
      setEditedData({
        ID: auth.user.ID,
        Name: auth.user.Name,
        Email: auth.user.Email,
        Hospital: auth.user.Hospital,
        Password: auth.user.Password,
        Status: auth.user.Status,
        canTrain: auth.user.CanTrain || false,
        canPredict: auth.user.CanPredict || false,
        profileImage: auth.user.profileImage || "/images/review1.png",
      });

      if (auth.user.profileImage) {
        setPreviewImage(auth.user.profileImage);
      }
    }
  }, [auth.user, navigate]);

  // Show loading if userData not ready
  if (loading || !userData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: darkMode ? "background.default" : "background.default",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
        <Typography variant="body1" sx={{ mt: 2, color: "text.primary" }}>
          Loading profile data...
        </Typography>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editedData.Name) {
      alert("Please enter a valid name.");
      return;
    }

    try {
      const response = await axios.put(`${SERVER_URL}/user/edit-details`, editedData);
      if (response.data.success) {
        setAuth((prev) => ({
          ...prev,
          user: { ...response.data.user },
        }));
        updateCookies({
          user: { ...response.data.user },
          role: auth.role,
          token: auth.token,
        });
        setUserData(editedData);
        setIsEditDialogOpen(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + (error.message || "Unknown error"));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = () => {
    if (!passwordData.currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setError("");
    console.log("Password updated:", passwordData.newPassword);
    setIsPasswordDialogOpen(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 3,
          bgcolor: "background.default",
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            width: { xs: "100%", sm: "800px" },
          }}
        >
          {/* Header with Profile Image */}
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "12px 12px 0 0",
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={userData.profileImage || "/images/review1.png"}
                alt="Profile"
                style={{
                  width: "112px",
                  height: "112px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
                  {userData.Name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#e0f7fa" }}>
                  {userData.Email}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => setIsEditDialogOpen(true)}
              sx={{
                bgcolor: darkMode ? "#80deea" : "#45c9b3",
                "&:hover": { bgcolor: darkMode ? "#b0faff" : "#69d7c5" },
              }}
            >
              Edit Profile
            </Button>
          </Box>

          {/* Profile Details */}
          <Box sx={{ p: 3, display: "grid", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Full Name: {userData.Name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Organisation: {userData.Hospital}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ImageIcon sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Profile Picture:
              </Typography>
              <img
                src={userData.profileImage || "/images/review1.png"}
                alt="Profile"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid",
                  borderColor: "text.secondary",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Email Address: {userData.Email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LockIcon sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Password:
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setIsPasswordDialogOpen(true)}
                sx={{
                  borderColor: darkMode ? "text.primary" : "primary.main",
                  color: darkMode ? "text.primary" : "primary.main",
                  "&:hover": {
                    borderColor: darkMode ? "#80deea" : "#00acc1",
                    bgcolor: darkMode ? "rgba(77, 208, 225, 0.1)" : "rgba(38, 198, 218, 0.1)",
                  },
                }}
              >
                Change Password
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LockIcon sx={{ color: "primary.main" }} />
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Status: {userData.Status.charAt(0).toUpperCase() + userData.Status.slice(1)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon sx={{ color: "primary.main" }} />
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  Can Train: {userData.CanTrain ? "Yes" : "No"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LockIcon sx={{ color: "primary.main" }} />
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  Can Predict: {userData.CanPredict ? "Yes" : "No"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
          <DialogTitle sx={{ color: "text.primary" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ color: "primary.main" }} />
              Edit Profile
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
              <TextField
                label="Full Name"
                name="Name"
                value={editedData.Name || ""}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: "primary.main", mr: 1 }} />,
                }}
              />
              <TextField
                label="Email Address"
                value={editedData.Email || ""}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: <EmailIcon sx={{ color: "primary.main", mr: 1 }} />,
                }}
              />
              <TextField
                label="Organisation"
                value={editedData.Hospital || ""}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: <BusinessIcon sx={{ color: "primary.main", mr: 1 }} />,
                }}
              />
              <TextField
                label="Status"
                value={editedData.Status.charAt(0).toUpperCase() + editedData.Status.slice(1)}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: "primary.main", mr: 1 }} />,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid",
                    borderColor: "text.secondary",
                  }}
                />
                <Button component="label" startIcon={<ImageIcon sx={{ color: "primary.main" }} />}>
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  Upload Profile Picture
                </Button>
              </Box>
              <TextField
                label="Can Train"
                value={editedData.canTrain ? "Yes" : "No"}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: "primary.main", mr: 1 }} />,
                }}
              />
              <TextField
                label="Can Predict"
                value={editedData.canPredict ? "Yes" : "No"}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: "primary.main", mr: 1 }} />,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: darkMode ? "#80deea" : "#00acc1" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={isPasswordDialogOpen}
          onClose={() => {
            setIsPasswordDialogOpen(false);
            setError("");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
          }}
        >
          <DialogTitle sx={{ color: "text.primary" }}>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                placeholder="Enter current password"
              />
              <TextField
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                placeholder="Enter new password"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                placeholder="Confirm new password"
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setError("");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: darkMode ? "#80deea" : "#00acc1" },
              }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
