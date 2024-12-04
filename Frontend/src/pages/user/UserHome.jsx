import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../../components/DashboardHeader";
import Overview from "../../components/Overview";
import PatientManagement from "../../components/PatientManagement";
import EditPatientModal from "../../components/EditPatientModal";
import AddPatientForm from "../../components/addPatientForm";
import TrainModel from "../trainer/TrainModel"; // Import TrainModel component

const UserHome = () => {
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("all");
  const [inActivePatients, setInActivePatients] = useState([]);
  const [activePatients, setActivePatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // Fetch patients data
  const fetchPatients = async () => {
    try {
      const inActivePatientsResponse = await axios.get(
        "http://localhost:8080/admin/get-inactive"
      );
      setInActivePatients(inActivePatientsResponse.data?.patients || []);

      const activePatientsResponse = await axios.get(
        "http://localhost:8080/admin/get-active"
      );
      setActivePatients(activePatientsResponse.data?.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setInActivePatients([]);
      setActivePatients([]);
    }
  };

  useEffect(() => {
    fetchPatients(); // Fetch patients on initial load
  }, []);

  // Define filtered patients based on the selected tab
  const filteredPatients =
    tab === "Active Treatment"
      ? activePatients
      : tab === "Inactive Treatment"
      ? inActivePatients
      : [...activePatients, ...inActivePatients];

  // Handle opening and closing of Add Patient modal
  const handleAddPatient = () => {
    setIsAddPatientModalOpen(true);
  };

  const handleCloseAddPatientModal = () => {
    setIsAddPatientModalOpen(false);
  };

  // Handle adding new patient data
  const handleAddPatientData = async (patientDetails) => {
    try {
      await axios.post("http://localhost:8080/admin/add-patient", patientDetails);
      alert("Patient added successfully!");
      fetchPatients();
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    }
  };

  // Handle editing patient data
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleUpdatePatientData = async (updatedPatient) => {
    try {
      await axios.put("http://localhost:8080/admin/update-patient", updatedPatient);
      alert("Patient details updated successfully!");
      fetchPatients();
      setSelectedPatient(null); // Close the modal after update
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient. Please try again.");
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-1">
          <aside className="w-64 bg-white shadow-md">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      view === "overview" ? "bg-blue-500 text-white" : "text-gray-600"
                    }`}
                    onClick={() => setView("overview")}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      view === "All Patients" ? "bg-blue-500 text-white" : "text-gray-600"
                    }`}
                    onClick={() => setView("All Patients")}
                  >
                    Patients
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded ${
                      view === "Train Model" ? "bg-blue-500 text-white" : "text-gray-600"
                    }`}
                    onClick={() => setView("Train Model")}
                  >
                    Train Model
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            {view === "overview" && <Overview />}
            {view === "All Patients" && (
              <PatientManagement
                tab={tab}
                setTab={setTab}
                filteredPatients={filteredPatients}
                handleAddPatient={handleAddPatient}
                handleEditPatient={handleEditPatient}
              />
            )}
            {view === "Train Model" &&  <TrainModel />} {/* Render Train Model */}
          </main>
        </div>

        {/* Add Patient Modal */}
        {isAddPatientModalOpen && (
          <AddPatientForm
            setIsAddPatientModalOpen={setIsAddPatientModalOpen}
            handleAddPatientData={handleAddPatientData}
          />
        )}

        {/* Edit Patient Modal */}
        {selectedPatient && (
          <EditPatientModal
            patient={selectedPatient}
            handleUpdatePatientData={handleUpdatePatientData}
            closeModal={() => setSelectedPatient(null)}
          />
        )}
      </div>
    </>
  );
};

export default UserHome;
