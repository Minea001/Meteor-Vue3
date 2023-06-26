import Sale from '../sale/sale'

Meteor.methods({
  saleTransactions({ reportDate, customerIds = [], employeeIds = [] }) {
    const selector = {
      tranDate: {
        $gte: reportDate[0],
        $lte: reportDate[1],
      },
    }
    if (customerIds.length) {
      // customerIds = [...]
      selector.customerId = {
        $in: customerIds,
      }
    }
    if (employeeIds.length) {
      selector.employeeId = {
        $in: employeeIds,
      }
    }

    const pipeline = [
      {
        $match: selector,
      },
      {
        $lookup: {
          from: 'employee',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'empDoc',
        },
      },
      {
        $unwind: { path: '$empDoc', preserveNullAndEmptyArrays: true },
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
        $project: {
          tranDate: 1,
          empName: '$empDoc.name',
          cusName: '$cusDoc.name',
          subTotal: 1,
          discount: 1,
          total: 1,
        },
      },
      {
        $sort: { tranDate: 1 },
      },
      {
        $group: {
          _id: null,
          details: {
            $push: '$$ROOT',
          },
          grandTotal: { $sum: '$total' },
        },
      },
    ]
    const data = Sale.aggregate(pipeline) // => [{_id:null,details:[],grandTotal:0]
    const {
      details= [],
      grandTotal = 0,
    } = data[0] || {}

    return { data: details, grandTotal }
  },
})
