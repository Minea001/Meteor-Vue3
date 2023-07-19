import SaleDetail from '../sale/details'
import Sale from '../sale/sale'
import Item from '../Item/items'
Meteor.methods({
  saleTransactionsDetailByEmp({ reportDate, customerIds = [], employeeIds = [],itemIds=[],categoryIds=[]}) {
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

    /*** Parent */
    if (customerIds.length) {
      parentSelector.customerId = {
        $in: customerIds,
      }
    }
    if (employeeIds.length) {
      parentSelector.employeeId = {
        $in: employeeIds,
      }
    }
    if (parentSelector.customerId || parentSelector.employeeId) {
      const saleDocs = Sale.find(parentSelector).fetch()
      const saleIds = saleDocs.map(it => it._id)
      detailSelector.saleId = { $in: saleIds }
    }
    /** Details */
    if (itemIds.length) {
      detailSelector.itemId = {
        $in: itemIds,
      }
    }

    if (!itemIds.length && categoryIds.length) {
      const itemSelector = {
        catId: { $in: categoryIds }
      }
      const itemDoc = Item.find(itemSelector).fetch()
      const ids = itemDoc.map(it => it._id)
      detailSelector.itemId = { $in: ids }
    }

    /*** Query data */
    const pipeline = [
        {$match:detailSelector},
        {
            $lookup: {
                from: 'sales',
                localField: 'saleId',
                foreignField: '_id',
                as: 'saleDoc',
            },
        },
        {
            $unwind: { path: '$saleDoc', preserveNullAndEmptyArrays: true },
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
                from: 'customers',
                localField: 'saleDoc.customerId',
                foreignField: '_id',
                as: 'cusDoc',
            },
        },
        {
            $unwind: { path: '$cusDoc', preserveNullAndEmptyArrays: true },
        },
        {
            $sort:{tranDate:1}
        },
        {
            $group:{
                _id:'$saleDoc.employeeId',
                details:{
                    $push:{
                        tranDate:'$tranDate',
                        cusName:'$cusDoc.name',
                        itemName:'$itemDoc.name',
                        qty:'$qty',
                        amount:'$amount',
                        price:'$price'
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
    const dataDoc = SaleDetail.aggregate(pipeline)
    const {
      data = [],
      grandTotal = 0,
    } = dataDoc[0] || {}
    return { data,grandTotal}
  }
})