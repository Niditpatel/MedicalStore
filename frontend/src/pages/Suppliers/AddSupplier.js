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
import  axios  from "axios";
import AsyncSelect from 'react-select/async';


export default function AddSupplier() {

  const navigate = useNavigate();
  
  const [data, setData] = useState({
    supplierName: "",
    contactNumber: "",
    store:[],
    isDeleted: false
  });

  const [stores,setStores] = useState([]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}supplier/new`,
        data
      );
      if(res.data.success){
        navigate('/suppliers');
      }
    } catch (error) {
      console.log(error);
    }
    
  };

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


  const searchStore =  async (inputValue) => {
    const res = await getStores(inputValue,true);
    const institutes = res.map((val) => {
      return { label: val.storeName, value: val._id };
    });
    return institutes;
};

useEffect(()=>{
getStores('',false);
},[]);

  return (
    <div className="container">
    <div class="flex items-center justify-center">
      <Card className="min-w-[320px] max-w-[520px] w-full">
        {/* <CardHeader floated={false}>
          <Typography className="text-center text-2xl">Supplier</Typography>
        </CardHeader> */}
        <CardBody>
          <form onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="mb-4 text-center">
              <Typography className="text-2xl">Add Supplier</Typography>
            </div>
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="supplierName"
                label="Name"
                value={data.supplierName}
                onChange={handleChange}
              />
              <Input
                size="sm"
                type="text"
                className="form-control"
                name="contactNumber"
                label="Contact Number"
                value={data.email}
                onChange={handleChange}
              />
               <AsyncSelect
openMenuOnFocus={true}
              tabSelectsValue={true} 
                cacheOptions
                isMulti
                defaultOptions={stores}
                isClearable
                placeholder="Select Company"
                loadOptions={searchStore}
                getOptionValue={(option) => option.value}
                getOptionLabel={(option) => option.label}
                onChange={(e)=>{
                  if(e.length >0){
                   const stores = e.map(item=>item.value)
                     setData({...data,store:stores})
                  }else{
                   setData({...data,store:[]})
                  }
                 }}
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
              <Button size="sm" className="mt-6" type="submit"  >
                Save
              </Button>
              <Button size="sm" className="mt-6" onClick={((e) => { navigate("/suppliers"); })}>
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

