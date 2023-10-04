const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        require: [true, "Please enter your buyer Name."],
    },
    contactNumber: {
        type: String,
        required: false,
    },
    isDeleted: {type:Boolean}
},{timestamps:true})


module.exports = mongoose.model("Buyer", buyerSchema);