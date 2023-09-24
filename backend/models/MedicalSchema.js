const mongoose = require("mongoose");
// const validator = require("vali")


const medicalStoreSchema = new mongoose.Schema({
    storeName: {
        type: String,
        require: [true, "Please enter Store name"],
    },
    contactNumber: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})


module.exports = mongoose.model("Store", medicalStoreSchema);