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

export default function AddProduct() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    productName: "",
    packing: "",
    store: '',
    supplier:[]
  });

  const [stores,setStores] = useState([]);
  const [suppliers,setSuppliers] = useState([]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const getStores = async (inputValue) => {
    try {
      const res = await axios.get(
        `${BASE_URL}storesSelect/?storeName=`+ inputValue
      );
      if(res.data.success){
          setStores(res.data.stores?.map(item=>
            {
            return {...item,value:item?._id,label:item.storeName}
          }))
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSuppliers = async (inputValue) => {
    try {
      const res = await axios.get(
        `${BASE_URL}suppliersSelect/?supplierName=`+inputValue
      );
      if(res.data.success){
        setSuppliers(res.data.suppliers?.map((item=>{
          return {...item,value:item._id,label:item.supplierName}
        })))
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
      const res = await getStores(inputValue);
      const institutes = res.map((val) => {
        return { label: val.storeName, value: val._id };
      });
      return institutes;
  };

  const searchSupplier =  async (inputValue) => {
      const res = await getSuppliers(inputValue);
      const institutes = res.map((val) => {
        return { label: val.supplierName, value: val._id };
      });
      return institutes;
  };

  useEffect(()=>{
    getStores('')
    getSuppliers('')
  },[])
  
  return (
    <div class="flex items-center justify-center">
      <Card className="w-96">
        <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Product</Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
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
            </div>
            <div className="flex justify-evenly">
              <Button size="sm" className="mt-6" type="submit">
                Save
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/products"); })}>
                Cancle
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div >
  );
};

