import SimpleSchema from "simpl-schema";
import Reciept from "../reciept/reciept";
import checkSaleStatus from '../sale/checkSaleStatus'

Meteor.methods({
    findReciept({ selector, page, rowsPerPage }) {
        if (!Meteor.isServer) return false
        selector = selector || {}
        const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
        const skip = rowsPerPage * (page - 1)

        const data = Reciept.aggregate([
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
                $lookup:{
                    from:'employee',
                    localField:'employeeId',
                    foreignField:'_id',
                    as: 'doc_emp'
                  },
                },
                {
                  $unwind:{
                      path:'$doc_emp',
                      preserveNullAndEmptyArrays:true,
                  }
                },
                {
                    $lookup:{
                      from:'customers',
                      localField:'customerId',
                      foreignField:'_id',
                      as: 'doc_cus'
                    },
                  },
                  {
                    $unwind:{
                        path:'$doc_cus',
                        preserveNullAndEmptyArrays:true,
                    }
                  },
          
               {
             $project:{
                tranDate:1,
                customerId:'$doc_cus.name',
                employeeId:'$doc_emp.name',
                saleId:'$doc_sale.tranDate',
                recieve:1,
                discount:1,
                memo:1
             }
               }

        ])
        const total = Reciept.find(selector).count()
        return { data, total }
    },
    checkRecieptExist({ selector }) {
        return Reciept.findOne(selector)
    },
    //get reciept by Id
    getReceiptById(id) {
       const reciept= Reciept.findOne({ _id: id })
       return reciept
    },
    //insert reciept
    insertReciept({ doc }) {
        new SimpleSchema({
            tranDate: Date,
            customerId: String,
            employeeId: String,
            saleId: String,
            recieve: Number,
            discount: Number,
            memo: {
                type:String,
                optional:true
            }
        }).validate(doc)
        if (!Meteor.isServer) return false
        try {
            const id = Reciept.insert(doc)
            // check status sale
            checkSaleStatus({ saleId: doc.saleId })
            return id
        } catch (error) {
            console.log('error', error)
            throw new Meteor.Error('Insert Reciept error', error)
        }
    },
    updateReciept({ doc }) {
        new SimpleSchema({
            _id: String,
            tranDate: Date,
            customerId: String,
            employeeId: String,
            saleId: String,
            recieve: Number,
            discount: Number,
            memo: {
                type:String,
                optional:true
            }
        }).validate(doc)
        if (!Meteor.isServer) return false
        try {
            const prevDoc = Reciept.findOne({ _id: doc._id })
            const res = Reciept.update({ _id: doc._id }, { $set: doc })

            // check status 
            if (prevDoc.saleId != doc.saleId) {
                checkSaleStatus({ saleId: prevDoc.saleId })
            }
            checkSaleStatus({ saleId: doc.saleId })

            return res
        } catch (error) {
            console.log('error', error)
            throw new Meteor.Error('Update Reciept', error)
        }
    },
    removeReciept({ id }) {
        new SimpleSchema({
            id: String,
        }).validate({id})
        if (!Meteor.isServer) return false
        try {
            const prevDoc = Reciept.findOne({ _id: id })
            // remove 
            const res = Reciept.remove({ _id: id })
            // check status sale
            checkSaleStatus({ saleId: prevDoc.saleId })

            return res
        } catch (error) {
            throw new Meteor.Error('Remove Reciept error', error)
        }
    }

})