const express =require("express");
const router = express.Router();
const Supplier = require("../models/SupplireSchema");


router.post("/supplier/new",async (req, res) => {
    const{storeName,contactNumber,isDeleted} = req.body;
    const supplier = await Supplier.create({
        storeName,contactNumber,isDeleted,
    });
    res.status(200).json({
        sucess: true,
        supplier:supplier
    })
}
);

router.get("/suppliers", async (req, res) => {
    const stores = await Supplier.find();
    res.status(200).json({
        sucess: true,
        stores
    })
});

router.put("/supplier/:id",async (req, res) => {
    let supplier = await Supplier.findById(req.params.id)
    if (!supplier) {
        return res.status(500).json({
            sucess: false,
            message: "supplier not found"
        })
    }
    supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        sucess: true,
    })
});
router.delete("/supplier/:id",
    async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        res.status(200).json({
            sucess: true,
            message: `Supplier not Found`
        })
    }else{
        await Supplier.deleteOne();
        res.status(200).json({
            sucess: true,
            message: `Supplier deleted succesfully `
        })
    }
});


module.exports  = router;