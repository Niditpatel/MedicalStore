const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        require: [true, "Please enter your Supplier name"],
    },
    store: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }],
    contactNumber: {
        type: String,
        required: false,
    },
    isDeleted: {type:Boolean}
},{timestamps:true})


module.exports = mongoose.model("Supplier", supplierSchema);