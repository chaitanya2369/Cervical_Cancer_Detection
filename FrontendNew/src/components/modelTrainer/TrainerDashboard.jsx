import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "../general/Modal";
import { useAuth } from "../../context/auth";
import * as XLSX from "xlsx";

// Load SheetJS via CDN (assumed to be included in the app's index.html)
// <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#263544",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
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

export default function TrainerDashboard() {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [datasetPool, setDatasetPool] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Redirect if user is not logged in or lacks permissions
  useEffect(() => {
    if (!loading && !auth.user) {
      navigate("/login", { replace: true });
    } else if (!loading && auth.user && !auth.user.CanTrain) {
      navigate("/unauthorized", { replace: true });
    }
  }, [auth.user, loading, navigate]);

  // Fetch submissions from backend
  const fetchSubmissions = async () => {
    setIsLoadingData(true);
    try {
      const SERVER_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${SERVER_URL}/trainer/data`);
      console.log("Submissions response:", response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch dataset pool (accepted data) from backend
  const fetchDatasetPool = async () => {
    setIsLoadingData(true);
    try {
      const SERVER_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${SERVER_URL}/trainer/accepted-data`);
      console.log("Dataset Pool response:", response.data);
      setDatasetPool(response.data);
    } catch (error) {
      console.error("Error fetching dataset pool:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Update submission status and feedback
  const handleStatusChange = async (submissionId, newStatus) => {
    console.log("Updating status for submission ID:", submissionId, "to", newStatus);
    try {
      const SERVER_URL = import.meta.env.VITE_API_URL;
      const response = await axios.patch(`${SERVER_URL}/trainer/update-status`, {
        ID: submissionId,
        status: newStatus,
      });
      console.log("Status update response:", response.data);
      // Refresh submissions and dataset pool
      await fetchSubmissions();
      if (newStatus === "accepted") {
        await fetchDatasetPool();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleFeedbackModalOpen = (submission) => {
    setCurrentSubmission(submission);
    setFeedback(submission.feedback || "");
    setOpenFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      const SERVER_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${SERVER_URL}/user/update-status`, {
        id: currentSubmission.ID,
        status: currentSubmission.Status,
        feedback,
      });
      // Refresh submissions
      await fetchSubmissions();
      setOpenFeedbackModal(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleTrainModel = () => {
    if (selectedDatasets.length === 0) {
      alert("Please select at least one dataset to train.");
      return;
    }
    const newTraining = {
      id: trainingHistory.length + 1,
      model: `Model v${(trainingHistory.length + 1).toFixed(1)}`,
      datasets: selectedDatasets,
      accuracy: `${Math.floor(Math.random() * 20) + 80}%`,
      date: new Date().toISOString().split("T")[0],
      notes: `Trained with ${selectedDatasets.length} dataset(s)`,
    };
    setTrainingHistory([...trainingHistory, newTraining]);
    setSelectedDatasets([]);
  };

  const handlePreviewModalOpen = (item, isSubmission = false) => {
    if (isSubmission) {
      setCurrentSubmission(item);
      setCurrentDataset(null);
    } else {
      setCurrentDataset(item);
      setCurrentSubmission(null);
    }
    setOpenPreviewModal(true);
  };

  // Download cellsData and convert to Excel
  const handleDownloadCellsData = async (id, filename) => {
    setDownloadStatus(null);
    try {
      const SERVER_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${SERVER_URL}/trainer/download-data?id=${id}`, {});
      console.log("Download response:", response.data.cellsData);
  
      // Transform each cell's data into an object with feature names as keys
      const cellsArray = response.data.cellsData.map(cell => {
        const cellObject = {};
        cell.forEach(item => {
          cellObject[item.Key] = item.Value;
        });
        return cellObject;
      });
  
      // Create the Excel worksheet
      const worksheet = XLSX.utils.json_to_sheet(cellsArray);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "CellsData");
  
      // Generate and download the Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}_cellsData.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      setDownloadStatus({ type: "success", message: "Dataset downloaded successfully!" });
    } catch (error) {
      setDownloadStatus({
        type: "error",
        message: `Error downloading dataset: ${error.message}`,
      });
    }
  };

  // Fetch data only when auth.user is ready and user has permissions
  useEffect(() => {
    if (loading || !auth.user || !auth.user.CanTrain) return;

    if (tabValue === 0) {
      fetchSubmissions();
    } else if (tabValue === 2) {
      setDownloadStatus(null);
      fetchDatasetPool();
    }
  }, [tabValue, auth.user, loading]);

  // Show loading state while auth or data is being fetched
  if (loading || !auth.user) {
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
        {/* Top Navbar
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
              <Button
                component={Link}
                to="/trainer/view-patients"
                variant="outlined"
                sx={{
                  borderColor: darkMode ? "text.primary" : "primary.main",
                  color: darkMode ? "text.primary" : "primary.main",
                  "&:hover": {
                    borderColor: darkMode ? "#6ec1ae" : "#3e8c7e",
                    bgcolor: darkMode ? "rgba(110, 193, 174, 0.1)" : "rgba(73, 171, 155, 0.1)",
                  },
                }}
              >
                View Patients
              </Button>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
                color="primary"
              />
              <Button
                component={Link}
                to="/logout"
                variant="outlined"
                sx={{
                  borderColor: darkMode ? "text.primary" : "primary.main",
                  color: darkMode ? "text.primary" : "primary.main",
                  "&:hover": {
                    borderColor: darkMode ? "#6ec1ae" : "#3e8c7e",
                    bgcolor: darkMode ? "rgba(110, 193, 174, 0.1)" : "rgba(73, 171, 155, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar> */}

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              width: { xs: "100%", sm: "1000px" },
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
              Trainer Dashboard
            </Typography>

            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              centered
              sx={{ mb: 3 }}
            >
              <Tab label="Submissions" />
              <Tab label="Training History" />
              <Tab label="Dataset Pool" />
            </Tabs>

            {tabValue === 0 && (
              <>
                {/* Submissions Table */}
                {isLoadingData ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "primary.main" }} />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Dataset Name</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Doctor</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Type</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Notes</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {submissions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: "center", color: "text.secondary" }}>
                              No submissions available.
                            </TableCell>
                          </TableRow>
                        ) : (
                          submissions.map((submission) => (
                            <TableRow key={submission.ID}>
                              <TableCell sx={{ color: "text.primary" }}>{submission.DatasetName}</TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>{submission.Sender}</TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>{submission.Type}</TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>{submission.Note}</TableCell>
                              <TableCell>
                                <FormControl size="small">
                                  <Select
                                    value={submission.Status}
                                    onChange={(e) => handleStatusChange(submission.ID, e.target.value)}
                                  >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="accepted">Accepted</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                    <MenuItem value="used">Used in Training</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Train Model Section
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "text.primary",
                      mb: 2,
                    }}
                  >
                    Train Model
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="select-datasets-label">Select Datasets</InputLabel>
                    <Select
                      labelId="select-datasets-label"
                      label="Select Datasets"
                      multiple
                      value={selectedDatasets}
                      onChange={(e) => setSelectedDatasets(e.target.value)}
                    >
                      {submissions
                        .filter((s) => s.Status === "accepted")
                        .map((submission) => (
                          <MenuItem key={submission.ID} value={submission.DatasetName}>
                            {submission.DatasetName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleTrainModel}
                    sx={{
                      py: 1.2,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: darkMode ? "#81d4bf" : "#3e8c7e" },
                    }}
                  >
                    Train Model
                  </Button>
                </Box> */}
              </>
            )}

            {tabValue === 1 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Model</TableCell>
                      <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Accuracy</TableCell>
                      <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trainingHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: "center", color: "text.secondary" }}>
                          No training history available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      trainingHistory.map((training) => (
                        <TableRow key={training.id}>
                          <TableCell sx={{ color: "text.secondary" }}>{training.date}</TableCell>
                          <TableCell sx={{ color: "text.primary" }}>{training.model}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{training.accuracy}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>{training.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 2 && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    mb: 2,
                  }}
                >
                </Typography>
                {isLoadingData ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress sx={{ color: "primary.main" }} />
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Dataset Name</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Description</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Date</TableCell>
                          <TableCell sx={{ color: "text.primary", fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {datasetPool && datasetPool.length > 0 ? (
                          datasetPool.map((dataset) => (
                            <TableRow key={dataset.ID}>
                              <TableCell sx={{ color: "text.primary" }}>
                                {dataset.DatasetName || "N/A"}
                              </TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>
                                {dataset.Note || "No description available"}
                              </TableCell>
                              <TableCell sx={{ color: "text.secondary" }}>
                                {dataset.date || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {/* <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handlePreviewModalOpen(dataset)}
                                >
                                  View Details
                                </Button> */}
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  sx={{ ml: 1 }}
                                  onClick={() => handleDownloadCellsData(dataset.ID,dataset.DatasetName)}
                                >
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} sx={{ textAlign: "center", color: "text.secondary" }}>
                              No datasets available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {downloadStatus && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: downloadStatus.type === "success" ? "green.600" : "red.600",
                      mt: 2,
                    }}
                  >
                    {downloadStatus.message || "Status unavailable"}
                  </Typography>
                )}
              </>
            )}
          </Paper>
        </Box>

        {/* Feedback Modal */}
        <Modal
          isOpen={openFeedbackModal}
          onClose={() => setOpenFeedbackModal(false)}
          onSave={handleFeedbackSubmit}
          title={`Add Feedback for ${currentSubmission?.DatasetName}`}
          saveButtonText="Submit"
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback (e.g., 'Missing values in column X')"
            />
          </Box>
        </Modal>

        {/* Preview Modal */}
        <Modal
          isOpen={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          title={
            currentSubmission
              ? `Submission Details: ${currentSubmission?.DatasetName}`
              : `Dataset Preview: ${currentDataset?.DatasetName}`
          }
          saveButtonText="Close"
          onSave={() => setOpenPreviewModal(false)}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {currentSubmission ? (
              <>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Doctor:</strong> {currentSubmission?.Sender}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Date:</strong> {currentSubmission?.date || "Unknown"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Notes:</strong> {currentSubmission?.Note}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Status:</strong> {currentSubmission?.Status}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Description:</strong> {currentDataset?.Note || "No description available"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Summary:</strong> {currentDataset?.summary || "Summary not available"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Date:</strong> {currentDataset?.date || "Unknown"}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}
