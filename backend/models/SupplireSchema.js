const mongoose = require("mongoose");
// const validator = require("vali")


const supplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        require: [true, "Please enter your Store name"],
    },
    contactNumber: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean  },
    createdAt:{
        type:Date,
        default:Date.now
    },
    timestamps: true
})


module.exports = mongoose.model("Supplier", supplierSchema);