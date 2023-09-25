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

import moment from "moment/moment";

const Edit = () => {
  const navigate = useNavigate();
  const { rowIndex } = useParams();
  const [data, setData] = useState({
    _id:"",
    storeName: "",
    contactNumber: ""
  });

  const getData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/MedicalStores/search?storeId=${rowIndex}`
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
        `${BASE_URL}/tabs/MedicalStores/storeId/${rowIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        navigate('/stores')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form style={{ maxWidth: 600, margin: "auto" }}>
        <Card className="w-96">
          <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Store</Typography>
          </CardHeader>
          <CardBody>
            <form className="mb-2  max-w-screen-lg ">
              <div className="mb-4 flex flex-col gap-6">
                <Input size="sm" label="Name" name="storeName" value={data?.storeName}
                  onChange={handleChange} />
                <Input size="sm" label="Contact Number" name="contactNumber" value={data?.contactNumber}
                  onChange={handleChange} />
                <Input size="sm" label="Description" name="description" value={data?.description}
                  onChange={handleChange} />
              </div>
              <Button className="mt-6" fullWidth onClick={handleSubmit}>
                Update
              </Button>
            </form>
          </CardBody>
        </Card>
      </form>
    </div >
  );
};

export default Edit;
