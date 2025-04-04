import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const ViewPatient = () => {
  const [svmDicFile, setSvmDicFile] = useState(null);
  const [logisticDicFile, setLogisticDicFile] = useState(null);
  const [svmAfFile, setSvmAfFile] = useState(null);
  const [logisticAfFile, setLogisticAfFile] = useState(null);
  const [currentModel, setCurrentModel] = useState("svm_dic");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // New state for preview modal
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
  const [selectedPatientDetails, setSelectedPatientDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewPatient = async (patientID) => {
    try {
      const response = await axios.post("http://localhost:8080/user/get-patient", { "ID": patientID });
      setSelectedPatientDetails(response.data.patient);
      setResponseData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setError("Failed to fetch patient details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientID) handleViewPatient(patientID);
  }, [patientID]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!selectedPatientDetails) return <div className="text-center py-10">No patient details found</div>;

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      const fileUrl = URL.createObjectURL(file);
      const setters = {
        "svm_dic": setSvmDicFile,
        "logistic_regression_dic": setLogisticDicFile,
        "svm_af": setSvmAfFile,
        "logistic_regression_af": setLogisticAfFile,
      };
      setters[type](fileUrl);

      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          complete: (result) => {
            const jsonData = result.data;
            setParsedData(jsonData);
            console.log("Parsed JSON Data:", JSON.stringify(jsonData, null, 2));
          },
          header: true,
          skipEmptyLines: true,
          error: (error) => console.error("Error parsing CSV:", error),
        });
      } else if (file.name.endsWith('.xlsx')) {
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
    const file = { "svm_dic": svmDicFile, "logistic_regression_dic": logisticDicFile, "svm_af": svmAfFile, "logistic_regression_af": logisticAfFile }[currentModel];
    if (!file || !parsedData) {
      alert("Please upload a file and ensure it’s parsed before predicting.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/user/predict/${currentModel}`,
        { id: patientID, type: currentModel, data: parsedData },
        { headers: { "Content-Type": "application/json" } }
      );
      setPrediction(response.data.prediction);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error during prediction:", error);
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

  const removeMedicine = (med) => setPrescription(prescription.filter((m) => m !== med));

  const addTest = () => {
    if (newTest && !followUpTests.includes(newTest)) {
      setFollowUpTests([...followUpTests, newTest]);
      setNewTest("");
    }
  };

  const removeTest = (test) => setFollowUpTests(followUpTests.filter((t) => t !== test));

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Patient Details</h2>
          <div className="mb-6 bg-slate-300 p-3 rounded-xl " >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Patient Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-bold ">ID:</span> {selectedPatientDetails.ID}</li>
              <li><span className="font-bold">Name:</span> {selectedPatientDetails.Name}</li>
              <li><span className="font-bold">Age:</span> {selectedPatientDetails.Age}</li>
              <li><span className="font-bold">Contact:</span> {selectedPatientDetails.PhoneNumber}</li>
              <li><span className="font-bold">Address:</span> {selectedPatientDetails.Address}</li>
            </ul>
          </div>
          <div className="mb-6 bg-slate-300 p-3 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Consultation Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-bold">Consult Date:</span> {selectedPatientDetails.ConsultDate}</li>
              <li><span className="font-bold">B.P:</span> {selectedPatientDetails.Vitals?.BP || "N/A"} mmHg</li>
              <li><span className="font-bold">Weight:</span> {selectedPatientDetails.Vitals?.Weight || "N/A"} Kgs</li>
              <li><span className="font-bold">SPO2:</span> {selectedPatientDetails.Vitals?.SPO2 || "N/A"} % </li>
            </ul>
          </div>
          <div className="mb-6 bg-slate-300 p-3 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Doctor Information</h3>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Name:</span> {selectedPatientDetails.Doctor?.Name || "N/A"}</li>
              <li><span className="font-medium">ID:</span> {selectedPatientDetails.Doctor?.ID || "N/A"}</li>
              <li><span className="font-medium">Specialization:</span> {selectedPatientDetails.Doctor?.Specialization || "N/A"}</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex border-b mb-4">
              {["Diagnosis", "Notes", "Prescription", "FollowUp"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Diagnosis" && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Model Selection</h3>
                  <div className="flex space-x-2 mb-4">
                    {["svm_dic", "logistic_regression_dic", "svm_af", "logistic_regression_af"].map((model) => (
                      <button
                        key={model}
                        className={`px-3 py-1 rounded ${currentModel === model ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setCurrentModel(model)}
                      >
                        {model.replace("_", " ").toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="border-dashed border-2 p-4 text-center">
                    {svmDicFile && currentModel === "svm_dic" ? (
                      <p onClick={() => handleFileClick(svmDicFile)} className="cursor-pointer">Uploaded: {svmDicFile.split('/').pop()}</p>
                    ) : (
                      <label htmlFor="fileUpload" className="cursor-pointer">Upload .csv/.xlsx</label>
                    )}
                    <input
                      id="fileUpload"
                      type="file"
                      accept=".csv, .xlsx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, currentModel)}
                    />
                  </div>
                  <button onClick={handlePredict} className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Predict
                  </button>
                </div>
                <div>
                  <p><b>Cancer Percentage:</b> {prediction}</p>
                  <p><b>Model Accuracy:</b> 96%</p>
                  <p><b>Cancer Stage:</b> 1</p>
                </div>
              </div>
            )}

            {activeTab === "Notes" && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-40 p-2 border rounded"
                placeholder="Add notes here..."
              />
            )}

            {activeTab === "Prescription" && (
              <div>
                <select
                  value={newMedicine}
                  onChange={(e) => setNewMedicine(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="">Select Medicine</option>
                  {["Medicine A", "Medicine B", "Medicine C"].map((med) => (
                    <option key={med} value={med}>{med}</option>
                  ))}
                </select>
                <button onClick={addMedicine} className="bg-green-500 text-white px-4 py-2 rounded">
                  Add
                </button>
                <ul className="mt-2 space-y-2">
                  {prescription.map((med) => (
                    <li key={med} className="flex justify-between bg-gray-50 p-2 rounded">
                      {med}
                      <button onClick={() => removeMedicine(med)} className="text-red-500">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "FollowUp" && (
              <div>
                <DatePicker
                  selected={followUpDate}
                  onChange={(date) => setFollowUpDate(date)}
                  className="w-full p-2 border rounded mb-2"
                />
                <select
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="">Select Test</option>
                  {["Blood Test", "MRI", "CT Scan"].map((test) => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
                <button onClick={addTest} className="bg-green-500 text-white px-4 py-2 rounded">
                  Add
                </button>
                <ul className="mt-2 space-y-2">
                  {followUpTests.map((test) => (
                    <li key={test} className="flex justify-between bg-gray-50 p-2 rounded">
                      {test}
                      <button onClick={() => removeTest(test)} className="text-red-500">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Preview & Edit Button */}
          <button
            onClick={togglePreviewModal}
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Preview & Edit Details
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showHistory ? "Hide History" : "View History"}
          </button>
          {showHistory && (
            <div className="mt-4 bg-white shadow-md rounded-lg p-6">
              <h3 className="font-semibold mb-2">Patient History</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><b>Consult Date:</b> 06-08-2024</p>
                <p><b>Diagnosis:</b> About the diagnosis information...</p>
                <p><b>Cancer Percentage:</b> 15%</p>
                <p><b>Model Used:</b> SVM DIC</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg">
            <p>File: {modalFile?.split('/').pop()}</p>
            {parsedData && (
              <pre className="mt-2 max-h-60 overflow-auto">{JSON.stringify(parsedData, null, 2)}</pre>
            )}
            <button onClick={toggleModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}

      {/* Preview & Edit Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Preview & Edit Details</h2>

            {/* Notes Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 p-2 border rounded"
                placeholder="Edit notes here..."
              />
            </div>

            {/* Prescription Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Prescription</h3>
              <div className="flex items-center mb-2">
                <select
                  value={newMedicine}
                  onChange={(e) => setNewMedicine(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Medicine</option>
                  {["Medicine A", "Medicine B", "Medicine C"].map((med) => (
                    <option key={med} value={med}>{med}</option>
                  ))}
                </select>
                <button onClick={addMedicine} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {prescription.map((med) => (
                  <li key={med} className="flex justify-between bg-gray-50 p-2 rounded">
                    {med}
                    <button onClick={() => removeMedicine(med)} className="text-red-500">Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow-up Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Follow-up</h3>
              <div className="mb-2">
                <label className="block text-gray-600 mb-1">Follow-up Date</label>
                <DatePicker
                  selected={followUpDate}
                  onChange={(date) => setFollowUpDate(date)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center mb-2">
                <select
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Test</option>
                  {["Blood Test", "MRI", "CT Scan"].map((test) => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
                <button onClick={addTest} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {followUpTests.map((test) => (
                  <li key={test} className="flex justify-between bg-gray-50 p-2 rounded">
                    {test}
                    <button onClick={() => removeTest(test)} className="text-red-500">Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={togglePreviewModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default ViewPatient;