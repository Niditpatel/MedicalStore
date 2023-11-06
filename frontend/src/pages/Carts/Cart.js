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
  DialogFooter,
  DialogHeader
} from "@material-tailwind/react";
import { DateRange, DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BASE_URL } from "../../Common";
import axios from "axios";
import {
  Box,
  Pagination
} from "@mui/material";
import Select from 'react-select'
import { options } from "../../StaticData/StaticData"
import { useReactToPrint } from "react-to-print";


const Cart = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState({ storeName: '', supplierName: '', productName: '', buyerName: '' });
  const [totalProducts, setTotalProduct] = useState(0);
  const [page_Index, setPage_Index] = useState(1);

  const [dialog, setDialog] = useState({ open: false, item: {} })
  const [claerAll, setClaerAll] = useState(false);
  const [printCart, setPrintCart] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [page_Size, setPage_Size] = useState(5);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getData = async () => {
    try {
      const data = await axios.get(
        `${BASE_URL}cart/search/?` + 'supplierName=' + searchData.supplierName + '&buyerName=' +
        searchData.buyerName
        + '&storeName=' + searchData.storeName + '&productName=' + searchData.productName + '&offset=' + page_Index + '&limit=' + page_Size
      );
      const dataForPrint = await axios.get(
        `${BASE_URL}cart/print/?` + 'supplierName=' +
        searchData.supplierName + '&buyerName=' + searchData.buyerName
        + '&storeName=' + searchData.storeName + '&productName=' + searchData.productName
      );
      console.log("dataForPrint", dataForPrint);
      if (data.data.success) {
        setData(data.data.data)
        setTotalProduct(data.data.total)
        setFilterData(data.data.data)
      }
      if (dataForPrint.data.success) {
        setPrintData(dataForPrint.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }

  const handleSelect = async (date) => {
    let filtered = data.filter((product) => {
      let productDate = new Date(product.createdAt);
      return (productDate >= date.selection.startDate &&
        productDate <= date.selection.endDate);
    })
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilterData(filtered);
  };

  const addInPendingCart = async () => {
    try {
      const data = await axios.post(
        `${BASE_URL}pendingcart/new`,
      );
      if (data.data.success) {
        navigate('/pending-cart');
      } else {
        console.log(data.data.error)
      }
    } catch (error) {
      console.log(error);
    }
  }

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
  const handleClearCart = async () => {
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
  const TABLE_HEAD = ["Product Name", "Packing", "Supplier", "Delete"];

  useEffect(() => {
    getData();
  }, [searchData, page_Index, page_Size]);

  return (

    <div className="container">
      <Card className="h-full w-full	">
        <CardHeader floated={false} shadow={false} className=" rounded-none print:hidden">
          <div className="mb-3 flex justify-between items-center">
            <Typography> Cart </Typography>
            <div className="flex gap-3">
              <Button className="mt-6 m-0 " size="sm" onClick={(e) => {addInPendingCart();}}>Add to Pending Cart</Button>
              <Button className="mt-6 m-0 " size="sm" onClick={(e) => { navigate("/") }}>Add</Button>
              <Button className="btn btn-primary" type="primary" onClick={(e) => setPrintCart(true)}>
                Print
              </Button>
              <Button className="mt-6 m-0 " size="sm" color="red" onClick={(e) => { setClaerAll(true) }}>clear All</Button>
              {/* <div>
                <Popover animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }} placement="bottom" >
                  <PopoverHandler>
                    <Button className="mr-12">{(moment(startDate).format("DD-MM-YYYY"))} {" to "} {(moment(endDate).format("DD-MM-YYYY"))} </Button>
                  </PopoverHandler>
                  <PopoverContent className="w-96">
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleSelect}
                      moveRangeOnFirstSelection={false}
                      ranges={[selectionRange]}
                    />
                  </PopoverContent>
                </Popover>
              </div> */}
            </div>
          </div>
          <div className="w-full flex gap-5 justify-between items-center">
            <Input
              type="text"
              size="sm"
              className="form-control border rounded"
              label="Company Name"
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
          </div>
        </CardHeader>
        <CardBody className="p-4 overflow-hidden px-0">
          <table className="w-full min-w-max table-auto text-left" id="section-to-print" >
            <thead >
              <tr>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 pl-3"
                  >
                    Product Name
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Packing
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Supplier Name
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Quantity
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Buyer Name
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70 text-right print:hidden pr-8"
                  >
                    Delete
                  </Typography>
                </th>
              </tr>
            </thead>
            {loading === false ?
              <tbody>
                {data && data.length > 0 ?
                  <>
                    {filterData?.map((item, index,) => {
                      const isLast = index === data.length - 1;
                      const classes = isLast
                        ? "p-1"
                        : "p-1 border-b border-blue-gray-50";
                      return (
                        <tr className="h-4" key={index}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-4"
                            >
                              {item?.productName}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-4"
                            >
                              {item?.packing}
                            </Typography>
                          </td>
                          <td className={classes} >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-4"
                            >
                              {item?.supplier?.map((x) => x.supplierName).join(',')}
                            </Typography>
                          </td>
                          <td className={classes} >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-4"
                            >
                              {item?.quantity}
                            </Typography>
                          </td>
                          <td className={classes} >
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal ml-4"
                            >
                              {item?.buyer?.buyerName}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Box className={'flex justify-end pr-9'} >
                              <Button
                                variant="gradient" size="sm" color='red' className="btn btn-danger print:hidden"
                                onClick={(e) => setDialog({ open: true, item: item })}
                              >X
                              </Button>
                            </Box>
                          </td>
                        </tr>
                      );
                    },
                    )}
                  </>
                  : <>
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center' }}>There is nothing to show.</td>
                    </tr>
                  </>
                }

              </tbody>
              : <>Wait </>}
          </table>
        </CardBody>
        <CardFooter className="pt-0 print:hidden">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button variant="text" onClick={(e) => {
                if (page_Index > 1) {
                  handleChangePageNew(e, page_Index - 1);
                }
              }}>
                <Typography>&lt;</Typography>
              </Button>
              <Typography>{page_Index}</Typography>
              <Button variant="text" onClick={(e) => {
                if (data?.length < page_Size) {
                  return;
                } else {
                  handleChangePageNew(e, page_Index + 1)
                }
              }}>
                <Typography>&gt;</Typography>
              </Button>
            </Box>
            <Select
              defaultValue={options[0]}
              onChange={(e) => {
                setPage_Size(parseInt(e?.value))
                setPage_Index(1)
              }} options={options} />
          </div>
        </CardFooter>
      </Card>
      <Dialog
        open={dialog.open}
        handler={(e) => { setDialog({ open: false, item: {} }) }}
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
            onClick={(e) => { setDialog({ open: false, item: {} }) }}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e) => {
            setDialog({ open: false, item: {} })
            handleDelete(dialog.item?._id)
          }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={claerAll}
        handler={(e) => { setClaerAll(false) }}
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
            onClick={(e) => { setClaerAll(false) }}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e) => {
            setClaerAll(false)
            handleClearCart()
          }}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={printCart}
        size="xl"
        handler={(e) => { setPrintCart(false) }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="justify-end">
          <Button
            color="grey"
            variant='gradient'
            onClick={handlePrint}
            className="mr-1"
          >
            <span>Print </span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e) => {
            setPrintCart(false)
          }}>
            <span>Cancel</span>
          </Button>
        </DialogHeader>
        <DialogBody divider>
          <table className="w-full min-w-max table-auto text-left" id="section-to-print" ref={componentRef}>
            <thead >
              <tr>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Product Name
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Packing
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Supplier Name
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Quantity
                  </Typography>
                </th>
                <th
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    Buyer Name
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {printData?.map((item, index,) => {
                const isLast = index === data.length - 1;
                const classes = isLast
                  ? "p-1"
                  : "p-1 border-b border-blue-gray-50";
                return (
                  <tr className="h-4" key={index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal ml-4"
                      >
                        {item?.productName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal ml-4"
                      >
                        {item?.packing}
                      </Typography>
                    </td>
                    <td className={classes} >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal ml-4"
                      >
                        {item?.supplier?.map((x) => x.supplierName).join(',')}
                      </Typography>
                    </td>
                    <td className={classes} >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal ml-4"
                      >
                        {item?.quantity}
                      </Typography>
                    </td>
                    <td className={classes} >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal ml-4"
                      >
                        {item?.buyer?.buyerName}
                      </Typography>
                    </td>
                  </tr>
                );
              },
              )}
            </tbody>
          </table>
        </DialogBody>
      </Dialog>

    </div >

  );
};

export default Cart;
