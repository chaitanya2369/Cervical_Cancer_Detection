import React, { useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const ViewPatient = () => {
  const [dicImage, setDicImage] = useState(null);
  const [afImage, setAfImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("DIC");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpTests, setFollowUpTests] = useState([]);
  const [newTest, setNewTest] = useState("");
  const [activeTab, setActiveTab] = useState("Notes");
  const [prediction,setPrediction] = useState("NA");

  const [responseData,setResponseData] = useState([]);

  const [showHistory, setShowHistory] = useState(false);

  const location = useLocation();
  const patientID = location.state?.patientID;
  const [selectedPatientDetails, setSelectedPatientDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const handleViewPatient = async (patientID) => {
    console.log("Patient ID: ",patientID);
    try {
      const response = await axios.post("http://localhost:8080/user/get-patient", {
        "ID":patientID
      });
      console.log("response data:",response.data.patient.Images[0])
      setSelectedPatientDetails(response.data.patient);
      console.log("Response Data:",selectedPatientDetails)
      setResponseData(response.data);
      setLoading(false);
      console.log(responseData)
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setError("Failed to fetch patient details. Please try again.");
      setLoading(false);
    }

  };
  useEffect(() => {
    if (patientID) {
      handleViewPatient(patientID);
    }
  }, [patientID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!selectedPatientDetails) {
    return <div>No patient details found</div>;
  }



  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleTabSwitch = (type) => {
    setCurrentImage(type);
  };

  const handleImageUpload = async (event, type) => {
    // const file = URL.createObjectURL(event.target.files[0]);
    const file = event.target.files[0];
    if (type === "DIC") {
      // setDicImage(file);
      setDicImage(URL.createObjectURL(file));
    } else {
      // setAfImage(file);
      setAfImage(URL.createObjectURL(file));
    }

    const formData = new FormData();
    console.log("p:0"+patientID)
    formData.append("image", file);
    formData.append("id", patientID)
    formData.append("type", type)

    try {
      // Send the file to the backend
      const response = await axios.post(
        "http://localhost:8080/user/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction); // Assume the backend returns a prediction
      setResponseData(response.data);
      console.log("Prediction:", response.data.prediction);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }

  };

  const prescriptionOptions = ["Medicine A", "Medicine B", "Medicine C"];
  const followUpTestOptions = ["Blood Test", "MRI", "CT Scan"];

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    toggleModal();
  };

  const addMedicine = () => {
    if (newMedicine && !prescription.includes(newMedicine)) {
      setPrescription([...prescription, newMedicine]);
      setNewMedicine("");
    }
  };

  const removeMedicine = (med) => {
    setPrescription(prescription.filter((m) => m !== med));
  };

  const addTest = () => {
    if (newTest && !followUpTests.includes(newTest)) {
      setFollowUpTests([...followUpTests, newTest]);
      setNewTest("");
    }
  };

  const removeTest = (test) => {
    setFollowUpTests(followUpTests.filter((t) => t !== test));
  };

  

  return (
    <>
      <DashboardHeader />
      
      <div className="bg-slate-400 flex justify-between">
        {/* Patient Info */}
        <div className="w-1/3 p-4 border-x-2">
          <ul>
            <li className="my-1">
              <b>Patient Id: </b>{selectedPatientDetails.ID}
            </li>
            <li className="my-1">
              <b>Name: </b>{selectedPatientDetails.Name}
            </li>
            <li className="my-1">
              <b>Age: </b>{selectedPatientDetails.Age}
            </li>
            <li className="my-1">
              <b>Contact: </b>{selectedPatientDetails.PhoneNumber}
            </li>
            <li className="my-1">
              <b>Address:</b>{selectedPatientDetails.Address}
            </li>
          </ul>
        </div>

        {/* Consultation Info */}
        <div className="p-4 w-1/3 border-x-2">
          <ul>
            <li className="my-1">
              <b>Consult Date: </b>{selectedPatientDetails.ConsultDate}
            </li>
            <li className="my-1">
              <b>B.P: </b>{selectedPatientDetails.Vitals.BP}
            </li>
            <li className="my-1">
              <b>Weight: </b>{selectedPatientDetails.Vitals.Weight}
            </li>
            <li className="my-1">
              <b>SPo2: </b>{selectedPatientDetails.Vitals.SPO2}
            </li>
          </ul>
        </div>

        {/* Doctor Info */}
        <div className="p-4 w-1/3 border-x-2">
          <ul>
            <li className="my-1">
              <b>Doctor Name: </b>{selectedPatientDetails.Doctor.Name}
            </li>
            <li className="my-1">
              <b>Doctor Id: </b>{selectedPatientDetails.Doctor.ID}
            </li>
            <li className="my-1">
              <b>Specialisation: </b>{selectedPatientDetails.Doctor.Specialization}
            </li>
          </ul>
        </div>
      </div>

      {/* Diagnosis Information */}
      <div className="p-5">
        <h1 className="font-semibold">Diagnosis Information: </h1>
        <div className="flex justify-around h-2/3">
          <div
            className="flex flex-col justify-between border p-4 bg-slate-500"
            style={{ width: "450px", height: "450px" }}
          >
            <div className="flex mb-4">
              <button
                className={`px-4 py-2 ${
                  currentImage === "DIC" ? "bg-blue-200" : ""
                }`}
                onClick={() => handleTabSwitch("DIC")}
              >
                DIC
              </button>
              <button
                className={`px-4 py-2 ${
                  currentImage === "AF" ? "bg-blue-200" : ""
                }`}
                onClick={() => handleTabSwitch("AF")}
              >
                AF
              </button>
            </div>

            {/* Display DIC or AF Image */}
            <div
              className="p-4 w-auto"
              style={{ cursor: "pointer", height: "70%" }}
            >
              {currentImage === "DIC" && dicImage ? (
                <img
                  src={dicImage}
                  alt="DIC"
                  className="w-full h-full"
                  onClick={() => handleImageClick(dicImage)}
                />
              ) : currentImage === "AF" && afImage ? (
                <img
                  src={afImage}
                  alt="AF"
                  className="w-full h-full"
                  onClick={() => handleImageClick(afImage)}
                />
              ) : (
                <label
                  className="block text-center border-2 border-dashed border-gray-300 p-4 cursor-pointer"
                  onClick={() => document.getElementById("imageUpload").click()}
                >
                  Click Here to upload the image
                </label>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, currentImage)}
                className="mt-2 cursor-pointer hidden"
                id="imageUpload"
              />
            </div>

            {/* Predict and Reupload */}
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white">
                Predict
              </button>
              <button
                onClick={() => document.getElementById("imageUpload").click()}
                className="px-4 py-2 bg-blue-500 text-white"
              >
                {dicImage || afImage ? "Reupload Image" : "Upload Image"}
              </button>
            </div>
          </div>

          {/* Cancer Details */}
          <div className="ml-8 flex flex-col">
            <div className="p-3 rounded-sm flex items-center my-2 bg-slate-400 w-full h-1/3">
              <b>Cancer Percentage: </b>{prediction}
            </div>
            <div className="p-3 rounded-sm flex items-center my-2 bg-slate-400 w-full h-1/3">
              <b>Model Accuracy: </b>96%
            </div>
            <div className="p-3 rounded-sm flex items-center my-2 bg-slate-400 w-full h-1/3">
              <b>Cancer Stage: </b>1
            </div>
          </div>

          {/* Doctor's Section: Tab Switching for Notes, Prescription, Follow-up */}
          <div className="ml-8 border p-4 w-1/3">
            <div className="flex mb-4">
              <button
                className={`px-4 py-2 ${
                  activeTab === "Notes" ? "bg-blue-200" : ""
                }`}
                onClick={() => setActiveTab("Notes")}
              >
                Notes
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "Prescription" ? "bg-blue-200" : ""
                }`}
                onClick={() => setActiveTab("Prescription")}
              >
                Prescription
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "FollowUp" ? "bg-blue-200" : ""
                }`}
                onClick={() => setActiveTab("FollowUp")}
              >
                Follow-up
              </button>
            </div>

            {/* Conditionally render content based on active tab */}
            {activeTab === "Notes" && (
              <div className="border p-3 bg-white rounded">
                <b>Notes:</b>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border p-2 rounded"
                  rows="5"
                />
              </div>
            )}

            {activeTab === "Prescription" && (
              <div className="border p-3 bg-white rounded">
                <b>Prescription:</b>
                <div className="flex items-center mt-2">
                  <select
                    value={newMedicine}
                    onChange={(e) => setNewMedicine(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Medicine</option>
                    {prescriptionOptions.map((med, idx) => (
                      <option key={idx} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addMedicine}
                    className="ml-2 px-4 py-2 bg-green-500 text-white"
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-2">
                  {prescription.map((med, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      {med}
                      <button
                        onClick={() => removeMedicine(med)}
                        className="ml-2 text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "FollowUp" && (
              <div className="border p-3 bg-white rounded">
                <b>Follow-up Date:</b>
                <DatePicker
                  selected={followUpDate}
                  onChange={(date) => setFollowUpDate(date)}
                  className="w-full border p-2 rounded mt-2"
                />
                <b className="mt-4 block">Tests:</b>
                <div className="flex items-center mt-2">
                  <select
                    value={newTest}
                    onChange={(e) => setNewTest(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Test</option>
                    {followUpTestOptions.map((test, idx) => (
                      <option key={idx} value={test}>
                        {test}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addTest}
                    className="ml-2 px-4 py-2 bg-green-500 text-white"
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-2">
                  {followUpTests.map((test, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      {test}
                      <button
                        onClick={() => removeTest(test)}
                        className="ml-2 text-red-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md  w-auto overflow-auto max-h-[90vh] max-w-[90vw]">
            <div className="overflow-auto">
              <img
                src={modalImage}
                alt="Enlarged"
                className="max-w-full max-h-full"
              />
            </div>
            <button
              onClick={toggleModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="px-6">
        {/* Button to toggle the patient's history */}
        <button
          onClick={toggleHistory}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showHistory ? "Hide Patient's History" : "View Patient's History"}
        </button>
        
        {/* Patient's history section, shown conditionally */}
        {showHistory && (
          <div className="flex flex-col p-6 items-center">
            <div className="bg-slate-400 px-12 pr-52 py-12 rounded-2xl mt-4">
              <p>
                <b>Consult Date: </b> 06-08-2024
              </p>
              <p>
                <b>Diagnosis Information:</b> About the Diagnosis Information
                regarding the patient
              </p>
              <ul>
                <li>
                  <b>Weight: </b> {responseData.Weight}
                </li>
                <li>
                  <b>Height: </b> 172 cm
                </li>
                <li>
                  <b>B.P: </b> 110/80 mmHg
                </li>
              </ul>
              <div className="flex mt-4">
                <img
                  src="/images/DICimage.png"
                  alt="Error Loading Image"
                  className="h-40 w-40"
                />
                <div className="ml-4">
                  <p>
                    <b>Cancer Percentage:</b> 15%
                  </p>
                  <p>
                    <b>Model Used:</b> DIC
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewPatient;
