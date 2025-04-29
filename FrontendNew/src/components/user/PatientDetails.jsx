import React, { useState } from "react";
// import PagesHeader from "../general/PagesHeader";
import Modal from "../general/Modal"; // Adjust path as needed

const PatientDetails = () => {
  // State for patient data
  const [patientData, setPatientData] = useState({
    contactInfo: {
      phone: "+91 8125455369",
      address: "Sheelanagar, Visakhapatnam, AndhraPradesh",
    },
    generalInfo: {
      name: "Caren G. Simpson",
      consultDate: "07-04-2025",
      patientID: "CC1520",
      age: "35 years old",
      dateOfBirth: "15-06-1985",
      status: "Active",
      image: "/images/review1.png", // Ensure this path is correct in your public/images folder
    },
    patientNotes: [
      {
        date: "Jun 8, 2027, 4:45 PM",
        note: "Asthma - Ensure the patient always carries an inhaler and avoids allergy triggers.",
      },
      {
        date: "Apr 9, 2028, 9:15 AM",
        note: "Hypertension - Advise the patient to engage in light exercise and monitor blood pressure weekly.",
      },
      {
        date: "Oct 10, 2027, 2:30 PM",
        note: "Type 2 Diabetes - Patient needs to monitor blood sugar levels regularly & follow the recommended diet.",
      },
    ],
    medicalInfo: {
      lastUpdated: "15 Jun 2028, 10:45 AM",
      bodyHeight: "5 ft 1.5 in",
      bodyWeight: "140 lbs",
      bodyMassIndex: "13 lbs",
      heartRate: "72 bpm",
      bloodPressure: "120/80 mmHg",
      bloodSugar: "90 mg/dL",
    },
  });

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({ ...patientData });

  // Handle input changes for general and contact info
  const handleInputChange = (section, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle note changes
  const handleNoteChange = (index, field, value) => {
    const updatedNotes = [...editedData.patientNotes];
    updatedNotes[index] = { ...updatedNotes[index], [field]: value };
    setEditedData((prev) => ({
      ...prev,
      patientNotes: updatedNotes,
    }));
  };

  // Handle medical info changes
  const handleMedicalInfoChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        [field]: value,
      },
    }));
  };

  // Save edited data
  const handleSave = () => {
    setPatientData(editedData);
    setIsEditModalOpen(false);
  };

  // Open edit modal with current data
  const handleEditClick = () => {
    setEditedData({ ...patientData });
    setIsEditModalOpen(true);
  };

  return (
    <>
      {/* <Header backText="Patients" title="Patient Details" /> */}
      <div className="bg-white shadow-md p-6">
        {/* Patient Header */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
              {patientData.generalInfo.image ? (
                <img
                  src={patientData.generalInfo.image}
                  alt={`${patientData.generalInfo.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">
                  {patientData.generalInfo.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {patientData.generalInfo.name}
              </h2>
              <p className="text-sm text-gray-600">
                Patient ID: {patientData.generalInfo.patientID}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-block bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
              {patientData.generalInfo.status}
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
            {/* General Info (Top) */}
            <div className="flex mb-6">
              <div className="bg-gray-50 p-4 rounded-lg w-1/2 mr-2">
                <h3 className="text-lg font-medium mb-4">General Info</h3>
                <p>
                  <strong>Consult Date: </strong>
                  <br />
                  {patientData.generalInfo.consultDate}
                </p>
                <p>
                  <strong>Age</strong>
                  <br />
                  {patientData.generalInfo.age}
                </p>
                <p>
                  <strong>Phone Number</strong>
                  <br />
                  {patientData.contactInfo.phone}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg w-1/2 ml-2">
                <p>
                  <strong>Date of Birth</strong>
                  <br />
                  {patientData.generalInfo.dateOfBirth}
                </p>
                <p>
                  <strong>Address</strong>
                  <br />
                  {patientData.contactInfo.address}
                </p>
              </div>
            </div>

            {/* Medical Info (Bottom) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Medical Info</h3>
              <p className="text-sm text-gray-500 mb-2">
                Last Updated on {patientData.medicalInfo.lastUpdated}{" "}
                <span className="ml-2">...</span>
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Body Height
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.medicalInfo.bodyHeight}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Body Weight
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.medicalInfo.bodyWeight}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Body Mass Index
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.medicalInfo.bodyMassIndex}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A3.72 3.72 0 0023 3z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Heart Rate
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.medicalInfo.heartRate}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 12H4"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Blood Pressure
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.medicalInfo.bloodPressure}
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg flex items-center space-x-3 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">
                      Blood Sugar
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {patientData.medicalInfo.bloodSugar}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Patient Notes</h3>
              <div className="space-y-4 flex flex-col">
                {patientData.patientNotes.map((note, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-300"
                  >
                    <p className="text-sm text-gray-700 font-medium">
                      {note.date}
                    </p>
                    <p className="text-gray-900 mt-2">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Data Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        title="Edit Patient Data"
      >
        <div className="space-y-4">
          {/* General Info */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={editedData.generalInfo.name}
              onChange={(e) =>
                handleInputChange("generalInfo", "name", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Consult Date
            </label>
            <input
              type="text"
              value={editedData.generalInfo.consultDate}
              onChange={(e) =>
                handleInputChange("generalInfo", "consultDate", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age</label>
            <input
              type="text"
              value={editedData.generalInfo.age}
              onChange={(e) =>
                handleInputChange("generalInfo", "age", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="text"
              value={editedData.generalInfo.dateOfBirth}
              onChange={(e) =>
                handleInputChange("generalInfo", "dateOfBirth", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <input
              type="text"
              value={editedData.generalInfo.status}
              onChange={(e) =>
                handleInputChange("generalInfo", "status", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone
            </label>
            <input
              type="text"
              value={editedData.contactInfo.phone}
              onChange={(e) =>
                handleInputChange("contactInfo", "phone", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              value={editedData.contactInfo.address}
              onChange={(e) =>
                handleInputChange("contactInfo", "address", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Medical Info */}
          {Object.keys(editedData.medicalInfo)
            .filter((key) => key !== "lastUpdated")
            .map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-medium mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type="text"
                  value={editedData.medicalInfo[key]}
                  onChange={(e) => handleMedicalInfoChange(key, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}

          {/* Patient Notes */}
          {editedData.patientNotes.map((note, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">
                Note {index + 1} Date
              </label>
              <input
                type="text"
                value={note.date}
                onChange={(e) =>
                  handleNoteChange(index, "date", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="block text-gray-700 font-medium mb-1">
                Note {index + 1} Text
              </label>
              <textarea
                value={note.note}
                onChange={(e) =>
                  handleNoteChange(index, "note", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default PatientDetails;
