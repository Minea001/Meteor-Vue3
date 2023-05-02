import {ValidateMethod} from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import Vendors from './vendors'

Meteor.methods({
    ShowVendor(){
        const doc=Vendors.find().fetchAsync()
        return doc
    },
    // insert data
    insertVendor(doc){
        new SimpleSchema({
            name:String,
            telephone:{
                type:String,
                optional: true,
            },
            address:{
                type:String,
                optional: true,
            },
            status:String
        }).validate(doc)
        // this method run only on the sever
        if(!Meteor.isServer) return false
        try {
            console.log('doc',doc)
            return Vendors.insert(doc)
        } catch (error) {
            console.log('error',error)
            throw new Meteor.Error('Insert Failed',error)
        }
    },
    // for find vendor in paginate
    findVendors({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit=rowsPerPage === 0? Number.MAX_SAFE_INTEGER : rowsPerPage
        const skip=rowsPerPage * (page-1)

        const data=Vendors.aggregate([
            {
                $match:selector,
            },
            {
                $skip:skip,
            },
            {
                $limit:limit,
            },
        ])
        const total=Vendors.find(selector).count()
        return {data, total}
    },

    // Check existing 
    checkVendorExist({selector}){
        return Vendors.findOne(selector)
    },
    // Find vendor by id
    getVendorById(id){
        return Vendors.findOne({_id:id})
    },
    // To update vendor
    updateVendor(doc){
        new SimpleSchema({
            _id:String,
            name:String,
            telephone:{
                type:String,
                optional:true,
            },
            address:{
                type:String,
                optional:true,
            },
            status: String,

        }).validate(doc)
        if(!Meteor.isServer) return false
        try{
            return Vendors.update({_id:doc._id},{$set:doc})
        }catch(error){
            console.log('error',error)
            throw new Meteor.Error('Update Customer failed',error)
        }
    },
    removeVendor({id}){
        new SimpleSchema({
            id:String
        }).validate({id})
        if(!Meteor.isServer) return false
        try{
            return Vendors.remove({_id:id})
        }catch(error){
            console.log('error',error)
            throw new Meteor.Error('Remove Vendor failed',error)
        }
    },
})