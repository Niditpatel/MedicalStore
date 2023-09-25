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
import axios from 'axios';

const Add = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    storeName: "",
    contactNumber: ""
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault()
    navigate("/stores")
    try {
      const submiData = await axios.post(`${BASE_URL}store/new`, data)
      if(submiData.success) {
      }
      // getAllUsers()
    }
    catch (e) {
      alert(e.message);
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
