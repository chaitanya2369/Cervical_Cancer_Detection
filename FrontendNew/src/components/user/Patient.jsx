import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import PatientDetails from "./PatientDetails";

const Patient = () => {
  const [svmDicFile, setSvmDicFile] = useState(null);
  const [logisticDicFile, setLogisticDicFile] = useState(null);
  const [svmAfFile, setSvmAfFile] = useState(null);
  const [logisticAfFile, setLogisticAfFile] = useState(null);
  const [currentModel, setCurrentModel] = useState("svm_dic");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpTests, setFollowUpTests] = useState([]);
  const [newTest, setNewTest] = useState("");
  const [activeTab, setActiveTab] = useState("Diagnosis");
  const [prediction, setPrediction] = useState("NA");
  const [responseData, setResponseData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const location = useLocation();
  const patientID = location.state?.patientID;

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      const fileUrl = URL.createObjectURL(file);
      const setters = {
        svm_dic: setSvmDicFile,
        logistic_regression_dic: setLogisticDicFile,
        svm_af: setSvmAfFile,
        logistic_regression_af: setLogisticAfFile,
      };
      setters[type](fileUrl);

      if (file.name.endsWith(".csv")) {
        Papa.parse(file, {
          complete: (result) => {
            setParsedData(result.data);
            console.log("Parsed JSON Data:", JSON.stringify(result.data, null, 2));
          },
          header: true,
          skipEmptyLines: true,
          error: (error) => console.error("Error parsing CSV:", error),
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
      }
    } else {
      alert("Please upload a .csv or .xlsx file.");
    }
  };

  const handlePredict = async () => {
    if (!parsedData) {
      alert("Please upload a file and ensure it’s parsed before predicting.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/predict`,
        parsedData
      );
      setPrediction(response.data.prediction || "NA");
      setResponseData(response.data);
    } catch (error) {
      console.error("Error during prediction:", error);
      setPrediction("Error");
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleFileClick = (file) => {
    setModalFile(file);
    toggleModal();
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Patient Details Section */}
        <div className="mb-6">
          <PatientDetails />
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
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "svm_dic",
                    "logistic_regression_dic",
                    "svm_af",
                    "logistic_regression_af",
                  ].map((model) => (
                    <button
                      key={model}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        currentModel === model
                          ? "bg-teal-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition-colors`}
                      onClick={() => setCurrentModel(model)}
                    >
                      {model.replace("_", " ").toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                  {svmDicFile && currentModel === "svm_dic" ? (
                    <p
                      onClick={() => handleFileClick(svmDicFile)}
                      className="text-teal-600 cursor-pointer hover:underline"
                    >
                      Uploaded: {svmDicFile.split("/").pop()}
                    </p>
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
                    onChange={(e) => handleFileUpload(e, currentModel)}
                  />
                </div>
                <button
                  onClick={handlePredict}
                  className="mt-4 w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Predict
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    <span className="text-teal-600">Cancer Percentage:</span>{" "}
                    {prediction}%
                  </p>
                  <p className="text-md text-gray-600">
                    <span className="font-medium">Model Accuracy:</span> 96%
                  </p>
                  <p className="text-md text-gray-600">
                    <span className="font-medium">Cancer Stage:</span> 1
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notes" && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Add notes here..."
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
              onClick={() => setShowHistory(!showHistory)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              {showHistory ? "Hide History" : "View History"}
            </button>
          </div>

          {/* Patient History */}
          {showHistory && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Patient History
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Consult Date:</span> 06-08-2024
                </p>
                <p>
                  <span className="font-medium">Diagnosis:</span> About the
                  diagnosis information...
                </p>
                <p>
                  <span className="font-medium">Cancer Percentage:</span> 15%
                </p>
                <p>
                  <span className="font-medium">Model Used:</span> SVM DIC
                </p>
              </div>
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
            <p className="mb-2">File: {modalFile?.split("/").pop()}</p>
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Edit notes here..."
              />
            </div>

            {/* Prescription Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
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

            <div className="flex justify-end">
              <button
                onClick={togglePreviewModal}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patient;