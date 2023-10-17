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

router.post("/dataRoute/new", async (req, res) => {
    const dataAdd = req.body;
    console.log(dataAdd)
    if (dataAdd && dataAdd?.length > 0) {
        dataAdd.forEach(function (doc) {
            const newCart = new Store({
                 storeName:doc.storeName,
            })
            newCart.save();
        });
        res.status(200).json({
            success: true,
        })
    } else {
        res.status(200).json({
            success: false,
        })
    }
}
);

router.get("/stores", async (req, res) => {
    const storeName = req.query.storeName?req.query.storeName:''
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:5
    const stores = await Store.find({$and:[{storeName:{'$regex':storeName,'$options':'i'}},{isDeleted:{$ne:true}}]}).skip(pageNo*pageSize).limit(pageSize);
    const total = await Store.find({$and:[{storeName:{'$regex':storeName,'$options':'i'}},{isDeleted:{$ne:true}}]}).count()
    res.status(200).json({
        success: true,
        stores,
        total
    })
});

router.get("/storesSelect", async (req, res) => {
    const storeName = req.query.storeName?req.query.storeName:''
    const stores = await Store.find({$and:[{storeName:{'$regex':storeName,'$options':'i'}},{isDeleted:{$ne:true}}]}).limit(10);
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
            message: `Company not Found`
        })
    }else{
        await Store.findByIdAndUpdate(req.params.id,{$set:{isDeleted:true}});
        res.status(200).json({
            success: true,
            message: `Company deleted succesfully `
        })
    }
});


module.exports  = router;