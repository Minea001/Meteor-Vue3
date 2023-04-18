import SimpleSchema from "simpl-schema";
import Unit from './unit'

Meteor.methods({
    ShowUnit(){
        const data =Unit.find().fetchAsync()
        return data
    }, 
    findUnit({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit=rowsPerPage===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip =rowsPerPage*(page-1)
        const data=Unit.aggregate([
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
        const total=Unit.find(selector).count()
        return {data,total}
    },
    GetUnitById(id){
        return Unit.findOne({_id:id})
    },
    checkunitExist({selector}){
        return Unit.findOne(selector)
    },
    Unitadd(doc) {
        // validate method
       
        new SimpleSchema({
          name: String,
         
        }).validate(doc)
    
        if (!Meteor.isServer) return false
    
        try {
          console.log('doc', doc)
          return Unit.insert(doc)
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Insert error', error)
        }
      },
    updateUnit(doc){
        new SimpleSchema({
            name:String,
            _id:String
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            return Unit.update({_id:doc._id},{$set:doc})
        } catch (error) {
            console.log('error',error)
            throw new Meteor.Error('Update Error')
        }
    },
    removeUnit({id}){
        new SimpleSchema({
            id:String,
        }).validate({id})
        if(!Meteor.isServer) return false
        try {
            return Unit.remove({_id:id})
        } catch (error) {
            throw new Meteor.Error('Delete Error')
        }
    }
})