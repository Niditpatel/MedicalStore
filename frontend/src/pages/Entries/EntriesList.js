import { useEffect, useState, useRef } from "react";
import { Await, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Common";
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
import moment from "moment/moment";


export default function EntitrysList() {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState({ productName: '', supplierName: '' });
    const [dataForSheet, setDataForSheet] = useState([]);
    //in Future use
    const [storeData, setStoreData] = useState([]);
    const [productData, setProductData] = useState([])
    const [supplierData, setSupplierData] = useState([])

    const [filterData, setFilterData] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());



    const getData = async () => {

        setLoading(true);
        const productData = await getProductData();
        const supplierData = await getSupplierData();
        const storeData = await getStoreData();
        try {
            const res = await fetch(
                `/api/v1//tabs/Entries?_format=index`
            );
            const data = await res.json();
            const realData = Object.keys(data).map((key) => data[key])
            let malData = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map((item) => {
                const product = productData.find(p => p?.productId?.toString() === item?.productId?.toString())
                const supplier = supplierData.find(s => s?.supplierId?.toString() === item?.supplierId?.toString())
                const store = storeData.find(st => st?.storeId?.toString() === item?.storeId?.toString());
                item.productName = product?.productName
                item.packing = product?.packing
                item.supplierName = supplier?.supplierName
                item.message = supplier?.message
                item.storeName = store?.storeName
                // item.createdDate = realData?.createdDate
                return item
            })
            setData(malData)
            setFilterData(malData);
            localStorage.setItem("maxEntryId", realData.length);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }

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

    const handlesearch = async () => {
        const filterdata = data.filter(item => item?.productName?.toLowerCase()?.includes(searchData?.productName?.toLowerCase())
            &&
            item?.supplierName?.toLowerCase()?.includes(searchData?.supplierName?.toLowerCase())
        )
        setFilterData(filterdata)
    }


    useEffect(() => {
        getData();
        getSupplierData();
        getProductData();
        getStoreData();
    }, []);


    const handleDelete = async (e, item) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `/api/v1//tabs/Entries/entryId/${item?.entryId}`,
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

    const handleEdit = (index) => {
        navigate(`/edit-entry/${index}`)
    }

    const addForCart = (maal) => {
        console.log("maal", maal);
        const isExists = dataForSheet.find(item => item.entryId == maal.entryId)
        if (isExists !== null && isExists) {
            const newData = dataForSheet.filter(item => item.entryId !== maal.entryId)
            setDataForSheet(newData);
        } else {
            setDataForSheet([...dataForSheet, maal])
        }
    }
    const addFinalCart = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(
                `/api/v1//tabs/Carts`,
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
    const TABLE_HEAD = ["", "Store Name", "Product Name", "Packing", "Supplier", "Supplier Contact", "", ""];
    return (
        <div className="container">

            <div className="flex items-center justify-end">
                <Card className="h-full w-11/12	">
                    <CardHeader floated={false} shadow={false} className=" rounded-none">
                        <div className="mb-3 flex justify-between items-center">
                            <Typography> Entry List</Typography>
                            <div className="items-end ">
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
                                <Button className="mt-6 m-0 mr-3" onClick={addFinalCart}>Add to cart</Button>
                                <Button className="mt-6 m-0 " onClick={(e) => { navigate("/add-entry") }}>Add Entry</Button>
                            </div>
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
                                    {filterData?.map((item, index,) => {
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
                                                <td className={classes}>
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
        </div>
    );
};

