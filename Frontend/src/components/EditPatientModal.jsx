import React, { useState, useEffect } from "react";

const EditPatientForm = ({
  patientData, // The patient details passed for editing
  handleEditPatientData, // The function to handle the form submission
  setIsEditPatientModalOpen, // Function to close the modal
}) => {
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    phoneNumber: "",
    patientId: "",
    address: "",
    consultDate: "",
    vitals: {
      bp: "",
      weight: "",
      spo2: "",
    },
    doctor: {
      name: "",
      id: "",
      specialization: "",
    },
  });

  useEffect(() => {
    if (patientData) {
      setPatientDetails(patientData); // Pre-fill the form with existing patient data
    }
  }, [patientData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested field changes
  const handleNestedChange = (section, name, value) => {
    setPatientDetails((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditPatientData(patientDetails); // Submit the updated patient data
    setIsEditPatientModalOpen(false); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white w-1/2 max-w-4xl p-6 rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-2 right-5 text-2xl font-bold text-gray-600 hover:text-red-500"
          onClick={() => setIsEditPatientModalOpen(false)}
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Edit Patient Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Information */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Patient Name"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.age}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Contact Number"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.phoneNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.address}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="consultDate"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.consultDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Vitals */}
          <h3 className="text-lg font-medium text-gray-700">Vitals</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="B.P (e.g., 120/80)"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.vitals.bp}
              onChange={(e) =>
                handleNestedChange("vitals", "bp", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Weight (in Kgs)"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.vitals.weight}
              onChange={(e) =>
                handleNestedChange("vitals", "weight", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="SPO2 (e.g., 99%)"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.vitals.spo2}
              onChange={(e) =>
                handleNestedChange("vitals", "spo2", e.target.value)
              }
              required
            />
          </div>

          {/* Doctor Information */}
          <h3 className="text-lg font-medium text-gray-700">Doctor Details</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Doctor Name"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.doctor.name}
              onChange={(e) =>
                handleNestedChange("doctor", "name", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Doctor ID"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.doctor.id}
              onChange={(e) =>
                handleNestedChange("doctor", "id", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Specialization"
              className="block w-full p-3 border rounded-lg"
              value={patientDetails.doctor.specialization}
              onChange={(e) =>
                handleNestedChange("doctor", "specialization", e.target.value)
              }
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Update Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPatientForm;
