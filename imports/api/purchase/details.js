import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Purchase=new Mongo.Collection('purchaseDetail');

Purchase.schema=new SimpleSchema({
    purchaseId:String,
    tranDate:Date,
    itemId:String,
    unitId:String,
    qty:Number,
    cost:Number,
    amount:Number,
    memo:{
        type:String,
        optional:true
      },

})
Purchase.attachSchema(Purchase.schema)
export default Purchase