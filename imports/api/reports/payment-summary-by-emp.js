import Payment from '../payment/payment'
Meteor.methods({
    PaymentSummaryByEmp({ reportDate, vendorIds = [], employeeIds = [] }) {
        const paymentSelector = {
            tranDate: {
                $gte: reportDate[0],
                $lte: reportDate[1]
            },
        }

        if (vendorIds.length) {
            paymentSelector.vendorId = { $in: vendorIds }
        }
        if (employeeIds.length) {
            paymentSelector.employeeId = { $in: employeeIds }
        }

        DataDetails = Payment.aggregate([
            { $match: paymentSelector },
            {
                $group: {
                    _id: { empId: '$employeeId', venId: '$vendorId' },
                    discount: { $sum: '$discount' },
                    paid: { $sum: '$paid' }
                }
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: '_id.venId',
                    foreignField: '_id',
                    as: 'venDoc',
                },
            },
            {
                $unwind: { path: '$venDoc', preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: '$_id.empId',
                    details: {
                        $push: {
                            venName: '$venDoc.name',
                            discount: '$discount',
                            paid: '$paid'
                        },
                    },
                    totalDiscount: { $sum: '$discount' },
                    totalPaid: { $sum: '$paid' }
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
                    totalPaid: 1
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: '$$ROOT'
                    },
                    grandTotalDiscount: { $sum: '$totalDiscount' },
                    grandTotalPaid: { $sum: '$totalPaid' }
                }
            },

        ])
        const {
            data = [],
            // grandTotalDiscount = 0,
            grandTotalPaid = 0
        } = DataDetails[0] || {}
        return { datares: data, grandTotalPaid }
    }
})
