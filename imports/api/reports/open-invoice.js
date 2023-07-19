import Reciept from '../reciept/reciept'
import Sale from '../sale/sale'
Meteor.methods({
    OpenInvoice({ reportDate, customerIds = [], employeeIds = [] }) {
        const saleSelector = {
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
          /*** Parent */
        if (customerIds.length) {
            saleSelector.customerId = {
              $in: customerIds,
            }
          }
          if (employeeIds.length) {
            saleSelector.employeeId = {
              $in: employeeIds,
            }
          }
        const dataSale =Sale.aggregate([
            {
                $match: saleSelector
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'cusDoc',
                },
            },
            {
                $unwind: { path: '$cusDoc', preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: '$employeeId',
                    details: {
                        $push: {
                            tranDate: '$tranDate',
                            cusName: '$cusDoc.name',
                            total: '$total',
                            saleId: '$_id'
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
        // get sale Ids 
        const saleDoc = Sale.find(saleSelector).fetch()
        const saleIds = saleDoc.map(it => it._id)
        // print(saleIds)
        // get receupt 
        const receiptSelector = {
            tranDate: {
                $lte: reportDate
            },
            saleId: { $in: saleIds }
        }
        const receiptDoc =Reciept.aggregate([
            {
                $match: receiptSelector
            },
            {
                $group: {
                    _id: '$saleId',
                    totalReceived: { $sum: '$recieve' }
                }
            }
        ])      
        // loop data sale for calucate balance
        let grandTotalBalance = 0,grandTotalAmount = 0,grandTotalReceived = 0
        for (let i = 0; i < dataSale.length; i++) {
            const doc = dataSale[i]
            doc.totalReceived = 0
            doc.totalBalance = 0   
            // loop details
            for (let j = 0; j < doc.details.length; j++) {
                const it = doc.details[j]
                it.balance = it.total
                it.receive = 0
                // get receipt
                const receipt = receiptDoc.find(re => re._id == it.saleId)
                if (receipt) {
                    it.receive = receipt.totalReceived
                    it.balance = it.balance - it.receive
                }
        
                // total
                doc.totalReceived += it.receive
                doc.totalBalance += it.balance
            }
            
            // grandTotal
            grandTotalBalance += doc.totalBalance
            grandTotalAmount += doc.totalAmount
            grandTotalReceived+= doc.totalReceived
        }
    const {
        data = [],
    } = dataSale[0] || {}
    return { data: dataSale,grandTotalAmount,grandTotalReceived,grandTotalBalance}
    }
})
