import React from "react";
import { useNavigate } from "react-router-dom";

const PatientManagement = ({
  tab,
  setTab,
  handleAddPatient,
  filteredPatients
}) => {
  const navigate = useNavigate();

  // // Filter patients based on the current tab
  // const filteredPatients =
  //   tab === "Active Treatment"
  //     ? filteredPatients.filter((patient) => patient.status === "Active Treatment")
  //     : tab === "Inactive Treatment"
  //     ? filteredPatients.filter((patient) => patient.status === "Inactive Treatment")
  //     : filteredPatients;
  console.log(filteredPatients);

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setTab("Active Treatment")}
          className={`px-4 py-2 rounded ${
            tab === "Active Treatment" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Active Treatment
        </button>
        <button
          onClick={() => setTab("Inactive Treatment")}
          className={`px-4 py-2 rounded ${
            tab === "Inactive Treatment" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Inactive Treatment
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded ${
            tab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All Patients
        </button>
      </div>

      <button
        onClick={handleAddPatient}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add New Patient
      </button>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Patient ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Contact</th>
            <th className="p-2 text-left">Doctor</th>
            {/* <th className="p-2 text-left">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No patients found
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/user/viewpatient`, { state: { patientID: patient.ID } })}
              >
                <td className="p-2">{patient.ID}</td>
                <td className="p-2">{patient.Name}</td>
                <td className="p-2">{patient.PhoneNumber}</td>
                <td className="p-2">{patient.Doctor.Name}</td>
                {/* <td className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleEditPatient(patient);
                    }}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientManagement;
