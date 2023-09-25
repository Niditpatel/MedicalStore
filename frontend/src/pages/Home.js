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
import moment from "moment";


const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [dataForSheet, setDataForSheet] = useState([]);  
  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState({ storeName: '',supplierName:'',productName:'' });

  const getData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/search?`+'supplierName='+
        searchData.supplierName+'&storeName='+searchData.storeName+'&productName='+searchData.productName
      );
      const data = await res.json();
      setData(data?.data)
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getData();
  }, [searchData]);

  const handleDelete = async (rowIndex) => {
    try {
      const res = await fetch(
        `https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5/${rowIndex}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        const updatedData = data.filter((_, i) => i !== rowIndex);
        setData(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) =>{
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  }

  const handlesearch = async () => {
    try {
      const res = await fetch(
        `https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5/search?name=*${searchData.name}*`
      );
      const data = await res.json();
      setData(data?.data)
    } catch (error) {
      console.log(error);
    }
  }

  const addForCart = (maal) => {
    const isExists = dataForSheet.find(item => item.rowNo === maal.rowNo)
    if (isExists !== null && isExists) {
      const newData = dataForSheet.filter(item => item.rowNo !== maal.rowNo)
      setDataForSheet(newData);
    } else {
      setDataForSheet([...dataForSheet, maal])
    }
  }
  const addFinalCart = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5/tabs/cart",
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

  const TABLE_HEAD = ["", "Store Name", "Product Name", "Packing", "Supplier", ""];
  return (

    <div className="container">
    <div className="flex items-center justify-end">
        <Card className="h-full w-11/12	">
            <CardHeader floated={false} shadow={false} className=" rounded-none">
                <div className="mb-3 flex justify-between items-center">
                    <Typography> List</Typography>
                    {/* <div className="items-end ">
                        <Popover animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 25 },
                        }} placement="bottom" >
                            <PopoverHandler>
                                {/* <Button className="mr-12">{(moment(startDate).format("DD-MM-YYYY"))} {" to "} {(moment(endDate).format("DD-MM-YYYY"))} </Button> 
                            </PopoverHandler>
                            <PopoverContent className="w-96">
                                {/* <DateRange
                                    editableDateInputs={true}
                                    onChange={handleSelect}
                                    moveRangeOnFirstSelection={false}
                                    ranges={[selectionRange]}
                                /> 
                            </PopoverContent>
                        </Popover>
                        <Button className="mt-6 m-0 mr-3" onClick={addFinalCart}>Add to cart</Button>
                        <Button className="mt-6 m-0 " onClick={(e) => { navigate("/add-entry") }}>Add Entry</Button>
                    </div> */}
                </div>
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
                                                <Checkbox onChange={(e) => { addForCart(item) }} />
                                            </div>
                                        </td>
                                        {console.log(item)}
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold"
                                                >
                                                    {item?.store?.storeName}
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
                                                {item?.supplier?.map((item)=>item?.supplierName)?.join(' ,')}
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
                                        {/* <td className={classes}>
                                            <Button
                                                variant="gradient"
                                                color='blue'
                                                size="sm"
                                                onClick={() => handleEdit(item?.productId)}
                                            >
                                                &#x1F589;
                                            </Button>
                                        </td>
                                        <td className={classes}>
                                            <Button
                                                variant="gradient" size="sm" color='red' className="btn btn-danger"
                                                onClick={(e) => handleDelete(e, item)}
                                            >X
                                            </Button>
                                        </td> */}
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
</div>

  );
};

export default Home;
