import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, ErrorMessage } from 'formik';
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
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import moment from "moment/moment";
import * as Yup from "yup";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BASE_URL } from "../../Common";
import axios from "axios";
import AsyncSelect from 'react-select/async';
import {
    Box,
    Pagination,
    TextField
} from "@mui/material";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Select from 'react-select'
import { options } from "../../StaticData/StaticData"
import { useReactToPrint } from "react-to-print";
import { DateRange, DateRangePicker } from 'react-date-range';


const Report = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState({ open: false, item: {} })
    const [buyers, setBuyers] = useState([]);
    const [data, setData] = useState([]);
    const [printData, setPrintData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [supplierWiseData, setSupplierWiseData] = useState([]);
    const [companyWiseData, setCompanyWiseData] = useState([]);
    const [buyerWiseData, setBuyerWiseData] = useState([]);
    const [searchData, setSearchData] = useState({ storeName: '', supplierName: '', productName: '' });
    const [rsearchData, setrSearchData] = useState({ store: '', supplierName: '', productName: '' });
    const [totalData, setTotalData] = useState(0);
    const [page_Index, setPage_Index] = useState(1);
    const [page_Size, setPage_Size] = useState(5);
    const [reportType, setReportType] = useState(1);
    const [stores, setStores] = useState([]);
    const [printCart, setPrintCart] = useState(false);
    const [supplierWisePrintData, setSupplierWisePrintData] = useState([]);
    const [BuyerWisePrintData, setBuyerWisePrintData] = useState([]);
    const [CompnanyWisePrintData, setCompnanyWisePrintData] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date());

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }

    const handleSelect = async (date) => {
        let filtered = supplierWiseData.filter((product) => {
            let productDate = new Date(product.createdAt);
            return (productDate >= date.selection.startDate &&
                productDate <= date.selection.endDate);
        })
        setStartDate(date.selection.startDate);
        setEndDate(date.selection.endDate);
    };
    const handleChangePageNew = (e, value) => {
        setPage_Index(value);
    }

    const getBuyers = async (inputValue, loadMode) => {
        try {
            const res = await axios.get(
                `${BASE_URL}buyersSelect/?buyerName=` + inputValue
            );
            if (res.data.success) {
                const buyers = res.data.buyers?.map(item => {
                    return { ...item, value: item?._id, label: item.buyerName }
                })
                if (!loadMode) {
                    setBuyers(buyers)
                }
                return buyers
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };

    const searchBuyer = async (inputValue) => {
        const res = await getBuyers(inputValue, true);
        const institutes = res.map((val) => {
            return { label: val.buyerName, value: val._id };
        });
        return institutes;
    };

    const getStores = async (inputValue, loadMode) => {
        try {
            const res = await axios.get(
                `${BASE_URL}storesSelect/?storeName=` + inputValue
            );
            if (res.data.success) {
                const stores = res.data.stores?.map(item => {
                    return { ...item, value: item?._id, label: item.storeName }
                })
                if (!loadMode) {
                    setStores(stores)
                }
                return stores
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };

    const searchStore = async (inputValue) => {
        const res = await getStores(inputValue, true);
        const institutes = res.map((val) => {
            return { label: val.storeName, value: val._id };
        });
        return institutes;
    };
    const getSuppliers = async (inputValue, loadMode) => {
        try {
            const res = await axios.get(
                `${BASE_URL}suppliersSelect/?supplierName=` + inputValue
            );
            if (res.data.success) {

                const suppliers = res.data.suppliers?.map((item => {
                    return { ...item, value: item._id, label: item.supplierName }
                }))
                if (!loadMode) {
                    setSuppliers(suppliers)
                }
                return suppliers
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };
    const searchSupplier = async (inputValue) => {

        const res = await getSuppliers(inputValue, true);
        const institutes = res.map((val) => {
            return { label: val.supplierName, value: val._id };
        });
        return institutes;
    };

    const getSupplierWiseReportPrint = async (supplierId) => {
        try {
            const res = await axios.get(
                `${BASE_URL}supplierreportprint/?supplier_id=` + supplierId
            );
            if (res.data.success) {
                setPrintData(res.data.data)
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getSupplierWiseReport = async (supplierId) => {
        try {
            const res = await axios.get(
                `${BASE_URL}supplierreport/?supplier_id=` + supplierId + '&offset=' + page_Index + '&limit=' + page_Size
            );
            
            if (res.data.success) {
                setData(res.data.data)
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getCompanyrWiseReportPrint = async (companyId) => {
        try {
            const res = await axios.get(
                `${BASE_URL}companyreportprint/?company_id=` + companyId + '&start_date=' + startDate + '&end_date=' + endDate
            );
            if (res.data.success) {
                setPrintData(res.data.companyreport)
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getCompanyWiseReport = async (companyId) => {
        try {
            const res = await axios.get(
                `${BASE_URL}companyreport/?company_id=` + companyId + '&offset=' + page_Index + '&limit=' + page_Size
                + '&start_date=' + startDate + '&end_date=' + endDate
            );
            if (res.data.success) {
                setData(res.data.companyreport)
                setTotalData(res.data.total)
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getBuyerWiseReportPrint = async (buyerId) => {
        try {
            const res = await axios.get(
                `${BASE_URL}buyerreportprint/?buyer_id=` + buyerId + '&start_date=' + startDate + '&end_date=' + endDate
            );
            if (res.data.success) {
                setPrintData(res.data.buyerReport)
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getBuyerWiseReport = async (buyerId) => {
        debugger

        try {
            const res = await axios.get(
                `${BASE_URL}buyerreport/?buyer_id=` + buyerId + '&offset=' + page_Index + '&limit=' + page_Size
                + '&start_date=' + startDate + '&end_date=' + endDate
            );
            console.log("res",res.data);
            if (res.data.success) {
                setData(res.data.buyerReport)
                setTotalData(res.data.total)
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
    }, [searchData, page_Index, page_Size]);

    useEffect(() => {
        getStores('', false)
        getSuppliers('', false)
        getBuyers('', false)
    }, [])


    const reportTypes = [
        { label: 'Company Wise', value: 1 },
        { label: 'Buyer Wise', value: 2 },
        { label: 'Supplier Wise', value: 3 },
    ]
    const Company_HEAD = ["Product Name", "Packing", "Total Quantiy"];
    const Buyer_HEAD = ["Buyer Name", "Buyer Contact", "Product Name", "Total Quantity"];
    const Supplier_HEAD = ["Product Name", "Packing", "Supplier", "Supplier Contact"];
    console.log("data",data);
console.log("Printdata",printData);
    return (
        <div className="container mb-8">
            <Card className="h-full w-full	">
                <CardHeader floated={false} shadow={false} className=" rounded-none print:hidden">
                    <div className="mb-3 flex justify-between items-center">
                        <Select
                            menuPortalTarget={document.body}
                            options={reportTypes}
                            onChange={(e) => {
                                setData(null)
                                setPrintData(null)
                                setReportType(e.value)
                            }}
                            value={reportTypes.find(item => item.value === reportType)}
                        />
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

                        {reportType === 1 &&
                            <AsyncSelect
                                cacheOptions
                                menuPortalTarget={document.body}
                                defaultOptions={stores}
                                isClearable
                                placeholder="Select Company"
                                loadOptions={searchStore}
                                getOptionValue={(option) => option.value}
                                getOptionLabel={(option) => option.label}
                                onChange={(e) => {
                                    debugger
                                    setrSearchData({ ...rsearchData, store: e ? e.value : '' })
                                    getCompanyWiseReport(e?._id)
                                    getCompanyrWiseReportPrint(e?._id)
                                }}
                                // value={rsearchData.store}
                                noOptionsMessage={({ inputValue }) =>
                                    !inputValue
                                        ? "Start Typing to View Results"
                                        : inputValue.length > 0
                                            ? "No Result Are Found Matching This Value"
                                            : "Type At Least Three Character to View Result"
                                }
                            />
                        }
                        {reportType === 2 &&
                            <AsyncSelect
                                cacheOptions
                                menuPortalTarget={document.body}
                                defaultOptions={buyers}
                                isClearable
                                placeholder="Select Buyer"
                                loadOptions={searchBuyer}
                                getOptionValue={(option) => option.value}
                                getOptionLabel={(option) => option.label}
                                onChange={(e) => {
                                    setrSearchData({ ...rsearchData, store: e ? e.value : '' })
                                    getBuyerWiseReport(e?._id)
                                    getBuyerWiseReportPrint(e?._id)
                                }}
                                // value={rsearchData.store}
                                noOptionsMessage={({ inputValue }) =>
                                    !inputValue
                                        ? "Start Typing to View Results"
                                        : inputValue.length > 0
                                            ? "No Result Are Found Matching This Value"
                                            : "Type At Least Three Character to View Result"
                                }
                            />
                        }
                        {reportType === 3 &&
                            <AsyncSelect
                                cacheOptions
                                menuPortalTarget={document.body}
                                defaultOptions={suppliers}
                                isClearable
                                placeholder="Select Supplier"
                                loadOptions={searchSupplier}
                                getOptionValue={(option) => option.value}
                                getOptionLabel={(option) => option.label}
                                onChange={(e) => {
                                    setrSearchData({ ...rsearchData, store: e ? e.value : '' })
                                    getSupplierWiseReport(e?._id)
                                    getSupplierWiseReportPrint(e?._id)
                                }}
                                // value={rsearchData.store}
                                noOptionsMessage={({ inputValue }) =>
                                    !inputValue
                                        ? "Start Typing to View Results"
                                        : inputValue.length > 0
                                            ? "No Result Are Found Matching This Value"
                                            : "Type At Least Three Character to View Result"
                                }
                            />
                        }
                        <div className="flex gap-2">
                            <Button type="submit"
                                onClick={(e) => {
                                    debugger
                                    setPrintCart(true);
                                }}
                                size="sm" className="mt-6 m-0"
                            >Print Report</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="p-4 overflow-hidden px-0 ">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            {reportType === 1 &&
                                <tr>
                                    {Company_HEAD.map((head) => (
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
                                </tr>}
                            {reportType === 2 &&
                                <tr>
                                    {Buyer_HEAD.map((head) => (
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
                                </tr>}
                            {reportType === 3 &&
                                <tr>
                                    {Supplier_HEAD.map((head) => (
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
                                </tr>}
                        </thead>
                        {reportType === 1 &&
                            <tbody>
                                {data?.map((item, index,) => {
                                    const isLast = index === data.length - 1;
                                    const classes = isLast
                                        ? "py-1 px-2"
                                        : "py-1 px-2 border-b border-blue-gray-50";
                                    return (
                                        <tr className="h-4" key={index}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item?.product}
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
                                                    {item?.totalQuantity}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                },
                                )}
                            </tbody>}
                        {reportType === 2 &&
                            <tbody>
                                {data?.map((item, index,) => {
                                    const isLast = index === data.length - 1;
                                    const classes = isLast
                                        ? "py-1 px-2"
                                        : "py-1 px-2 border-b border-blue-gray-50";
                                    return (
                                        <tr className="h-4" key={index}>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item?.product}
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
                                                {item?.totalQuantity}
                                            </Typography>
                                        </td>
                                    </tr>
                                    );
                                },
                                )}
                            </tbody>}
                        {reportType === 3 &&
                            <tbody>
                                {data?.map((item, index,) => {
                                    const isLast = index === data.length - 1;
                                    const classes = isLast
                                        ? "py-1 px-2"
                                        : "py-1 px-2 border-b border-blue-gray-50";
                                    return (
                                        <tr className="h-4" key={index}>
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
                                                    {item?.supplier?.supplierName}
                                                </Typography>
                                            </td>

                                            <td className={classes} >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item?.supplier?.contactNumber}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                },
                                )}
                            </tbody>}
                    </table>
                </CardBody>

                <CardFooter className="pt-0 print:hidden">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Pagination
                            count={Math.ceil(totalData / page_Size)}
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
                            {reportType === 1 &&
                                <tr>
                                    {Company_HEAD.map((head) => (
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
                                </tr>}
                            {reportType === 2 &&
                                <tr>
                                    {Buyer_HEAD.map((head) => (
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
                                </tr>}
                            {reportType === 3 &&
                                <tr>
                                    {Supplier_HEAD.map((head) => (
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
                                </tr>}
                        </thead>
                        {reportType === 1 &&
                            <tbody>
                                {printData?.map((item, index,) => {
                                    const isLast = index === printData.length - 1;
                                    const classes = isLast
                                        ? "p-1"
                                        : "p-1 border-b border-blue-gray-50";
                                    return (
                                        <tr className="h-4" key={index}>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {item?.product}
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
                                                {item?.totalQuantity}
                                            </Typography>
                                        </td>
                                    </tr>
                                    );
                                },
                                )}
                            </tbody>}
                        {reportType === 2 &&
                            <tbody>
                                {printData?.map((item, index,) => {
                                    const isLast = index === printData.length - 1;
                                    const classes = isLast
                                        ? "p-1"
                                        : "p-1 border-b border-blue-gray-50";
                                    return (
                                        <tr className="h-4" key={index}>
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
                                                    {item?.supplier?.supplierName}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                },
                                )}
                            </tbody>}
                        {reportType === 3 &&
                            <tbody>
                                {printData?.map((item, index,) => {
                                    const isLast = index === printData.length - 1;
                                    const classes = isLast
                                        ? "p-1"
                                        : "p-1 border-b border-blue-gray-50";
                                    return (
                                        <tr className="h-4" key={index}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item?.product}
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
                                                    {item?.totalQuantity}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                },
                                )}
                            </tbody>}
                    </table>
                </DialogBody>
            </Dialog>
        </div >
    );
};



export default Report;
