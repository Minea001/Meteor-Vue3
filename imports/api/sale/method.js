import SimpleSchema from "simpl-schema";
import Item from "../Item/items";
import Sale from './sale'

Meteor.methods({
    //for find vendor in paginate
    findSale({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit =rowsPerPage===0? Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip=rowsPerPage * (page-1)

        const data =Sale.aggregate([
            {
                $match:selector,
            },
            {
                $skip:skip,
            },            
            {
                $limit:limit,
            },
            {
                $lookup:
                {
                    from: 'item',
                    localField: 'unit',
                    foreignField: '_id',
                    as: 'doc_unitsale'
                },
            },
            //look up for sale
            {
                $unwind:
                {
                    path: '$doc_unitsale',
                    preserveNullAndEmptyArrays: true
                }
            },
            

        ])
        const total=Sale.find(selector).count()
        return {data,total}
    },
    checkSaleExist({selector}){
        return Sale.findOne(selector)
    },
    // get sale by ID
    getSaleById(id){
        return Sale.findOne({_id:id})
    },
    //Insert Item
    insertSale(doc){
        new SimpleSchema({
            tranDate:Date,
            employeeId:String,
            customerId:String,
            itemId:String,
            memeo:String,
            qty:Number,
            price:Number,
            unit:String,
            amount:Number,
            subTotal:Number,
            discount:Number,
            total:Number,
            status:String,
            statusDate:Object,
            totalReceived:Number
        }).validate(doc)
        if(!Meteor.isServer) return false
        try{
            return Sale.insert(doc)
        }catch(error){
            console.log('error',error)
            throw new Meteor.Error("Insert Sale Error ",error)
        }
    },
    updateSale(doc){
        new SimpleSchema({
            _id:String,
            tranDate:Date,
            employeeId:String,
            customerId:String,
            itemId:String,
            memeo:String,
            qty:Number,
            price:Number,
            unit:String,
            amount:Number,
            subTotal:Number,
            discount:Number,
            total:Number,
            status:String,
            statusDate:Object,
            totalReceived:Number
        }).validate(doc)
        if(!Meteor.isser) return false
        try {
            return Sale.update({_id:doc._id},{$set:doc})
        } catch (error) {
            throw new Meteor.Error("Update Sale Failed",error);
        }
    },
    removeSale({id}){
        new SimpleSchema({
            _id:String
        }).validate({id})
        if(!Meteor.isServer) return false
        try {
            return Item.remove({_id:id})
        } catch (error) {
            throw new Meteor.Error('Remove Sale Error',error)
        }
    }
})