import { useState ,useEffect} from "react";
import { useNavigate ,useParams} from "react-router-dom";
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
    const { rowIndex } = useParams();
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
    createdDate: '',
  });

    const getData = async () => {
        try {
          const res = await fetch(
            `${BASE_URL}/tabs/Entries/search?entryId=${rowIndex}`
          );
          const data = await res.json();
          setData(data[0]);
        } catch (error) {
          console.log(error);
        }
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const res = await fetch(
          `${BASE_URL}/tabs/Entries/${rowIndex}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({entryId:data.entryId,storeId:data.storeId,productId:data.productId,supplierId:data.supplierId,createdDate:data.createdDate,modifiedDate:moment(new Date().toString()).format("DD-MM-YYYY"),isDeleted:false}),
          }
        );
        if (res.ok) {
          navigate("/entries");
        }
      } catch (error) {
        console.log(error);
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
getData();
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
              value={optionStoreData?.find(item=> item?.storeId?.toString() === data?.storeId?.toString())}
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
              value={optionProductData?.find(item=> item?.productId?.toString() === data?.productId?.toString())}
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
              value={optionSupplierData?.find(item=> item?.supplierId?.toString() === data?.supplierId?.toString())}
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
                Update
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
