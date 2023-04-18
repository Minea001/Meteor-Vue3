import SimpleSchema from "simpl-schema";
import Item from './items'
import Unit from '../units/unit'

Meteor.methods({
    ShowItem(){
        const units=Unit.find().fetch()//fetch unit
        const data=Item.find().fetch()
        for(let i=0;i<data.length;i++){
            const it=data[i]
            const unit=units.find(u=>u._id==it.unitId)// id that get from unit==unitId of Item of index i 
            if(unit) it.unitLabel=unit.name //create Unit Label
        }
        return data
    },
    // for find vendor in paginate
    findItems({selector,page,rowsPerPage}){
        if(!Meteor.isServer) return false
        selector=selector || {}
        const limit=rowsPerPage === 0? Number.MAX_SAFE_INTEGER : rowsPerPage
        const skip=rowsPerPage * (page-1)

        const data=Item.aggregate([
            {
                $match:selector,
            },
            {
                $skip:skip,
            },
            {
                $limit:limit,
            },
            // look up Category
            {
            $lookup:
            {
                from: 'categorys',
                localField: 'catId',
                foreignField: '_id',
                as: 'doc_categ'
            },
        },
        
        {
            $unwind:
            {
                path: '$doc_categ',
                preserveNullAndEmptyArrays: true
            }
        },
        // look up Unit
        {
            $lookup:
            {
                from: 'unit',
                localField: 'unitId',
                foreignField: '_id',
                as: 'doc_unit'
            },
        },
        
        {
            $unwind:
            {
                path: '$doc_unit',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project:
            {
                name:1,
                catName:'$doc_categ.name',
                unitName:'$doc_unit.name',
                price:1,
                cost:1,
                memo:1,
                status:1
            }
        },
 
           
        ])
        const total=Item.find(selector).count()
        return {data, total}
    },
    checkItemExist({selector}){
        return Item.findOne(selector)
    },
    //get item by id
    getItemById(id){
        return Item.findOne({_id:id})
    },
    //insert Item 
    insertItem(doc){
        new SimpleSchema({
            name:String,
            catId:String,
            unitId:String,
            price:Number,
            cost:Number,
            memo:{
                type: String,
                optional:true
            },
            status:String
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            return Item.insert(doc)
        } catch (error) {
            console.log('error',error)
            throw new Meteor.Error('Insert Item error',error)

        }
    },
    updateItem(doc) {
        new SimpleSchema({
            _id:String,
            name:String,
            catId:String,
            unitId:String,
            price:Number,
            cost:Number,
            memo:{
                type: String,
                optional:true
            },
            status:String
        }).validate(doc)
        if(!Meteor.isServer) return false
        try {
            return Item.update({_id:doc._id},{$set:doc})
        } catch (error) {
            throw new Meteor.Error('Update Item');

        }
    },
    removeItem({id}){
        new SimpleSchema({
            id:String
        }).validate({id})
        if(!Meteor.isServer) return false
        try{
            return Item.remove({_id:id})
        }catch(error){
            throw new Meteor.Error('Remove Item error',error)
        }
    }
})