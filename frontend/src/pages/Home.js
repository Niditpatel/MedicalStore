import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Input,
  Checkbox,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";


const Home = () => {
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [dataForSheet, setDataForSheet] = useState([]);

  const [searchData, setSearchData] = useState({ name: '' });

  const getData = async () => {
    try {
      const res = await fetch(
        `https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5?_format=index`
      );
      const data = await res.json();
      setData(Object.keys(data).map((key) => data[key]))
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (rowIndex) => {
    try {
      const res = await fetch(
        `https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5/${rowIndex}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        const updatedData = data.filter((_, i) => i !== rowIndex);
        setData(updatedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) =>
    setSearchData({ ...searchData, [e.target.name]: e.target.value });

  const handlesearch = async () => {
    try {
      const res = await fetch(
        `https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5/search?name=*${searchData.name}*`
      );
      const data = await res.json();
      setData(Object.keys(data).map((key) => data[key]));
    } catch (error) {
      console.log(error);
    }
    console.log(data);


  }

  const addForCart = (maal) => {
    const isExists = dataForSheet.find(item => item.rowNo === maal.rowNo)
    if (isExists !== null && isExists) {
      const newData = dataForSheet.filter(item => item.rowNo !== maal.rowNo)
      setDataForSheet(newData);
    } else {
      setDataForSheet([...dataForSheet, maal])
    }
  }
  const addFinalCart = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://sheet.best/api/sheets/77d76d92-bbd0-4a20-bf70-8b63e67900b5/tabs/cart",
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
  return (

    <div>
      {/* <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Hello
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={searchData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handlesearch}>search</button>
      </div>
      <div>
      </div>
      <div className="accordion" id="accordionExample">
        {data?.map((item, i) => (
          <div className="accordion-item" key={i}>
            <h2 className="accordion-header" style={{ display: "flex" }} id={`heading${i}`}>
              <input onChange={(e) => { addForCart(item) }} type="checkbox" style={{ width: '25px' }} />
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${i}`}
                aria-expanded="true"
                aria-controls={`collapse${i}`}
              >
                {item.date}
              </button>
            </h2>
            <div
              id={`collapse${i}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${i}`}
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong className="display-6">{item.name}</strong> ---{" "}
                    {item.email}
                  </span>
                  <span>
                    <Link to={`/edit/${i}`} style={{ textDecoration: "none" }}>
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger ms-1"
                      onClick={() => handleDelete(i)}
                    >
                      X
                    </button>
                  </span>
                </div>
                <p>{item.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className="btn btn-primary" onClick={addFinalCart}>Add to cart</button>
      </div> */}

    </div>

  );
};

export default Home;
