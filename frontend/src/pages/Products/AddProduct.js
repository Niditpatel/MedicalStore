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


export default function AddProduct() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    storeId: 0,
    productName: "",
    packing: "",
    message: "",
    createdDate: (moment(new Date()).format("DD-MM-YYYY")),
  });
  console.log("BASE_URL", BASE_URL);
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let productId = localStorage.getItem('maxProductId')
    if (productId) {
      productId = parseInt(productId) + 1
      try {
        const res = await fetch(
          `${BASE_URL}/tabs/Products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, productId: productId }),
          }
        );
        if (res.ok) {
          navigate("/products");
        }
      } catch (error) {
        console.log(error);
      }
    }
    else {
      navigate("/products")
    }
  };
  return (
    <div class="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Product</Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="productName"
                label="Product Name"
                value={data.productName}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="packing"
                label="Packing"
                value={data.packing}
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

