import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Input,
  Button,
  Select,
  Option as MaterialOption,
} from "@material-tailwind/react";
import { useAuth } from "../../context/auth";

const AddOrEditFields = () => {
  const { auth, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  const user = auth.user;
  const hospital = user.Hospital;
  const [newField, setNewField] = useState("");
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/fields/${user.Hospital}`
        );
        if (response.data.success) {
          setFields(response.data.fields);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };
    fetchFields();
  }, [hospital]);

  // Handle adding a new field
  const handleAddField = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/edit-fields/${hospital}`,
        {
          fields: [...fields, newField],
        }
      );
      if (response.data.success) {
        setFields((prevFields) => [...prevFields, newField]);
        setNewField(""); // Clear the input field after adding
      }
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  return (
    <div className="p-6 h-screen bg-gray-100">
      <Typography variant="h4" className="mb-6">
        Add or Edit Patient Fields for Organization {hospital}
      </Typography>

      {/* Form to Add a Field */}
      <Card className="p-6">
        <div className="flex justify-between p-6 ">
          <div className="w-1/2">
            <Typography variant="h4" className="mb-4">
              Current Fields
            </Typography>
            <ul className="list-disc pl-6">
              {fields.map((field) => (
                <li key={field} className="mb-2">
                  {field}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2">
            <Typography variant="h4" className="mb-4">
              Add New Field
            </Typography>
            <div className="flex space-x-4 mb-4">
              <Input
                label="Field Name"
                value={newField.name}
                onChange={(e) => setNewField(e.target.value)}
              />
              <Button color="blue" onClick={handleAddField} className="w-full">
                Add Field
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddOrEditFields;
