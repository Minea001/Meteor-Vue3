import SimpleSchema from "simpl-schema";
import Item from '../Item/items'
import Reciept from "../reciept/reciept";
import { throttle } from "lodash";

Meteor.methods({
    findReciept({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit=rowsPerPage===0? Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip =rowsPerPage * (page-1)

        const data=Reciept.aggregate([
            {
                $match :selector,
            },
            {
                $sort:{tranDate:-1}
            },
            {
                $skip:skip,
            },
            {
                $limit:limit,
            },
        
        ])
        const total=Reciept.find(selector).count()
        return {data,total}
    },
    checkRecieptExist({selector}){
        return Reciept.findOne(selector)
    },
    //get reciept by Id
    getReceiptById(id){
       return Reciept.findOne({_id:id})
    },
    //insert reciept
    insertReciept(doc){
        new SimpleSchema({
           
                tranDate:Date,
                customerId:String,
                employeeId:String,
                saleId:String,
                recieve:Number,
                discount:Number,
                memo:String
                
           
        }).validate(doc)
        if(!Meteor.isServer) return false
        try{
            return Reciept.insert(doc)
        }catch(error){
            console.log('error',error)
            throw new Meteor.Error('Insert Reciept error',error)

        }
    },
    updateReciept(doc){
        new SimpleSchema({
            _id:String,
            tranDate:Date,
            customerId:String,
            employeeId:String,
            saleId:String,
            recieve:Number,
            discount:Number,
            memo:String
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            return Reciept.update({_id:id},{$set:doc})
        } catch (error) {
            console.log('error',error)
            throw new Meteor.Error('Update Reciept',error)
        }
    },
    removeReciept({id}){
        new SimpleSchema({
            id:String,
        }).validate(doc)
        if(!Meteor.isServer) return false
        try{
            return Reciept.remove({_id:id})
        }catch(error){
            throw new Meteor.Error('Remove Reciept erroe',error)
        }
    }

})