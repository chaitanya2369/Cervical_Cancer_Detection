import React from "react";
import { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Select,
  Option,
  Checkbox,
} from "@material-tailwind/react";
import { Plus } from "lucide-react";
import axios from "axios";

const AddOrEditUserModal = ({
  children,
  initialData,
  setTableData,
  filter,
}) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const isAddMode = initialData ? false : true;
  const [userDetails, setUserDetails] = useState({
    name: initialData?.Name || "",
    email: initialData?.Email || "",
    status: initialData?.Status || "approved",
    canPredict: initialData?.CanPredict || false,
    canTrain: initialData?.CanTrain || false,
    hospital: initialData?.Hospital || "",
    password: initialData?.Password || "",
  });
  const handleChange = (field) => (value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };
  const checkFilters = (user) => {
    console.log("user: ", user);
    if (filter.totalItems >= filter.size) return false;
    if (filter.selectedCategory.toLowerCase() != user.Status) {
      return false;
    }
    return Object.values(user).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(filter.search)
    );
  };
  const handleSubmit = async () => {
    const resp = isAddMode
      ? await axios.post(`${VITE_API_URL}/admin/add-user`, userDetails)
      : await axios.put(
          `${VITE_API_URL}/admin/edit-user/${initialData.id}`,
          userDetails
        );
    if (resp.data.success) {
      console.log(resp);
      if (isAddMode) {
        checkFilters(resp.data.user)
          ? setTableData((prevData) => [...prevData, resp.data.user])
          : null;
      } else {
        checkFilters(resp.data.user)
          ? setTableData((prevData) =>
              prevData.map((item) =>
                item.ID === initialData.ID ? { ...item, ...userDetails } : item
              )
            )
          : setTableData((prevData) =>
              prevData.filter((item) => item.ID !== initialData.ID)
            );
      }
      setUserDetails({
        name: "",
        email: "",
        status: "approved",
        canPredict: false,
        canTrain: false,
        hospital: "",
        password: "",
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
              {isAddMode ? "Add User" : "Edit User"}
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              {isAddMode ? "Enter" : "Edit"} details of User.
            </Typography>
            <Input
              label="Name"
              size="lg"
              value={userDetails.name}
              onChange={(e) => handleChange("name")(e.target.value)}
            />
            <Input
              label="Email"
              size="lg"
              value={userDetails.email}
              onChange={(e) => handleChange("email")(e.target.value)}
            />
            <Select
              label="Status"
              size="lg"
              value={userDetails.status}
              onChange={(value) => handleChange("status")(value)}
            >
              <Option value="approved">Approved</Option>
              <Option value="unapproved">Unapproved</Option>
            </Select>
            <Checkbox
              label="Predicting Permission"
              checked={userDetails.canPredict}
              onChange={(e) => handleChange("canPredict")(e.target.checked)}
              color="blue"
            />
            <Checkbox
              label="Training Permission"
              checked={userDetails.canTrain}
              onChange={(e) => handleChange("canTrain")(e.target.checked)}
              color="blue"
            />
            <Input
              label="Organization"
              size="lg"
              value={userDetails.hospital}
              onChange={(e) => handleChange("hospital")(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleSubmit} fullWidth>
              {isAddMode ? "Add User" : "Edit User"}
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default AddOrEditUserModal;
