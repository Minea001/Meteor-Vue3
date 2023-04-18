import {ValidatedMethod} from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import Employee from './employee'

Meteor.methods({
    ShowEmployee(){
        const doc=Employee.find().fetchAsync()
        return doc
    },
    findEmployees({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit=rowsPerPage===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip =rowsPerPage*(page-1)
        const data=Employee.aggregate([
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
        const total=Employee.find(selector).count()
        return {data,total}
    }, 
    checkempExist({selector}){
        return Employee.findOne(selector)
    },
    // get emp by id
    getEmployeeById(id){
return Employee.findOne({_id:id})
    },
    // insert employee
    insertEmployees(doc){
        new SimpleSchema({
            name:String,
            telephone:{
                type:String,
                optional:true,
            },
            address:{
                type:String,
                optional:true
            },
            status:{
                type:String,
                optional:true
            }
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            // console.log('doc',doc)
            return Employee.insert(doc)
        } catch (error) {
            console.log('error',error)
            throw new Meteor.Error('Insert Employee error',error)
        }
    },
    updateEmployee(doc){
        new SimpleSchema({
            _id:String,
            name:String,
            telephone:{
                type:String,
                optional:true,
            },
            address:{
                type:String,
                optional:true
            },
            status:String
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            return Employee.update({_id:doc._id},{$set:doc})
        } catch (error) {
            console.log('error', error)
            throw new Meteor.Error('Update Employee error',error)         
        }
    },
    removeEmployee({id}){
        new SimpleSchema({
            id:String,
        }).validate({id})
        if(!Meteor.isServer) return false
        try {
            return Employee.remove({_id:id})
        } catch (error) {
            throw new Meteor.Error('Remove Employee error',error)
        }
    },
})