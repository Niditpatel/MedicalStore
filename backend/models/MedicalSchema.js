const mongoose = require("mongoose");
// const validator = require("vali")


const medicalStoreSchema = new mongoose.Schema({
    storeName: {
        type: String,
        require: [true, "Please enter your Store name"],
    },
    contactNumber: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        require: [true, "Please enter your Contact Number"],
    },
    userName: {
        type: String,
        require: [true, "Please enter your user Name"],
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    timestamps: true
})


module.exports = mongoose.model("MedicalStore", medicalStoreSchema);