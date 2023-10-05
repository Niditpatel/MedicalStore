const express =require("express");
const router = express.Router();
const Store = require("../models/MedicalSchema");


router.post("/store/new",async (req, res) => {
    const{storeName,contactNumber,isDeleted} = req.body;
    const store = await Store.create({
        storeName,contactNumber,isDeleted,
    });
    res.status(200).json({
        success: true,
        store:store
    })
}
);

router.get("/stores", async (req, res) => {
    const storeName = req.query.storeName?req.query.storeName:''
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:5
    const stores = await Store.find({storeName:{'$regex':storeName,'$options':'i'}}).skip(pageNo*pageSize).limit(pageSize);
    const total = await Store.find({storeName:{'$regex':storeName,'$options':'i'}}).count()
    res.status(200).json({
        success: true,
        stores,
        total
    })
});

router.get("/storesSelect", async (req, res) => {
    const storeName = req.query.storeName?req.query.storeName:''
    const stores = await Store.find({storeName:{'$regex':storeName,'$options':'i'}}).limit(10);
    res.status(200).json({
        success: true,
        stores
    })
});

// router.get("/totalStores", async (req, res) => {
//     const total = await Store.find({}).count();
//     res.status(200).json({
//         success: true,
//         total
//     })
// });

router.put("/store/:id",async (req, res) => {
    let store = await Store.findById(req.params.id)
    if (!store) {
        return res.status(500).json({
            success: false,
            message: "store not found"
        })
    }
    store = await Store.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
    })
});

router.get("/store/:id",async (req, res) => {
    let store = await Store.findById(req.params.id)
    if (!store) {
        return res.status(500).json({
            success: false,
            message: "store not found"
        })
    }
    res.status(200).json({
        success: true,
        store
    })
});

router.delete("/store/:id",
    async (req, res) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
        res.status(200).json({
            success: true,
            message: `Store not Found`
        })
    }else{
        await Store.findByIdAndUpdate(req.params.id,{...store,isDeleted:true});
        res.status(200).json({
            success: true,
            message: `Store deleted succesfully `
        })
    }
});


module.exports  = router;