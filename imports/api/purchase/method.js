import SimpleSchema from "simpl-schema";
import Item from '../Item/items'
import Unit from '../units/unit'
import Purchase from './purchase'
import PurchaseDetail from './details'
// import schema
import { purchaseSchema, purchaseDetailSchema } from './schema'

Meteor.methods({
  //for find purchase in paginate
  findPurchase({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)

    const data = Purchase.aggregate([
      {
        $match: selector,
      },
      {
        $sort: { tranDate: -1 }
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'employee',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'doc_emp'
        },
      },
      {
        $unwind: {
          path: '$doc_emp',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'doc_ven'
        },
      },
      {
        $unwind: {
          path: '$doc_ven',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {
          tranDate:1,
          empName:'$doc_emp.name',
          vendorName:'$doc_ven.name',
          subTotal:1,
          discount:1,
          total:1,
          status:1,
          totalPaid:1,
        }
      }
    ])
    const total = Purchase.find(selector).count()
    return { data, total }
  },
  checkPurchaseExist({ selector }) {
    return Purchase.findOne(selector)
  },
  //get purchase by ID
  getPurchaseById(id) {
    const parent = Purchase.findOne({ _id: id })
    const details = PurchaseDetail.find({ purchaseId: id }).fetch()

    const units = Purchase.find({}).fetch()
    for (let i = 0; i < details.length; i++) {
      const it = details[i]
      const unit = units.find(u => u._id == it.unitId)
      if (unit) it.unitLabel = unit.name //create Unit label
    }
    return { doc: parent, itemDetails: details } //?
  },
  //Insert Purchase
  insertPurchase({ doc, itemDetails }) {
    new SimpleSchema({
      doc: purchaseSchema,
      itemDetails: Array,
      'itemDetails.$': purchaseDetailSchema,
    }).validate({ doc, itemDetails })
    if (!Meteor.isServer) return false
    try {
      //  insert sale (parent)
      const purchaseId = Purchase.insert(doc)
      // loop pick data for sale details
      for (let i = 0; i < itemDetails.length; i++) {
        const it = itemDetails[i]
        it.tranDate = doc.tranDate
        it.purchaseId = purchaseId

        // insert to sale details (child)
        PurchaseDetail.insert(it)

      }
      return purchaseId
      console.log(purchaseId)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert Purchase Error ', error)
    }
  },
  updatePurchase({ doc, itemDetails }) {
    new SimpleSchema({
      doc: purchaseSchema,
      itemDetails: Array,
      'itemDetails.$': purchaseDetailSchema
    }).validate({ doc, itemDetails })
    if (!Meteor.isServer) return false

    try {
      const purchaseId = doc._id
      const res = Purchase.update({ _id: purchaseId }, { $set: doc })

      PurchaseDetail.remove({ purchaseId })
      //loop pick data
      for (let i = 0; i < itemDetails.length; i++) {
        const it = itemDetails[i]
        it.tranDate = doc.tranDate
        it.purchaseId = purchaseId

        //insert to purchase detail
        PurchaseDetail.insert(it)
      }
      return res
    } catch (error) {
      console.log(error)
      throw new Meteor.Error('Update Server error', error)
    }
  },

  removePurchase({ id }) {
    new SimpleSchema({
      id: String,
    }).validate({ id })
    if (!Meteor.isServer) return false
    try {
      // remove detail
      PurchaseDetail.remove({ saleId: id })
      //  remove parent
      const res = Purchase.remove({ _id: id })
      return res
    } catch (error) {
      throw new Meteor.Error('Remove Purchase Error', error)
    }
  },

})
