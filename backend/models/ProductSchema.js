const mongoose = require("mongoose");
// const validator = require("vali")


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: [true, "Please enter your Store name"],
    },
    packing: {
        type: String,
        required: false,
    },
    store:{ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    supplier:[{type:mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true}],
    isDeleted: {
        type: Boolean  },
    createdAt:{
        type:Date,
        default:Date.now
    },
    timestamps: true
})


module.exports = mongoose.model("Products", productSchema);