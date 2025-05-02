import React, { useState, useRef } from "react";
import useDownloader from "react-use-downloader";
import { useAuth } from "../../context/auth";

const TrainingData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store files locally
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const { percentage, download, isInProgress } = useDownloader();
  const fileUrl = "/files/FinalFeatures.xlsx"; // Frontend-accessible path
  const filename = "File_Format.xlsx";

  const { auth, loading } = useAuth();

  if (loading || !auth.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        <p className="ml-4 text-xl font-semibold text-gray-700">Loading...</p>
      </div>
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
    handleUpload(file);
  };

  const handleUpload = (file) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Store file with unique ID (timestamp)
        setUploadedFiles((prev) => [...prev, { ...file, id: Date.now() }]);
        setUploadStatus({ type: "success", message: "File uploaded successfully!" });
        setSelectedFile(null);
        setUploadProgress(0);
      }
    }, 300);
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
  if (!CanTrain && !CanPredict) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-gray-800">
          You do not have permission to access this page.
        </h1>
      </div>
    );
  }

  return (
    <div className="m-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Training Data</h1>

      {CanTrain && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Upload Excel File for Training
          </h3>
          <div className="space-y-6">
            <p className="text-gray-600 text-sm">
              The file should be in .xlsx format, with a maximum size of 10 MB.
            </p>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              role="region"
              aria-describedby="upload-instructions"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gray-200 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 15l-6-6m0 0l-6 6m6-6v12"
                    />
                  </svg>
                </div>
              </div>
              <p id="upload-instructions" className="text-gray-700 font-medium">
                Drag and drop files to upload
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Your file will be private until you publish your profile.
              </p>
              <button
                onClick={handleSelectFiles}
                className="mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Select files to upload"
              >
                Select files
              </button>
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
                ref={fileInputRef}
                aria-hidden="true"
              />
            </div>

            {selectedFile && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-orange-500 mr-2">📄</span>
                    <span className="text-gray-700">{selectedFile.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{getFileSize(selectedFile)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                  />
                </div>
                <div className="text-right text-sm text-gray-500">{uploadProgress}%</div>
              </div>
            )}

            {uploadStatus && (
              <p
                className={`text-sm ${
                  uploadStatus.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {uploadStatus.message}
              </p>
            )}

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files</h4>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-center mt-2"
                  >
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-2">📄</span>
                      <span className="text-gray-700 text-sm">{file.name}</span>
                      <span className="text-gray-500 text-xs ml-2">{getFileSize(file)}</span>
                    </div>
                    <button
                      onClick={() => removeUploadedFile(file)}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                      aria-label={`Delete ${file.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2h8a2 2 0 00-2-2m-4 0V3m4 0V3m-7 4h10"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {(CanTrain || CanPredict) && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Excel File Format</h3>
          <div className="space-y-4">
            <button
              onClick={() => download(fileUrl, filename)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isInProgress}
              aria-label="Download file format"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {isInProgress ? `Downloading ${percentage}%` : "Download Format"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingData;
