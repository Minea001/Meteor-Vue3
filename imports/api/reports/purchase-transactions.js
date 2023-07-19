import Purchase from '../purchase/purchase'
Meteor.methods({
  purchaseTransactions({ reportDate, vendorIds = [], employeeIds = [] }) {
    const selector = {
      tranDate: {
        $gte: reportDate[0],
        $lte: reportDate[1],
      },
    }
    if (vendorIds.length) {
      // vendorIds = [...]
      selector.vendorId = {
        $in: vendorIds,
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
        $project: {
          tranDate: 1,
          empName: '$empDoc.name',
          venName: '$venDoc.name',
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
            $push: '$$ROOT', // push all
          },
          grandTotal: { $sum: '$total' }, // sum up data
        },
      },
    ]
    const data = Purchase.aggregate(pipeline) // => [{_id:null,details:[],grandTotal:0]
    const {
      details= [],
      grandTotal = 0,
    } = data[0] || {}

    return { data: details, grandTotal }
  },
})
