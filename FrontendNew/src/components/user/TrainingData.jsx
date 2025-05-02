import React, { useState, useRef } from "react";
import useDownloader from "react-use-downloader";
import { useAuth } from "../../context/auth";

const TrainingData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Track uploaded files
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  
  const { percentage, download, cancel, isInProgress, error } = useDownloader();
  const fileUrl = "/files/FinalFeatures.xlsx"; // Update to a valid absolute path or URL
  const filename = "File_Format.xlsx";


    const { auth,loading } = useAuth();
  
    if(loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
  

  const handleFileChange = (file) => {
    if (file && file.name.endsWith(".xlsx") && file.size <= 10 * 1024 * 1024) { // 10 MB limit
      setSelectedFile(file);
      setUploadStatus(null);
      setUploadProgress(0);
      handleUpload(file);
    } else if (file && !file.name.endsWith(".xlsx")) {
      setSelectedFile(null);
      setUploadStatus({ type: "error", message: "Please upload a valid .xlsx file." });
    } else {
      setSelectedFile(null);
      setUploadStatus({ type: "error", message :"File size exceeds 10 MB limit." });
    }
  };

  const handleUpload = (file) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadedFiles((prev) => [...prev, file]);
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
    setUploadedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

    const user = auth.user;
    console.log("User data:", user);
    const CanTrain = user.CanTrain;
    console.log("User can train:", CanTrain);
    const CanPredict = user.CanPredict;
    console.log("User can predict:", CanPredict);

    return (
      CanTrain && CanPredict ? (
        <div className="m-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Training Data</h1>
    
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload Excel File for Training</h3>
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
                <p className="text-gray-700 font-medium">Drag and drop files to upload</p>
                <p className="text-gray-500 text-sm mt-1">
                  Your file will be private until you publish your profile.
                </p>
                <button
                  onClick={handleSelectFiles}
                  className="mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  Select files
                </button>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                  ref={fileInputRef}
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
                      key={index}
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
                        title="Delete"
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
    
          {/* Download Format Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Excel File Format</h3>
            <div className="space-y-4">
              <button
                onClick={() => download(fileUrl, filename)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
                disabled={isInProgress}
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
                {error && <span className="ml-2 text-red-500 text-sm">Error</span>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold text-gray-800">You do not have permission to access this page.</h1>
        </div>
      )
    );
  }    

export default TrainingData;
