import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Common";
import axios from 'axios';

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
import {
  Box,
  Pagination
} from "@mui/material";
import Select from 'react-select'
import { options } from "../../StaticData/StaticData"

export default function SupplierList() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ supplierName: '' });
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [page_Index, setPage_Index] = useState(1);
  const [page_Size, setPage_Size] = useState(5);


  // const getTotalSupplier = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${BASE_URL}totalSupplier`
  //     );
  //     setTotalSupplier(res.data.total)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}suppliers/?` + 'supplierName=' + searchData.supplierName + '&pageNo=' + page_Index + '&pageSize=' + page_Size
      );
      if (res.data.success) {
        setData(res.data.suppliers)
        setTotalSupplier(res.data.total)
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log(error);
    }
    // getTotalSupplier()
  };



  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}supplier/` + id
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    getData();
  };
  const handleChange = (e) =>
    setSearchData({ ...searchData, [e.target.name]: e.target.value });

  const handleEdit = (index) => {
    navigate(`/edit-supplier/${index}`)
  }

  const handleChangePageNew = (e, value) => {
    setPage_Index(value);
  }

  useEffect(() => {
    getData()
  }, [searchData, page_Index, page_Size])

  return (
    <div className="container">
      <Card className="h-full w-full	mb-8">
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
              onChange={handleChange}
            />
            {/* <Button  size="sm" className="btn btn-primary m-0" onClick={handlesearch}>search</Button> */}
          </div>
        </CardHeader>
        <CardBody className="p-4 overflow-hidden px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Name
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 "
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 "
                  >
                    Contact
                  </Typography>
                </th>
                <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-right pr-12"
                    >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Edit/Delete
                  </Typography>
                </th>
              </tr>
            </thead>
            {loading === false ?
              <tbody>
                {data && data.length > 0 ?
                  <>
                    {data?.map((item, index,) => {
                      const isLast = index === data.length - 1;
                      const classes = isLast
                        ? "py-1 px-2"
                        : "py-1 px-2 border-b border-blue-gray-50";
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
                              {item?.contactNumber}
                            </Typography>
                          </td>
                          <td className={classes}>
                          <Box className={'text-right mr-6 flex justify-end gap-5'}>
                              <Button
                                className="btn btn-sm btn-danger ms-1"
                                variant="gradient"
                                color='blue'
                                size="sm"
                                onClick={() => handleEdit(item?._id)}
                              >
                                &#x1F589;
                              </Button>
                              <Button
                                variant="gradient"
                                size="sm" color='red' className="btn btn-danger ms-2"
                                onClick={(e) => handleDelete(item?._id)}
                              >X
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
              : <>Wait </>}
          </table>
        </CardBody>
        <CardFooter className="pt-0 ">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Pagination
              count={Math.ceil(totalSupplier / page_Index)}
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

