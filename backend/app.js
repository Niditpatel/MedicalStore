const express = require("express");
const app = express();
const cors = require("cors");

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(cors());
app.use(express.json())







module.exports = app