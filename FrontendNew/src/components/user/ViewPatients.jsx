import React, { useState, useEffect } from "react";
import SearchBar from "../general/SearchBar";
import PatientsTable from "./PatientsTable";
// import Pagination from "../general/Pagination"
import Patient from "./Patient";
import Modal from "../general/Modal"; // Adjust path as needed

const ViewPatients = () => {
  const [selectedCategory, setSelectedCategory] = useState("Active Treatment");
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const initialData = [
      { id: 1, name: "Liam", phoneNumber: "9876543210", status: "active" },
      { id: 2, name: "Olivia", phoneNumber: "9123456789", status: "inactive" },
      { id: 3, name: "Noah", phoneNumber: "9988776655", status: "active" },
      { id: 4, name: "Emma", phoneNumber: "9090909090", status: "inactive" },
      { id: 5, name: "Ava", phoneNumber: "9212345678", status: "active" },
      { id: 6, name: "James", phoneNumber: "9001122334", status: "inactive" },
      { id: 7, name: "Sophia", phoneNumber: "9334455667", status: "active" },
      { id: 8, name: "Elijah", phoneNumber: "9445566778", status: "inactive" },
      { id: 9, name: "Isabella", phoneNumber: "9556677889", status: "active" },
      {
        id: 10,
        name: "William",
        phoneNumber: "9667788990",
        status: "inactive",
      },
    ];
    setTableData(initialData);
  }, []);

  const handleAdminClick = (e) => {
    setSelectedCategory(e.target.textContent);
  };

  const handleAddPatient = () => {
    const nameInput = document.querySelector(
      'input[placeholder="Enter patient name"]'
    ).value;
    const phoneInput = document.querySelector(
      'input[placeholder="Enter phone number"]'
    ).value;
    const ageInput = document.querySelector(
      'input[placeholder="Enter age"]'
    ).value;
    const genderSelect = document.querySelector("select").value;
    const dobInput = document.querySelector('input[type="date"]').value;
    const emailInput = document.querySelector(
      'input[placeholder="Enter email address"]'
    ).value;
    const addressInput = document.querySelector(
      'textarea[placeholder="Enter full address"]'
    ).value;
    const categorySelect = document.querySelector(
      "select option:checked"
    ).textContent;
    const notesInput = document.querySelector(
      'textarea[placeholder="Any important notes or history..."]'
    ).value;

    if (nameInput && phoneInput) {
      const newPatient = {
        id: Date.now(),
        name: nameInput,
        age: ageInput || null,
        gender: genderSelect || null,
        dob: dobInput || null,
        phoneNumber: phoneInput,
        email: emailInput || null,
        address: addressInput || null,
        status: categorySelect.toLowerCase().includes("active")
          ? "active"
          : "inactive",
        notes: notesInput || null,
      };
      setTableData([...tableData, newPatient]);
      setIsAddModalOpen(false);
      // Reset form
      document
        .querySelectorAll("input, select, textarea")
        .forEach((input) => (input.value = ""));
    } else {
      alert("Name and Phone Number are required!");
    }
  };

  const filteredData = tableData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.phoneNumber.includes(search) ||
      patient.status.toLowerCase().includes(search.toLowerCase()) ||
      (patient.email &&
        patient.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="m-2">
      {selectedPatient === "" ? (
        <div>
          <div className="flex justify-between">
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
                onClick={(e) => handleAdminClick(e)}
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
                onClick={(e) => handleAdminClick(e)}
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
          <PatientsTable
            tableData={filteredData}
            setSelectedPatient={setSelectedPatient}
          />
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
              <label className="block text-gray-700 font-medium mb-1">
                Patient Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Age
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Gender
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter email address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <textarea
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Medical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Treatment Category
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                <option value="Active Treatment">Active Treatment</option>
                <option value="Inactive Treatment">Inactive Treatment</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Medical History / Notes
              </label>
              <textarea
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
