import SimpleSchema from 'simpl-schema'
import Unit from '../units/unit'
import Sale from './sale'
import SaleDetails from './details'
import Reciept from '../reciept/reciept'
import { saleSchema, saleDetailSchema } from './schema'

Meteor.methods({
  //function show Sale Id
  getSaleOpts({ selector, receiptId }) {
    receiptId = receiptId || ''

    const data = Sale.aggregate([
      {
        $match: selector
      },
      {
        //sort by tranDate
        $sort: { tranDate: 1 }
      },
      {
        $project: {
          tranDateStr: { $dateToString: { format: "%Y-%m-%d", date: "$tranDate" } },
          total: {
            //to project field total=total-recieve
            $subtract: ["$total", "$totalReceived"]
          }
        }
      },
      // for project to show as Label in select Sale Id (EX: 12/5/2023-170) but it store as id
      //balance=$total means we want to show value os total money in textbox 'open'
      {
        $project: {
          value: '$_id',
          label: { $concat: ['$tranDateStr', ' - ', { $toString: "$total" },] },
          balance: '$total'
        }
      }
    ])

    // For update
    if (receiptId) {
      const receiptDoc = Reciept.findOne({ _id: receiptId })
      console.log('receiptDoc', receiptDoc)
      const { saleId, recieve } = receiptDoc // saleId = receiptDoc.saleId

      const doc = data.find(it => it.value == saleId)
      if (doc) {
        doc.balance += recieve
        const res = doc.label.split(" ")
        res[res.length - 1] = doc.balance
        doc.label = res.join(" ")
      }
    }

    return data;
  },
  //for find sale in paginate

  findSale({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)

    const data = Sale.aggregate([
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
          from: 'item',
          localField: 'unit',
          foreignField: '_id',
          as: 'doc_unitsale',
        },
      },
      //look up for sale
      {
        $unwind: {
          path: '$doc_unitsale',
          preserveNullAndEmptyArrays: true,
        },
      },
      // look up for Employee and Customer
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
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'doc_cus'
        },
      },
      {
        $unwind: {
          path: '$doc_cus',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {
          tranDate: 1,
          empName: '$doc_emp.name',
          cusName: '$doc_cus.name',
          subTotal: 1,
          discount: 1,
          total: 1,
          status: 1,
          totalReceived: 1
        }
      }

    ])
    const total = Sale.find(selector).count()
    return { data, total }
  },
  checkSaleExist({ selector }) {
    return Sale.findOne(selector)
  },
  // get sale by ID
  getSaleById(id) {
    const parent = Sale.findOne({ _id: id })
    const details = SaleDetails.find({ saleId: id }).fetch()

    const units = Unit.find({}).fetch()
    for (let i = 0; i < details.length; i++) {
      const it = details[i]
      const unit = units.find(u => u._id == it.unitId)// id that get from unit==unitId of Item of index i
      if (unit) it.unitLabel = unit.name //create Unit Label
    }
    return { doc: parent, itemDetails: details }
  },
  //Insert Sale
  insertSale({ doc, itemDetails }) {
    new SimpleSchema({
      doc: saleSchema,
      itemDetails: Array,
      'itemDetails.$': saleDetailSchema,
    }).validate({ doc, itemDetails })
    if (!Meteor.isServer) return false
    try {
      //  insert sale (parent)
      const saleId = Sale.insert(doc)
      // loop pick data for sale details
      for (let i = 0; i < itemDetails.length; i++) {
        const it = itemDetails[i]
        it.tranDate = doc.tranDate
        it.saleId = saleId

        // insert to sale details (child)
        SaleDetails.insert(it)

      }
      return saleId
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert Sale Error ', error)
    }
  },

  updateSale({ doc, itemDetails }) {
    new SimpleSchema({
      doc: saleSchema,
      itemDetails: Array,
      'itemDetails.$': saleDetailSchema
    }).validate({ doc, itemDetails })
    if (!Meteor.isServer) return false
    try {
      const saleId = doc._id
      //  update sale (parent)
      const res = Sale.update({ _id: saleId }, { $set: doc })

      // remove sale details
      SaleDetails.remove({ saleId })

      // loop pick data for sale details 
      for (let i = 0; i < itemDetails.length; i++) {
        const it = itemDetails[i]
        it.tranDate = doc.tranDate
        it.saleId = saleId

        // insert to sale details (child)
        SaleDetails.insert(it)
      }

      return res
    } catch (error) {
      throw new Meteor.Error('Update Sale Failed', error)
    }
  },
  removeSale({ id }) {
    new SimpleSchema({
      id: String,
    }).validate({ id })
    if (!Meteor.isServer) return false
    try {
      // remove detail
      SaleDetails.remove({ saleId: id })
      //  remove parent
      const res = Sale.remove({ _id: id })
      return res
    } catch (error) {
      throw new Meteor.Error('Remove Sale Error', error)
    }
  },
})
