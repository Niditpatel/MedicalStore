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
import moment from "moment/moment";

const Edit = () => {
  const navigate = useNavigate();
  const { rowIndex } = useParams();
  const [data, setData] = useState({
    _id: "",
    storeName: "",
    contactNumber: ""
  });

  const getData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}store/${rowIndex}`
      );
      console.log("ssdsata", res.data.store);

      setData(res.data.store);
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
        `${BASE_URL}store/${rowIndex}`, data
      );
      if (res.data.success) {
        navigate("/company")
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mb-8">
      <div className="flex items-center justify-center">
      <Card className="min-w-[320px] max-w-[520px] w-full">
      {/* <form style={{ maxWidth: 600, margin: "auto" }} onSubmit={(e)=>{
        e.preventDefault();
        handleSubmit();
      }}> */}
          {/* <CardHeader floated={false}>
            <Typography className="text-center text-2xl">Company</Typography>
          </CardHeader> */}
          <CardBody>
            <form className="mb-2  max-w-screen-lg " onSubmit={(e)=>{
               e.preventDefault();
              handleSubmit(e);
            }}>
              <div className="mb-4 text-center">
                <Typography className="text-2xl">Edit Company</Typography>
              </div>
              <div className="mb-4 flex flex-col gap-6">
                <Input size="sm" label="Name" name="storeName" value={data?.storeName}
                  onChange={handleChange} />
                <Input size="sm" label="Contact Number" name="contactNumber" value={data?.contactNumber}
                  onChange={handleChange} />
              </div>
              <div className="flex justify-evenly">
                <Button size="sm" className="mt-6" type="submit"  >
                  Update
                </Button>
                <Button size="sm" className="mt-6" onClick={((e) => { navigate("/company"); })}>
                  Cancle
                </Button>
              </div>
            </form>
          </CardBody>
      {/* </form> */}
        </Card>
      </div>
    </div >
  );
};

export default Edit;
