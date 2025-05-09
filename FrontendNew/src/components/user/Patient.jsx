import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import PatientDetails from "./PatientDetails";

import { Trash2 } from "lucide-react";

// Define model constants for consistency
const MODELS = {
  SVM: "svm",
  LOGISTIC_REGRESSION: "logisticRegression",
};

// Define analysis types
const ANALYSIS_TYPES = {
  DIC: "dic",
  AF: "af",
};

import { useAuth } from "../../context/auth";

const Patient = ({ id }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentModel, setCurrentModel] = useState(MODELS.SVM);
  const [currentType, setCurrentType] = useState(ANALYSIS_TYPES.DIC);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [prescription, setPrescription] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpTests, setFollowUpTests] = useState([]);
  const [newTest, setNewTest] = useState("");
  const [activeTab, setActiveTab] = useState("Diagnosis");
  const [prediction, setPrediction] = useState("NA");
  const [responseData, setResponseData] = useState(null); // For prediction response
  const [historyData, setHistoryData] = useState(null); // For patient history
  const [showHistory, setShowHistory] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const location = useLocation();
  const { auth, loading } = useAuth();
  console.log("id:", id);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (uploadedFile) URL.revokeObjectURL(uploadedFile.url);
    };
  }, [uploadedFile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  } // Wait for loading to finish
  const canPredict = auth.user.CanPredict; // Check if user can predictf

  const parseFile = (file) => {
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        complete: (result) => {
          setParsedData(result.data);
          console.log(
            "Parsed JSON Data:",
            JSON.stringify(result.data, null, 2)
          );
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error("Error parsing CSV:", error);
          alert("Failed to parse the CSV file. Please check the file format.");
        },
      });
    } else if (file.name.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setParsedData(jsonData);
        console.log("Parsed JSON Data:", JSON.stringify(jsonData, null, 2));
      };
      reader.readAsArrayBuffer(file);
      reader.onerror = (error) => {
        console.error("Error reading XLSX file:", error);
        alert("Failed to parse the XLSX file. Please check the file format.");
      };
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      const fileUrl = URL.createObjectURL(file);
      setUploadedFile({
        file,
        url: fileUrl,
        name: file.name,
      });
      parseFile(file);
    } else {
      alert("Please upload a .csv or .xlsx file.");
    }
  };

  const handleDeleteFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
      setParsedData(null);
      setPrediction("NA");
      setResponseData(null);
      // Reset file input to allow reuploading
      const fileInput = document.getElementById("fileUpload");
      if (fileInput) fileInput.value = "";
    }
  };

  const handlePredict = async () => {
    if (!canPredict) {
      alert("You do not have permission to predict. Please contact the admin.");
      return;
    } else if (!id) {
      alert(
        "Patient ID is missing. Please ensure a valid patient is selected."
      );
      return;
    }
    if (!parsedData) {
      alert("Please upload a file and ensure it's parsed before predicting.");
      return;
    }

    setIsPredicting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/user/predict?model=${currentModel}&type=${currentType}&patientId=${id}`,
        { cells: parsedData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Prediction data:", parsedData);
      console.log("Prediction response:", response.data);
      setPrediction(response.data.prediction || "NA");
      setResponseData(response.data);
    } catch (error) {
      console.error("Error during prediction:", error);
      setPrediction("Error");
      alert("Failed to get prediction. Please try again or check the server.");
    } finally {
      setIsPredicting(false);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleFileClick = () => {
    if (uploadedFile) {
      toggleModal();
    }
  };

  const togglePreviewModal = () => setIsPreviewModalOpen(!isPreviewModalOpen);

  const addMedicine = () => {
    if (newMedicine && !prescription.includes(newMedicine)) {
      setPrescription([...prescription, newMedicine]);
      setNewMedicine("");
    }
  };

  const removeMedicine = (med) =>
    setPrescription(prescription.filter((m) => m !== med));

  const addTest = () => {
    if (newTest && !followUpTests.includes(newTest)) {
      setFollowUpTests([...followUpTests, newTest]);
      setNewTest("");
    }
  };

  const removeTest = (test) =>
    setFollowUpTests(followUpTests.filter((t) => t !== test));

  const handleSaveDetails = async () => {
    if (!note || note.trim() === "") {
      alert("Please add notes before saving. Notes are required.");
      setActiveTab("Notes");
      return;
    }

    try {
      const noteData = {
        note,
        prescription: prescription.join(", "),
        followUpDate: followUpDate ? followUpDate.toISOString() : null,
        followUpTests: followUpTests.join(", "),
        prediction,
        modelUsed: currentModel,
        consultDate: new Date().toISOString(),
      };

      console.log("Saving patient details:", noteData);

      const response = await axios.patch(
        `${apiUrl}/user/add-note/${id}`,
        noteData
      );

      if (response.status === 200) {
        console.log("Patient details saved successfully:", response.data);
        alert("Patient details saved successfully!");
        setShowHistory(true);
        getPatientHistory(); // Refresh history after saving
      } else {
        throw new Error("Failed to save patient details");
      }
    } catch (error) {
      console.error("Error saving patient details:", error);
      alert(
        `Error saving patient details: ${
          error.message || "Unknown error occurred"
        }`
      );
    }
  };

  const getPatientHistory = async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await axios.get(`${apiUrl}/user/history/${id}`);
      if (response.status === 200) {
        console.log("Patient history:", response.data);
        setHistoryData(response.data.history?.History); // Set to History array
        setShowHistory(true);
      } else {
        throw new Error("Failed to fetch patient history");
      }
    } catch (error) {
      console.error("Error fetching patient history:", error);
      setHistoryError(error.message || "Unknown error occurred");
      setShowHistory(false);
      alert(
        `Error fetching patient history: ${
          error.message || "Unknown error occurred"
        }`
      );
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Get display labels for models and types
  const getModelDisplayName = (model) => {
    return model === MODELS.SVM ? "SVM" : "Logistic Regression";
  };

  const getTypeDisplayName = (type) => {
    return type === ANALYSIS_TYPES.DIC ? "DIC" : "AF";
  };

  // Helper to extract prediction and probability from Prediction array
  const getPredictionData = (predictionArray) => {
    const predictionObj = {};
    predictionArray.forEach((item) => {
      if (item.Key === "prediction") {
        predictionObj.prediction = item.Value;
      } else if (item.Key === "probaility") {
        predictionObj.probaility = item.Value;
      }
    });
    return predictionObj;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Patient Details Section */}
        <div className="mb-6">
          <PatientDetails id={id} />
        </div>

        {/* Main Content Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="border-b mb-6">
            <div className="flex space-x-6">
              {["Diagnosis", "Notes", "Prescription", "FollowUp"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-teal-500 text-teal-600"
                      : "text-gray-600 hover:text-gray-800"
                  } transition-colors`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "Diagnosis" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Model Selection
                </h3>
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-600 mb-2">
                    Model
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(MODELS).map((model) => (
                      <button
                        key={model}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          currentModel === model
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition-colors`}
                        onClick={() => setCurrentModel(model)}
                      >
                        {getModelDisplayName(model)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-600 mb-2">
                    Analysis Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(ANALYSIS_TYPES).map((type) => (
                      <button
                        key={type}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          currentType === type
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } transition-colors`}
                        onClick={() => setCurrentType(type)}
                      >
                        {getTypeDisplayName(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                  {uploadedFile ? (
                    <div className="flex items-center justify-center space-x-2">
                      <p
                        onClick={handleFileClick}
                        className="text-teal-600 cursor-pointer hover:underline"
                      >
                        Uploaded: {uploadedFile.name}
                      </p>
                      <button
                        onClick={handleDeleteFile}
                        className="text-red-500 hover:text-red-700 transition-colors text-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="fileUpload"
                      className="text-teal-600 cursor-pointer hover:underline"
                    >
                      Upload .csv/.xlsx
                    </label>
                  )}
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".csv, .xlsx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <button
                  onClick={handlePredict}
                  disabled={isPredicting && !canPredict}
                  className={`mt-4 w-full py-2 rounded-lg transition-colors ${
                    isPredicting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  }`}
                >
                  {isPredicting ? "Predicting..." : "Predict"}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Prediction Results
                </h3>
                {responseData && responseData.prediction ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Model
                          </th>
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Type
                          </th>
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Predictions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-gray-700">
                            {getModelDisplayName(currentModel)}
                          </td>
                          <td className="p-3 text-gray-700">
                            {getTypeDisplayName(currentType)}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-2">
                              {responseData.prediction.map((val, idx) => {
                                const maxProb =
                                  responseData.probaility &&
                                  responseData.probaility[idx]
                                    ? Math.max(...responseData.probaility[idx])
                                    : 0;
                                const percentage = (maxProb * 100).toFixed(2);
                                return (
                                  <span
                                    key={idx}
                                    className={`px-3 py-1 text-sm rounded-full font-semibold ${
                                      val === 1
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    Cell {idx}: {val} ({percentage}%)
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    No predictions available. Please upload a file and predict.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Notes" && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Add notes here..."
              required
            />
          )}

          {activeTab === "Prescription" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  value={newMedicine}
                  onChange={(e) => setNewMedicine(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select Medicine</option>
                  {["Medicine A", "Medicine B", "Medicine C"].map((med) => (
                    <option key={med} value={med}>
                      {med}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addMedicine}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {prescription.map((med) => (
                  <li
                    key={med}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700">{med}</span>
                    <button
                      onClick={() => removeMedicine(med)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "FollowUp" && (
            <div className="space-y-4">
              <div className="mb-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Follow-up Date
                </label>
                <DatePicker
                  selected={followUpDate}
                  onChange={(date) => setFollowUpDate(date)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select Test</option>
                  {["Blood Test", "MRI", "CT Scan"].map((test) => (
                    <option key={test} value={test}>
                      {test}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addTest}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {followUpTests.map((test) => (
                  <li
                    key={test}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700">{test}</span>
                    <button
                      onClick={() => removeTest(test)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={togglePreviewModal}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Preview & Edit Details
            </button>
            <button
              onClick={() => {
                if (showHistory) {
                  setShowHistory(false);
                  setHistoryData(null);
                  setHistoryError(null);
                } else {
                  getPatientHistory();
                }
              }}
              disabled={isHistoryLoading}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isHistoryLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {isHistoryLoading
                ? "Loading..."
                : showHistory
                ? "Hide History"
                : "View History"}
            </button>
          </div>

          {/* Patient History Section */}
          {showHistory && (
            <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Patient History
              </h3>
              {historyError && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                  Error: {historyError}
                </div>
              )}
              {isHistoryLoading && (
                <div className="text-center text-gray-600">
                  Loading history...
                </div>
              )}
              {!isHistoryLoading &&
                !historyError &&
                historyData?.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Consult Date
                          </th>
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Model
                          </th>
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Type
                          </th>
                          <th className="p-3 text-sm font-semibold text-gray-600">
                            Predictions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData != null &&
                          historyData.map((entry, index) => {
                            const predictionData = getPredictionData(
                              entry.Prediction
                            );
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-gray-50 transition-colors"
                              >
                                <td className="p-3 text-gray-700">
                                  {new Date(
                                    entry.CreatedAt
                                  ).toLocaleDateString()}
                                  {<br />}
                                  {new Date(
                                    entry.CreatedAt
                                  ).toLocaleTimeString()}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {entry.Model?.toUpperCase()}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {entry.Type?.toUpperCase()}
                                </td>
                                <td className="p-3">
                                  <div className="flex flex-wrap gap-2">
                                    {predictionData.prediction?.map(
                                      (val, idx) => {
                                        const maxProb =
                                          predictionData.probaility &&
                                          predictionData.probaility[idx]
                                            ? Math.max(
                                                ...predictionData.probaility[
                                                  idx
                                                ]
                                              )
                                            : 0;
                                        const percentage = (
                                          maxProb * 100
                                        ).toFixed(2);
                                        return (
                                          <span
                                            key={idx}
                                            className={`px-3 py-1 text-sm rounded-full font-semibold ${
                                              val === 1
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                          >
                                            Cell {idx}: {val} ({percentage}%)
                                          </span>
                                        );
                                      }
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              {!isHistoryLoading &&
                !historyError &&
                (!historyData || historyData.length === 0) && (
                  <div className="text-center text-gray-600">
                    No history available for this patient.
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              File Preview
            </h3>
            <p className="mb-2">File: {uploadedFile?.name}</p>
            {parsedData && (
              <pre className="mt-2 max-h-60 overflow-auto bg-gray-50 p-4 rounded">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            )}
            <button
              onClick={toggleModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Preview & Edit Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Preview & Edit Details
            </h2>

            {/* Notes Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Notes
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Edit notes here..."
                required
              />
            </div>

            {/* Prescription Section */}
            <div className="mb-6">
              <h3 className="text-lgd font-semibold text-gray-700 mb-2">
                Prescription
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <select
                  value={newMedicine}
                  onChange={(e) => setNewMedicine(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select Medicine</option>
                  {["Medicine A", "Medicine B", "Medicine C"].map((med) => (
                    <option key={med} value={med}>
                      {med}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addMedicine}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {prescription.map((med) => (
                  <li
                    key={med}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700">{med}</span>
                    <button
                      onClick={() => removeMedicine(med)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow-up Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Follow-up
              </h3>
              <div className="mb-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Follow-up Date
                </label>
                <DatePicker
                  selected={followUpDate}
                  onChange={(date) => setFollowUpDate(date)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select Test</option>
                  {["Blood Test", "MRI", "CT Scan"].map((test) => (
                    <option key={test} value={test}>
                      {test}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addTest}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {followUpTests.map((test) => (
                  <li
                    key={test}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700">{test}</span>
                    <button
                      onClick={() => removeTest(test)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  if (!note || note.trim() === "") {
                    alert(
                      "Please add notes before saving. Notes are required."
                    );
                    return;
                  }
                  handleSaveDetails();
                  togglePreviewModal();
                }}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={togglePreviewModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patient;
