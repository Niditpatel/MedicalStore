import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Common";
import {
  Card,
  Input,
  Checkbox,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

const Store = () => {
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [searchData, setSearchData] = useState({ storeName: '' });

  const getData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      setData(realData.filter(item => item?.isDeleted?.toString() !== 'TRUE'))
      localStorage.setItem("maxStoreId", realData.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (e, item) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/MedicalStores/storeId/${item?.storeId}`,
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
        `${BASE_URL}/search?storeName=*${searchData.storeName}*`
      );
      const data = await res.json();
      setData(data.filter(item => item?.isDeleted?.toString() !== 'TRUE'))
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  }

  const handleAdd = () => {
    navigate('/add-store');
  }
  const handleEdit = (index) => {
    navigate(`/edit-store/${index}`)
  }

  const TABLE_HEAD = ["Store Name", "Contact Number", "Description", "Create Date", "Modified Date", "", ""];

  return (
    <div className="container ">
      <div className="mb-3 flex gap-2 justify-end">

      </div>
      <div className="flex items-center justify-center">
        <Card className="h-full w-11/12	">
          <CardHeader floated={false} shadow={false} className="	 rounded-none">
            <div className="w-full flex justify-between mb-3 items-center" style={{justifyContent:'space-between'}}>
            <Typography> Store List</Typography>
            <Button size="sm" className="mt-6 m-0" onClick={handleAdd}>Add Store</Button>
            </div>
            <div className="w-full flex justify-between gap-10 items-center">
            <Input
              type="text"
              size="md"
              className="form-control border rounded "
              label="Store Name"
              name="storeName"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handlesearch();
                }
              }}
              value={searchData.storeName}
              onChange={handleChange}
            />
        <Button variant="gradient" size="sm" className="btn btn-primary" onClick={handlesearch}>search</Button>
        </div>
          </CardHeader>
          <CardBody className="p-4 overflow-hidden px-0">
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
              <tbody>
                {data?.map((item, index) => {
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
                            {item?.storeName}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.contactNumber}
                        </Typography>
                      </td>
                      <td className={classes} >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.description}
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
                        <Button
                          className="btn btn-sm btn-danger ms-1"
                          variant="gradient"
                          size="sm"
                          color='blue'
                          onClick={() => handleEdit(item?.storeId)}
                        >
                          &#x1F589;
                        </Button>
                      </td>
                      <td className={classes}>
                        <Button
                          className="btn btn-sm btn-danger ms-1"
                          variant="gradient"
                          size="sm"
                          color='red'
                          onClick={(e) => handleDelete(e, item)}
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  );
                },
                )}
              </tbody>
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
          <CardFooter className="pt-0 ">
            {/* <Button size="sm" onClick={addFinalCart}>Add to cart</Button> */}
          </CardFooter>
        </Card>
      </div>

      {/* <div className="mb-5 flex justify-between">
        <div className="text-2xl">Stores</div>
        <Button variant="gradient" size="sm" className="btn btn-primary" color='black' onClick={handleAdd}>Add</Button>
        </div>
      <div className="mb-3 flex gap-2 justify-end">
        <Input
          type="text"
          size="sm"
          className="form-control border rounded"
          label="Name"
          value={searchData.name}
          onChange={handleChange}
        />
        <Button variant="gradient" size="sm" className="btn btn-primary" onClick={handlesearch}>search</Button>
      </div>
      <div>
      <table className="table w-full text-center border-collapse">
          <thead>
            <tr className="border  bg-secondary/[0.6]">
              {data && data.length > 0 && Object.keys(data[0]).map((item, i) =>
                <th key={i}>{item}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 && data.map((item, index) =>
              <tr key={index} className="border even:bg-secondary">
                {Object.keys(item).map((key) => (
                  <td
                    key={key}
                    style={{ fontSize: "17px", lineHeight: "28px" }}
                  >
                    {typeof item[key] === "boolean"
                      ? item[key] === true
                        ? "Yes"
                        : "No"
                      : item[key]}
                  </td>
                ))}
                <td className="flex p-2  items-center justify-center space-x-2">
                <Button variant="gradient" size="sm" color='blue' className="btn btn-primary" onClick={(e)=>{
                   e.preventDefault();
                   handleEdit(item?.storeId);
                }}>Edit</Button>
                <Button variant="gradient" size="sm" color='red' className="btn btn-danger" onClick={(e)=>{
                   e.preventDefault();
                   handleDelete(item?.storeId);
                }}>delete</Button>
              </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>

  );
};

export default Store;
