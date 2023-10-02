const express = require("express");
const router = express.Router();
const Carts = require("../models/CartSchema");
const Products = require("../models/ProductSchema")


router.post("/cart/new",async (req, res) => {
    const{products} = req.body;
    const cart = await (await Products.find({_id:{$in:products}})).forEach((doc)=>{
        Carts.bulkSave(doc)
    })
    console.log(products)
    // Carts.insertMany(Products.find({_id:{$in:products}}))
    res.status(200).json({
        success: true,
        product:cart
    })
}
);

router.get("/carts", async (req, res) => {
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:15
    const carts = await Carts.find().skip(pageNo*pageSize).limit(pageSize);
    res.status(200).json({
        success: true,
        carts
    })
});


router.get("/totalcarts", async (req, res) => {
    const total = await Carts.find().count();
    res.status(200).json({
        success: true,
        total
    })
});


router.delete("/cart/:id",
    async (req, res) => {
    const cart = await Carts.findById(req.params.id);

    if (!cart) {
        res.status(200).json({
            success: true,
            message: `cart not Found`
        })
    }else{
        await Carts.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: `cart deleted succesfully `
        })
    }
});

router.get("cart/search",
    async (req, res) => {
        const { productName,supplierName,storeName, offset, limit, sort_by, order } = req.query;
        const product = productName !== undefined ? productName :''
        const page_limit = ((limit !== undefined && limit.length > 0) ? parseInt(limit) : 5);
        const page_no = ((offset !== undefined && offset.length > 0) ? parseInt(offset) - 1 : 0);
        const sort_order = ((order !== undefined && order.length > 0) ? parseInt(order) : 1);
        const sort_field = ((sort_by !== undefined && sort_by.length > 0) ? sort_by : '_id');

        const filterQuery =  {productName:{'$regex':product,'$options':'i'}}
       const lookupQuery1 = [
            {
                $lookup: {
                    from: 'suppliers',
                    localField: 'supplier',
                    foreignField: '_id',
                    as: 'supplier',
                    pipeline: [
                        {
                            $project: {
                                supplierName: 1,
                                contactNumber:1,
                                _id:0
                            }
                        }
                    ]
                },
            },
            // {
            //     $unwind: {
            //         path: '$supplier',
            //         // for not showing not matched doc 
            //          preserveNullAndEmptyArrays: false
            //     }
            // }
        ]

        const lookupQuery2 = [
            {
                $lookup: {
                    from: 'stores',
                    localField: 'store',
                    foreignField: '_id',
                    as: 'store',
                    pipeline: [
                        {
                            $project: {
                                storeName: 1,
                                contactNumber:1,
                                _id:0
                            }
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$store',
                    // for not showing not matched doc 
                     preserveNullAndEmptyArrays: false
                }
            }
        ]
        const supplierFilterQuery = supplierName ? supplierName :''
        const storeFilterQuery =storeName? storeName : '' ;

    const data = await Carts.aggregate([
        { $match: filterQuery},
         ...lookupQuery1,
         ...lookupQuery2,
         {$match:{$and:
            [
                {'supplier.supplierName': {'$regex':supplierFilterQuery ,'$options':'i'}},
                {'store.storeName':{'$regex':storeFilterQuery,'$options':'i'}}
            ]
        }},
            {
                $facet: {
                    metadata: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 }
                            }
                        },
                    ],
                    data: [
                        { $sort: { [sort_field]: sort_order } },
                        { $skip: page_limit * page_no },
                        { $limit: page_limit },
                    ]
                }
            },
    ])
   
        res.status(200).json({
            success: true,
            data:data[0]?.data ? data[0]?.data :[],
            total:data[0]?.metadata[0]?.total ? data[0]?.metadata[0]?.total :0
        })
});

module.exports  = router;