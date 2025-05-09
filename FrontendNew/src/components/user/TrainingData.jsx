import React, { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#49ab9b" },
    background: { default: "#f5f7fa", paper: "#fff" },
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
          padding: "8px 16px",
          transition: "all 0.3s ease",
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
    primary: { main: "#6ec1ae" },
    background: { default: "#1e2a38", paper: "#263544" },
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
          padding: "8px 16px",
          transition: "all 0.3s ease",
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
      },
    },
  },
});

const TrainingData = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { auth, loading } = useAuth();

  if (loading || !auth.user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: darkMode ? "background.default" : "background.default",
        }}
      >
        <CircularProgress sx={{ color: "primary.main", mr: 2 }} />
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  const { CanTrain, CanPredict } = auth.user;

  const handleFileChange = (file) => {
    if (!file) {
      setSelectedFile(null);
      setUploadStatus({ type: "error", message: "No file selected." });
      return;
    }
    if (!file.name.endsWith(".xlsx")) {
      setSelectedFile(null);
      setUploadStatus({ type: "error", message: "Please upload a valid .xlsx file." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setUploadStatus({ type: "error", message: "File size exceeds 10 MB limit." });
      return;
    }
    setSelectedFile(file);
    setUploadStatus(null);
    setUploadProgress(0);
  };

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadStatus({ type: "error", message: "Please select a file to upload." });
      return;
    }
    if (!fileType) {
      setUploadStatus({ type: "error", message: "Please select a file type (AF or DIC)." });
      return;
    }

    setIsSubmitting(true);
    setUploadStatus(null);
    setUploadProgress(0);

    try {
      // Parse the Excel file
      const parsedData = await parseExcelFile(selectedFile);

      // Prepare the payload
      const payload = {
        type: fileType,
        note: notes,
        sender: auth.user.Name || "Unknown User",
        cellsData: parsedData,
        datasetName: selectedFile.name,
      };

      // Log the payload for verification
      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

      // Simulate upload progress for the UI
      const fakeProgress = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(fakeProgress);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      const SERVER_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${SERVER_URL}/user/upload-training-data`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearInterval(fakeProgress);
      setUploadProgress(100);

      setUploadedFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: selectedFile.name,
          type: fileType,
          notes: notes || "No notes provided",
        },
      ]);
      setUploadStatus({ type: "success", message: "Data submitted successfully!" });
      setSelectedFile(null);
      setFileType("");
      setNotes("");
      setUploadProgress(0);
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: `Error submitting data: ${error.response?.status || ""} ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSelectFiles = () => {
    fileInputRef.current.click();
  };

  const getFileSize = (file) => {
    if (!file) return "0 MB";
    return (file.size / (1024 * 1024)).toFixed(2) + " MB";
  };

  const removeUploadedFile = (fileToRemove) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileToRemove.id));
    setUploadStatus({ type: "success", message: "File removed successfully!" });
  };

  const handleDownload = async (type, filename) => {
    setIsDownloading(true);
    setDownloadStatus(null);

    try {
      const SERVER_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${SERVER_URL}/user/format-file?type=${type}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadStatus({ type: "success", message: `${type.toUpperCase()} format file downloaded successfully` });
    } catch (error) {
      setDownloadStatus({
        type: "error",
        message: `Error downloading ${type.toUpperCase()} format file: ${error.response?.status || ""} ${error.message}`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!CanTrain && !CanPredict) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: darkMode ? "background.default" : "background.default",
        }}
      >
        <Typography variant="h5" sx={{ color: "text.primary", fontWeight: "bold" }}>
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {CanTrain && (
          <Paper sx={{ p: 6, mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 4 }}
            >
              Upload Excel File for Training
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                The file should be in .xlsx format, with a maximum size of 10 MB.
              </Typography>

              {/* Upload Section and Form Side-by-Side */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 4,
                }}
              >
                {/* Left Column: Upload Section and File Name */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Drag-and-Drop Area */}
                  <Paper
                    sx={{
                      border: "2px dashed",
                      borderColor: isDragging ? "primary.main" : "grey.300",
                      borderRadius: "12px",
                      p: 8,
                      textAlign: "center",
                      bgcolor: isDragging ? "rgba(73, 171, 155, 0.1)" : "background.paper",
                      transition: "all 0.3s ease",
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="region"
                    aria-describedby="upload-instructions"
                  >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                      <UploadIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                    </Box>
                    <Typography
                      id="upload-instructions"
                      variant="body1"
                      sx={{ fontWeight: "medium", color: "text.primary" }}
                    >
                      Drag and drop files to upload
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                      Your file will be private until you publish your profile.
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleSelectFiles}
                      sx={{ mt: 4 }}
                      aria-label="Select files to upload"
                    >
                      Select Files
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      aria-hidden="true"
                    />
                  </Paper>

                  {/* File Name and Size */}
                  {selectedFile && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body1" sx={{ color: "text.primary" }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        ({getFileSize(selectedFile)})
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Right Column: File Type, Notes, and Submit */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {selectedFile ? (
                    <>
                      <FormControl fullWidth>
                        <InputLabel id="file-type-label">File Type</InputLabel>
                        <Select
                          labelId="file-type-label"
                          label="File Type"
                          value={fileType}
                          onChange={(e) => setFileType(e.target.value)}
                        >
                          <MenuItem value="">Select Type</MenuItem>
                          <MenuItem value="AF">AF</MenuItem>
                          <MenuItem value="DIC">DIC</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Notes (Optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter any notes about this file (e.g., 'Data from rural clinic')"
                      />

                      {/* Submit Button */}
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{
                          alignSelf: "flex-end",
                          bgcolor: "primary.main",
                          "&:hover": { bgcolor: darkMode ? "#81d4bf" : "#3e8c7e" },
                          "&:disabled": { bgcolor: "grey.500", cursor: "not-allowed" },
                        }}
                      >
                        {isSubmitting ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                            Submitting...
                          </Box>
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
                      Select a file to add type and notes.
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Progress Bar */}
              {isSubmitting && (
                <Box sx={{ width: "100%", mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "right", mt: 1, color: "text.secondary" }}
                  >
                    {uploadProgress}%
                  </Typography>
                </Box>
              )}

              {/* Upload Status */}
              {uploadStatus && (
                <Typography
                  variant="body2"
                  sx={{
                    color: uploadStatus.type === "success" ? "green.600" : "red.600",
                    mt: 2,
                  }}
                >
                  {uploadStatus.message}
                </Typography>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
                  >
                    Uploaded Files
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>
                            File Name
                          </TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>
                            Type
                          </TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>
                            Notes
                          </TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadedFiles.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell sx={{ color: "text.primary" }}>{file.name}</TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>{file.type}</TableCell>
                            <TableCell sx={{ color: "text.secondary" }}>{file.notes}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => removeUploadedFile(file)}
                                sx={{
                                  color: "red.500",
                                  "&:hover": { bgcolor: "red.50" },
                                }}
                                aria-label={`Delete ${file.name}`}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {(CanTrain || CanPredict) && (
          <Paper sx={{ p: 6 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 4 }}
            >
              Excel File Format
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleDownload("af", "af_format.xlsx")}
                  disabled={isDownloading}
                  sx={{
                    flex: 1,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: darkMode ? "#81d4bf" : "#3e8c7e",
                      bgcolor: darkMode ? "rgba(110, 193, 174, 0.1)" : "rgba(73, 171, 155, 0.1)",
                    },
                    "&:disabled": { borderColor: "grey.500", color: "grey.500" },
                  }}
                  startIcon={<DownloadIcon />}
                  aria-label="Download AF file format"
                >
                  {isDownloading ? "Downloading..." : "Download AF Format"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDownload("dic", "dic_format.xlsx")}
                  disabled={isDownloading}
                  sx={{
                    flex: 1,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: darkMode ? "#81d4bf" : "#3e8c7e",
                      bgcolor: darkMode ? "rgba(110, 193, 174, 0.1)" : "rgba(73, 171, 155, 0.1)",
                    },
                    "&:disabled": { borderColor: "grey.500", color: "grey.500" },
                  }}
                  startIcon={<DownloadIcon />}
                  aria-label="Download DIC file format"
                >
                  {isDownloading ? "Downloading..." : "Download DIC Format"}
                </Button>
              </Box>
              {downloadStatus && (
                <Typography
                  variant="body2"
                  sx={{
                    color: downloadStatus.type === "success" ? "green.600" : "red.600",
                    mt: 2,
                  }}
                >
                  {downloadStatus.message}
                </Typography>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default TrainingData;
