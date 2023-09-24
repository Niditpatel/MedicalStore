const mongoose = require("mongoose");

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
    }
},{timestamps:true})


module.exports = mongoose.model("Store", medicalStoreSchema);