import React from "react";

const EditPatientModal = ({ selectedPatient, setSelectedPatient, handleUpdatePatient }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl mb-4">Edit Patient</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePatient(selectedPatient);
          }}
        >
          <div className="mb-4">
            <label className="block mb-2" htmlFor="patientName">
              Patient Name:
            </label>
            <input
              type="text"
              id="patientName"
              value={selectedPatient?.name || ""}
              onChange={(e) => setSelectedPatient({ ...selectedPatient, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="patientStatus">
              Patient Status:
            </label>
            <input
              type="text"
              id="patientStatus"
              value={selectedPatient?.status || ""}
              onChange={(e) => setSelectedPatient({ ...selectedPatient, status: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
