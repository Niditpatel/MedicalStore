const express =require("express");
const router = express.Router();
const Store = require("../models/MedicalSchema");


router.post("/store/new",async (req, res) => {
    const{storeName,contactNumber,isDeleted} = req.body;
    const store = await Store.create({
        storeName,contactNumber,isDeleted,
    });
    res.status(200).json({
        sucess: true,
        store:store
    })
}
);

router.get("/stores", async (req, res) => {
    const storeName = req.params.storeName?req.params.storeName:''
    const pageNo = req.params.pageNo ? req.params.pageNo:0
    const pageSize = req.params.pageSize?req.params.pageSize:5
    const stores = await Store.find({storeName:{'$regex':storeName,'$options':'i'}}).skip(pageNo*pageSize).limit(pageSize);
    res.status(200).json({
        sucess: true,
        stores
    })
});

router.get("/storesSelect", async (req, res) => {
    const storeName = req.params.storeName?req.params.storeName:''
    const stores = await Store.find({storeName:{'$regex':storeName,'$options':'i'}}).limit(10);
    res.status(200).json({
        sucess: true,
        stores
    })
});

router.put("/store/:id",async (req, res) => {
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
});
router.delete("/store/:id",
    async (req, res) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
        res.status(200).json({
            sucess: true,
            message: `Store not Found`
        })
    }else{
        await Store.findByIdAndDelete(req.params.id);
        res.status(200).json({
            sucess: true,
            message: `Store deleted succesfully `
        })
    }
});


module.exports  = router;