const express = require("express");
const router = express.Router();
const Buyer = require("../models/BuyerSchema");


router.post("/buyer/new",async (req, res) => {
    const{buyerName,contactNumber,isDeleted} = req.body;
    const buyer = await Buyer.create({
        buyerName,contactNumber,isDeleted
    });
    res.status(200).json({
        success: true,
        supplier:buyer
    })
}
);

router.get("/buyers", async (req, res) => {
    const buyerName = req.query.buyerName?req.query.buyerName:''
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:15
    const buyers = await Supplier.find({buyerName:{'$regex':buyerName,'$options':'i'}}).skip(pageNo*pageSize).limit(pageSize);
    res.status(200).json({
        success: true,
        buyers
    })
});

router.get("/totalBuyers", async (req, res) => {
    const total = await Buyer.find({}).count();
    res.status(200).json({
        sucess: true,
        total
    })
});

router.get("/buyersSelect", async (req, res) => {
    const buyerName = req.query.buyerName?req.query.buyerName:''
    const buyers = await Supplier.find({buyerName:{'$regex':buyerName,'$options':'i'}});
    res.status(200).json({
        success: true,
        buyers
    })
});

router.put("/buyer/:id",async (req, res) => {
    let buyer = await Buyer.findById(req.params.id)
    if (!buyer) {
        return res.status(500).json({
            success: false,
            message: "buyer not found"
        })
    }
    buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        buyer:buyer
    })
});

router.get("/buyer/:id",async (req, res) => {
    let buyer = await Buyer.findById(req.params.id)
    if (!buyer) {
        return res.status(500).json({
            success: false,
            message: "buyer not found"
        })
    }else{
        res.status(200).json({
            success: true,
            buyer
        })
    }

});
router.delete("/buyer/:id",
    async (req, res) => {
    const buyer = await Buyer.findById(req.params.id);

    if (!buyer) {
        res.status(200).json({
            success: true,
            message: `buyer not Found`
        })
    }else{
        await Buyer.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: `Buyer deleted succesfully `
        })
    }
});


module.exports  = router;