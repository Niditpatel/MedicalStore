const express =require("express");
const router = express.Router();
const Supplier = require("../models/SupplireSchema");


router.post("/supplier/new",async (req, res) => {
    const{supplierName,contactNumber,isDeleted} = req.body;
    const supplier = await Supplier.create({
        supplierName,contactNumber,isDeleted
    });
    res.status(200).json({
        sucess: true,
        supplier:supplier
    })
}
);

router.get("/suppliers", async (req, res) => {
    const supplierName = req.params.supplierName?req.params.supplierName:''
    const pageNo = req.params.pageNo ? req.params.pageNo:0
    const pageSize = req.params.pageSize?req.params.pageSize:5
    const suppliers = await Supplier.find({supplierName:{'$regex':supplierName,'$options':'i'}}).skip(pageNo*pageSize).limit(pageSize);
    res.status(200).json({
        sucess: true,
        suppliers
    })
});

router.get("/suppliersSelect", async (req, res) => {
    const supplierName = req.params.supplierName?req.params.supplierName:''
    const suppliers = await Supplier.find({supplierName:{'$regex':supplierName,'$options':'i'}}).limit(10);
    res.status(200).json({
        sucess: true,
        suppliers
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