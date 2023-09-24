import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Common";
import {
  Card,
  Input,
  CardBody,
  Button,
  CardHeader,
  Typography
} from "@material-tailwind/react";

import moment from "moment/moment";

const Add = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    storeName: "",
    contactNumber: "",
    description: "",
    isDeleted: "FALSE",
    createdDate: moment(new Date().toString()).format("DD-MM-YYYY"),
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let storeId = localStorage.getItem('maxStoreId')
    if (storeId) {
      storeId = parseInt(storeId) + 1
      try {
        const res = await fetch(
          `${BASE_URL}/tabs/MedicalStores`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, storeId: storeId }),
          }
        );
        if (res.ok) {
          navigate("/stores");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/stores")
    }
  };
  return (
    <div class="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Store</Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="storeName"
                label="Name"
                value={data.storeName}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="contactNumber"
                label="Contact Number"
                value={data.contactNumber}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="description"
                label="Description"
                value={data.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit"  >
                Save
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/stores"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
  );
};

export default Add;
