import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import axios from 'axios';

const Edit = () => {
  const navigate = useNavigate();
  const { rowIndex } = useParams();
  const [data, setData] = useState({
    _id: "",
    buyerName: "",
    contactNumber: ""
  });

  const getData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}buyer/${rowIndex}`
      );

      setData(res.data.buyer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}buyer/${rowIndex}`, data
      );
      if (res.data.success) {
        navigate("/buyer")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Buyer</Typography>
        </CardHeader>
        <CardBody>
          <form className="mb-2  max-w-screen-lg " onSubmit={(e) => {
            handleSubmit(e);
          }}>
            <div className="mb-4 flex flex-col gap-6">
              <Input size="sm" label="Name" name="buyerName" value={data?.buyerName}
                onChange={handleChange} />
              <Input size="sm" label="Contact Number" name="contactNumber" value={data?.contactNumber}
                onChange={handleChange} />
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit"  >
                Update
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/buyer"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
  );
};

export default Edit;