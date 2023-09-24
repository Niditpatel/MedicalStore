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


export default function EditProduct() {
  const navigate = useNavigate();
  const { rowIndex } = useParams();
  const [data, setData] = useState({
    productId:0,
    productName: "",
    packing: "",
    message: "",
    modifiedDate:(moment(new Date()).format("DD-MM-YYYY")),
  });
  const getData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/Products/search?productId=${rowIndex}`
      );
      const data = await res.json();
      setData(data[0]);
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
      const res = await fetch(
        `${BASE_URL}/tabs/Products/search?productId=${rowIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        navigate("/products");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Products</Typography>
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
                Update
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/products"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
  );
};

