import React, { useState, useEffect } from "react";
import SearchBar from "../general/SearchBar";
import PatientsTable from "./PatientsTable";
import Patient from "./Patient";
import Modal from "../general/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Loader } from "lucide-react";

const ViewPatients = () => {
  const [selectedCategory, setSelectedCategory] = useState("Active Treatment");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    dob: "",
    phoneNumber: "",
    email: "",
    address: "",
    notes: ""
  });

  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    // if (!user) {
    //   return; // Early return if no user
    // }

    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const SERVER_URL = import.meta.env.VITE_API_URL;
        const status = selectedCategory.toLowerCase();
        const hospital = "KIMS";
        
        const resp = await axios.get(
          `${SERVER_URL}user/patients/${hospital}?status=${status}&page=${pageNumber}&size=${pageSize}&search=${search}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = resp.data;
        console.log("data: ",data);
        if (data.success) {
          setTableData(data.patients || []);
        } else {
          console.error("Failed to fetch patients:", data.message);
          setTableData([]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setTableData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [selectedCategory, search, pageNumber, pageSize, user]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPageNumber(1); // Reset to first page when changing category
  };

  const handleAddPatient = async () => {
    // Basic validation
    if (!newPatient.name || !newPatient.phoneNumber) {
      alert("Name and Phone Number are required!");
      return;
    }

    try {
      // In a real implementation, you would send this to your API
      const SERVER_URL = import.meta.env.VITE_API_URL;
      const hospital = user.Hospital;
      
      const response = await axios.post(
        `${SERVER_URL}/user/patients/${hospital}`,
        {
          ...newPatient,
          status: selectedCategory.toLowerCase().includes("active") ? "active" : "inactive",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        // Refresh the patient list
        setTableData([...tableData, response.data.patient]);
        setIsAddModalOpen(false);
        // Reset form
        setNewPatient({
          name: "",
          age: "",
          gender: "Male",
          dob: "",
          phoneNumber: "",
          email: "",
          address: "",
          notes: ""
        });
      } else {
        alert("Failed to add patient: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("An error occurred while adding the patient");
    }
  };

  console.log(tableData);
  // Show loading state if waiting for user data
  // if (!auth.user) {
  //   return (
  //     <div className="flex flex-col justify-center items-center min-h-screen">
  //       <Loader className="w-12 h-12 text-teal-500 animate-spin mb-4" />
  //       <p className="text-xl font-semibold text-gray-700">Loading Patients...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="m-2">
      {selectedPatient === "" ? (
        <div>
          <div className="flex justify-between mb-4">
            <div className="flex bg-gray-400 rounded-lg ml-3">
              <button
                className={`
                  rounded-lg
                  px-4 py-3
                  whitespace-nowrap
                  ${
                    selectedCategory === "Active Treatment"
                      ? "bg-slate-800 text-white"
                      : "bg-transparent"
                  }
                `}
                type="button"
                onClick={() => handleCategoryChange("Active Treatment")}
              >
                Active Treatment
              </button>
              <button
                className={`
                  rounded-lg
                  px-4 py-3
                  whitespace-nowrap
                  ${
                    selectedCategory === "Inactive Treatment"
                      ? "bg-slate-800 text-white"
                      : "bg-transparent"
                  }
                `}
                type="button"
                onClick={() => handleCategoryChange("Inactive Treatment")}
              >
                Inactive Treatment
              </button>
            </div>
            <div className="flex w-full justify-end">
              <SearchBar setSearch={setSearch} />
              <button
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none ml-2"
                type="button"
                onClick={() => setIsAddModalOpen(true)}
              >
                + Add Patient
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          ) : (
            <>
              <PatientsTable
                tableData={tableData}
                setSelectedPatient={setSelectedPatient}
              />
            </>
          )}
        </div>
      ) : (
        <Patient id={selectedPatient} setSelectedPatient={setSelectedPatient} />
      )}

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Patient"
        onSave={handleAddPatient}
        saveButtonText="Add Patient"
      >
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Patient Name</label>
              <input
                type="text"
                name="name"
                value={newPatient.name}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={newPatient.age}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter age"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Gender</label>
              <select
                name="gender"
                value={newPatient.gender}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={newPatient.dob}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={newPatient.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={newPatient.email}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address</label>
              <textarea
                rows={2}
                name="address"
                value={newPatient.address}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Medical Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Treatment Category</label>
              <select
                name="status"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Active Treatment">Active Treatment</option>
                <option value="Inactive Treatment">Inactive Treatment</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Medical History / Notes</label>
              <textarea
                rows={3}
                name="notes"
                value={newPatient.notes}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Any important notes or history..."
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewPatients;
