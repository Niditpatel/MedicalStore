import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import axios from "axios";


export default function EditSupplier() {
  const navigate = useNavigate();
  const { rowIndex } = useParams();
  const [data, setData] = useState({
    supplierName: "",
    contactNumber: ""
  });

  const getData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}supplier/`+rowIndex
      );
      if(res.data.success){
        setData(res.data.supplier)
      }
    } catch (error) {
      console.log(error);
    }
    
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}supplier/`+rowIndex,
        data
      );
        if(res.data.success){
          navigate('/suppliers')
        }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="container">
      <div className="flex items-center justify-center">
      <Card className="min-w-[320px] max-w-[520px] w-full">
        {/* <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Edit Supplier</Typography>
        </CardHeader> */}
        <CardBody>
          <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="mb-4 text-center">
              <Typography className="text-2xl">Edit Supplier</Typography>
            </div>
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
                value={data.contactNumber}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit"  >
                Update
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/suppliers"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      </div>
    </div >
    // <form style={{ maxWidth: 500, margin: "auto" }} onSubmit={handleSubmit}>
    //   <h1 className="text-muted text-center">Edit</h1>
    //   <div className="mb-3">
    //     <label htmlFor="name" className="form-label">
    //       Name
    //     </label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       name="name"
    //       value={data.name}
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="mb-3">
    //     <label htmlFor="email" className="form-label">
    //       Email
    //     </label>
    //     <input
    //       type="email"
    //       className="form-control"
    //       name="email"
    //       value={data.email}
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="mb-3">
    //     <label htmlFor="message" className="form-label">
    //       Message
    //     </label>
    //     <textarea
    //       name="message"
    //       cols="30"
    //       rows="3"
    //       className="form-control"
    //       value={data.message}
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="text-center">
    //     <button className="btn btn-primary">Update</button>
    //     <button className="btn btn-secondry" onClick={((e) => { navigate("/"); })}>cancel</button>
    //   </div>
    // </form>
  );
};

