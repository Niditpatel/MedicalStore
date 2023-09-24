const express =require("express");
const router = express.Router();
const Products = require("../models/ProductSchema");


router.post("/product/new",async (req, res) => {
    const{productName,packing,store,supplier,isDeleted} = req.body;
    const product = await Products.create({
        productName,packing,store,supplier,isDeleted
    });
    res.status(200).json({
        sucess: true,
        product:product
    })
}
);

router.get("/products", async (req, res) => {
    const products = await Products.find();
    res.status(200).json({
        sucess: true,
        products
    })
});

router.put("/product/:id",async (req, res) => {
    let product = await Products.findById(req.params.id)
    if (!product) {
        return res.status(500).json({
            sucess: false,
            message: "Product not found"
        })
    }
    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        sucess: true,
    })
});
router.delete("/product/:id",
    async (req, res) => {
    const product = await Products.findById(req.params.id);

    if (!product) {
        res.status(200).json({
            sucess: true,
            message: `Product not Found`
        })
    }else{
        await Products.deleteOne();
        res.status(200).json({
            sucess: true,
            message: `Product deleted succesfully `
        })
    }
});


module.exports  = router;