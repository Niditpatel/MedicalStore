import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  CardBody,
  Button,
  CardHeader,
  Typography
} from "@material-tailwind/react";
import { BASE_URL } from "../../Common";
import moment from "moment/moment"; 
import axios from 'axios';
import AsyncSelect from 'react-select/async';

export default function AddPendingCart() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    productName: "",
    packing: "",
    store: '',
    quantity:0,
    supplier:[],
    buyer:'',
    createdAt:'',
    modifiedAt:''
  });

  const [stores,setStores] = useState([]);
  const [buyers,setBuyers] = useState([]);
  const [suppliers,setSuppliers] = useState([]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const getStores = async (inputValue,loadMode) => {
    try {
      const res = await axios.get(
        `${BASE_URL}storesSelect/?storeName=`+ inputValue
      );
      if(res.data.success){
        const stores = res.data.stores?.map(item=>
          {
          return {...item,value:item?._id,label:item.storeName}
        })
        if(!loadMode){
          setStores(stores)
        }
        return stores
      }else{
        return null
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBuyer = async (inputValue,loadMode) => {
    try {
      const res = await axios.get(
        `${BASE_URL}buyersSelect/?buyerName=`+ inputValue
      );
      if(res.data.success){
        const buyers = res.data.stores?.map(item=>
          {
          return {...item,value:item?._id,label:item.buyerName}
        })
        if(!loadMode){
          setBuyers(buyers)
        }
        return buyers
      }else{
        return null
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSuppliers = async (inputValue,loadMode) => {
    try {
      const res = await axios.get(
        `${BASE_URL}suppliersSelect/?supplierName=`+inputValue
      );
      if(res.data.success ){

        const suppliers = res.data.suppliers?.map((item=>{
          return {...item,value:item._id,label:item.supplierName}
        }))
        if(!loadMode){
          setSuppliers(suppliers)
        }
        return suppliers
      }else{
        return null
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}product/new`,
        data
      );
      if(res.data.success){
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchStore =  async (inputValue) => {
      const res = await getStores(inputValue,true);
      const institutes = res.map((val) => {
        return { label: val.storeName, value: val._id };
      });
      return institutes;
  };

  const searchSupplier =  async (inputValue) => {
      const res = await getSuppliers(inputValue,true);
      const institutes = res.map((val) => {
        return { label: val.supplierName, value: val._id };
      });
      return institutes;
  };

  const searchBuyer =  async (inputValue) => {
    const res = await getBuyer(inputValue,true);
    const institutes = res.map((val) => {
      return { label: val.buyerName, value: val._id };
    });
    return institutes;
};

  useEffect(()=>{
    getStores('',false)
    getSuppliers('',false)
    getBuyer('',false)
  },[])
  
  return (
    <div className="container">
    <div class="flex items-center justify-center">
    <Card className="min-w-[320px] max-w-[520px] w-full">
        {/* <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Product</Typography>
        </CardHeader> */}
        <CardBody>
          <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="mb-4 text-center">
              <Typography className="text-2xl">Add entry to pending cart </Typography>
            </div>
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="productName"
                label="Product Name"
                value={data.productName}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="packing"
                label="Packing"
                value={data.packing}
                onChange={handleChange}
              />
              <AsyncSelect
                cacheOptions
                defaultOptions={stores}
                isClearable
                placeholder="Select Store"
                loadOptions={searchStore}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
                onChange={(e)=>{
                  setData({...data,store:e?e.value:''})
                }}
                noOptionsMessage={({ inputValue }) =>
                  !inputValue
                    ? "Start Typing to View Results"
                    : inputValue.length > 0
                    ? "No Result Are Found Matching This Value"
                    : "Type At Least Three Character to View Result"
                }
              />
                <AsyncSelect
                cacheOptions
                isMulti
                defaultOptions={suppliers}
                isClearable
                placeholder="Select Suppliers"
                loadOptions={searchSupplier}
                onChange={(e)=>{
                 if(e.length >0){
                  const suppliers = e.map(item=>item._id)
                    setData({...data,supplier:suppliers})
                 }else{
                  setData({...data,supplier:[]})
                 }
                }}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
                noOptionsMessage={({ inputValue }) =>
                  !inputValue
                    ? "Start Typing to View Results"
                    : inputValue.length > 0
                    ? "No Result Are Found Matching This Value"
                    : "Type At Least Three Character to View Result"
                }
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="quantity"
                label="quantity"
                value={data.quantity}
                onChange={handleChange}
              />
                <AsyncSelect
                cacheOptions
                defaultOptions={buyers}
                isClearable
                placeholder="Select Buyer"
                loadOptions={searchBuyer}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
                onChange={(e)=>{
                  setData({...data,buyer:e?e.value:''})
                }}
                noOptionsMessage={({ inputValue }) =>
                  !inputValue
                    ? "Start Typing to View Results"
                    : inputValue.length > 0
                    ? "No Result Are Found Matching This Value"
                    : "Type At Least Three Character to View Result"
                }
              />
              <Input
                size="sm"
                type="date"
                className="form-control"
                name="createdAt"
                label="Date"
                value={data.createdAt}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit">
                Save
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
    </div>

  );
};

