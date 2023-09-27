const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

const Store = require("./routes/StoreRoute")
const Supplier = require("./routes/SupplierRoute")
const Product = require("./routes/ProductRoute")

app.use("/api/v1", Store)
app.use("/api/v1", Supplier)
app.use("/api/v1", Product)


app.use(cors());
app.use(express.json())

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build"));
});

module.exports = app