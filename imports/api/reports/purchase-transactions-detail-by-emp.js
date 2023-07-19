import PurchaseDetail from '../purchase/details'
import Purchase from '../purchase/purchase'
import Item from '../Item/items'
Meteor.methods({
    purchaseTransactionDetailEmp({ reportDate, vendorIds = [], employeeIds = [], itemIds = [], categoryIds = [] }) {
        const parentSelector = {
            tranDate: {
                $gte: reportDate[0],
                $lte: reportDate[1]
            },
        }
        const detailSelector = {
            tranDate: {
                $gte: reportDate[0],
                $lte: reportDate[1]
            },
        }
        // Parent
        if (vendorIds.length) {
            parentSelector.vendorId = { $in: vendorIds }
        }
        if (employeeIds.length) {
            parentSelector.employeeId = { $in: employeeIds }
        }
        if (parentSelector.vendorId || parentSelector.employeeId) {
            const purchaseDocs = Purchase.find(parentSelector).fetch()
            const purchaseIds = purchaseDocs.map(it => it._id)
            detailSelector.purchaseId = { $in: purchaseIds }
        }
            // Details
            if (itemIds.length) {
                detailSelector.itemId = { $in: itemIds }
            }
            // filter category 
            // itemIds from client
            if (!itemIds.length && categoryIds.length) {
                const itemSelector = {
                    catId: { $in: categoryIds }
                }
                const itemDoc = Item.find(itemSelector).fetch()
                const ids = itemDoc.map(it => it._id)
                detailSelector.itemId = { $in: ids }
            }
            // Query Data
            const pipeline = [
                {$match:detailSelector},
                {
                    $lookup: {
                        from: 'purchase',
                        localField: 'purchaseId',
                        foreignField: '_id',
                        as: 'purchaseDoc',
                    },
                },
                {
                    $unwind: { path: '$purchaseDoc', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'item',
                        localField: 'itemId',
                        foreignField: '_id',
                        as: 'itemDoc',
                    },
                },
                {
                    $unwind: { path: '$itemDoc', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'vendors',
                        localField: 'purchaseDoc.vendorId',
                        foreignField: '_id',
                        as: 'venDoc',
                    },
                },
                {
                    $unwind: { path: '$venDoc', preserveNullAndEmptyArrays: true },
                },
                {
                    $sort:{tranDate:1}
                },
                {
                    $group:{
                        _id:'$purchaseDoc.employeeId',
                        details:{
                            $push:{
                                tranDate:'$tranDate',
                                venName:'$venDoc.name',
                                itemName:'$itemDoc.name',
                                qty:'$qty',
                                amount:'$amount',
                                cost:'$cost'
                            }
                        },
                        totalQty:{$sum:'$qty'},
                        totalAmount:{$sum:'$amount'}
                    }
                },
                {
                    $lookup: {
                        from: 'employee',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'empDoc',
                    },
                },
                {
                    $unwind: { path: '$empDoc', preserveNullAndEmptyArrays: true },
                },
                {
                    $project:{
                        groupName:'$empDoc.name',
                        totalQty:1,
                        totalAmount:1,
                        details:1
                    }
                },
                {
                    $sort:{groupName: 1}
                },
                {
                    $group:{
                        _id:null,
                        grandTotal:{$sum:'$totalAmount'},
                        data:{
                            $push:'$$ROOT'
                        }
                    }
                }
            ]
            const dataDoc = PurchaseDetail.aggregate(pipeline)
            const {
                data = [],
                grandTotal = 0,
            } = dataDoc[0] || {}
            return { data, grandTotal }
        }
})