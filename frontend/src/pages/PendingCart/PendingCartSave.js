import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  CardBody,
  Button,
  Typography
} from "@material-tailwind/react";
import { BASE_URL } from "../../Common";
import axios from 'axios';
import AsyncSelect from 'react-select/async';

export default function AddPendingCart() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    productName: "",
    packing: "",
    store: '',
    quantity: 0,
    supplier: [],
    buyer: '',
    isDeleted: false,
    isCart: false,
    createdAt: new Date(),
    modifiedAt: '',
    _id:''
  });

  const [stores, setStores] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [product, setProducts] = useState([]);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const getProducts = async (inputValue, loadMode) => {
    try {
      const res = await axios.get(
        `${BASE_URL}productSelect/?productName=` + inputValue
      );
      if (res.data.success) {
        const products = res.data.products?.map(item => {
          return { ...item, value: item?._id, label: item.productName }
        })
        if (!loadMode) {
          setProducts(products)
        }
        return products
      } else {
        return null
      }
    } catch (error) {
      console.log(error);
    }
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

  const getBuyer = async (inputValue, loadMode) => {
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
  const searchProduct = async (inputValue) => {
    const res = await getProducts(inputValue, true);
    const institutes = res.map((val) => {
      return { label: val.productName, value: val._id };
    });
    return institutes;
  };


  const searchBuyer = async (inputValue) => {
    const res = await getBuyer(inputValue, true);
    const institutes = res.map((val) => {
      return { label: val.buyerName, value: val._id };
    });
    return institutes;
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}pendingcart/forceSave`,
        data
      );
      if (res.data.success) {
        navigate('/pending-cart');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStores('', false)
    getBuyer('', false)
    getProducts('', false)
    getSuppliers('', false)
  }, [])
  const storesName = stores.find((x) => x._id === data.store)
  const supplierNames = data?.supplier?.map(supplierId => {
    const foundSupplier = suppliers.find(supplier => supplier._id === supplierId);
    return foundSupplier ? foundSupplier.supplierName : 'No Supplier';
  });
  return (
    <div className="container">
      <div class="flex items-center justify-center">
        <Card className="min-w-[320px] max-w-[520px] w-full">
          <CardBody>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
              <div className="mb-4 text-center">
                <Typography className="text-2xl">Add entry to pending cart </Typography>
              </div>
              <div className="mb-4 flex flex-col gap-6">
                <AsyncSelect
                  cacheOptions
                  defaultOptions={product}
                  isClearable
                  placeholder="Select Products"
                  loadOptions={searchProduct}
                  getOptionValue={(option) => option.value}
                  getOptionLabel={(option) => option.label}
                  onChange={(e) => {
                    setData({ ...data, productName: e.productName, packing: e.packing, supplier: e.supplier, store: e.store ,_id:e._id})
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
                  disabled
                  type="text"
                  className="form-control"
                  name="storeName"
                  label="store"
                  value={storesName?.storeName}
                />
                <Input
                  size="sm"
                  type="text"
                  className="form-control"
                  name="supplierName"
                  label="Supplier"
                  disabled
                  value={supplierNames}
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
                  onChange={(e) => {
                    setData({ ...data, buyer: e ? e.value : '' })
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
                <Button size="sm" className="mt-6" onClick={((e) => { navigate("/pending-cart"); })}>
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

