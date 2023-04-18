import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Item =new Mongo.Collection('item')

Item.schema=new SimpleSchema({
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
})

Item.attachSchema(Item.schema)

export default Item