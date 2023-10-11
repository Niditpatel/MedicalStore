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
  CardFooter,
  Dialog,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import * as Yup from "yup";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { BASE_URL } from "../Common";
import axios from "axios";
import AsyncSelect from 'react-select/async';
import {
  Box,
  Pagination,
  TextField
} from "@mui/material";
import Select from 'react-select'
import { options } from "../StaticData/StaticData"



const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([{
    _id: "",
    productName: "",
    packing: "",
    store: {
      contactNumber: "",
      storeName: "",
      _id: "",
    },
    supplier: [{
      contactNumber: "",
      supplierName: "",
      _id: "",
    }],
    isCart: false,
    buyerId: "",
    quantity: 0
  }]);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ open: false, item: {} })
  const [buyers, setBuyers] = useState([]);
  const [searchData, setSearchData] = useState({ storeName: '', supplierName: '', productName: '' });
  const [totalProducts, setTotalProduct] = useState(0);
  const [page_Index, setPage_Index] = useState(1);
  const [page_Size, setPage_Size] = useState(5);

  const getData = async () => {
    try {
      const data = await axios.get(
        `${BASE_URL}search/?` + 'supplierName=' +
        searchData.supplierName + '&storeName=' + searchData.storeName + '&productName=' + searchData.productName + '&offset=' + page_Index + '&limit=' + page_Size
      );
      if (data.data.success) {
        let dataMake = data?.data?.data
        dataMake.map((x) => {
          x.buyerId = "";
          x.quantity = 0;
          x.isCart = false;
          return x;
        });
        setData(dataMake)
        setTotalProduct(data.data.total)
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const data = await axios.delete(
        `${BASE_URL}product/` + id
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
  const addAll = (e) => {
    const newData = data.map((x) => {
      x.isCart = e
      return x
    })
    setData(newData)
  }


  const handleAddCart = async (values) => {
    let validateQuantiy = values?.data?.filter(
      (x) =>
        x.isCart === true &&
        (x._id === " " ||
          x.quantity < 1)
    ).length;

    let validateBuyer = values?.data?.filter(
      (x) =>
        x.isCart === true &&
        (x._id === "" ||
          x.buyerId === "")
    ).length;
    if (validateQuantiy > 0) {
      return alert("Quantity must grater than 0 in selected field")
    }
    if (validateBuyer > 0) {
      return alert("Please select Buyer in selected field ")
    }
    try {
      const data = await axios.post(
        `${BASE_URL}cart/new`,
        values?.data.filter((item) => item?.isCart === true)
      );
      if (data.data.success) {
        navigate('/cart');
      } else {
        console.log(data.data.error)
      }
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    getData();
    // getTotalProducts();
  }, [searchData, page_Index, page_Size]);

  useEffect(() => {
    getBuyers('', false);
  }, [])
  const validationSchema =
    Yup.object().shape({
      data: Yup.array().of(
        Yup.object().shape({
          buyerId: Yup.string().when("isCart", {
            is: true,
            then: Yup.string().required("Buyer is required.")
              .min(1, "Byer is required."),
            otherwise: Yup.string(),
          }),
          quantity: Yup.number().when("isCart", {
            is: true,
            then: Yup.number().required("Quantiy is required.")
              .min(1, "Quantiy is required."),
            otherwise: Yup.number(),
          }),
          isCart: Yup.boolean()
        }))
    })
  const handleFocus = (event) => event.target.select();

  return (
    <div className="container mb-8">
      <Formik
        enableReinitialize
        initialValues={{
          data: data
        }}
        onSubmit={(values) => {
          handleAddCart(values)
        }}
      // validateOnMount
      // validationSchema={validationSchema}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Card className="h-full w-full	">
                <CardHeader floated={false} shadow={false} className=" rounded-none print:hidden">
                  <div className="mb-3 flex justify-between items-center">
                    <Typography> Product List </Typography>
                    <div className="flex gap-2">
                      <Button size="sm" className="mt-6 m-0" onClick={(e) => {
                        navigate('/add-product')
                      }}>Add Product</Button>
                      <Button type="submit"
                        //disabled={isSubmitting}
                        onSubmit={(E) => {
                          console.log("errora", props.errors);
                        }}
                        size="sm" className="mt-6 m-0"
                      >Add to Cart</Button>
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
                <CardBody className="p-4 overflow-hidden px-0 ">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        <th
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-2"
                        >
                          <Checkbox size={'small'} onChange={(e) => { addAll(e.target.checked) }} className="m-0 p-0 print:hidden" />
                        </th>
                        <th
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-2"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            Product Name
                          </Typography>
                        </th><th
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-2"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >Packing
                          </Typography>
                        </th>

                        <th
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-2"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >Supplier
                          </Typography>
                        </th>
                        <th
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-2"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >Quantity
                          </Typography>
                        </th>
                        <th
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-2"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >Buyer
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    {loading === false ?
                      <tbody>
                        {data?.map((item, index,) => {
                          const isLast = index === data.length - 1;
                          const classes = isLast
                            ? "py-1 px-2"
                            : "py-1 px-2 border-b border-blue-gray-50";
                          return (
                            <tr className="h-4" key={index}>
                              <td className={classes} >
                                <div className="flex items-center">
                                  <Checkbox className="print:hidden" size={'small'} onChange={(e) => {
                                    setFieldValue(
                                      `data[${index}].isCart`,
                                      e.target?.checked ? e.target.checked : false,
                                      false
                                    );
                                  }}
                                    checked={values.data[index]?.isCart}
                                    value={values.data[index]?.isCart} />
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
                                <Select
                                  menuPortalTarget={document.body}
                                  className="basic-single"
                                  classNamePrefix="select"
                                  isClearable={true}
                                  isSearchable={true}
                                  onChange={(e)=>{
                                    setFieldValue(
                                      `data[${index}].supplierId`,
                                      e !== null ? e.value : "",
                                      false
                                    );
                                  }}
                                  name="supplier"
                                  options={item.supplier.map((item)=>{
                                    return {...item,label:item.supplierName,value:item._id}
                                  })}
                                />
                              </td>
                              <td className={classes}>
                                <TextField size="small"
                                  type="number"
                                  name={`data[${index}].quantity`}
                                  value={values.data[index]?.quantity}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `data[${index}].quantity`,
                                      e.target.value ? parseInt(e.target.value) : 0,
                                      false
                                    )
                                  }}
                                  onWheel={(e) => e.target.blur()}
                                  inputProps={{
                                    style: { textAlign: "right" },
                                  }}
                                  onFocus={handleFocus}
                                />
                                {/*  <ErrorMessage name={`data[${index}].quantity`} /> */}
                              </td>
                              <td className={classes}>
                                <AsyncSelect
                                  cacheOptions
                                  menuPortalTarget={document.querySelector('body')}
                                  defaultOptions={buyers}
                                  isClearable
                                  placeholder="Buyer"
                                  loadOptions={searchBuyer}
                                  getOptionValue={(option) => option.value}
                                  getOptionLabel={(option) => option.label}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `data[${index}].buyerId`,
                                      e !== null ? e.value : "",
                                      false
                                    );
                                  }}
                                  noOptionsMessage={({ inputValue }) =>
                                    !inputValue
                                      ? "Start Typing to View Results"
                                      : inputValue.length > 0
                                        ? "No Result Are Found Matching This Value"
                                        : "Type At Least Three Character to View Result"
                                  }
                                />
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
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Pagination
                      count={Math.ceil(totalProducts / page_Size)}
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
            </form>
          );
        }}
      </Formik>
      <Dialog
        open={dialog.open}
        handler={(e) => { setDialog({ open: false, item: {} }) }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody divider>
          Are you sure you Want to delete Store <span className="font-bold">{dialog?.item?.storeName}</span>.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
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
    </div >
  );
};



export default Home;
