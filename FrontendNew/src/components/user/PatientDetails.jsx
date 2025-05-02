import React, { useState, useEffect } from "react";
import Modal from "../general/Modal";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import Lucide icons
import {
  User,
  CalendarDays,
  Ruler,
  Weight,
  Activity,
  HeartPulse,
  Droplets,
  FileText,
  MapPin,
  Phone,
} from "lucide-react";

const SERVER_URL = import.meta.env.VITE_API_URL;

const PatientDetails = ({ id }) => {
  const [patientData, setPatientData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/get-patient/${id}`);
        console.log("Fetched Data:", response.data.patient);
        if(response.data.success) {
         
          // Transform backend response to match PATCH payload
          const fetchedData = {
            _id: response.data.patient.ID,
            name: response.data.patient.Name,
            age: response.data.patient.Age,
            phoneNumber: response.data.patient.PhoneNumber,
            address: response.data.patient.Address,
            consultdate: response.data.patient.ConsultDate,
            dateofbirth: response.data.patient.DateOfBirth,
            isactive: response.data.patient.IsActive,
            hospital: response.data.patient.Hospital,
            fields: {
            ...response.data.patient.fields,
            // Remove duplicate Blood Sugar, keep BloodSugar
            BloodSugar: response.data.patient.fields.BloodSugar || response.data.patient.fields["Blood Sugar"],
            "Blood Sugar": undefined,
          },
          notes: response.data.patient.Notes.map((note) => ({
            note: note.note,
            insertedat: note.insertedat, // Keep as string
          })),
        };
        setPatientData(fetchedData);
      }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        alert("Error fetching patient data: " + (error.message || "Unknown error"));
      }
    };
    
    if (id) {
      fetchPatientDetails();
    }
  }, [id]);
  
  console.log("patientData:",patientData)
  // Initialize editedData
  useEffect(() => {
    if (patientData) {
      setEditedData({ ...patientData });
    }
  }, [patientData]);

  // Handle input changes for top-level fields
  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle medical info changes
  const handleMedicalInfoChange = (field, value) => {
    setEditedData((prev) => {
      const newFields = { ...prev.fields, [field]: value };
      // Calculate BMI if Height or Weight changes
      if (field === "Height" || field === "Weight") {
        const height = field === "Height" ? parseFloat(value) : parseFloat(prev.fields.Height);
        const weight = field === "Weight" ? parseFloat(value) : parseFloat(prev.fields.Weight);
        newFields.BMI = height && weight ? (weight / ((height / 100) * (height / 100))).toFixed(2) : "N/A";
      }
      return { ...prev, fields: newFields };
    });
  };

  // Handle Blood Pressure changes
  const handleBloodPressureChange = (value) => {
    setEditedData((prev) => ({
      ...prev,
      fields: { ...prev.fields, BP: value },
    }));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return "N/A";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");
  };

  // Save edited data
  const handleSave = async () => {
    if (!editedData) return;

    // Validation
    if (!editedData.name) {
      alert("Please enter a valid name.");
      return;
    }
    if (!editedData.age || parseInt(editedData.age) < 0) {
      alert("Please enter a valid age.");
      return;
    }
    if (!editedData.phoneNumber || !/^\d{10}$/.test(editedData.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!editedData.fields.Height || parseInt(editedData.fields.Height) <= 0) {
      alert("Please enter a valid body height.");
      return;
    }
    if (!editedData.fields.Weight || parseInt(editedData.fields.Weight) <= 0) {
      alert("Please enter a valid body weight.");
      return;
    }
    if (!editedData.fields.BP || !/^\d+\/\d+$/.test(editedData.fields.BP)) {
      alert("Please enter a valid blood pressure (e.g., 120/89).");
      return;
    }
    if (
      editedData.fields.BloodSugar &&
      editedData.fields.BloodSugar !== "N/A" &&
      !/^\d+$/.test(editedData.fields.BloodSugar)
    ) {
      alert("Please enter a valid blood sugar value (number or N/A).");
      return;
    }
    if (
      editedData.fields["Blood Group"] &&
      !/^(A\+|A\-|B\+|B\-|O\+|O\-|AB\+|AB\-)$/.test(editedData.fields["Blood Group"])
    ) {
      alert("Please enter a valid blood group (e.g., A+, B-, O+).");
      return;
    }

    // Prepare data for API, exclude _ui
    const { _ui, ...dataToSend } = editedData;

    try {
      const response = await axios.patch(`${SERVER_URL}/user/edit-patient/${id}`, dataToSend);
      if (response.status === 200) {
        setPatientData(editedData);
        setIsEditModalOpen(false);
        alert("Patient data updated successfully!");
      } else {
        throw new Error("Failed to update patient data");
      }
    } catch (error) {
      console.error("Error updating patient data:", error);
      alert("Error updating patient data: " + (error.message || "Unknown error"));
    }
  };

  // Open edit modal
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  if (!patientData) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const displayBP = patientData.fields?.BP || "N/A";
  
  return (
    <>
      <div className="bg-white shadow-md p-6">
        {/* Patient Header */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
              {true ? (
                <img
                  src="/images/review1.png"
                  alt={`${patientData.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">{patientData.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{patientData.name}</h2>
              <p className="text-sm text-gray-600">Patient ID: {patientData._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-block bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
              {patientData.isactive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm transition-colors"
            >
              Edit Data
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-6">
          <div className="w-2/3">
            {/* General Info */}
            <div className="flex mb-6">
              <div className="bg-gray-50 p-4 rounded-lg w-1/2 mr-2">
                <h3 className="text-lg font-medium mb-4">General Info</h3>
                <p>
                  <strong>Consult Date: </strong>
                  <br />
                  {formatDate(patientData.consultdate)}
                </p>
                <p>
                  <strong>Age</strong>
                  <br />
                  {patientData.age}
                </p>
                <p>
                  <strong>Phone Number</strong>
                  <br />
                  {patientData.phoneNumber}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg w-1/2 ml-2">
                <p>
                  <strong>Date of Birth</strong>
                  <br />
                  {formatDate(patientData.dateofbirth)}
                </p>
                <p>
                  <strong>Address</strong>
                  <br />
                  {patientData.address}
                </p>
              </div>
            </div>

            {/* Medical Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Medical Info</h3>
              <p className="text-sm text-gray-500 mb-2">
                Last Updated on {formatDate(patientData.ConsultDate)}
                <span className="ml-2">...</span>
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <Ruler className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Body Height</p>
                    <p className="text-lg font-bold text-teal-800">{patientData.fields.Height} cm</p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <Weight className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Body Weight</p>
                    <p className="text-lg font-bold text-teal-800">{patientData.fields.Weight} kgs</p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <Activity className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Body Mass Index</p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.fields?.BMI || "N/A"} Kg/m²
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <HeartPulse className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">SpO2</p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.fields?.SOP2 || "N/A"} bpm
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <Activity className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Blood Pressure</p>
                    <p className="text-lg font-bold text-teal-800">{displayBP} mmHg</p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <Droplets className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Blood Sugar</p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.fields?.BloodSugar || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <User className="w-6 h-6 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Blood Group</p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.fields?.["Blood Group"] || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col">
              <h3 className="text-lg font-medium mb-4">Patient Notes</h3>
              <div className="space-y-4 flex flex-col overflow-y-auto max-h-96 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {patientData.notes && patientData.notes.length > 0 ? (
                  patientData.notes.map((note, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-300"
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="text-xs text-gray-500">{formatDate(note.insertedat)}</span>
                      </div>
                      <p className="text-gray-900">{note.note || "No note content"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No notes available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Data Modal */}
      {isEditModalOpen && editedData && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Patient Data"
          onSave={handleSave}
        >
          <div className="p-6">
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-600" />
              General Information
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-teal-600" />
                  Name
                </label>
                <input
                  type="text"
                  value={editedData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1 text-teal-600" />
                  Consult Date
                </label>
                <DatePicker
                  selected={
                    editedData.consultdate && editedData.consultdate !== "N/A"
                      ? new Date(editedData.consultdate)
                      : null
                  }
                  onChange={(date) => handleInputChange("consultdate", date ? date.toISOString() : "N/A")}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholderText="Select date"
                  dateFormat="dd-MM-yyyy"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-teal-600" />
                  Age
                </label>
                <input
                  type="number"
                  value={editedData.age || ""}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-teal-600" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editedData.phoneNumber || ""}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1 text-teal-600" />
                  Date of Birth
                </label>
                <DatePicker
                  selected={
                    editedData.dateofbirth && editedData.dateofbirth !== "N/A"
                      ? new Date(editedData.dateofbirth)
                      : null
                  }
                  onChange={(date) => handleInputChange("dateofbirth", date ? date.toISOString() : "N/A")}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholderText="Select date"
                  dateFormat="dd-MM-yyyy"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-teal-600" />
                  Address
                </label>
                <input
                  type="text"
                  value={editedData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter address"
                />
              </div>
            </div>

            <h4 className="text-lg font-medium mb-4 flex items-center">
              <HeartPulse className="w-5 h-5 mr-2 text-teal-600" />
              Medical Information
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Ruler className="w-4 h-4 mr-1 text-teal-600" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={editedData.fields?.Height || ""}
                  onChange={(e) => handleMedicalInfoChange("Height", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter height"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Weight className="w-4 h-4 mr-1 text-teal-600" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={editedData.fields?.Weight || ""}
                  onChange={(e) => handleMedicalInfoChange("Weight", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Activity className="w-4 h-4 mr-1 text-teal-600" />
                  Body Mass Index (Kg/m²)
                </label>
                <input
                  type="text"
                  value={editedData.fields?.BMI || "N/A"}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                  placeholder="Calculated"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <HeartPulse className="w-4 h-4 mr-1 text-teal-600" />
                  SpO2 (bpm)
                </label>
                <input
                  type="number"
                  value={editedData.fields?.SOP2 || ""}
                  onChange={(e) => handleMedicalInfoChange("SOP2", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter SpO2"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Activity className="w-4 h-4 mr-1 text-teal-600" />
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  value={editedData.fields?.BP || ""}
                  onChange={(e) => handleBloodPressureChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 120/89"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <Droplets className="w-4 h-4 mr-1 text-teal-600" />
                  Blood Sugar
                </label>
                <input
                  type="text"
                  value={editedData.fields?.BloodSugar || ""}
                  onChange={(e) => handleMedicalInfoChange("BloodSugar", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter blood sugar"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-teal-600" />
                  Blood Group
                </label>
                <input
                  type="text"
                  value={editedData.fields?.["Blood Group"] || ""}
                  onChange={(e) => handleMedicalInfoChange("Blood Group", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., A+, B-, O+"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PatientDetails;
