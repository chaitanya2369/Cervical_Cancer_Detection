import React, { useState, useEffect, useRef } from "react";
import {
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Zoom,
  Paper,
  Tooltip,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#49ab9b" },
    background: { default: "#f5f7fa", paper: "#fff" },
    text: { primary: "#263238", secondary: "#607d8b" },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(73, 171, 155, 0.2)",
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(110, 193, 174, 0.2)",
        },
      },
    },
  },
});

const Modal = ({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  width = "800px",
  height = "90vh",
  saveButtonText = "Save Changes",
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
    }

    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        setPosition((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        setStartPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startPos]);

  const handleMouseDown = (e) => {
    if (headerRef.current.contains(e.target)) {
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleSaveWithLoading = () => {
    setIsLoading(true);
    onSave();
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!isOpen) return null;

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
        PaperProps={{
          style: {
            width: width,
            maxHeight: height,
            transform: `translate(${position.x}px, ${position.y}px)`,
            touchAction: isDragging ? "none" : "auto",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ padding: 0,mb: 2 }}>
          <Box
            ref={headerRef}
            onMouseDown={handleMouseDown}
            sx={{
              background: darkMode
                ? "linear-gradient(135deg, #6ec1ae, #4f9c8b)"
                : "linear-gradient(135deg, #49ab9b, #3c8f81)",
              color: "#fff",
              px: 3,
              py: 2.5,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "move",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <DragHandleIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {title || "Edit Details"}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {/* <Tooltip title="Toggle Theme">
                <IconButton
                  size="small"
                  sx={{ color: "#fff" }}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip> */}
              <Tooltip title="Close">
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          <Paper elevation={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {children}
            </Box>
          </Paper>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            backgroundColor: darkMode ? "#263544" : "#fff",
            gap: "12px",
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: darkMode ? "text.primary" : "primary.main",
              color: darkMode ? "text.primary" : "primary.main",
              "&:hover": {
                borderColor: darkMode ? "#6ec1ae" : "#3e8c7e",
                backgroundColor: darkMode
                  ? "rgba(110, 193, 174, 0.1)"
                  : "rgba(73, 171, 155, 0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveWithLoading}
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: darkMode ? "#81d4bf" : "#3e8c7e" },
              "&:disabled": { bgcolor: "grey.500", cursor: "not-allowed" },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                Saving...
              </Box>
            ) : (
              saveButtonText
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Modal;
