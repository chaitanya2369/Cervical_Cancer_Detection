import React from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Select,
  Option,
} from "@material-tailwind/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const AddOrEditAdminModal = ({
  children,
  initialData,
  setTableData,
  filter,
}) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const isAddMode = initialData ? false : true;
  const [adminDetails, setAdminDetails] = useState({
    name: isAddMode ? "" : initialData.Name,
    email: isAddMode ? "" : initialData.Email,
    password: isAddMode ? "" : initialData.Password,
    status: isAddMode ? "approved" : initialData.Status,
    role: "admin",
    hospital: isAddMode ? "" : initialData.Hospital,
  });

  const handleChange = (field) => (value) => {
    setAdminDetails((prev) => ({ ...prev, [field]: value }));
  };
  const checkFilters = (admin) => {
    if (filter.totalItems >= filter.size) return false;
    if (filter.selectedCategory.toLowerCase() != admin.Status) {
      return false;
    }
    return Object.values(admin).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(filter.search)
    );
  };
  const handleSubmit = async () => {
    const resp = isAddMode
      ? await axios.post(`${VITE_API_URL}/super-admin/add-admin`, adminDetails)
      : await axios.put(
          `${VITE_API_URL}/super-admin/edit-admin/${initialData.ID}`,
          adminDetails
        );
    if (resp.data.success) {
      console.log(resp);
      if (isAddMode) {
        checkFilters(resp.data.admin)
          ? setTableData((prevData) => [...prevData, resp.data.admin])
          : null;
      } else {
        checkFilters(resp.data.admin)
          ? setTableData((prevData) =>
              prevData.map((item) =>
                item.ID === initialData.ID ? { ...item, ...adminDetails } : item
              )
            )
          : setTableData((prevData) =>
              prevData.filter((item) => item.ID !== initialData.ID)
            );
      }
      setAdminDetails({
        name: "",
        email: "",
        status: "approved",
        hospital: "",
        role: "admin",
      });
    }
    handleOpen();
  };

  return (
    <div>
      <div onClick={handleOpen}>{children}</div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              {isAddMode ? "Add Admin" : "Edit Admin"}
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              {isAddMode ? "Enter" : "Edit"} details of Admin.
            </Typography>
            <Input
              label="Name"
              size="lg"
              value={adminDetails.name}
              onChange={(e) => handleChange("name")(e.target.value)}
            />
            <Input
              label="Email"
              size="lg"
              value={adminDetails.email}
              onChange={(e) => handleChange("email")(e.target.value)}
            />
            <Select
              label="Status"
              size="lg"
              value={adminDetails.status}
              onChange={(value) => handleChange("status")(value)}
            >
              <Option value="approved">Approved</Option>
              <Option value="unapproved">Unapproved</Option>
            </Select>
            <Input
              label="Organization"
              size="lg"
              value={adminDetails.hospital}
              onChange={(e) => handleChange("hospital")(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleSubmit} fullWidth>
              {isAddMode ? "Add Admin" : "Edit Admin"}
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default AddOrEditAdminModal;
