const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json())
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

const Store = require("./routes/StoreRoute")
const Supplier = require("./routes/SupplierRoute")
const Product = require("./routes/ProductRoute")
const Carts = require("./routes/CartRoute")
const PendingCart = require("./routes/PendingCartRoute")
const Buyer = require("./routes/BuyerRoute")

app.use("/api/v1", Store)
app.use("/api/v1", Buyer)
app.use("/api/v1", Supplier)
app.use("/api/v1", Product)
app.use("/api/v1", Carts)
app.use('/api/v1',PendingCart)


// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build"));
// });

module.exports = app