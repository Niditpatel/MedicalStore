import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  CardBody,
  Button,
  CardHeader,
  Typography
} from "@material-tailwind/react";
import { BASE_URL } from "../../Common";
import moment from "moment/moment";
import  axios  from "axios";


export default function AddSupplier() {

  const navigate = useNavigate();
  
  const [data, setData] = useState({
    supplierName: "",
    contactNumber: "",
    isDeleted: false
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}supplier/new`,
        data
      );
      if(res.data.success){
        navigate('/suppliers');
      }
    } catch (error) {
      console.log(error);
    }
    
  };


  return (
    <div class="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Supplier</Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="supplierName"
                label="Name"
                value={data.supplierName}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="contactNumber"
                label="Contact Number"
                value={data.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit"  >
                Save
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/suppliers"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
  );
};

