import SimpleSchema from "simpl-schema";
import Payment from "../payment/payment";
import checkPurchaseStatus from '../purchase/checkPurchaseStatus'

Meteor.methods({
    findPayment({ selector, page, rowsPerPage }) {
        if (!Meteor.isServer) return false
        selector = selector || {}
        const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
        const skip = rowsPerPage * (page - 1)

        const data = Payment.aggregate([
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
                    tranDate: 1,
                    vendorId: '$doc_ven.name',
                    employeeId: '$doc_emp.name',
                    purchaseId: 1,
                    paid: 1,
                    discount: 1,
                    memo: 1
                }
            }


        ])
        const total = Payment.find(selector).count()
        return { data, total }
    },
    //get payment by id
    getPaymentById(id) {
        return Payment.findOne({ _id: id })
    },
    //insert reciept
    insertPayment({ doc }) {
        new SimpleSchema({
            tranDate: Date,
            vendorId: String,
            employeeId: String,
            purchaseId: String,
            paid: Number,
            discount: Number,
            memo: {
                type:String,
                optional:true
            }
        }).validate(doc)
        if (!Meteor.isServer) return false
        try {
            const id = Payment.insert(doc)
            //check status purchase
            checkPurchaseStatus({ purchaseId: doc.purchaseId })
            return id
        } catch (error) {
            console.log('error', error)
            throw new Meteor.Error('Insert Payment error', error)
        }
    },
    updatePayment({ doc }) {
        new SimpleSchema({
            _id: String,
            tranDate: Date,
            vendorId: String,
            employeeId: String,
            purchaseId: String,
            paid: Number,
            discount: Number,
            memo: {
                optional: true,
                type: String
            }
        }).validate(doc)
        if (!Meteor.isServer) return false
        try {
            const prevDoc = Payment.findOne({ _id: doc._id })
            const res = Payment.update({ _id: doc._id }, { $set: doc })
            //check status
            if (prevDoc.purchaseId != doc.purchaseId) {
                //check status
                checkPurchaseStatus({ purchaseId: prevDoc.purchaseId })
            }
            checkPurchaseStatus({ purchaseId: doc.purchaseId })
            return res
            //check status
        } catch (error) {
            console.log('error', error)
            throw new Meteor.Error('Update Payment', error)
        }
    },
    removePayment({ id }) {
        new SimpleSchema({
            id: String,
        }).validate({id})
        if (!Meteor.isServer) return false
        try {
            const prevDoc = Payment.findOne({ _id: id })
            // remove 
            const res = Payment.remove({ _id: id })
            // check status sale
            checkPurchaseStatus({ purchaseId: prevDoc.purchaseId })
            return res
        } catch (error) {
            throw new Meteor.Error('Remove Payment error', error)
        }
    }
})