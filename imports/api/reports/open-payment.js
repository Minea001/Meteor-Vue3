import Payment from '../payment/payment'
import Purchase from '../purchase/purchase'
Meteor.methods({
    OpenPayment({ reportDate, vendorIds = [], employeeIds = [] }) {
        const purchaseSelector = {
            tranDate: {
                $lte: reportDate
            },
            $or: [
                { status: { $ne: 'Closed' } },
                {
                    $and: [
                        { status: { $eq: 'Closed' } },
                        { 'statusDate.closed': { $gt: reportDate } }
                    ]
                }
            ]
        }
        if (vendorIds.length) {
            purchaseSelector.vendorId = {
              $in: vendorIds,
            }
          }
          if (employeeIds.length) {
            purchaseSelector.employeeId = {
              $in: employeeIds,
            }
          }
        const datapurchase =Purchase.aggregate([
            {
                $match: purchaseSelector
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'venDoc',
                },
            },
            {
                $unwind: { path: '$venDoc', preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: '$employeeId',
                    details: {
                        $push: {
                            tranDate: '$tranDate', 
                            venName: '$venDoc.name',
                            total: '$total',
                            purchaseId: '$_id'
                        }
                    },
                    totalAmount: { $sum: '$total' }
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
                $project: {
                    groupName: '$empDoc.name',
                    details: 1,
                    totalAmount: 1
                }
            }
        ])
        
        // get purchase Ids 
        const purchaseDoc = Purchase.find(purchaseSelector).fetch()
        const purchaseIds = purchaseDoc.map(it => it._id)
        // print(saleIds)
        // get receupt 
        const paymentSelector = {
            tranDate: {
                $lte: reportDate
            },
            purchaseId: { $in: purchaseIds }
        }
        const paymentDoc =Payment.aggregate([
            {
                $match: paymentSelector
            },
            {
                $group: {
                    _id: '$purchaseId',
                    totalPaid: { $sum: '$paid' }
                }
            }
        ])
        // loop data sale for calucate balance 
        let grandTotalBalance = 0,grandTotalAmount = 0,grandTotalPaid = 0
        for (let i = 0; i < datapurchase.length; i++) {
            const doc = datapurchase[i]
            doc.totalPaid = 0
            doc.totalBalance = 0
            // loop details
            for (let j = 0; j < doc.details.length; j++) {
                const it = doc.details[j]
                it.balance = it.total
                it.paid = 0
                // get receipt
                const payment = paymentDoc.find(re => re._id == it.purchaseId)
                if (payment) {
                    it.paid = payment.totalPaid
                    it.balance = it.balance - it.paid
                }
                // total
                doc.totalPaid += it.paid
                doc.totalBalance += it.balance
            }
            // grandTotal
            grandTotalBalance += doc.totalBalance
            grandTotalAmount += doc.totalAmount
            grandTotalPaid += doc.totalPaid
        }
    const {
        data = [], 
    } = datapurchase[0] || {}
    return { data: datapurchase,grandTotalAmount,grandTotalPaid,grandTotalBalance}
    }
})
