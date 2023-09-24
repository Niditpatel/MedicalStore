import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Common";
import {
  Card,
  Input,
  CardBody,
  Button,
  CardHeader,
  Typography
} from "@material-tailwind/react";

import Select from "react-select";

import moment from "moment/moment";

const Add = () => {
  const navigate = useNavigate();
  const [storeData,setStoreData] = useState([]);
  const [optionStoreData,setOptionStoreData] = useState([]);
  const [optionSupplierData,setOptionSupplierData] = useState([]);
  const [optionProductData,setOptionProductData] = useState([]);
  const [productData,setProductData] = useState([])
  const [supplierData,setSupplierData] = useState([])
  const [data, setData] = useState({
    storeId: "",
    productId: "",
    supplierId: "",
    isDeleted: "FALSE",
    createdDate: moment(new Date().toString()).format("DD-MM-YYYY"),
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let entryId = localStorage.getItem('maxEntryId')
    if (entryId) {
      entryId = parseInt(entryId) + 1
      try {
        const res = await fetch(
          `${BASE_URL}/tabs/Entries`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data, entryId: entryId }),
          }
        );
        if (res.ok) {
          navigate("/entries");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/entries")
    }
  };

  const getSupplierData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/tabs/Suppliers?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      const newdata = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map(item=>{return {...item,label:item?.supplierName,value:item?.supplierId}})
      setSupplierData(newdata);
      setOptionSupplierData(newdata.slice(0,6))
    } catch (error) {
      console.log(error);
    }
  };

  const getStoreData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}?_format=index`
      );
      const data = await res.json();
      const realData = Object.keys(data).map((key) => data[key])
      const newdata = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map(item=>{return{...item,label:item?.storeName,value:item?.storeId}})
      setStoreData(newdata);
      setOptionStoreData(newdata.slice(0,6))
    } catch (error) {
      console.log(error);
    }
  };

  const getProductData = async () => {
    try {
        const res = await fetch(
            `${BASE_URL}/tabs/Products?_format=index`
        );
        const data = await res.json();
        const realData = Object.keys(data).map((key) => data[key])
        const newdata = realData.filter(item => item?.isDeleted?.toString() !== 'TRUE').map(item=>{return{...item,label:item?.productName,value:item?.productId}})
        setProductData(newdata);
        setOptionProductData(newdata.slice(0,6))
      } catch (error) {
        console.log(error);
    }
};

useEffect(()=>{
getStoreData();
getSupplierData();
getProductData(); 
},[])

  return (
    <div className="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Entries</Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-6">
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              placeholder="Select Store"
              isSearchable
              name="Store"
              options={optionStoreData}
              onInputChange={(value)=>{
                setOptionStoreData(storeData.filter(item=>item?.label?.includes(value)).slice(0,6))
              }}
              onChange={(e)=>{
                if(e){
                  setData({...data,storeId:e.value})
                }else{
                  setData({...data,storeId:''})
                }
              }}
            />
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              placeholder="Select Product"
              isSearchable
              onInputChange={(value)=>{
                setOptionProductData(productData.filter(item=>item?.label?.includes(value)).slice(0,6))
              }}
              name="product"
              options={optionProductData}
              onChange={(e)=>{
                if(e){
                  setData({...data,productId:e.value})
                }else{
                  setData({...data,productId:''})
                }
              }}
            />
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              placeholder="Select Supplier"
              name="supplier"
              onInputChange={(value)=>{
                setOptionSupplierData(supplierData.filter(item=>item?.label?.includes(value)).slice(0,6))
              }}
              options={optionSupplierData}
              onChange={(e)=>{
                if(e){
                  setData({...data,supplierId:e.value})
                }else{
                  setData({...data,supplierId:''})
                }
              }}
            />
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit"  >
                Save
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/entries"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
  );
};

export default Add;
