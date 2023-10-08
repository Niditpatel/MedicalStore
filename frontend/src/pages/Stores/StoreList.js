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
  Dialog,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import axios from 'axios';
import {
  Box,
  Pagination
} from "@mui/material";
import Stack from '@mui/material/Stack';
import Select from 'react-select'
import { options } from "../../StaticData/StaticData"

const Store = () => {
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [totalStore, setTotalStore] = useState(0);
  const [page_Index, setPage_Index] = useState(1);
  const [dialog, setDialog] = useState({ open: false, item: {} })
  const [searchData, setSearchData] = useState({ storeName: '' });
  const [page_Size, setPage_Size] = useState(5);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}stores/?storeName=${searchData.storeName}&pageNo=${page_Index}&pageSize=${page_Size}`
      );
      setData(res.data.stores)
      setTotalStore(res.data.total)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [searchData, page_Index, page_Size]);

  const handleDelete = async (id) => {
    try {
      const data = await axios.delete(`${BASE_URL}store/${id}`)
      getData();
      if (data.data.success) {
        console.log("deleted successfully");
      }
    }
    catch (e) {
      console.log(e.message);
    }
  };

  const handleChange = (e) =>
    setSearchData({ ...searchData, [e.target.name]: e.target.value });

  const handleAdd = () => {
    navigate('/add-company');
  }
  const handleEdit = (index) => {
    navigate(`/edit-company/${index}`)
  }
  const handleChangePageNew = (e, value) => {
    setPage_Index(value);
  }
  const TABLE_HEAD = ["Company Name", "Contact Number", "Edit/Delete"];
  return (
    <div className="container mb-8 ">
      <div className="flex items-center justify-center w-full">
        <Card className="h-full w-full	">
          <CardHeader floated={false} shadow={false} className="	 rounded-none">
            <div className="w-full flex justify-between mb-3 items-center" style={{ justifyContent: 'space-between' }}>
              <Typography> Company List</Typography>
              <Button size="sm" className="mt-6 m-0" onClick={handleAdd}>Add Company</Button>
            </div>
            <div className="w-full flex justify-between gap-10 items-center">
              <Input
                type="text"
                size="md"
                className="form-control border rounded "
                label="Company Name"
                name="storeName"
                value={searchData.storeName}
                onChange={handleChange}
              />
            </div>
          </CardHeader>
          <CardBody className="p-4 overflow-hidden px-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 "
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >Name
                    </Typography>
                  </th>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 "
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >Contact Number
                    </Typography>
                  </th>
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-right pr-12"
                    >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >Edit/Delete
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ?
                  <>
                    {data?.map((item, index) => {
                      const isLast = index === data.length - 1;
                      const classes = isLast
                        ? "py-1 px-2 "
                        : "py-1 px-2 border-b border-blue-gray-50";
                      return (
                        <tr className="h-4" key={index}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <Typography
                                variant="small"
                                color="blue-gray"
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
                          {/* <td className={classes} >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.createdDate ? (item?.createdDate) : '-'}
                        </Typography>
                      </td> */}
                          <td className={classes}>
                          <Box className={'text-right flex gap-2 justify-end'}>
                              <Button
                                className="btn btn-sm btn-danger ms-1"
                                variant="gradient"
                                size="sm"
                                color='blue'
                                onClick={() => handleEdit(item?._id)}
                              >
                                &#x1F589;
                              </Button>
                              <Button
                                className="btn btn-sm btn-danger ms-2"
                                variant="gradient"
                                size="sm"
                                color='red'
                                onClick={(e) => setDialog({ open: true, item: item })}
                              >
                                X
                              </Button>
                            </Box>
                          </td>
                        </tr>
                      );
                    },
                    )}</>
                  : <> <tr>
                    <td colSpan={9} style={{ textAlign: 'center' }}>There is nothing to show.</td>
                  </tr></>}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="pt-0 ">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Pagination
                count={Math.ceil(totalStore / page_Size)}
                page={page_Index}
                onChange={handleChangePageNew}
              />
              <Select
                defaultValue={options[0]}
                onChange={(e) => {
                  setPage_Size(parseInt(e?.value))
                  setPage_Index(1)
                }} options={options} />
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog
        open={dialog.open}
        handler={(e) => { setDialog({ open: false, item: {} }) }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody divider>
          Are you sure you Want to delete store <span className="font-bold">{dialog?.item?.storeName}</span>.
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="grey" onClick={(e) => {
            handleDelete(dialog.item?._id)
            setDialog({ open: false, item: {} })
          }}
            className="mr-1"
          >
            <span>Confirm</span>
          </Button>
          <Button
            color="grey"
            variant='text'
            onClick={(e) => { setDialog({ open: false, item: {} }) }}
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>


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
