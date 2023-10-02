import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Checkbox,
  Popover,
  PopoverHandler,
  PopoverContent,
  CardFooter
} from "@material-tailwind/react";
import { DateRange, DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BASE_URL } from "../Common";
import axios from "axios";
import {
  Pagination
} from "@mui/material";
import Stack from '@mui/material/Stack';



const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataForCart, setDataForCart] = useState([]);
  const [searchData, setSearchData] = useState({ storeName: '', supplierName: '', productName: '' });
  const [totalProducts, setTotalProduct] = useState(0);
  const [page_Index, setPage_Index] = useState(1);

  const getTotalProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}totalProducts`
      );
      setTotalProduct(res.data.total)
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const data = await axios.get(
        `${BASE_URL}search/?` + 'supplierName=' +
        searchData.supplierName + '&storeName=' + searchData.storeName + '&productName=' + searchData.productName + '&offset=' + page_Index
      );
      if (data.data.success) {
        setData(data.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getData();
    getTotalProducts();
  }, [searchData, page_Index]);

  const handleDelete = async (id) => {
    try {
      const data = await axios.delete(
        `${BASE_URL}/product` + id
      );
      if (data.data.success) {
        console.log(data.data.message)
      }
    } catch (error) {
      console.log(error);
    }
    getData();
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  }
  const handleChangePageNew = (e, value) => {
    setPage_Index(value);
  }
  const handleEdit = (id) => {
    navigate('/edit-product/' + id)
  }
  const addForCart = (maal) => {
    const isExists = dataForCart?.find(item => item._id == maal._id)
    if (isExists !== null && isExists) {
      const newData = dataForCart?.filter(item => item._id !== maal._id)
      setDataForCart(newData);
    } else {
      setDataForCart([...dataForCart, maal])
    }
  }
  const addAll = (e) => {
    if(e === true){
      setDataForCart(data)
    }
    else{
      setDataForCart([])
    }
    // const isExists = dataForCart?.find(item => item._id == maal._id)
    // if (isExists !== null && isExists) {
    //   const newData = dataForCart?.filter(item => item._id !== maal._id)
    //   setDataForCart(newData);
    // } else {
    //   setDataForCart([...dataForCart, maal])
    // }
  }

const handleAddCart = async() =>{
  try {
    const data = await axios.post(
      `${BASE_URL}cart/new`,
      dataForCart?.map(item=>item._id)?.filter(item=>item !== undefined)
    );
    if (data.data.success) {
      navigate('/cart');
    }else{
      console.log(data.data.error)
    }
  } catch (error) {
    console.log(error);
  }
}

  const TABLE_HEAD = [ <Checkbox onChange={(e) => {addAll(e.target.checked) }} />, "Product Name", "Packing", "Supplier", "", ""];
  return (

    <div className="container">
      <Card className="h-full w-full	">
        <CardHeader floated={false} shadow={false} className=" rounded-none print:hidden">
          <div className="mb-3 flex justify-between items-center">
            <Typography> Products </Typography>
           <div style={{display:'flex',gap:5}}> <Button className="mt-6 m-0 " onClick={(e) => { navigate("/add-product") }}>Add Product</Button>
           <Button className="mt-6 m-0 " onClick={(e) => { handleAddCart(); }}>Add to Cart</Button></div>
          </div>
          <div className="w-full flex gap-5 justify-between items-center">
            <Input
              type="text"
              size="sm"
              className="form-control border rounded"
              label="Store Name"
              name="storeName"
              value={searchData.storeName}
              onChange={handleChange}
            />
            <Input
              type="text"
              size="sm"
              className="form-control border rounded"
              label="Product Name"
              name="productName"
              value={searchData.productName}
              onChange={handleChange}
            />
            <Input
              type="text"
              size="sm"
              className="form-control border rounded"
              label="Supplier Name"
              name="supplierName"
              value={searchData.supplierName}
              onChange={handleChange}
            />
            {/* <Button variant="gradient" size="sm" className="btn btn-primary" onClick={handlesearch}>search</Button> */}
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
                          <Checkbox onChange={(e) => { addForCart(item) }}
                          checked={dataForCart.find(A=>A._id === item._id) ? true :false}
                          value={dataForCart.find(A=>A._id === item._id) ? true :false} />
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.productName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.packing}
                        </Typography>
                      </td>
                      <td className={classes} >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.supplier?.map((item) => item?.supplierName)?.join(', ')}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Button
                          variant="gradient"
                          color='blue'
                          size="sm"
                          className="print:hidden"
                          onClick={() => handleEdit(item?._id)}
                        >
                          &#x1F589;
                        </Button>
                      </td>
                      <td className={classes}>
                        <Button
                          variant="gradient" size="sm" color='red' className="btn btn-danger print:hidden"
                          onClick={(e) => handleDelete(item?._id)}
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
        <CardFooter className="pt-0 print:hidden">
          <Stack>
            <Pagination
              count={Math.ceil(totalProducts / 10)}
              page={page_Index}
              onChange={handleChangePageNew}
            />
          </Stack>
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

export default Home;
