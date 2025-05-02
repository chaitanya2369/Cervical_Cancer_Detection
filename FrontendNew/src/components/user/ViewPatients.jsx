import React, { useState, useEffect } from "react";
import SearchBar from "../general/SearchBar";
import PatientsTable from "./PatientsTable";
import Patient from "./Patient";
import Modal from "../general/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Loader } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_API_URL;
const HOSPITAL = "KIMS"; // Use one consistent variable

const ViewPatients = () => {
  const [selectedCategory, setSelectedCategory] = useState("active");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState([]);

  // Form state - Initialize with all required fields
  const [newPatient, setNewPatient] = useState({
    consultdate: new Date().toISOString().split("T")[0], // Default to today's date
    name: "",
    age: "",
    phoneNumber: "", // Added this missing field
    address: "",
    dateofbirth: "",
    hospital: HOSPITAL,

    isactive: true, // Default to active
    fields: {},
  });

  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchFields = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/user/fields/${HOSPITAL}`);
      console.log("Fields Response:", response.data);
  
      if (response.data.success) {
        setFields(response.data.fields || []);
      } else {
        console.log("Failed to fetch the fields");
        setFields([]);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
      setFields([]);
    }
  };
  
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const status = selectedCategory.toLowerCase();
        console.log("status: ", status);

        const resp = await axios.get(
          `${SERVER_URL}/user/patients/${HOSPITAL}?status=${status}&page=${pageNumber}&size=${pageSize}&search=${search}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = resp.data;
        console.log("data: ", data);
        if (data.success) {
          setTableData(data.patients || []);
          setMaxPages(data.totalPages || 1);
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
    // Form validation
    if (!newPatient.name || !newPatient.phoneNumber) {
      alert("Name and Phone Number are required!");
      return;
    }
  
    try {
      // Determine active status based on selected category
      const isActive = selectedCategory.toLowerCase() === "active";
      console.log("isActive: ", isActive);
      console.log("newPatient: ", newPatient);
      // Prepare the data to be sent
      const patientData = {
        ...newPatient,
        hospital: HOSPITAL,
        isactive: isActive,
      };
      
      console.log("Sending patient data:", patientData);
      
      const response = await axios.post(
        `${SERVER_URL}/user/add-patient`,
        patientData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      console.log("Add Patient Response:", response.data);
      if (response.data.success) {
        // Refresh the patient list instead of manually adding to the table
        // This ensures we have the correct data format returned from the server
        const refreshResp = await axios.get(
          `${SERVER_URL}/user/patients/${HOSPITAL}?status=${selectedCategory.toLowerCase()}&page=${pageNumber}&size=${pageSize}&search=${search}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        
        if (refreshResp.data.success) {
          setTableData(refreshResp.data.patients || []);
        }
        
        // Reset form and close modal
        setIsAddModalOpen(false);
        setNewPatient({
          name: "",
          age: "",
          phoneNumber: "",
          address: "",
          hospital: HOSPITAL,
          isactive: true,
          fields: {},
        });
        
        alert("Patient added successfully!");
      } else {
        alert("Failed to add patient: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("An error occurred while adding the patient: " + (error.response?.data?.message || error.message));
    }
  };
  
  // Open modal and fetch fields
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    fetchFields();
    // Reset the new patient form with the current category
    setNewPatient({
      name: "",
      age: "",
      phoneNumber: "",
      address: "",
      hospital: HOSPITAL,
      isactive: selectedCategory.toLowerCase() === "active",
      fields: {},
    });
  };

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
                    selectedCategory === "active"
                      ? "bg-slate-800 text-white"
                      : "bg-transparent"
                  }
                `}
                type="button"
                onClick={() => handleCategoryChange("active")}
              >
                Active Treatment
              </button>
              <button
                className={`
                  rounded-lg
                  px-4 py-3
                  whitespace-nowrap
                  ${
                    selectedCategory === "Inactive"
                      ? "bg-slate-800 text-white"
                      : "bg-transparent"
                  }
                `}
                type="button"
                onClick={() => handleCategoryChange("Inactive")}
              >
                Inactive Treatment
              </button>
            </div>
            <div className="flex w-full justify-end">
              <SearchBar setSearch={setSearch} />
              <button
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none ml-2"
                type="button"
                onClick={handleOpenAddModal}
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
              
              {/* Pagination controls could be added here */}
              
            </>
          )}
        </div>
      ) : (
        <Patient id={selectedPatient}/>
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
              <label className="block text-gray-700 font-semibold mb-1">
                Consult Date
              </label>
              <input
                type="date"
                name="consultdate"
                value={newPatient.consultdate}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                // placeholder="Enter Consult date"
                required
                // disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateofbirth"
                value={newPatient.dateofbirth}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                // placeholder="Enter Consult date"
                required
                // disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Patient Name*
              </label>
              <input
                type="text"
                name="name"
                value={newPatient.name}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter patient name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Age
              </label>
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
              <label className="block text-gray-700 font-semibold mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={newPatient.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Hospital
              </label>
              <input
                type="text"
                name="hospital"
                value={HOSPITAL}
                disabled
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-100"
                placeholder="Hospital"
              />
            </div>
            
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Address
              </label>
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
              <label className="block text-gray-700 font-semibold mb-1">
                Treatment Category
              </label>
              <select
                name="isactive"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="active">Active Treatment</option>
                <option value="Inactive">Inactive Treatment</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields */}
          {fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((fieldName) => (
                <div key={fieldName}>
                  <label className="block text-gray-700 font-semibold mb-1 capitalize">
                    {fieldName}
                  </label>
                  <input
                    type="text"
                    name={fieldName}
                    value={newPatient.fields?.[fieldName] || ""}
                    onChange={(e) =>
                      setNewPatient((prev) => ({
                        ...prev,
                        fields: {
                          ...prev.fields,
                          [fieldName]: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-2 border-b-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder={`Enter ${fieldName}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ViewPatients;
