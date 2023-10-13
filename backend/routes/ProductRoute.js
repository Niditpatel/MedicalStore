const express =require("express");
const router = express.Router();
const Products = require("../models/ProductSchema");
const { default: mongoose } = require("mongoose");
// const { default: mongoose } = require("mongoose");

const ObjectId = mongoose.Types.ObjectId


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

// router.get("/products", async (req, res) => {
//     const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
//     const pageSize = req.query.pageSize?req.query.pageSize:15
//     const products = await Products.find().skip(pageNo*pageSize).limit(pageSize);
//     res.status(200).json({
//         success: true,
//         products
//     })
// });


// router.get("/totalProducts", async (req, res) => {
//     const total = await Products.find().count();
//     res.status(200).json({
//         success: true,
//         total
//     })
// });

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


router.get("/product/:id",async (req, res) => {
    let product = await Products.findById(req.params.id)
    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }else{
        res.status(200).json({
            success: true,
            product
        })
    }
    
    
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
        await Products.findByIdAndUpdate(req.params.id,{$set:{isDeleted:true}});
        res.status(200).json({
            success: true,
            message: `Product deleted succesfully `
        })
    }
});

router.get("/productSelect", async (req, res) => {
    const productName = req.query.productName?req.query.productName:''
    const products = await Products.find({$and:[{productName:{'$regex':productName,'$options':'i'}},{isDeleted:{$ne:true}}]}).limit(10);
    res.status(200).json({
        success: true,
        products
    })
});
router.get("/search",
    async (req, res) => {
        // const {productName,supplierName,storeName} = req.query;
        const { productName,supplierName,storeName, offset, limit, sort_by, order } = req.query;
        const product = productName !== undefined ? productName :''
        const page_limit = ((limit !== undefined && limit.length > 0) ? parseInt(limit) : 5);
        const page_no = ((offset !== undefined && offset.length > 0) ? parseInt(offset) - 1 : 0);
        const sort_order = ((order !== undefined && order.length > 0) ? parseInt(order) : 1);
        const sort_field = ((sort_by !== undefined && sort_by.length > 0) ? sort_by : '_id');

        const filterQuery =  {$and:[{productName:{'$regex':product,'$options':'i'}},{isDeleted:{$ne:true}}]}
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
                                _id:1
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
                                _id:1
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
            data:data[0]?.data ? data[0]?.data :[],
            total:data[0]?.metadata[0]?.total ? data[0]?.metadata[0]?.total :0
        })
});


router.get('/supplierreport',async (req,res)=>{

    const supplier_id = req.query.supplier_id

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
                            _id:1
                        }
                    }
                ]
            },
        },
        {
            $unwind: {
                path: '$supplier',
                // for not showing not matched doc 
                 preserveNullAndEmptyArrays: false
            }
        }
    ]
    const data = await Products.aggregate([
         ...lookupQuery1,
         {$match:
                {'supplier._id': new mongoose.Types.ObjectId(supplier_id)},
        },
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
                    data:[
                        
                    ]
                    
                }
            },
    ])

    res.status(200).json({
        data
    })
})







module.exports  = router;