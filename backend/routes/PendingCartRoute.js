const express = require("express");
const router = express.Router();
const Carts = require("../models/CartSchema");
const PendingCart = require("../models/PendingCart")


router.post("/pendingcart/new",async (req,res) => {
    var d = new Date();
        d.setDate(d.getDate() - 1);
    const  cartProducts =  await  Carts.find({$and:[{isDeleted:{$ne:true}},{createdAt:{$lte:d}}]})
    console.log(cartProducts)
       if(cartProducts && cartProducts?.length >0){
        cartProducts.forEach(function(doc){
            const newCart = new PendingCart({
                productName:doc.productName
                ,packing:doc.packing
                ,store:doc.store
                ,supplier:doc.supplier
                ,buyer:doc.buyer
                ,quantity:doc.quantity
                ,isDeleted:false
                ,isCart:false
                ,createdAt:doc.createdAt
            })
            newCart.save();
         });
         res.status(200).json({
            success: true,
        })
       }else{
        res.status(200).json({
            success: false,
        })
    }
}
);

router.put('/clearfromcart',async(req,res)=>{
    var d = new Date();
    d.setDate(d.getDate() - 1);
    try{
    await  Carts.updateMany({$and:[{isDeleted:{$ne:true}},{createdAt:{$lte:d}}]},{$set:{isDeleted:true}})
    res.status(200).json({
        success: true,
    })
    }catch(e){
        res.status(400).json({
            success:false,
            e
        })
    }
})


router.post("/pendingcart/forcesave",async (req, res) => {
    const carts = req.body;
    const createdDate = ISODate(carts.createdAt)
        const newCart = new PendingCart({
            productName:carts.productName
            ,packing:carts.packing
            ,store:carts.store
            ,supplier:carts.supplier
            ,buyer:carts.buyer
            ,quantity:carts.quantity
            ,isDeleted:false
            ,createdAt:createdDate
        })
            newCart.save();
        res.status(200).json({
            success: true,
        })
}
);

router.get("/pendingCarts", async (req, res) => {
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo)-1:0
    const pageSize = req.query.pageSize?req.query.pageSize:15
    const pendingCart = await PendingCart.find({isDeleted:{$ne:true}}).skip(pageNo*pageSize).limit(pageSize);
    const total = await PendingCart.find({isDeleted:{$ne:true}}).count();
    res.status(200).json({
        success: true,
        pendingCart,
        total
    })
});



router.delete("/PendingCart/:id",
    async (req, res) => {
    const pednidngCart = await PendingCart.findById(req.params.id);

    if (!cart) {
        res.status(200).json({
            success: true,
            message: `item not Found`
        })
    }else{
        await PendingCart.findByIdAndUpdate(req.params.id,{$set:{isDeleted:true}});
        res.status(200).json({
            success: true,
            message: `item deleted succesfully `
        })
    }
});

router.delete("/pendingCarts",
    async (req, res) => {
    try{
        const cart = await Carts.updateMany({$set:{isDeleted:true}});
        res.status(200).json({
            success: true,
            message: `deleted succesfully `
        })
    }catch(e){
        res.status(400).json({
            success:false,
            message:'something was wrong'
        })
    }
});

router.get("/pendingCart/search",
    async (req, res) => {
        const { productName,supplierName,storeName, offset, limit, sort_by, order,start_date ,end_date,buyerName} = req.query;
        const product = productName !== undefined ? productName :''
        const page_limit = ((limit !== undefined && limit.length > 0) ? parseInt(limit) : 5);
        const page_no = ((offset !== undefined && offset.length > 0) ? parseInt(offset) - 1 : 0);
        const sort_order = ((order !== undefined && order.length > 0) ? parseInt(order) : 1);
        const sort_field = ((sort_by !== undefined && sort_by.length > 0) ? sort_by : '_id');
        const filterQuery =  {$and:[
            {productName:{'$regex':product,'$options':'i'}},
            {isDeleted:{$ne:true}},
            {createdAt:{$gte:new Date(start_date),$lte:new Date(end_date)}}
            ]}

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

        const lookupQuery3 = [
            {
                $lookup: {
                    from: 'buyers',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                    pipeline: [
                        {
                            $project: {
                                buyerName: 1,
                                contactNumber:1,
                                _id:0
                            }
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$buyer',
                    // for not showing not matched doc 
                     preserveNullAndEmptyArrays: false
                }
            }
        ]
        const supplierFilterQuery = supplierName ? supplierName :''
        const storeFilterQuery =storeName? storeName : '' ;
        const buyerFilterQuery =buyerName? buyerName : '' ;

    const data = await PendingCart.aggregate([
        { $match: filterQuery},
         ...lookupQuery1,
         ...lookupQuery2,
         ...lookupQuery3,
         {$match:{$and:
            [
                {'supplier.supplierName': {'$regex':supplierFilterQuery ,'$options':'i'}},
                {'store.storeName':{'$regex':storeFilterQuery,'$options':'i'}},
                {'buyer.buyerName':{'$regex':buyerFilterQuery,'$options':'i'}}
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

router.get("/pendingCart/print",
    async (req, res) => {
        const { productName,supplierName,storeName, offset, limit, sort_by, order,start_date ,end_date,buyerName} = req.query;
        const product = productName !== undefined ? productName :''
        const sort_order = ((order !== undefined && order.length > 0) ? parseInt(order) : 1);
        const sort_field = ((sort_by !== undefined && sort_by.length > 0) ? sort_by : '_id');
        const filterQuery =  {$and:[
            {productName:{'$regex':product,'$options':'i'}},
            {isDeleted:{$ne:true}},
            {createdAt:{$gte:new Date(start_date),$lte:new Date(end_date)}}
            ]}

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

        const lookupQuery3 = [
            {
                $lookup: {
                    from: 'buyers',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                    pipeline: [
                        {
                            $project: {
                                buyerName: 1,
                                contactNumber:1,
                                _id:0
                            }
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$buyer',
                    // for not showing not matched doc 
                     preserveNullAndEmptyArrays: false
                }
            }
        ]
        const supplierFilterQuery = supplierName ? supplierName :''
        const storeFilterQuery =storeName? storeName : '' ;
        const buyerFilterQuery =buyerName? buyerName : '' ;

    const data = await PendingCart.aggregate([
        { $match: filterQuery},
         ...lookupQuery1,
         ...lookupQuery2,
         ...lookupQuery3,
         {$match:{$and:
            [
                {'supplier.supplierName': {'$regex':supplierFilterQuery ,'$options':'i'}},
                {'store.storeName':{'$regex':storeFilterQuery,'$options':'i'}},
                {'buyer.buyerName':{'$regex':buyerFilterQuery,'$options':'i'}}
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
                        { $sort: { [sort_field]: sort_order } }
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


router.get('/pendingCart/company',async(req,res)=>{

    const companyreport = await pendingCart.aggregate(
        [
            {
                $group:{
                _id:{}
                }
            }
        ]
    )
    res.status(200).json({
        
    })
});

module.exports  = router;