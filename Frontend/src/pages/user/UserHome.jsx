import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../../components/DashboardHeader";
import Overview from "../../components/Overview";
import PatientManagement from "../../components/PatientManagement";
import AddPatientForm from "../../components/addPatientForm";
import TrainModel from "../trainer/TrainModel"; 
import { useLocation } from "react-router-dom";

const UserHome = () => {
  const [view, setView] = useState("overview");
  const [tab, setTab] = useState("all");
  const [inActivePatients, setInActivePatients] = useState([]);
  const [activePatients, setActivePatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);

  const location = useLocation();
  const { state } = location;
  console.log(state)
  // Fetch patients data
  const fetchPatients = async () => {
    try {
      const inActivePatientsResponse = await axios.get(
        "http://localhost:8080/user/get-Inactive"
      );
      setInActivePatients(inActivePatientsResponse.data?.active_patients || []);
  
      const activePatientsResponse = await axios.get(
        "http://localhost:8080/user/get-active"
      );
      setActivePatients(activePatientsResponse.data.active_patients || []);
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
    setIsAddPatientModalOpen(true); // Opens the modal
  };

  const handleCloseAddPatientModal = () => {
    setIsAddPatientModalOpen(false);
  };

  // Handle adding new patient data
  const handleAddPatientData = async (patientDetails) => {
    console.log(patientDetails);
    try {
      await axios.post("http://localhost:8080/user/add-patient", patientDetails);
      alert("Patient added successfully!");
      fetchPatients();
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    }
  };

  // Handle editing patient data
  const handleEditPatientData = (patient) => {
    setSelectedPatient(patient); // Set the selected patient for editing
  };

  const handleUpdatePatientData = async (updatedPatient) => {
    try {
      await axios.put("http://localhost:8080/user/update-patient", updatedPatient);
      alert("Patient details updated successfully!");
      fetchPatients(); // Re-fetch patients to ensure the data is up-to-date
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
                    disabled={!state.CanTrain}
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
              />
            )}
            {view === "Train Model" &&  <TrainModel />} {/* Render Train Model */}
          </main>
        </div>

        {/* Add Patient Modal */}
        {isAddPatientModalOpen && (
          <AddPatientForm
            setIsAddPatientOpen={setIsAddPatientModalOpen}
            handleAddPatientData={handleAddPatientData}
          />
        )}

        {/* Edit Patient Modal */}
        {/* {isEditPatientModalOpen && selectedPatient && (
          <EditPatientForm
            patient={selectedPatient}
            setIsEditPatientModalOpen={setIsEditPatientModalOpen}
            handleUpdatePatientData={handleUpdatePatientData}
            setSelectedPatient={setSelectedPatient}
          />
        )} */}
      </div>
    </>
  );
};

export default UserHome;
