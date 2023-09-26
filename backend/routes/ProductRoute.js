const express =require("express");
const router = express.Router();
const Products = require("../models/ProductSchema");


router.post("/product/new",async (req, res) => {
    const{productName,packing,store,supplier,isDeleted} = req.body;
    const product = await Products.create({
        productName,packing,store,supplier,isDeleted
    });
    res.status(200).json({
        success: true,
        product:product
    })
}
);

router.get("/products", async (req, res) => {
    const products = await Products.find();
    res.status(200).json({
        success: true,
        products
    })
});


router.get("/totalProducts", async (req, res) => {
    const total = await Products.find().count();
    res.status(200).json({
        success: true,
        total
    })
});

router.put("/product/:id",async (req, res) => {
    let product = await Products.findById(req.params.id)
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }
    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
    })
});
router.delete("/product/:id",
    async (req, res) => {
    const product = await Products.findById(req.params.id);

    if (!product) {
        res.status(200).json({
            success: true,
            message: `Product not Found`
        })
    }else{
        await Products.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: `Product deleted succesfully `
        })
    }
});

// router.get("/search",
//     async (req, res) => {
//         const {productName,supplierName,storeName} = req.query;
//         const product = productName ? productName :''
//         const supplier = supplierName ? supplierName :''
//         const store = storeName? storeName : '' 

//     const data = await Products.find({$or:[
//         {productName: {'$regex':product,'$options':'i'}},
//     {'store.storeName':{'$regex':store,'$options':'i'}},
//     {'supplier.supplierName':{'$regex':supplier,'$options':'i'}}
// ]
// })
//     .populate({path:'store',select:'storeName contactNumber -_id'})
//     .populate({path:'supplier',supplierName:{'$regex':supplier,'$options':'i'},select:'supplierName contactNumber -_id'});
   
//         res.status(200).json({
//             success: true,
//             data:data
//         })
// });

router.get("/search",
    async (req, res) => {
        // const {productName,supplierName,storeName} = req.query;
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

    const data = await Products.aggregate([
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
            data:data[0].data,
            total:data[0].metadata[0].total
        })
});

module.exports  = router;