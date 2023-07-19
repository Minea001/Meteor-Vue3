import Receipt from '../reciept/reciept'
Meteor.methods({
    ReceiptSummaryByEmp({ reportDate, customerIds = [], employeeIds = [] }) {
        const receiptSelector = {
            tranDate: {
                $gte: reportDate[0],
                $lte: reportDate[1]
            },
        }

        if (customerIds.length) {
            receiptSelector.customerId = { $in: customerIds }
        }
        if (employeeIds.length) {
            receiptSelector.employeeId = { $in: employeeIds }
        }

        DataDetails = Receipt.aggregate([
            { $match: receiptSelector },
            {
                $group: {
                    _id: { empId: '$employeeId', cusId: '$customerId' },
                    discount: { $sum: '$discount' },
                    receive: { $sum: '$recieve' }
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id.cusId',
                    foreignField: '_id',
                    as: 'cusDoc',
                },
            },
            {
                $unwind: { path: '$cusDoc', preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: '$_id.empId',
                    details: {
                        $push: {
                            cusName: '$cusDoc.name',
                            discount: '$discount',
                            receive: '$receive'
                        },
                    },
                    totalDiscount: { $sum: '$discount' },
                    totalReceive: { $sum: '$receive' }
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
                    totalDiscount: 1,
                    totalReceive: 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: '$$ROOT'
                    },
                    grandTotalDiscount: { $sum: '$totalDiscount' },
                    grandTotalReceive: { $sum: '$totalReceive' }
                }
            }
        ])
        const {
            data = [],
            grandTotalReceive = 0
        } = DataDetails[0] || {}

        return { datares: data, grandTotalReceive }

    }
})
