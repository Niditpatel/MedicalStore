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
  CardFooter,
  Dialog,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { DateRange, DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BASE_URL } from "../../Common";
import axios from "axios";
import {
  Pagination
} from "@mui/material";
import Stack from '@mui/material/Stack';



const Cart = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState({ storeName: '', supplierName: '', productName: '' });
  const [totalProducts, setTotalProduct] = useState(0);
  const [page_Index, setPage_Index] = useState(1);

  const [dialog,setDialog] = useState({open:false,item:{}})
  const [claerAll,setClaerAll] = useState(false);

  const getTotalProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}totalcarts`
      );
      setTotalProduct(res.data.total)
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const data = await axios.get(
        `${BASE_URL}cart/search/?` + 'supplierName=' +
        searchData.supplierName + '&storeName=' + searchData.storeName + '&productName=' + searchData.productName +'&offset=' + page_Index
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
  }, [searchData,page_Index]);

  const handleDelete = async (id) => {
    try {
      const data = await axios.delete(
        `${BASE_URL}/cart/` + id
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
  const handleClearCart = async()=>{
    try {
      const data = await axios.delete(
        `${BASE_URL}/carts`
      );
      if (data.data.success) {
        console.log(data.data.message)
      }
    } catch (error) {
      console.log(error);
    }
    getData();
  }
  const TABLE_HEAD = ["", "Product Name", "Packing", "Supplier", ""];
  return (

    <div className="container">
      <Card className="h-full w-full	">
        <CardHeader floated={false} shadow={false} className=" rounded-none print:hidden">
          <div className="mb-3 flex justify-between items-center">
            <Typography> Cart </Typography>
            <div className="flex gap-3">
              <Button className="mt-6 m-0 " onClick={(e) => { navigate("/") }}>Add In Cart</Button>
              <Button className="mt-6 m-0 " onClick={(e)=>{setClaerAll(true)}}>claer Cart</Button>
            </div>
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
                {data && data.length >0 ?
                <>
                 {data?.map((item, index,) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast
                    ? "p-1"
                    : "p-1 border-b border-blue-gray-50";
                  return (
                    <tr className="h-4" key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {/* <Checkbox onChange={(e) => { addForCart(item) }} /> */}
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
                          variant="gradient" size="sm" color='red' className="btn btn-danger print:hidden"
                          onClick={(e) => setDialog({open:true,item:item})}
                        >X
                        </Button>
                      </td>
                    </tr>
                  );
                },
                )}
                </>
                :<>
                <tr>
                  <td colSpan={9} style={{textAlign:'center'}}>There is nothing to show.</td>
                </tr>
                </>
                }
               
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
      </Card>
      <Dialog
        open={dialog.open}
        handler={(e)=>{setDialog({open:false,item:{}})}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody divider>
          Are you sure you Want to delete this item <span className="font-bold">{dialog?.item?.productName}</span>.
        </DialogBody>
        <DialogFooter>
          <Button
            color="grey"
            variant='gradient'
            onClick={(e)=>{setDialog({open:false,item:{}})}}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e)=>{setDialog({open:false,item:{}})
                    handleDelete(dialog.item?._id)}}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={claerAll}
        handler={(e)=>{setClaerAll(false)}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody divider>
          Are you sure you Want to clear cart.
        </DialogBody>
        <DialogFooter>
          <Button
            color="grey"
            variant='gradient'
            onClick={(e)=>{setClaerAll(false)}}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e)=>{
                    setClaerAll(false)
                    handleClearCart()}}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>

  );
};

export default Cart;
