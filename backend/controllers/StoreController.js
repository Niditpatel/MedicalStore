const Store = require("../models/MedicalSchema");

//start
exports.createStore = async (req, res) => {
    const{storeName,contactNumber,isDeleted} = req.body;
    const store = await Store.create({
        storeName,contactNumber,isDeleted,
    });
    res.status(200).json({
        sucess: true,
        store:store
    })
}

exports.updateStore = async (req, res) => {
    let store = await Store.findById(req.params.id)
    if (!store) {
        return res.status(500).json({
            sucess: false,
            message: "store not found"
        })
    }
    store = await Store.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        sucess: true,
    })
}

exports.allStore = async (req, res) => {
    const stores = await Store.find();
    res.status(200).json({
        sucess: true,
        stores
    })
}

exports.deleteStore = async (req, res, next) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
        return next('store does not exist')
    }
    await Store.deleteOne();

    res.status(200).json({
        sucess: true,
        message: `Store deleted succesfully `
    })
}