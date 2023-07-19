import Receipt from '../reciept/reciept'
Meteor.methods({
    ReceiptDetailByEmp({ reportDate, customerIds = [], employeeIds = [] }) {
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
                            discount: '$discount',
                            receive: '$recieve',
                        }
                    },
                    totalDiscount: { $sum: '$discount' },
                    totalReceive: { $sum: '$recieve' }
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
            },

        ])
        const {
            data = [],
            grandTotalDiscount = 0,
            grandTotalReceive = 0
        } = DataDetails[0] || {}
        return { datares: data, grandTotalDiscount, grandTotalReceive }
    }
})
