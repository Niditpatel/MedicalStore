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


export default function AddSupplier() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    supplierName: "",
    email: "",
    message: "",
    createdDate: (moment(new Date()).format("DD-MM-YYYY")),
  });
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let supplierId = localStorage.getItem('maxSupplierId')
    if (supplierId) {
      supplierId = parseInt(supplierId) + 1
      try {
        const res = await fetch(
          `${BASE_URL}/tabs/Suppliers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, supplierId: supplierId }),
          }
        );
        if (res.ok) {
          navigate("/suppliers");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      navigate("/suppliers")
    }
  };
  return (
    <div class="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Supplier</Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
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
                name="email"
                label="Email"
                value={data.email}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="message"
                label="Message"
                value={data.message}
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

