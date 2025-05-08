import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

export default function TrainModel() {
  const { auth, loading } = useAuth();
  
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [approvedDatasets, setApprovedDatasets] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [analysisType, setAnalysisType] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [modelMetadata, setModelMetadata] = useState({
    modelType: "svm",
    accuracy: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if user is not logged in or lacks permissions
  useEffect(() => {
    if (!auth.user) {
      navigate("/login", { replace: true });
    } else if (!auth.user.CanTrain) {
      navigate("/unauthorized", { replace: true });
    } 
  }, [auth.user, navigate]);

  // Show loading if data is not ready
  if (loading || !approvedDatasets) {
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
          Loading...
        </Typography>
      </Box>
    );
  }


  const handleAnalysisTypeChange = (e) => {
    setAnalysisType(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith(".pkl")) {
        setModelFile(file);
        setError("");
      } else {
        setError("Please upload a .pkl file.");
        setModelFile(null);
      }
    }
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setModelMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveModel = async () => {
    if (!analysisType) {
      setError("Please select an analysis type (AF or DIC).");
      return;
    }
    if (!modelFile) {
      setError("Please upload a .pkl file.");
      return;
    }
    if (!modelMetadata.modelType) {
      setError("Please select a model type.");
      return;
    }
    if (!modelMetadata.accuracy || isNaN(modelMetadata.accuracy) || modelMetadata.accuracy <= 0 || modelMetadata.accuracy > 100) {
      setError("Please enter a valid accuracy (0-100).");
      return;
    }

    setError("");
    setSuccess("");

    // Prepare form data for API
    const formData = new FormData();
    formData.append("modelFile", modelFile);
    formData.append("modelType", modelMetadata.modelType);
    formData.append("analysisType", analysisType);
    formData.append("accuracy", modelMetadata.accuracy);
    formData.append("notes", modelMetadata.notes);
    formData.append("id", auth.user.ID);

    try {
      const response = await axios.post(`${SERVER_URL}/trainer/upload-pickle`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setSuccess("Model uploaded successfully!");
        // Reset form
        setSelectedDatasets([]);
        setAnalysisType("");
        setModelFile(null);
        setModelMetadata({ modelType: "svm", accuracy: "", notes: "" });
        document.getElementById("model-file-input").value = "";
      } else {
        throw new Error("Failed to upload model");
      }
    } catch (error) {
      console.error("Error uploading model:", error);
      setError("Error uploading model: " + (error.message || "Unknown error"));
    }
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              mb: 3,
              textAlign: "center",
            }}
          >
            Upload Trained Model
          </Typography>


          {/* Model File Upload */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px dashed",
              borderColor: "primary.main",
              borderRadius: "8px",
              p: 2,
              bgcolor: darkMode ? "rgba(77, 208, 225, 0.1)" : "rgba(38, 198, 218, 0.1)",
              mb: 2,
            }}
          >
            <Button
              component="label"
              startIcon={<CloudUploadIcon sx={{ fontSize: 40, color: "primary.main" }} />}
            >
              <input
                id="model-file-input"
                type="file"
                accept=".pkl"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {modelFile ? modelFile.name : "Upload .pkl file"}
            </Typography>
          </Box>
              {/* Analysis Type Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="analysis-type-label">Analysis Type</InputLabel>
                <Select
                  labelId="analysis-type-label"
                  label="Analysis Type"
                  value={analysisType}
                  onChange={handleAnalysisTypeChange}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: darkMode ? "#2e3b4e" : "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#4b5e77" : undefined,
                    },
                  }}
                >
                  <MenuItem value="AF">AF</MenuItem>
                  <MenuItem value="DIC">DIC</MenuItem>
                </Select>
              </FormControl>

          {/* Model Metadata */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="model-type-label">Model Type</InputLabel>
              <Select
                labelId="model-type-label"
                label="Model Type"
                name="modelType"
                value={modelMetadata.modelType}
                onChange={handleMetadataChange}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: darkMode ? "#2e3b4e" : "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: darkMode ? "#4b5e77" : undefined,
                  },
                }}
              >
                <MenuItem value="svm">SVM</MenuItem>
                <MenuItem value="logisticRegression">Logistic Regression</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Accuracy (%)"
              type="number"
              name="accuracy"
              value={modelMetadata.accuracy}
              onChange={handleMetadataChange}
              placeholder="Enter accuracy (0-100)"
            />
          </Box>

          <TextField
            fullWidth
            label="Notes (Optional)"
            name="notes"
            value={modelMetadata.notes}
            onChange={handleMetadataChange}
            placeholder="Add any notes about the model"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          {/* Error/Success Messages */}
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography variant="body2" sx={{ mb: 2, color: "green" }}>
              {success}
            </Typography>
          )}

          {/* Save Button */}
          <Button
            variant="contained"
            onClick={handleSaveModel}
            sx={{
              py: 1.2,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: darkMode ? "#80deea" : "#69d7c5" },
              width: "100%",
            }}
          >
            Upload Model
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
