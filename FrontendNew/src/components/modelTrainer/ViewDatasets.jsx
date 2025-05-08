import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_URL;

// Mock data for datasets (to be replaced with API call)
const mockDatasetPool = [
  { id: 1, name: "Cervical Images Q1 2024", description: "High-quality images", date: "2024-04-15", summary: "Rows: 150, Columns: 5, Missing Values: 0" },
  { id: 2, name: "Pap Smear Q2 2023", description: "Pap smear results", date: "2023-06-30", summary: "Rows: 200, Columns: 4, Missing Values: 10" },
];

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#26c6da" },
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
  },
});

export default function ViewDatasets() {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [datasetPool, setDatasetPool] = useState([]);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [currentDataset, setCurrentDataset] = useState(null);

  // Redirect if user is not logged in or lacks permissions
  useEffect(() => {
    if (!auth.user) {
      navigate("/login", { replace: true });
    } else if (!auth.user.CanTrain) {
      navigate("/unauthorized", { replace: true });
    } else {
      // Fetch datasets from API
      const fetchDatasets = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/datasets/approved`);
          if (response.data.success) {
            setDatasetPool(response.data.datasets);
          } else {
            setDatasetPool(mockDatasetPool); // Fallback to mock data
          }
        } catch (error) {
          console.error("Error fetching datasets:", error);
          setDatasetPool(mockDatasetPool); // Fallback to mock data
        }
      };
      fetchDatasets();
    }
  }, [auth.user, navigate]);

  // Show loading if data is not ready
  if (loading || !datasetPool) {
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
          Loading datasets...
        </Typography>
      </Box>
    );
  }

  const handlePreviewDialogOpen = (dataset) => {
    setCurrentDataset(dataset);
    setOpenPreviewDialog(true);
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
            Dataset Pool
          </Typography>

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
                {datasetPool.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell sx={{ color: "text.primary" }}>{dataset.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{dataset.description}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{dataset.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handlePreviewDialogOpen(dataset)}
                        sx={{
                          borderColor: darkMode ? "text.primary" : "primary.main",
                          color: darkMode ? "text.primary" : "primary.main",
                          "&:hover": {
                            borderColor: darkMode ? "#80deea" : "#00acc1",
                            bgcolor: darkMode ? "rgba(77, 208, 225, 0.1)" : "rgba(38, 198, 218, 0.1)",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)}>
        <DialogTitle sx={{ color: "text.primary" }}>
          Dataset Preview: {currentDataset?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Description: {currentDataset?.description}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Summary: {currentDataset?.summary}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
