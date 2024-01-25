const express =require("express");
const router = express.Router();
const Supplier = require("../models/SupplireSchema");


router.post("/supplier/new",async (req, res) => {
try{
    const{supplierName,store, contactNumber,isDeleted} = req.body;
    const supplier = await Supplier.create({
        supplierName,contactNumber,store, isDeleted
    });
    res.status(200).json({
        success: true,
        supplier:supplier,
    })
}catch(e){
    res.status(400).json({
        success: false,
    })
}
}
);

router.get("/suppliers", async (req, res) => {
try{
    const supplierName = req.query.supplierName?req.query.supplierName:''
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:15
    const suppliers = await Supplier.find({$and:[{supplierName:{'$regex':supplierName,'$options':'i'}},{isDeleted:{$ne:true}}]}).skip(pageNo*pageSize).limit(pageSize);
    const total = await Supplier.find({$and:[{supplierName:{'$regex':supplierName,'$options':'i'}},{isDeleted:{$ne:true}}]}).count();
    res.status(200).json({
        success: true,
        suppliers,
        total
    })
}catch(e){
    res.status(400).json({
        success: false,
    })
}
});

// router.get("/totalSupplier", async (req, res) => {
//     const total = await Supplier.find({}).count();
//     res.status(200).json({
//         sucess: true,
//         total
//     })
// });

router.get("/suppliersSelect", async (req, res) => {
try{
    const supplierName = req.query.supplierName?req.query.supplierName:''
    const suppliers = await Supplier.find({$and:[{supplierName:{'$regex':supplierName,'$options':'i'}},{isDeleted:{$ne:true}}]});
    res.status(200).json({
        success: true,
        suppliers
    })
}catch(e){
    res.status(400).json({
        success: false,
    })
}
});

router.put("/supplier/:id",async (req, res) => {
try{
    let supplier = await Supplier.findById(req.params.id)
    if (!supplier) {
        return res.status(500).json({
            success: false,
            message: "supplier not found"
        })
    }
    supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
    })
}catch(e){
    res.status(400).json({
        success: false,
    })
}
});

router.get("/supplier/:id",async (req, res) => {
try{
    let supplier = await Supplier.findById(req.params.id)
    if (!supplier) {
        return res.status(500).json({
            success: false,
            message: "supplier not found"
        })
    }else{
        res.status(200).json({
            success: true,
            supplier
        })
    }
}catch(e){
    res.status(400).json({
        success: false,
    })
}

});

router.post("/suppliers/new", async (req, res) => {
try{
    const dataAdd = req.body;
    if (dataAdd && dataAdd?.length > 0) {
        dataAdd.forEach(function (doc) {
            const newCart = new Supplier({
                supplierName:doc.supplierName,
                 isDeleted:false
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
}catch(e){
    res.status(400).json({
        success: false,
    })
}
}
);
router.delete("/supplier/:id",
    async (req, res) => {
try{
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
        res.status(200).json({
            success: true,
            message: `Supplier not Found`
        })
    }else{
        await Supplier.findByIdAndUpdate(req.params.id,{$set:{isDeleted:true}});
        res.status(200).json({
            success: true,
            message: `Supplier deleted succesfully `
        })
    }
}catch(e){
    res.status(400).json({
        success: false,
        message: `Something Went Wrong. `
    })
}
});


module.exports  = router;