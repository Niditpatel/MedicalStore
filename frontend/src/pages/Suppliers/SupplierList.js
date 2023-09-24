import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Common";

import {
  Card,
  CardHeader,
  Checkbox,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Input
} from "@material-tailwind/react";

export default function SupplierList() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [dataForSheet, setDataForSheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ supplierName: '' });

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/Suppliers?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      setData(realData.filter(item => item?.isDeleted?.toString() !== 'TRUE'))
      localStorage.setItem("maxSupplierId", realData.length);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };


  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (e,item) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/Suppliers/supplierId/${item?.supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...item, isDeleted: true }),
        }
      );
      if (res.ok) {
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) =>
    setSearchData({ ...searchData, [e.target.name]: e.target.value });

  const handlesearch = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/Suppliers/search?supplierName=*${searchData.supplierName}*`
      );
      const data = await res.json();
      setData(data.filter(item => item?.isDeleted?.toString() !== 'TRUE'))
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  }

  const addForCart = (maal) => {
    const isExists = dataForSheet.find(item => item.rowNo === maal.rowNo)
    if (isExists !== null && isExists) {
      const newData = dataForSheet.filter(item => item.rowNo !== maal.rowNo)
      console.log("newData", newData);
      setDataForSheet(newData);
    } else {
      console.log("newData", maal);
      setDataForSheet([...dataForSheet, maal])
    }
  }
  const addFinalCart = async (e) => {
    console.log("dataForSheet", dataForSheet);
    e.preventDefault();
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/Carts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataForSheet),
        }
      );
      if (res.ok) {
        navigate("/cart");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleEdit = (index) => {
    navigate(`/edit-supplier/${index}`)
  }
  const TABLE_HEAD = ["Supplier Name", "Email", "Created Date", "Modified Date", "Message", "", ""];
  return (
    <div className="container">

      <Card className="h-full w-11/12	">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex justify-between items-center mb-3">
          <Typography> SupplierList</Typography>
          {/* <Button size="sm" className="mt-6" onClick={addFinalCart}>Add to cart</Button> */}
          <Button size="sm" className="mt-6 m-0" onClick={(e) => { navigate("/add-supplier") }}>Add Supplier</Button>
          </div>
          <div className="w-full flex gap-10 justify-between items-center">
            <Input
              type="text"
              size="sm"
              className="form-control border rounded"
              label="Supplier Name"
              name="supplierName"
              value={searchData.supplierName}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlesearch();
                }
              }}
              onChange={handleChange}
            />
            <Button  size="sm" className="btn btn-primary m-0" onClick={handlesearch}>search</Button>
          </div>
        </CardHeader>
        <CardBody className="p-4 overflow-hidden overflow-x-scroll px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            {loading === false ?
              <tbody>
                {data?.map((item, index,) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast
                    ? "p-1"
                    : "p-1 border-b border-blue-gray-50";
                  return (
                    <tr className="h-4" key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {item?.supplierName}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.email}
                        </Typography>
                      </td>
                      <td className={classes} >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.createdDate ? (item?.createdDate) : '-'}
                        </Typography>
                      </td>
                      <td className={classes} >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.modifiedDate ? (item?.modifiedDate) : '-'}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.message}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Button
                          className="btn btn-sm btn-danger ms-1"
                          variant="gradient"
                          color='blue'
                          size="sm"
                          onClick={() => handleEdit(item?.supplierId)}
                        >
                          &#x1F589;
                        </Button>
                      </td>
                      <td className={classes}>
                        <Button
                          variant="gradient" 
                          size="sm" color='red' className="btn btn-danger"
                          onClick={(e) => handleDelete(e,item)}
                        >X
                        </Button>
                      </td>
                    </tr>
                  );
                },
                )}
              </tbody>
              : <>Wait </>}
          </table>
        </CardBody>

        {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" size="sm">
              1
            </IconButton>
            <IconButton variant="text" size="sm">
              2
            </IconButton>
            <IconButton variant="text" size="sm">
              3
            </IconButton>
            <IconButton variant="text" size="sm">
              ...
            </IconButton>
            <IconButton variant="text" size="sm">
              8
            </IconButton>
            <IconButton variant="text" size="sm">
              9
            </IconButton>
            <IconButton variant="text" size="sm">
              10
            </IconButton>
          </div>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

