import SimpleSchema from 'simpl-schema'
import Category from './categorys'

Meteor.methods({
    findCategory({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit=rowsPerPage===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip =rowsPerPage*(page-1)
        const data=Category.aggregate([
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
        const total=Category.find(selector).count()
        return {data,total}
    },
    ShowCat(){
        const doc =Category.find().fetchAsync()
        return doc
    }, 
    getCategoryById(id){
        return Category.findOne({_id:id})
    },
    checkCategExist({selector}){
        return Category.findOne(selector)
    },
    insertCategory(doc){
        new SimpleSchema({
            name:String
        }).validate(doc)
        if(!Meteor.isServer) return false

        try {
            return Category.insert(doc)
        } catch (error) {
            throw new Meteor.Error('Insert Category Error',error)
        }
    },
    updateCategory(doc){
        new SimpleSchema({
            _id:String,
            name:String
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            return Category.update({_id:doc._id},{$set:doc}) 
        } catch (error) {
            throw new Meteor.Error('Update Category Error',error)
        }
    },
    removeCategory({id}){
        new SimpleSchema({
            id:String,
        }).validate({id})
        if(!Meteor.isServer) return false
        try {
            return Category.remove({_id:id})
        } catch (error) {
            throw new Meteor.Error('Remove Category Error',error)
        }
    },

})