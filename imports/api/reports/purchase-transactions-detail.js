import PurchaseDetail from '../purchase/details'
import Purchase from '../purchase/purchase'
import Item from '../Item/items'
Meteor.methods({
    purchaseTransactionDetail({ reportDate, vendorIds = [], employeeIds = [], itemIds = [], categoryIds = [] }) {
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
                { $match: detailSelector },
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
                        from: 'employee',
                        localField: 'purchaseDoc.employeeId',
                        foreignField: '_id',
                        as: 'empDoc',
                    },
                },
                {
                    $unwind: { path: '$empDoc', preserveNullAndEmptyArrays: true },
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
                    $project: {
                        tranDate: 1,
                        empName: '$empDoc.name',
                        venName: '$venDoc.name',
                        itemName: '$itemDoc.name',
                        itemId: 1,
                        cost: 1,
                        qty: 1,
                        amount: 1
                    }
                },
                {
                    $sort: { tranDate: 1 }
                },
                {
                    $group: {
                        _id: null,
                        details: {
                            $push: '$$ROOT'
                        },
                        grandTotal: { $sum: '$amount' }
                    }
                }
            ]
            const data = PurchaseDetail.aggregate(pipeline)
            const {
                details = [],
                grandTotal = 0,
            } = data[0] || {}
            return { data: details, grandTotal }
        }
})