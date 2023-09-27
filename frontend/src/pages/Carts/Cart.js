import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BASE_URL } from "../../Common";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Popover,
  PopoverHandler,
  PopoverContent,
  Input
} from "@material-tailwind/react";
import { DateRange, DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  DataGrid,
} from '@mui/x-data-grid';
import moment from "moment/moment";
const Cart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({ productName: '', supplierName: '' });
  //in Future use
  const [storeData, setStoreData] = useState([]);
  const [productData, setProductData] = useState([])
  const [supplierData, setSupplierData] = useState([])
  const [onPrintButtonHide, setOnPrintButtonHide] = useState(false)

  const [filterData, setFilterData] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());


  const handleSelect = (date) => {
    let filtered = data.filter((product) => {
      let productDate = product.createdDate;
      return (productDate >= moment(date.selection.startDate).format("DD-MM-YYY") &&
        productDate <= moment(date.selection.endDate).format("DD-MM-YYY"));
    })
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilterData(filtered);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  }
  const handlePrint = () => {
    setOnPrintButtonHide(true);
    handlePrintForCart()
  }

  const handlePrintForCart = useReactToPrint({
    content: () => componentRef.current,
  });

  const getData = async () => {
    setLoading(true);
    const productData = await getProductData();
    const supplierData = await getSupplierData();
    const storeData = await getStoreData();
    try {
      const res = await fetch(
        `/api/v1//tabs/Carts?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      let malData = realData.map((item) => {
        const product = productData.find(p => p?.productId?.toString() === item?.productId?.toString())
        const supplier = supplierData.find(s => s?.supplierId?.toString() === item?.supplierId?.toString())
        const store = storeData.find(st => st?.storeId?.toString() === item?.storeId?.toString());
        item.productName = product?.productName
        item.packing = product?.packing
        item.supplierName = supplier?.supplierName
        item.message = supplier?.message
        item.storeName = store?.storeName
        return item
      })
      setData(malData)
      setFilterData(malData)
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const getSupplierData = async () => {
    try {
      const res = await fetch(
        `/api/v1//tabs/Suppliers?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      const newdata = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map(item => { return { ...item, label: item?.supplierName, value: item?.supplierId } })
      setSupplierData(newdata);
      return newdata
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const getStoreData = async () => {
    try {
      const res = await fetch(
        `/api/v1/?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      const newdata = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map(item => { return { ...item, label: item?.storeName, value: item?.storeId } })
      setStoreData(newdata);
      return newdata
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const getProductData = async () => {
    try {
      const res = await fetch(
        `/api/v1//tabs/Products?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      const newdata = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map(item => { return { ...item, label: item?.productName, value: item?.productId } })
      setProductData(newdata);
      return newdata
    } catch (error) {
      console.log(error);
      return null
    }
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  }

  const handlesearch = async () => {
    const filterdata = data.filter(item => item?.productName?.toLowerCase()?.includes(searchData?.productName?.toLowerCase())
      &&
      item?.supplierName?.toLowerCase()?.includes(searchData?.supplierName?.toLowerCase())
    )
    setFilterData(filterdata)
  }
  const columns = [
    { field: "storeName", headerName: "Store Name", minWidth: 200, flex: 1 },
    { field: "productName", headerName: "Product Name", minWidth: 200, flex: 1 },
    { field: "packing", headerName: "Packing", minWidth: 100, flex: 1 },
    { field: "supplierName", headerName: "Supplier", minWidth: 200, flex: 1 },
    { field: "message", headerName: "Supplier Contact", minWidth: 200, flex: 1 },
    { field: "createdDate", headerName: "Created Date", minWidth: 60, flex: 1 },
    {
      field: " ", headerName: "Delete", minWidth: 30, flex: 1, sortable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="gradient" size="sm" color='red' className="btn btn-danger"
            onClick={() =>
              handleDelete(params.id)}
          >
            X
          </Button>
        );
      },
    },
  ];
  const rows = [];
  filterData &&
    filterData.forEach((item, index) => {
      rows.push({
        id: index,
        storeName: item.storeName,
        productName: item.productName,
        packing: item.packing,
        supplierName: item.supplierName,
        message: item.message,
        createdDate: item.createdDate,
      });
    });
  useEffect(() => {
    getData();
  }, []);
  const handleDelete = async (rowIndex) => {
    try {
      const res = await fetch(
        `/api/v1//tabs/Carts/${rowIndex}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        const updatedData = data.filter((_, i) => i !== rowIndex);
        setData(updatedData);
        setFilterData(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const TABLE_HEAD = ["Store Name", "Product Name", "Packing", "Supplier", "Supplier Contact", "Created Date", ''];
  return (

    <div className="container">
      <div className="mb-3 flex justify-between items-center ">
        <Typography> Cart</Typography>
        <div className="items-end mr-20">
          <Button className="mt-0  mr-10" onClick={handlePrint} >Print </Button>
          <Popover animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }} placement="bottom" >
            <PopoverHandler>
              <Button>{(moment(startDate).format("DD-MM-YYYY"))} {" to "} {(moment(endDate).format("DD-MM-YYYY"))} </Button>
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
        </div>
      </div>
      {/* <Card className="h-full w-11/12	"> */}
      {/* <CardHeader floated={false} shadow={false} className=" rounded-none"> */}
      <div className="w-full flex gap-5 justify-between items-center">
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
        <Button variant="gradient" size="sm" className="btn btn-primary" onClick={handlesearch}>search</Button>
      </div>
      {/* </CardHeader> */}
      {/* <CardBody className="p-3 verflow-hidden overflow-x-scroll px-0 h-4/6" ref={componentRef}> */}
      <div className="p-3 verflow-hidden overflow-x-scroll px-0 h-4/6">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowHeight={40}
          initialState={{
            ...data,
            pagination: { paginationModel: { pageSize: 5 } },
          }}

          disableSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
        />
      </div>
      <table className="w-full min-w-max table-auto text-left hidden " ref={componentRef} >
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
          {filterData?.map((item, index,) => {
            const isLast = index === data.length - 1;
            const classes = isLast
              ? "p-1"
              : "p-1 border-b border-blue-gray-50";

            return (
              <tr key={index}>
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
                    {item?.supplierName}
                  </Typography>
                </td>
                <td className={classes} >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item?.message}
                  </Typography>
                </td>
                <td className={classes} >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {item?.createdDate}
                  </Typography>
                </td>
              </tr>
            );
          },
          )}
        </tbody >
      </table>
      {/* </CardBody> */}

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
      {/* </Card> */}
    </div>
  );
};

export default Cart;
