const express =require("express");
const router = express.Router();
const StoreController = require("../controllers/StoreController");


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
    const stores = await Store.find();
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
    async (req, res, next) => {
    const store = await Store.findById(req.params.id);

    if (!store) {
        res.status(200).json({
            sucess: true,
            message: `Store not Found`
        })
    }else{
        await Store.deleteOne();
        res.status(200).json({
            sucess: true,
            message: `Store deleted succesfully `
        })
    }
});


module.exports  = router;