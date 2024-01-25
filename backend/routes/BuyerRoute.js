const express = require("express");
const router = express.Router();
const Buyer = require("../models/BuyerSchema");


router.post("/buyer/new",async (req, res) => {
try{
    const{buyerName,contactNumber,isDeleted} = req.body;
    const buyer = await Buyer.create({
        buyerName,contactNumber,isDeleted
    });
    res.status(200).json({
        success: true,
        buyer:buyer
    })
}catch(e){
    res.status(400).json({
        success:false,
        buyer:[]
    })
}
}
);

router.get("/buyers", async (req, res) => {
   try{
    const buyerName = req.query.buyerName?req.query.buyerName:''
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:15
    const buyers = await Buyer.find({$and:[{buyerName:{'$regex':buyerName,'$options':'i'}},{isDeleted:{$ne:true}}]}).skip(pageNo*pageSize).limit(pageSize);
    const total = await Buyer.find({$and:[{buyerName:{'$regex':buyerName,'$options':'i'}},{isDeleted:{$ne:true}}]}).count()
    res.status(200).json({
        success: true,
        buyers,
        total
    })
   }catch(e){
    res.status(400).json({
        success: false
    })
   }
});

// router.get("/totalBuyers", async (req, res) => {
//     const total = await Buyer.find({}).count();
//     res.status(200).json({
//         sucess: true,
//         total
//     })
// });

router.get("/buyersSelect", async (req, res) => {
try{
    const buyerName = req.query.buyerName?req.query.buyerName:''
    const buyers = await Buyer.find({$and:[{buyerName:{'$regex':buyerName,'$options':'i'}},{isDeleted:{$ne:true}}]}).limit(10);
    res.status(200).json({
        success: true,
        buyers
    })
}catch(e){
    res.status(400).json({
        success: false
    })
}
});

router.put("/buyer/:id",async (req, res) => {
    try{
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
    }catch(e){
        res.status(400).json({
            success: false,
        })
    }
});

router.get("/buyer/:id",async (req, res) => {
    try{
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
    }catch(e){
        res.status(400).json({
            success: false,
        })
    }
});
router.delete("/buyer/:id",
    async (req, res) => {
    try{
        const buyer = await Buyer.findById(req.params.id);

    if (!buyer) {
        res.status(200).json({
            success: true,
            message: `buyer not Found`
        })
    }else{
        await Buyer.findByIdAndUpdate(req.params.id,{$set:{isDeleted:true}});
        res.status(200).json({
            success: true,
            message: `Buyer deleted succesfully `
        })
    }
    }catch(e){
        res.status(400).json({
            success: false,
            message: `Buyer deleted succesfully `
        })
    }
});


module.exports  = router;