import { useEffect, useState } from "react";
import { useNavigate ,useParams} from "react-router-dom";
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

export default function EditProduct() {
  const navigate = useNavigate();
  const { rowIndex } = useParams();
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

  const getStores = async (inputValue,init) => {
    try {
      const res = await axios.get(
        `${BASE_URL}storesSelect/?storeName=`+ inputValue
      );
      if(res.data.success){
        const companies = res.data.stores?.map(item=>
          {
          return {...item,value:item?._id,label:item.storeName}
        })
        if(init){
          setStores(companies)
        }
        if(res.data?.stores?.length >0){
          return companies;
        }else{
          return [];
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSuppliers = async (inputValue,init) => {
    try {
      const res = await axios.get(
        `${BASE_URL}suppliersSelect/?supplierName=${inputValue}`
      );
      if(res.data.success){
        const newsupps = res.data.suppliers?.map((item=>{
          if(!data.supplier?.includes(item?._id)){
            return {...item,value:item._id,label:item.supplierName}
          }
        }))
        if(init){
          setSuppliers(newsupps);
        }
        if(res.data?.suppliers?.length >0){
        return res.data.suppliers
        }else{
          return [];
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}product/`+rowIndex,
        data
      );
      if(res.data.success){
        navigate('/products');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchStore =  async (inputValue) => {
      const res = await getStores(inputValue,false);
      const institutes = res.map((val) => {
        return { label: val.storeName, value: val._id };
      });
      if(institutes?.length >0){
        return institutes;
        }else{
          return [];
        }
  };

  const searchSupplier =  async (inputValue) => {
      const res = await getSuppliers(inputValue,false);
      const institutes = res.map((val) => {
        return { label: val.supplierName, value: val._id };
      });
      if(institutes?.length >0){
      return institutes;
      }else{
        return [];
      }
  };

  const getData = async ()=>{
    try {
      const res = await axios.get(
        `${BASE_URL}product/`+rowIndex
      );
      if(res.data.success){
        setData(res.data.product)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getStores('',true)
    getSuppliers('',true)
    getData()
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
              <Typography className="text-2xl">Edit Product</Typography>
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
openMenuOnFocus={true}
              tabSelectsValue={true} 
                cacheOptions
                defaultOptions={stores}
                isClearable
                placeholder="Select Store"
                loadOptions={searchStore}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
                value={stores?.find(item=>item?._id === data.store)}
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
openMenuOnFocus={true}
              tabSelectsValue={true} 
                cacheOptions
                isMulti
                defaultOptions={suppliers}
                isClearable
                placeholder="Select Suppliers"
                loadOptions={searchSupplier}
                onChange={(e)=>{
                 if(e.length >0){
                  const suppliers = e.map(item=>item.value)
                    setData({...data,supplier:suppliers})
                 }else{
                  setData({...data,supplier:[]})
                 }
                }}
                value={suppliers?.filter(item=>data.supplier?.includes(item?._id))}
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
 </div>
  );
};

