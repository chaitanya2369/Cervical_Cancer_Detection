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
} from "@material-tailwind/react";
import { Plus } from "lucide-react";

const AddAdminModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  // name, email, status, hospital
  return (
    <div>
      <Button onClick={handleOpen} className="bg-themeBlue flex">
        <Plus strokeWidth={3} size={16} />
        Add Admin
      </Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Add Admin
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter details to of new admin.
            </Typography>
            <Input variant="outlined" label="Name" size="lg" />
            <Input variant="outlined" label="Email" size="lg" />
            <Input variant="outlined" label="Status" size="lg" />
            <Input variant="outlined" label="Organization" size="lg" />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleOpen} fullWidth>
              Add Admin
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default AddAdminModal;
